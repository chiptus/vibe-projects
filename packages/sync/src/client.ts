import type { Entries, SyncRequest, SyncResponse } from "./protocol";

/** Minimal async key/value store the sync layer wraps (yayog's `Store` fits). */
export interface KV {
  get(k: string): Promise<unknown | null>;
  /** Resolves to null on success, or an error string. */
  set(k: string, v: unknown): Promise<string | null>;
  del(k: string): Promise<void>;
  keys(prefix: string): Promise<string[] | null>;
}

export type SyncState = "off" | "syncing" | "ok" | "error";

export interface SyncStatus {
  state: SyncState;
  lastSyncAt: number | null;
  error: string | null;
}

export interface SyncedStore extends KV {
  /** Push local changes and pull remote ones now. */
  sync(): Promise<void>;
  getStatus(): SyncStatus;
  /** Fires on every status change; `remoteApplied` is true when remote data changed the local store. */
  subscribe(listener: (status: SyncStatus, remoteApplied: boolean) => void): () => void;
}

export interface SyncedStoreOptions {
  /** Namespace on the server, e.g. the project name. Lowercase letters, digits, dashes. */
  app: string;
  endpoint?: string;
  debounceMs?: number;
  fetch?: typeof fetch;
  getToken?: () => string | null;
}

interface Meta {
  t: number;
  d?: boolean;
  dirty?: boolean;
}
type MetaMap = Record<string, Meta>;

const META_KEY = "__sync:meta";
const TOKEN_KEY = "vibe-sync-token";

export function getSyncToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setSyncToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage unavailable
  }
}

/**
 * Wraps a local store so every write is also pushed to the server, and remote
 * changes are pulled in. The local store stays the source of truth for reads,
 * so the app keeps working offline; with no token set, it behaves exactly like
 * the wrapped store. Conflicts resolve per key, newest write wins.
 */
export function createSyncedStore(local: KV, opts: SyncedStoreOptions): SyncedStore {
  const endpoint = opts.endpoint ?? "/api/sync";
  const debounceMs = opts.debounceMs ?? 1500;
  const doFetch = opts.fetch ?? ((...a: Parameters<typeof fetch>) => fetch(...a));
  const getToken = opts.getToken ?? getSyncToken;

  let status: SyncStatus = { state: "off", lastSyncAt: null, error: null };
  const listeners = new Set<(s: SyncStatus, remoteApplied: boolean) => void>();
  const emit = (patch: Partial<SyncStatus>, remoteApplied = false) => {
    status = { ...status, ...patch };
    listeners.forEach((l) => l(status, remoteApplied));
  };

  // Meta read-modify-write is serialised so concurrent writes don't lose updates.
  let chain: Promise<unknown> = Promise.resolve();
  const withMeta = <T>(fn: (meta: MetaMap) => Promise<T> | T): Promise<T> => {
    const run = chain.then(async () => {
      const meta = ((await local.get(META_KEY)) as MetaMap | null) ?? {};
      const result = await fn(meta);
      await local.set(META_KEY, meta);
      return result;
    });
    chain = run.catch(() => {});
    return run;
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
    inFlight = runSync().finally(() => {
      inFlight = null;
      if (rerun) {
        rerun = false;
        void sync();
      }
    });
    return inFlight;
  }

  async function runSync(): Promise<void> {
    const token = getToken();
    if (!token) {
      emit({ state: "off", error: null });
      return;
    }
    emit({ state: "syncing", error: null });
    try {
      // Adopt pre-existing local keys (data from before sync was on) with t=1,
      // so any remote value wins but a key the server lacks still gets pushed.
      const localKeys = ((await local.keys("")) ?? []).filter((k) => k !== META_KEY);
      const outgoing: Entries = {};
      const sentT: Record<string, number> = {};
      await withMeta(async (meta) => {
        for (const k of localKeys) if (!meta[k]) meta[k] = { t: 1, dirty: true };
        for (const [k, m] of Object.entries(meta)) {
          if (!m.dirty) continue;
          const value = m.d ? null : await local.get(k);
          if (value === null && !m.d) continue; // vanished locally without a tombstone
          outgoing[k] = { v: JSON.stringify(value), t: m.t, d: m.d };
          sentT[k] = m.t;
        }
      });

      const body: SyncRequest = { app: opts.app, entries: outgoing };
      const res = await doFetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(res.status === 401 ? "Wrong sync token" : `Sync failed (${res.status})`);
      const { entries: remote } = (await res.json()) as SyncResponse;

      let applied = false;
      await withMeta(async (meta) => {
        for (const [k, r] of Object.entries(remote)) {
          const m = meta[k];
          if (!m || r.t > m.t) {
            if (r.d) await local.del(k);
            else {
              const err = await local.set(k, JSON.parse(r.v));
              if (err) throw new Error(err);
            }
            meta[k] = { t: r.t, d: r.d };
            applied = true;
          } else if (m.dirty && sentT[k] === m.t && r.t === m.t) {
            delete m.dirty; // server has our version
          }
        }
        // Dirty keys the server didn't echo back would only happen on rejected pushes; keep them dirty.
      });
      emit({ state: "ok", lastSyncAt: Date.now(), error: null }, applied);
    } catch (e) {
      emit({ state: "error", error: e instanceof Error ? e.message : String(e) });
    }
  }

  if (typeof window !== "undefined") {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") void sync();
    });
    window.addEventListener("online", () => void sync());
    void sync();
  }

  return {
    get: (k) => local.get(k),
    keys: (prefix) => local.keys(prefix),
    async set(k, v) {
      const err = await local.set(k, v);
      if (err) return err;
      await withMeta((meta) => {
        meta[k] = { t: Date.now(), dirty: true };
      });
      schedule();
      return null;
    },
    async del(k) {
      await local.del(k);
      await withMeta((meta) => {
        meta[k] = { t: Date.now(), d: true, dirty: true };
      });
      schedule();
    },
    sync,
    getStatus: () => status,
    subscribe(listener) {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
  };
}
