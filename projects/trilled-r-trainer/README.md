# Trilled R Trainer

Trilled R Trainer is an interval-timer web app for systematically learning the Spanish alveolar trill through staged, timed pronunciation drills. Unlike general language tools, it treats the trill as the motor-skill problem it actually is: it runs you through a daily workout of exercises ordered by difficulty — from relaxation and warm-up, through airflow and tongue-position drills, to real words and connected-speech phrases — with editable presets for different session lengths and skill levels. Progress is saved locally, presets are shareable as JSON, and the built-in training methodology is tuned with specific attention to Hebrew speakers, whose native ר interferes with the Spanish trill in ways most guides ignore.

See [`METHODOLOGY.md`](./METHODOLOGY.md) for the training reasoning behind the presets, and [`ROADMAP.md`](./ROADMAP.md) for where the project is headed.

## Features

- Interval timer with a large countdown, per-exercise and overall progress bars, auto-advance, and a beep (Web Audio API) between exercises.
- Presets — named workouts, each a list of exercises, selectable from a dropdown.
- Inline editing — add, edit, or delete exercises (name, duration, instruction) per preset, with a "Reset to Default" escape hatch.
- Import/export — copy the current preset to the clipboard as JSON, or paste JSON to import as a new preset under a user-supplied key.
- Color-coded exercises (relax/cool-down, Q-tip, lip-trill, everything else), keyed off substrings in the exercise name.
- Presets and the last-selected preset persist to `localStorage`, merged with the shipped defaults on load — see "Known gotchas" below.

## Running it

```
pnpm --filter trilled-r-trainer dev
```

Build:

```
pnpm --filter trilled-r-trainer build
```

## Data lives where

- Training content (the shipped presets) is in [`src/data/presets.ts`](./src/data/presets.ts), separate from the UI, so it can be edited without touching components.
- User data (any preset edits, imports, and the last-selected preset) lives in the browser's `localStorage`, under the `trilledRPresets` and `trilledRPreset` keys. Nothing leaves the device.

## Known gotchas

- **Preset merging.** Saved presets are merged with the code's `DEFAULT_PRESETS` on load, keyed by preset id (see [`src/lib/persistence.ts`](./src/lib/persistence.ts)). This used to be an all-or-nothing read — any saved presets replaced the defaults wholesale, so a newly shipped default preset would never reach a user who already had something saved. The stored blob carries a `version` field so future migrations have somewhere to hook in.
- **Beep needs a user gesture.** The `AudioContext` is created on first play; some browsers require a prior interaction before audio works. Starting the timer counts as that interaction, so it's usually fine.
- **No accounts, no sync.** Presets are per-browser via `localStorage`. Clearing site data loses any custom presets — export first if you want to keep them.
