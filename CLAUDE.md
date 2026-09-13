# vibe-projects

A monorepo for small personal apps built quickly with AI. Many unrelated projects, one repo.

## Conventions

- `projects/<kebab-name>/` — one folder per project, fully self-contained: own `package.json`, own `README.md`, own deps. No cross-project imports.
- If two projects ever need the same code, promote it to `packages/<name>/` — not before.
- Root `tsconfig.base.json` — each project's `tsconfig.json` extends it.
- Conventional commits. One PR per project change is fine. No CI yet.

## Adding a new project

```
pnpm create vite projects/<name> --template react-ts
```

Then:
1. Make its `tsconfig.json` extend `../../tsconfig.base.json`.
2. Add a `README.md` to the project: what it is, how to run it, where its data lives (if any).
3. Add a one-line link to it in the root `README.md`.
4. Add an entry for it in `projects/hub/src/projects.ts` so it shows up on the hub landing page.
5. Run it with `pnpm --filter <name> dev`.

Every project must be runnable with `pnpm --filter <name> dev` — keep the `name` field in each project's `package.json` matching its folder name.

## Building everything together

Each project keeps its own build tooling and framework — nothing ties them together at the bundler level. `pnpm build` at the root (`scripts/build.mjs`) runs every project's own `build` script, then stitches their `dist/` output into one root `dist/` for a single static deploy: `hub`'s build lands at the root, every other project lands at `dist/<project-name>/`, matching the paths in `projects/hub/src/projects.ts`.

Every project must therefore:
- Build with `pnpm --filter <name> build`, producing a `dist/` folder.
- Be deployable from a subpath (`/<project-name>/`) — don't assume it's served from `/`.
