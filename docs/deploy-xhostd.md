# Deploying to xhostd

The whole repo deploys as one xhostd `app`-template app (`vibe-projects`): one Node process serves the stitched `dist/` (hub at `/`, each project at `/<name>/`) and `POST /api/sync`, backed by the app's Postgres. Same origin, so no CORS.

- `install.sh` (build time, as root): `pnpm install`, `pnpm build`, `scripts/package-xhostd.ts` (bundles `packages/sync/src/node.ts` + copies `dist/` into `.xhostd/`), installs `pg`, deletes the rest.
- `launch.sh` (boot, non-root): `cd .xhostd && exec node server.mjs`.
- Health check is `GET /`, which is the hub's `index.html`.

## One-time setup

1. Add xhostd as a git remote (the app's `repo_url` is in the xhostd console, or `get_app`):
   `git remote add xhostd https://<user>:<token>@git.xhostd.com/<user>/vibe-projects.git` — or register an SSH key and use `git@git.xhostd.com:<user>/vibe-projects.git`. Don't commit the token.
2. In the xhostd console set the secret `SYNC_TOKEN` (long random string, e.g. `openssl rand -hex 24`). Without it `/api/sync` answers 500.
3. `git push xhostd main`, then deploy `prod` from branch `main`.
4. Open the History tab → Data panel in yayog-tracker on each device and paste `SYNC_TOKEN`.

## Updating

`git push xhostd main`, then deploy again. A deploy records a database snapshot first, so a bad release can be rewound.

## Env the server reads

`DATABASE_URL` and `XHOSTD_HTTP_PORT` (both injected by xhostd), `SYNC_TOKEN` (you set it), optional `STATIC_DIR` (default `dist`).

The Vercel + Upstash route (`api/sync.ts`, `vercel.json`) still works as an alternative.
