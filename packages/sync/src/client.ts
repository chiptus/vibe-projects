import { applyRemoteEntry, pullRemote, runSync, type EngineDeps } from "./engine";
import { isInternalKey, loadLedger, saveLedger, type Ledger } from "./ledger";
import { createLock } from "./lock";
import { MIN_TOKEN_LENGTH } from "./protocol";
import { getSyncToken, setSyncToken, tokenFingerprint } from "./token";
import type { ConnectMode, KV, SyncedStore, SyncedStoreOptions, SyncStatus } from "./types";

const errorMessage = (e: unknown) => (e instanceof Error ? e.message : String(e));

/**
 * Wraps a local store so every write is also pushed to the server, and remote
 * changes are pulled in. The local store stays the source of truth for reads,
 * so the app keeps working offline; with no token set, it behaves exactly like
 * the wrapped store. Conflicts resolve per key, newest write wins.
 */
export function createSyncedStore(local: KV, opts: SyncedStoreOptions): SyncedStore {
  const debounceMs = opts.debounceMs ?? 1500;
  const getToken = opts.getToken ?? getSyncToken;
  const setToken = opts.setToken ?? setSyncToken;
  const lock = createLock(`vibe-sync:${opts.app}`);
  const deps: EngineDeps = {
    local,
    app: opts.app,
    endpoint: opts.endpoint ?? "/api/sync",
    doFetch: opts.fetch ?? ((...a: Parameters<typeof fetch>) => fetch(...a)),
    lock,
  };

  let status: SyncStatus = { state: "off", lastSyncAt: null, error: null };
  const listeners = new Set<(s: SyncStatus, remoteApplied: boolean) => void>();
  const emit = (patch: Partial<SyncStatus>, remoteApplied = false) => {
    status = { ...status, ...patch };
    listeners.forEach((l) => l(status, remoteApplied));
  };

  let timer: ReturnType<typeof setTimeout> | undefined;
  const schedule = () => {
    if (!getToken()) return;
    clearTimeout(timer);
    timer = setTimeout(() => void sync(), debounceMs);
  };

  let inFlight: Promise<void> | null = null;
  let rerun = false;

  function sync(): Promise<void> {
    if (inFlight) {
      rerun = true;
      return inFlight;
    }
    inFlight = round().finally(() => {
      inFlight = null;
      if (rerun) {
        rerun = false;
        void sync();
      }
    });
    return inFlight;
  }

  async function round(): Promise<void> {
    const token = getToken();
    if (!token) {
      emit({ state: "off", error: null });
      return;
    }
    emit({ state: "syncing", error: null });
    try {
      const { applied, pending } = await runSync(deps, token);
      emit({ state: "ok", lastSyncAt: Date.now(), error: null }, applied);
      if (pending) schedule(); // a write landed mid-request; send it next
    } catch (e) {
      emit({ state: "error", error: errorMessage(e) });
    }
  }

  if (typeof window !== "undefined") {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") void sync();
    });
    window.addEventListener("online", () => void sync());
    void sync();
  }

  /** Write a value and its ledger entry as one unit, so remote application can't interleave. */
  const mutate = (k: string, apply: () => Promise<string | null>, tombstone: boolean): Promise<string | null> =>
    lock(async () => {
      const err = await apply();
      if (err) return err;
      const ledger = await loadLedger(local);
      const prev = ledger.keys[k];
      ledger.keys[k] = { t: Math.max(Date.now(), (prev?.t ?? 0) + 1), ...(tombstone ? { d: true } : {}), dirty: true };
      const saveErr = await saveLedger(local, ledger);
      if (!saveErr) return null;
      const message = `Saved locally, but sync bookkeeping failed: ${saveErr}`;
      emit({ state: "error", error: message });
      return message;
    });

  return {
    get: (k) => local.get(k),
    keys: (prefix) => local.keys(prefix),
    async set(k, v) {
      const err = await mutate(k, () => local.set(k, v), false);
      if (!err) schedule();
      return err;
    },
    async del(k) {
      await mutate(
        k,
        async () => {
          await local.del(k);
          return null;
        },
        true,
      );
      schedule();
    },
    sync,
    getStatus: () => status,
    subscribe(listener) {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },

    async connect(rawToken, mode: ConnectMode) {
      const token = rawToken.trim();
      if (token.length < MIN_TOKEN_LENGTH) return `The token must be at least ${MIN_TOKEN_LENGTH} characters.`;
      const fp = tokenFingerprint(token);

      if (mode === "replace") {
        // Read the account first so nothing changes if the token is wrong or the account is empty.
        let remote;
        try {
          remote = await pullRemote(deps, token);
        } catch (e) {
          return errorMessage(e);
        }
        if (!Object.values(remote).some((e) => !e.d)) {
          return "This token has no data yet, so there is nothing to replace this device's data with. Use Merge to upload this device's data instead.";
        }
        try {
          await lock(async () => {
            const ledger: Ledger = { token: fp, keys: {} };
            for (const k of (await local.keys("")) ?? []) if (!isInternalKey(k)) await local.del(k);
            for (const [k, r] of Object.entries(remote)) await applyRemoteEntry(local, ledger, k, r);
            const err = await saveLedger(local, ledger);
            if (err) throw new Error(`Could not save sync state: ${err}`);
          });
        } catch (e) {
          return errorMessage(e);
        }
        setToken(token);
        emit({ state: "ok", lastSyncAt: Date.now(), error: null }, true);
        return null;
      }

      // merge: forget the previous account's bookkeeping; every local key is re-adopted
      // and uploaded, and wherever the account already has the same key its version wins.
      try {
        await lock(async () => {
          const err = await saveLedger(local, { token: fp, keys: {} });
          if (err) throw new Error(`Could not save sync state: ${err}`);
        });
      } catch (e) {
        return errorMessage(e);
      }
      setToken(token);
      await sync();
      return status.state === "error" ? status.error : null;
    },

    async disconnect() {
      clearTimeout(timer);
      setToken(null);
      emit({ state: "off", error: null });
    },
  };
}
