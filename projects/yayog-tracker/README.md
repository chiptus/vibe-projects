# yayog-tracker

A mobile-first workout tracker for the YAYOG "Basic" program. Log each workout's reps/sets, see your history, and pick up where you left off across sessions.

Tap an exercise name on the Workout tab to see how to do it: the muscles worked, step-by-step instructions, notes on the variation the program asks for (hands elevated, pause at bottom, …) and the page in *You Are Your Own Gym* that has the photos. The instructions are written in our own words, in `src/program/guides/`; the book's photos are not included.

## Run

```
pnpm --filter yayog-tracker dev
pnpm --filter yayog-tracker test   # unit tests (vitest)
```

## Data

Ported from a single-file claude.ai artifact (`window.storage`). Storage is behind a `Store` interface (`src/storage/index.ts`):

- Inside a published claude.ai artifact (`window.storage` present), data is saved to the artifact's personal storage.
- Everywhere else (local dev, self-hosted), data is saved to IndexedDB in the browser.

Keys: `yayog:index` (list of completed workout keys across all Levels), `yayog:draft` (in-progress form, tagged with its Level), `yayog:active` (which Level's Program is shown), `yayog:<level>:w{N}:d{N}` (one record per workout; today only `basic`).

Known gap: when a Program is finished the app stays on the last workout. Reset is the only way to start again; repeating a cycle is not supported yet.

Use the Export/Import JSON buttons in the History tab's Data panel to move your data between versions or storage backends.
