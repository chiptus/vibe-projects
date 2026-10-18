# Deploying to xhostd

The whole repo deploys as one xhostd `app`-template app (`vibe-projects`): one Node process serves the stitched `dist/` (hub at `/`, each project at `/<name>/`) and `POST /api/sync`, backed by the app's Postgres. Same origin, so no CORS.

- `install.sh` (build time, as root): `pnpm install`, `pnpm build`, `scripts/package-xhostd.ts` (bundles `packages/sync/src/node.ts` + copies `dist/` into `.xhostd/`), installs `pg`, deletes the rest.
- `launch.sh` (boot, non-root): `cd .xhostd && exec node server.mjs`.
- Health check is `GET /`, which is the hub's `index.html`.

## One-time setup

1. In the xhostd console, connect `chiptus/vibe-projects` as the app's GitHub source (project → Git → GitHub source). Deploy `prod` from `main` (via the console or the connector's `deploy`).
2. Open yayog-tracker → History tab → Data panel → **Set up sync…**, press **Generate a new token**, then choose **Merge** (keeps this device's data). Put the token in a password manager.
3. On your other devices, open the same dialog and paste that token. Pick **Merge** to combine with what the device already has, or **Replace this device's data** to take the account's data as is.

There is no server-side secret to configure: each token is its own private silo (see "Tokens" below).

## Tokens

There are no accounts. A token (32+ characters) *is* the account: the server stores that token's data under `sha256(token)` and never stores the token itself. Anyone with a token sees only that token's data; a different token sees an empty, separate silo.

- Generate tokens with the button (256-bit random). A hand-written short token is rejected.
- A lost token means lost sync data: there is no recovery.
- Anyone can mint a token, so the endpoint is open for storage. Per-silo limits apply (2000 keys / 5 MB per app, 256 KB per value) and the Node server rate-limits each IP (120 requests/min). Watch the database size in the xhostd console.
- The operator (you) can read the stored data; it is not encrypted at rest.

## Updating

`git push xhostd main`, then deploy again. A deploy records a database snapshot first, so a bad release can be rewound.

## Env the server reads

`DATABASE_URL` and `XHOSTD_HTTP_PORT` (both injected by xhostd), optional `STATIC_DIR` (default `dist`).
