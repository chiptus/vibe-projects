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
