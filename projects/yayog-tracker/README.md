# yayog-tracker

A mobile-first workout tracker for the YAYOG "Basic" program. Log each workout's reps/sets, see your history, and pick up where you left off across sessions.

## Run

```
pnpm --filter yayog-tracker dev
```

## Data

Ported from a single-file claude.ai artifact (`window.storage`). Storage is behind a `Store` interface (`src/storage/index.ts`):

- Inside a published claude.ai artifact (`window.storage` present), data is saved to the artifact's personal storage.
- Everywhere else (local dev, self-hosted), data is saved to IndexedDB in the browser.

Keys: `yayog:index` (list of completed workout keys), `yayog:draft` (in-progress form), `yayog:basic:w{N}:d{N}` (one record per workout).

Use the Export/Import JSON buttons in the History tab's Data panel to move your data between versions or storage backends.
