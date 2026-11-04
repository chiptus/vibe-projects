"""Build an Anki package (.apkg) of Israeli wildflowers from data/flowers.json.

Writes out/israeli-wildflowers.apkg: a parent deck with two subdecks, and
every plant in exactly one of them:

  צמחי בר בישראל::פופולריים    - the well-known plants (see plants.is_popular)
  צמחי בר בישראל::שאר הצמחים   - everything else

Each plant becomes one note with two cards: photo -> Hebrew name, and Hebrew
name -> photo. Photos and pronunciation audio (Hebrew, Latin, English) are
downloaded from wildflowers.co.il once, cached in .media-cache/, shrunk, and
embedded. The cards only play the Hebrew audio.

The code lives in flower_anki/: plants.py (cleaning the export), tags.py,
media.py (downloads), note_model.py + templates/ (card layout), package.py.

Usage:
  python3 scripts/build_decks.py                  # download media, embed it
  python3 scripts/build_decks.py --remote-images  # no downloads: images load
                                                  # from the site, no audio
"""

import argparse
import json

from flower_anki.config import CACHE_DIR, DATA_FILE, OUT_DIR
from flower_anki.media import download_all
from flower_anki.package import write_package
from flower_anki.plants import Plant, build_plant, drop_missing_media


def sort_key(p: Plant):
    # Popular plants first so new cards start with familiar ones, then by family.
    return (not p.popular, p.fields["FamilyLatin"], p.fields["Hebrew"])


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument(
        "--remote-images",
        action="store_true",
        help="don't download media: link images to the site (needs internet "
        "while studying) and leave out audio",
    )
    parser.add_argument("--workers", type=int, default=8, help="parallel downloads")
    args = parser.parse_args()

    raw = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    plants = sorted((build_plant(r, args.remote_images) for r in raw), key=sort_key)
    print(f"{len(plants)} plants, {sum(p.popular for p in plants)} popular")

    if not args.remote_images:
        missing = download_all([m for p in plants for m in p.media], CACHE_DIR, args.workers)
        for p in plants:
            drop_missing_media(p, missing)

    suffix = "-remote" if args.remote_images else ""
    write_package(plants, CACHE_DIR, OUT_DIR / f"israeli-wildflowers{suffix}.apkg")


if __name__ == "__main__":
    main()
