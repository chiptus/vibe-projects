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

/** Tokens are the only credential and anyone can mint one, so they must be unguessable. */
export const MIN_TOKEN_LENGTH = 32;
export const MAX_TOKEN_LENGTH = 256;

/** Server-enforced limits. The client sizes its pushes to stay inside them. */
export const LIMITS = {
  /** Request body, in characters. */
  body: 2_000_000,
  entriesPerRequest: 500,
  key: 200,
  value: 256_000,
  /** Per (token, app): number of keys (tombstones included) and total value characters. */
  keysPerSilo: 2000,
  bytesPerSilo: 5_000_000,
};
