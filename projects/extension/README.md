# extension

WXT + Svelte browser extension (extracts page content with Readability).

## Run

```
pnpm --filter extension dev           # Chrome
pnpm --filter extension dev:firefox
pnpm --filter extension build         # output in .output/ (not dist/, so skipped by the root build)
```

Needs `TYPESAFE_AI_TOKEN` in the environment (see `.envrc`, not committed).
