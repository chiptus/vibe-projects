# @vibe/sync

Cross-device sync for the small apps in this repo. Local-first: an app keeps reading and writing its own local store; this package mirrors writes to a tiny server and pulls remote changes in. Auth is a bearer token that doubles as the account: each token gets its own private data, last write wins per key.

## Using it in a project

```ts
import { createSyncedStore } from "@vibe/sync";

const store = createSyncedStore(localKV, { app: "my-project" });
```

`localKV` is anything with `get/set/del/keys(prefix)` (see `KV`). The result has the same methods, plus `sync()`, `getStatus()` and `subscribe()`. With no token set it behaves exactly like `localKV`. Add `"@vibe/sync": "workspace:*"` to the project's dependencies. `yayog-tracker` is the reference integration (token field in the History tab → Data panel).

## Server setup

The server runs on **xhostd** as one Node process (Postgres storage) that also serves the built site. See [`docs/deploy-xhostd.md`](../../docs/deploy-xhostd.md). `createSyncHandler({ storage })` is a plain `Request → Response` function over a small `SyncStorage` interface, so another host or store is a small adapter (`pg.ts` is the example).

## How it works

- Data is one Postgres row per `(sha256(token)/<app>, key)`: `{ v: JSON string, t: ms timestamp, d?: deleted }`.
- Every write marks its key dirty with `t = Date.now()`. A debounced `POST /api/sync` sends dirty keys and returns the server's full state; keys with a newer `t` are applied locally.
- Deletes are tombstones so they propagate. Existing local data is adopted on first sync (`t = 1`), so remote data wins over it, and keys the server lacks get uploaded.
- Syncs run on load, tab focus, coming back online, and after writes.
- **Tokens are accounts.** The server namespaces data by `sha256(token)/<app>` and never stores the token; the namespace comes from the token alone. Tokens must be 32+ characters (`generateSyncToken()` makes 256-bit ones). Anyone can mint one, so the server caps keys/bytes per silo and the Node server rate-limits per IP.
- The token is stored in `localStorage` (`vibe-sync-token`) on each device. Lose it and the synced data is unrecoverable.

Not handled: merging concurrent edits to the *same key* from two devices (newest write wins), and large datasets (the full state is returned on each sync).
