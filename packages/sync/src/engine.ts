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
}

/** Push batches stay well inside the server's per-request limits. */
export const PUSH_LIMITS = { entries: 400, chars: 900_000 };

const ENTRY_OVERHEAD = 60; // JSON punctuation around each entry

/** Split entries into batches bounded by count and serialised size. */
export function chunkEntries(entries: Entries): Entries[] {
  const batches: Entries[] = [];
  let batch: Entries = {};
  let count = 0;
  let chars = 0;
  for (const [k, e] of Object.entries(entries)) {
    const size = k.length + e.v.length + ENTRY_OVERHEAD;
    if (count > 0 && (count >= PUSH_LIMITS.entries || chars + size > PUSH_LIMITS.chars)) {
      batches.push(batch);
      batch = {};
      count = 0;
      chars = 0;
    }
    batch[k] = e;
    count++;
    chars += size;
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
export async function runSync(d: EngineDeps, token: string): Promise<{ applied: boolean; pending: boolean }> {
  const fp = tokenFingerprint(token);

  // 1. Decide what to send.
  const sentT: Record<string, number> = {};
  const outgoing: Entries = {};
  await d.lock(async () => {
    const ledger = await loadLedger(d.local);
    // A different account's cache must not leak into this one: start over and re-adopt.
    if (ledger.token && ledger.token !== fp) ledger.keys = {};
    ledger.token = fp;
    // Adopt pre-existing local keys (data from before sync was on) at t=1: any remote
    // value wins, but a key the server lacks still gets pushed.
    for (const k of (await d.local.keys("")) ?? []) {
      if (!isInternalKey(k) && !ledger.keys[k]) ledger.keys[k] = { t: 1, dirty: true };
    }
    for (const [k, m] of Object.entries(ledger.keys)) {
      if (!m.dirty) continue;
      const value = m.d ? null : await d.local.get(k);
      if (value === null && !m.d) continue; // vanished locally without a tombstone
      outgoing[k] = { v: JSON.stringify(value), t: m.t, ...(m.d ? { d: true } : {}) };
      sentT[k] = m.t;
    }
    await mustSave(d.local, ledger);
  });

  // 2. Push in batches; the last response is the server's state after everything.
  let remote: Entries = {};
  const batches = chunkEntries(outgoing);
  if (batches.length === 0) remote = await pullRemote(d, token);
  for (const batch of batches) remote = await post(d, token, batch);

  // 3. Reconcile.
  return d.lock(async () => {
    const ledger = await loadLedger(d.local);
    if (ledger.token !== fp) return { applied: false, pending: false }; // account changed mid-flight: obsolete
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
