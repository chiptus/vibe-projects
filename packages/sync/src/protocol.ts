/** One synced key. `v` is the JSON-encoded value; `d` marks a deletion (tombstone). */
export interface Entry {
  v: string;
  t: number;
  d?: boolean;
}

export type Entries = Record<string, Entry>;

/** POST /api/sync — send local changes, receive the full remote state for the app. */
export interface SyncRequest {
  app: string;
  entries: Entries;
}

export interface SyncResponse {
  entries: Entries;
}
