"""Write the .apkg: a parent deck with popular / rest subdecks."""

from pathlib import Path

import genanki

from .config import DECK_POPULAR_ID, DECK_REST_ID, PARENT_DECK
from .note_model import FIELDS, MODEL
from .plants import Plant


def write_package(plants: list[Plant], cache_dir: Path, out_path: Path) -> None:
    decks = {
        True: genanki.Deck(DECK_POPULAR_ID, f"{PARENT_DECK}::פופולריים"),
        False: genanki.Deck(DECK_REST_ID, f"{PARENT_DECK}::שאר הצמחים"),
    }
    media_files = []
    for p in plants:
        if not p.fields["Image"]:
            continue  # a card without its photo is useless
        decks[p.popular].add_note(genanki.Note(
            model=MODEL,
            fields=[p.fields[f] for f in FIELDS],
            tags=p.tags,
            guid=genanki.guid_for("wildflower", p.raw["Id"]),
        ))
        media_files += [
            str(cache_dir / m.filename)
            for m in p.media
            if (cache_dir / m.filename).exists()
        ]
    out_path.parent.mkdir(parents=True, exist_ok=True)
    genanki.Package(list(decks.values()), media_files).write_to_file(out_path)

    size = out_path.stat().st_size / 1_000_000
    counts = ", ".join(f"{d.name.split('::')[-1]} {len(d.notes)}" for d in decks.values())
    print(f"{out_path.name}: {counts} notes, {len(media_files)} media files, {size:.1f} MB")
