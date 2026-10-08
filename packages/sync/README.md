# @vibe/sync

Cross-device sync for the small apps in this repo. Local-first: an app keeps reading and writing its own local store; this package mirrors writes to a tiny server and pulls remote changes in. Built for a single user — one shared token, last write wins per key.

## Using it in a project

```ts
import { createSyncedStore } from "@vibe/sync";

const store = createSyncedStore(localKV, { app: "my-project" });
```

`localKV` is anything with `get/set/del/keys(prefix)` (see `KV`). The result has the same methods, plus `sync()`, `getStatus()` and `subscribe()`. With no token set it behaves exactly like `localKV`. Add `"@vibe/sync": "workspace:*"` to the project's dependencies. `yayog-tracker` is the reference integration (token field in the History tab → Data panel).

## Server setup (Vercel)

`api/sync.ts` at the repo root is a Vercel function; `vercel.json` makes Vercel run `pnpm build` and serve `dist/`.

1. In the Vercel project: Storage → add **Upstash Redis** (Marketplace, free tier). This injects `KV_REST_API_URL` / `KV_REST_API_TOKEN`.
2. Add an env var `SYNC_TOKEN` with a long random string (e.g. `openssl rand -hex 24`).
3. Redeploy, then paste the same token into each device's app once.

## How it works

- Data per app is one Redis hash `sync:<app>`: key → `{ v: JSON string, t: ms timestamp, d?: deleted }`.
- Every write marks its key dirty with `t = Date.now()`. A debounced `POST /api/sync` sends dirty keys and returns the server's full state; keys with a newer `t` are applied locally.
- Deletes are tombstones so they propagate. Existing local data is adopted on first sync (`t = 1`), so remote data wins over it, and keys the server lacks get uploaded.
- Syncs run on load, tab focus, coming back online, and after writes.
- The token is stored in `localStorage` (`vibe-sync-token`). It is the only auth, so treat the deployment URL + token as the key to your data.

Not handled: merging concurrent edits to the *same key* from two devices (newest write wins), and large datasets (the full state is returned on each sync).
