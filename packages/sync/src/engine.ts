import { isInternalKey, loadLedger, saveLedger, type Ledger } from "./ledger";
import type { Lock } from "./lock";
import type { Entries, SyncRequest, SyncResponse } from "./protocol";
import { MIN_TOKEN_LENGTH } from "./protocol";
import { tokenFingerprint } from "./token";
import type { KV } from "./types";

export interface EngineDeps {
  local: KV;
  app: string;
  endpoint: string;
  doFetch: typeof fetch;
  lock: Lock;
  /** The token this device is currently syncing with (null when sync is off). */
  getToken: () => string | null;
}

/** Push batches stay well inside the server's per-request limits (the body limit is in UTF-8 bytes). */
export const PUSH_LIMITS = { entries: 400, bytes: 900_000 };

const encoder = new TextEncoder();
const byteLength = (text: string) => encoder.encode(text).length;

/** Split entries into batches bounded by count and serialised size. */
export function chunkEntries(entries: Entries): Entries[] {
  const batches: Entries[] = [];
  let batch: Entries = {};
  let count = 0;
  let bytes = 0;
  for (const [k, e] of Object.entries(entries)) {
    const size = byteLength(JSON.stringify(k)) + byteLength(JSON.stringify(e)) + 1; // as serialised, plus the colon/comma
    if (count > 0 && (count >= PUSH_LIMITS.entries || bytes + size > PUSH_LIMITS.bytes)) {
      batches.push(batch);
      batch = {};
      count = 0;
      bytes = 0;
    }
    batch[k] = e;
    count++;
    bytes += size;
  }
  if (count > 0) batches.push(batch);
  return batches;
}

async function post(d: EngineDeps, token: string, entries: Entries): Promise<Entries> {
  const body: SyncRequest = { app: d.app, entries };
  const res = await d.doFetch(d.endpoint, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.json().then(
      (b: { error?: unknown }) => (typeof b?.error === "string" ? b.error : null),
      () => null,
    );
    if (res.status === 401) throw new Error(`Sync token rejected — it must be at least ${MIN_TOKEN_LENGTH} characters`);
    if (res.status === 429) throw new Error("Too many sync requests — try again in a minute");
    throw new Error(detail ? `Sync failed: ${detail}` : `Sync failed (${res.status})`);
  }
  return ((await res.json()) as SyncResponse).entries;
}

/** The account's full current state for this app, without sending anything. */
export const pullRemote = (d: EngineDeps, token: string) => post(d, token, {});

const mustSave = async (local: KV, ledger: Ledger) => {
  const err = await saveLedger(local, ledger);
  if (err) throw new Error(`Could not save sync state: ${err}`);
};

/** Write a remote entry into the local store and the ledger. */
export async function applyRemoteEntry(local: KV, ledger: Ledger, k: string, r: Entries[string]): Promise<void> {
  if (r.d) await local.del(k);
  else {
    const err = await local.set(k, JSON.parse(r.v));
    if (err) throw new Error(err);
  }
  ledger.keys[k] = { t: r.t, ...(r.d ? { d: true } : {}) };
}

/**
 * One sync round: push dirty keys (in batches), then reconcile the server's state.
 * Everything that touches the ledger or local values runs under the lock; the
 * network calls do not. Throws on failure, leaving dirty keys dirty.
 */
export interface RoundResult {
  applied: boolean;
  pending: boolean;
  /** The active account changed (or sync was turned off) mid-round, so nothing was applied. */
  obsolete?: boolean;
}

const OBSOLETE: RoundResult = { applied: false, pending: false, obsolete: true };

export async function runSync(d: EngineDeps, token: string): Promise<RoundResult> {
  const fp = tokenFingerprint(token);
  // The token only changes under the lock, so checking it inside each lock is race-free.
  const active = () => d.getToken() === token;

  // 1. Decide what to send.
  const sentT: Record<string, number> = {};
  const outgoing: Entries = {};
  const planned = await d.lock(async () => {
    if (!active()) return false;
    const ledger = await loadLedger(d.local);
    // A different account's cache must not leak into this one: start over and re-adopt.
    if (ledger.token && ledger.token !== fp) ledger.keys = {};
    ledger.token = fp;
    // Adopt pre-existing local keys (data from before sync was on) at t=1: any remote
    // value wins, but a key the server lacks still gets pushed.
    const present = await d.local.keys("");
    if (!present) throw new Error("Could not list local data");
    const have = new Set(present);
    for (const k of present) {
      if (!isInternalKey(k) && !ledger.keys[k]) ledger.keys[k] = { t: 1, dirty: true };
    }
    for (const [k, m] of Object.entries(ledger.keys)) {
      if (!m.dirty) continue;
      if (!m.d && !have.has(k)) {
        // Gone locally without a tombstone: record the deletion so it reaches the account.
        m.d = true;
        m.t = Math.max(Date.now(), m.t + 1);
      }
      // A key that is present is sent as stored, even when its value is JSON null.
      const value = m.d ? null : await d.local.get(k);
      outgoing[k] = { v: JSON.stringify(value), t: m.t, ...(m.d ? { d: true } : {}) };
      sentT[k] = m.t;
    }
    await mustSave(d.local, ledger);
    return true;
  });
  if (!planned) return OBSOLETE;

  // 2. Push in batches; the last response is the server's state after everything.
  let remote: Entries = {};
  const batches = chunkEntries(outgoing);
  if (batches.length === 0) remote = await pullRemote(d, token);
  for (const batch of batches) {
    if (!active()) return OBSOLETE; // switched account or turned off: stop sending this account's data
    remote = await post(d, token, batch);
  }

  // 3. Reconcile.
  return d.lock(async () => {
    const ledger = await loadLedger(d.local);
    if (!active() || ledger.token !== fp) return OBSOLETE;
    let applied = false;
    try {
      for (const [k, r] of Object.entries(remote)) {
        const m = ledger.keys[k];
        if (!m || r.t > m.t) {
          await applyRemoteEntry(d.local, ledger, k, r);
          applied = true;
        } else if (r.t === m.t) {
          // Same version number does not mean same value (two devices can adopt different
          // data at t=1): the server's copy is canonical.
          const same = r.d
            ? !!m.d
            : !m.d && JSON.stringify(await d.local.get(k)) === r.v;
          if (!same) {
            await applyRemoteEntry(d.local, ledger, k, r);
            applied = true;
          }
          // Our version is on the server only if it is the one we sent; a write that
          // landed during the request keeps its dirty flag.
          if (sentT[k] === m.t) delete ledger.keys[k]!.dirty;
        }
        // r.t < m.t: a newer local write; it stays dirty and goes out next round.
      }
    } finally {
      await mustSave(d.local, ledger);
    }
    return { applied, pending: Object.values(ledger.keys).some((m) => m.dirty) };
  });
}
