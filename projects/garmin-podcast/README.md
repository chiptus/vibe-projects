# garmin-podcast

Podcasts on a Garmin watch: pick Podcasts, hand-pick Episodes into a Playlist, and let the watch Sync them over Wi-Fi. Spec: issue #35. Vocabulary: [CONTEXT.md](CONTEXT.md).

This is the skeleton stage: TanStack Start on Cloudflare Workers, D1 + Drizzle, Better Auth with Google sign-in. A signed-in person sees who they are (`GET /api/me`).

It is **deployed separately** (`"deployedSeparately": true`, ADR 0003): the root `pnpm build` skips it, and the hub links to its external URL.

## Run

```
cp .dev.vars.example .dev.vars   # fill in Google credentials
pnpm --filter garmin-podcast db:migrate:local
pnpm --filter garmin-podcast dev
```

Other scripts: `test` (Vitest in the Workers runtime), `typecheck`, `lint`, `build`.

## Tests

`test/` exercises the Worker's HTTP API handler (`src/server/api.ts`) against a real local D1 (Miniflare) with migrations from `drizzle/` applied and Google sign-in stubbed (the signed-in person is named by a request header). No network needed.

## Deploy

1. `wrangler d1 create garmin-podcast`, then put the printed id in `wrangler.jsonc`.
2. `pnpm --filter garmin-podcast db:migrate:remote`.
3. Create a Google OAuth client (redirect URI `<worker url>/api/auth/callback/google`), then set secrets with `wrangler secret put`: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
4. `pnpm --filter garmin-podcast deploy`.
5. Update the hub entry's `href` in `projects/hub/src/projects.ts` to the real Worker URL.

## Data

Stored in Cloudflare D1 (database `garmin-podcast`). Schema in `src/db/schema.ts`, migrations in `drizzle/` (regenerate with `pnpm --filter garmin-podcast db:generate`).
