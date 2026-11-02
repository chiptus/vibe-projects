import type { DataChange, SyncStatus } from "./types";

type Listener = (status: SyncStatus, change: DataChange | null) => void;

/** Current sync status plus subscribers; `change` tells them if local data was altered. */
export function createStatus(onChange?: (change: DataChange) => void) {
  let status: SyncStatus = { state: "off", lastSyncAt: null, error: null };
  const listeners = new Set<Listener>();

  return {
    get: () => status,
    emit(patch: Partial<SyncStatus>, change: DataChange | null = null) {
      status = { ...status, ...patch };
      listeners.forEach((l) => l(status, change));
      if (change) onChange?.(change);
    },
    /** A change made by another page instance: tell our listeners, but don't echo it back. */
    emitExternal(change: DataChange) {
      listeners.forEach((l) => l(status, change));
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
  };
}

export type Status = ReturnType<typeof createStatus>;
