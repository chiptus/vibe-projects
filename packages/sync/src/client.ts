import { createAccount } from "./account";
import type { EngineDeps } from "./engine";
import { loadLedger, saveLedger } from "./ledger";
import { createLock } from "./lock";
import { createRounds } from "./rounds";
import { createStatus } from "./status";
import { getSyncToken, setSyncToken } from "./token";
import type { KV, SyncedStore, SyncedStoreOptions } from "./types";

/**
 * Wraps a local store so every write is also pushed to the server, and remote
 * changes are pulled in. The local store stays the source of truth for reads,
 * so the app keeps working offline; with no token set, it behaves exactly like
 * the wrapped store. Conflicts resolve per key, newest write wins.
 */
export function createSyncedStore(local: KV, opts: SyncedStoreOptions): SyncedStore {
  const getToken = opts.getToken ?? getSyncToken;
  const setToken = opts.setToken ?? setSyncToken;
  const lock = createLock(`vibe-sync:${opts.app}`);
  const deps: EngineDeps = {
    local,
    app: opts.app,
    endpoint: opts.endpoint ?? "/api/sync",
    doFetch: opts.fetch ?? ((...a: Parameters<typeof fetch>) => fetch(...a)),
    lock,
    getToken,
  };

  const status = createStatus();
  const rounds = createRounds(deps, status, opts.debounceMs ?? 1500);
  const account = createAccount(deps, status, rounds, setToken);
  const sync = async () => void (await rounds.syncNow());

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
      status.emit({ state: "error", error: message });
      return message;
    });

  return {
    get: (k) => local.get(k),
    keys: (prefix) => local.keys(prefix),
    async set(k, v) {
      const err = await mutate(k, () => local.set(k, v), false);
      if (!err) rounds.schedule();
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
      rounds.schedule();
    },
    sync,
    getStatus: status.get,
    subscribe: status.subscribe,
    ...account,
  };
}
