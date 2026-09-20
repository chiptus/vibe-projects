# Roadmap

Where the project could go next, split into two tracks: the training content (new drills and progression) and the software (app features and fixes). They're somewhat independent — the content track needs a learner and a method, the software track needs a developer.

See [`METHODOLOGY.md`](./METHODOLOGY.md) for the reasoning the content items build on, and [`README.md`](./README.md) for the current feature set and known gotchas.

## Near-term / highest value

These are the small, high-leverage items worth doing first.

- ~~Fix the preset shadowing bug.~~ Done — saved presets now merge with code defaults on load (union keyed by preset id), with a `version` stamp on the stored blob for future migrations. See [`src/lib/persistence.ts`](./src/lib/persistence.ts).
- Report back on the Consonant → Trill block (content). Does n/l (*el río*, *un ratón*) land as easy as the pre-positioning theory predicts, and how far behind are the s launches (*es raro*, *Israel*)? That gap decides the next drill. This is a data-gathering step, not a build step — but it gates the content track.
- ~~Extract presets into a data file~~ Done — [`src/data/presets.ts`](./src/data/presets.ts), separate from component code, so training content is editable without touching the UI.

## Training track (content)

Ordered roughly by the progression ladder in `METHODOLOGY.md`.

- Vowel → Trill → Vowel as a single unit — the deferred ladder step. Introduce only once Vowel → Trill alone is reliable; it requires launching and cleanly terminating the trill on the following vowel.
- Burst-length control as its own drill. Deliberately produce short, controlled trills rather than long ones — directly targets the "runs long or collapses into taps" problem. Possibly a call-and-response format: fixed short target, learner matches it.
- Minimal pairs for the tap-vs-trill contrast that actually carries meaning: *pero / perro*, *caro / carro*, *coral / corral*. Trains perception alongside production.
- Connected speech — phrases and full sentences, not isolated words, so the trill survives at conversational speed. This is where the skill becomes usable rather than demonstrable.
- Expanded consonant→trill inventory once the s-launch gap is understood — more contexts, more phrases, ordered by the pre-positioning logic.

## Software track (features)

Ordered roughly by value-to-effort.

- Progress tracking. Session streaks, completion history, and per-session freeform notes (e.g. "s-launches still rough"). This is the biggest missing piece for a tool whose whole premise is daily reps — right now nothing records that the reps happened.
- Reorderable exercises. Drag-and-drop in edit mode. Currently exercises can be added, edited, and deleted, but not reordered without recreating them.
- Audio reference clips. A model recording per exercise so the learner can compare their attempt against a target. High value given that the passive-vs-active distinction is audible — hearing the "rougher, irregular" real trill next to a too-even tap run is itself instructive.
- Record & playback. Record an attempt and A/B it against the reference. Even a crude version directly attacks the "is this a real trill?" uncertainty that the diagnostic tests only partly resolve.
- Preset sharing. The import/export JSON is already a portable format; a share link or a small gallery of community presets is a natural extension.
- Cross-device persistence / sync. Move off `localStorage` to something that survives across devices, if the project goes multi-device or multi-user. Only worth it past the single-user stage.

## Explicitly deferred / non-goals (for now)

- Accounts and multi-user — unnecessary until sharing or sync is actually needed; adds backend and auth complexity that the core tool doesn't require.
- Speech recognition / automatic trill scoring — attractive but hard to do well; a real trill is acoustically subtle and false feedback would be worse than none. Revisit only if a reliable approach appears.
- Other sounds / other languages — the app generalizes to any staged pronunciation drill, but scope discipline says nail the trill first before broadening.

## How the two tracks interact

The content track produces new presets and exercises; the software track makes them easier to build, run, record, and share. The presets-as-data refactor sits at the seam — it serves both, and is worth doing early for that reason. Progress tracking and audio reference are the two features that would most change how the training itself feels, so if development time is limited, they're where it pays off most.
