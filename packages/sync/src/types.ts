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

/**
 * What to do with this device's existing data when it joins an account:
 * - `merge`: keep both; if an item exists on both sides, the account's version wins.
 * - `replace`: discard this device's data and take the account's. The account must already have data.
 */
export type ConnectMode = "merge" | "replace";

export interface SyncedStore extends KV {
  /** Push local changes and pull remote ones now. */
  sync(): Promise<void>;
  getStatus(): SyncStatus;
  /** Fires on every status change; `remoteApplied` is true when remote data changed the local store. */
  subscribe(listener: (status: SyncStatus, remoteApplied: boolean) => void): () => void;
  /** Join (or switch to) the account for `token`. Resolves to null on success, or an error message. */
  connect(token: string, mode: ConnectMode): Promise<string | null>;
  /** Stop syncing on this device. Local data is kept. */
  disconnect(): Promise<void>;
}

export interface SyncedStoreOptions {
  /** Namespace on the server, e.g. the project name. Lowercase letters, digits, dashes. */
  app: string;
  endpoint?: string;
  debounceMs?: number;
  fetch?: typeof fetch;
  getToken?: () => string | null;
  setToken?: (token: string | null) => void;
}
