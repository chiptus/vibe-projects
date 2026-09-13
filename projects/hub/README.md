# hub

Landing page for `vibe-projects` — lists and links to every project in the monorepo.

## Run

```
pnpm --filter hub dev
```

## Data

No data of its own. The project list is a static array in `src/projects.ts`; add an entry there (and to the root README) whenever a new project is added.

`href` assumes each project is deployed alongside the hub at its own path (e.g. `/yayog-tracker/`) — there's no deploy pipeline yet, so this is just the intended layout.
