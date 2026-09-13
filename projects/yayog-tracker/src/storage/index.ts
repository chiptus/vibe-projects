export interface Store {
  get(k: string): Promise<unknown | null>;
  /** Resolves to null on success, or an error string. */
  set(k: string, v: unknown): Promise<string | null>;
  del(k: string): Promise<void>;
  keys(prefix: string): Promise<string[] | null>;
}

export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

interface WindowStorage {
  get(key: string, shared: boolean): Promise<{ value: string } | null>;
  set(key: string, value: string, shared: boolean): Promise<string | null>;
  delete(key: string, shared: boolean): Promise<void>;
  list(prefix: string, shared: boolean): Promise<{ keys: string[] } | null>;
}

declare global {
  interface Window {
    storage?: WindowStorage;
  }
}

// Wraps window.storage, available only inside a published claude.ai artifact.
export const artifactStore: Store = {
  async get(k) {
    try {
      const r = await window.storage!.get(k, false);
      return r ? JSON.parse(r.value) : null;
    } catch {
      return null;
    }
  },
  async set(k, v, tries = 3) {
    let err = "unknown error";
    for (let i = 0; i < tries; i++) {
      try {
        const r = await window.storage!.set(k, JSON.stringify(v), false);
        if (r) return null;
        err = "storage returned no result";
      } catch (e) {
        err = e instanceof Error ? e.message : String(e);
      }
      await sleep(600 * (i + 1));
    }
    return err;
  },
  async del(k) {
    try {
      await window.storage!.delete(k, false);
    } catch {
      // ignore
    }
  },
  async keys(prefix) {
    try {
      const r = await window.storage!.list(prefix, false);
      return r?.keys || [];
    } catch {
      return null;
    }
  },
};

// IndexedDB-backed store for local dev / self-hosting, outside an artifact.
const DB_NAME = "yayog-tracker";
const STORE_NAME = "kv";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const req = fn(tx.objectStore(STORE_NAME));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const localStore: Store = {
  async get(k) {
    try {
      const v = await withStore("readonly", (s) => s.get(k));
      return v === undefined ? null : v;
    } catch {
      return null;
    }
  },
  async set(k, v) {
    try {
      await withStore("readwrite", (s) => s.put(v, k));
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : String(e);
    }
  },
  async del(k) {
    try {
      await withStore("readwrite", (s) => s.delete(k));
    } catch {
      // ignore
    }
  },
  async keys(prefix) {
    try {
      const all = (await withStore("readonly", (s) => s.getAllKeys())) as IDBValidKey[];
      return all.map(String).filter((k) => k.startsWith(prefix));
    } catch {
      return null;
    }
  },
};

export const store: Store = window.storage ? artifactStore : localStore;
