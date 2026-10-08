# flower-anki

Anki decks for learning Israeli wildflowers, built from the plant data on
[wildflowers.co.il](https://www.wildflowers.co.il) ("צמח השדה").

This project is a Python script that writes `.apkg` files, not a web app. It
has no `dev` or `build` script, so the root build skips it.

## Decks

`out/israeli-wildflowers.apkg` holds one parent deck with two subdecks. Each plant is in exactly one:

```
צמחי בר בישראל
├── פופולריים     981 plants: ones the site recorded a pronunciation for, or protected (no mosses/ferns)
└── שאר הצמחים    the other 1,841, mosses and ferns included
```

Study `פופולריים` alone to start, or the parent deck for everything (popular cards come first).
Each plant has a single learning history, whichever deck you study it from.

Each plant gets two cards for learning its Hebrew name:

- **Photo → Hebrew**: the photo on the front. The back shows the Hebrew name and plays its pronunciation.
- **Hebrew → photo**: the Hebrew name on the front. The back shows the photo and plays the pronunciation.

On both backs, a collapsed **פרטים נוספים** section holds the Latin, English and Arabic names, the family,
flowering months, habitat, regions, leaf traits and status. The photo credit is below it.

The Latin and English pronunciations are in the package too, in their own note fields (`AudioLatin`,
`AudioEnglish`). No card shows them yet, but they're ready for Latin or English card types.

**Recommended Anki setting:** for the parent deck, open Deck options → Burying and turn on
**Bury new siblings**. Then a plant's Hebrew → photo card arrives a day after its photo card,
not right behind it. The package can't set deck options itself.

Rebuilding and re-importing updates the notes and keeps your review history.

### Tags

Notes are tagged so you can build filtered decks, e.g. `tag:wildflowers::month::03 tag:wildflowers::region::גליל`:

- `wildflowers::family::<Latin family>`
- `wildflowers::lifeform::{annual,perennial,shrub,geophyte,tree,climber,parasite,moss,fern}`
- `wildflowers::color::<colour>`, `wildflowers::month::01`–`12`
- `wildflowers::habitat::<Hebrew>`, `wildflowers::region::<Hebrew>`
- `wildflowers::status::{endangered,protected,nectar,medicinal,edible,poisonous,allergenic,invasive,introduced}`
- `wildflowers::popular`

## Building

```sh
cd projects/flower-anki
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
python3 scripts/build_decks.py        # or: pnpm --filter flower-anki decks
```

The first run downloads about 2,800 photos and 2,700 audio clips from wildflowers.co.il into
`.media-cache/`, shrinking photos to 800px. Later runs reuse the cache. If the site doesn't
have a file it's remembered and skipped; a plant whose photo is missing is left out of the decks.
Network errors aren't remembered, so re-running retries those files.

`--remote-images` skips the downloads and writes `out/israeli-wildflowers-remote.apkg`.
Cards then load photos from the site, so you need internet while studying, and they have no audio.
This mode is mainly for a quick preview.

Then in Anki: **File → Import** and pick `out/israeli-wildflowers.apkg`.

## Data

- `data/flowers.json`: the plant list (2,822 entries).
- `data/lookups.json`: the site's lookup tables (families, colours, months, regions, …). The decks don't use these yet.

Both come from a single export file that holds two JSON documents back to back.
`scripts/split_source.py <export.json>` regenerates them from a new export.

Field notes, because the source names are misleading:

- `Hebrew_Name` is the **Arabic** name.
- `Hebrew_Audio` / `English_Audio` / `Common_Audio` are the Hebrew, Latin and English name pronunciations.
- `Leaf_Count` is the petal count, `Leaf_Lang` the leaf edge, `Kasut` the hairiness.
- `Description` is always empty.

The photos belong to their photographers (credited on each card). Keep the decks for personal
use and don't share them publicly, e.g. on AnkiWeb.
