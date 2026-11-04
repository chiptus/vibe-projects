# @vibe/sync

Cross-device sync for the small apps in this repo. Local-first: an app keeps reading and writing its own local store; this package mirrors writes to a tiny server and pulls remote changes in. Auth is a bearer token that doubles as the account: each token gets its own private data, last write wins per key.

## Using it in a project

```ts
import { createSyncedStore } from "@vibe/sync";

const store = createSyncedStore(localKV, { app: "my-project" });
```

`localKV` is anything with `get/set/del/keys(prefix)` (see `KV`). The result has the same methods, plus:

- `connect(token, mode)`: join or switch accounts. `mode` is `"merge"` (keep this device's data and the account's; the account's version wins a clash) or `"replace"` (discard this device's data and take the account's; refuses an empty account so a mistyped token can't wipe a device). Resolves to `null` or an error message.
- `disconnect()`: stop syncing, keep the local data.
- `sync()`, `getStatus()`, `subscribe(listener)`: run a round now, read the status, and listen for status changes and for remote data landing (`remoteApplied`).

With no token set it behaves exactly like `localKV`. Add `"@vibe/sync": "workspace:*"` to the project's dependencies. `yayog-tracker` is the reference integration (`SyncPanel`: a read-only token field plus a dialog for setting or changing the token, in the History tab's Data panel).

## Server setup

The server runs on **xhostd** as one Node process (Postgres storage) that also serves the built site. See [`docs/deploy-xhostd.md`](../../docs/deploy-xhostd.md). `createSyncHandler({ storage })` is a plain `Request → Response` function over a small `SyncStorage` interface, so another host or store is a small adapter (`pg.ts` is the example).

## How it works

- Data is one Postgres row per `(sha256(token)/<app>, key)`: `{ v: JSON string, t: ms timestamp, d?: deleted }`.
- The client keeps a *ledger* next to the cached data (`__sync:ledger`): per key its version `t`, whether it is a tombstone, whether the server still needs it (`dirty`), plus which account the cache belongs to.
- Every write updates the value and its ledger entry as one unit under a lock (`navigator.locks`, so it also holds across browser tabs). Remote data is applied under the same lock, so a pull can never land between a write's two steps.
- A debounced `POST /api/sync` sends dirty keys (in batches that fit the server's limits) and returns the server's full state. A remote key with a newer `t` is applied locally; the same `t` with a different value means the server's copy wins (two devices can adopt different data at `t = 1`); an older `t` means a newer local write, which stays dirty and goes out next round.
- Deletes are tombstones so they propagate. Existing local data is adopted on first sync (`t = 1`), so the account's data wins a clash while keys the account lacks get uploaded.
- Switching accounts resets the ledger. A response that belongs to the previous account is discarded.
- Syncs run on load, tab focus, coming back online, and after writes.
- **Tokens are accounts.** The server namespaces data by `sha256(token)/<app>` and never stores the token; the namespace comes from the token alone. Tokens must be 32+ characters (`generateSyncToken()` makes 256-bit ones). Anyone can mint one, so the server caps keys and bytes per silo (checked inside a transaction holding a per-silo advisory lock, so concurrent requests can't race past it), rejects invalid or oversized input outright with a clear message, and the Node server limits request size while reading and rate-limits per IP.
- The token is stored in `localStorage` (`vibe-sync-token`) on each device. Lose it and the synced data is unrecoverable.

## Tests

`pnpm --filter @vibe/sync test` runs against an in-memory store. Set `TEST_DATABASE_URL` to a scratch Postgres database to run the same suite against the real adapter too (it truncates `sync_entries`).

Not handled: merging concurrent edits to the *same key* from two devices (newest write wins), and very large datasets (the full state is returned on each sync).
