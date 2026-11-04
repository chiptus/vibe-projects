"""Split the raw wildflowers.co.il export into two clean JSON files.

The export is two JSON documents back to back (the plant list, then the
lookup tables), which a normal JSON parser rejects. This writes:

  data/flowers.json  - list of plants
  data/lookups.json  - lookup tables (families, colors, months, ...)

Usage: python3 scripts/split_source.py <raw-export.json>
"""

import json
import sys
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    text = Path(sys.argv[1]).read_text(encoding="utf-8")
    decoder = json.JSONDecoder()
    flowers, end = decoder.raw_decode(text)
    lookups, _ = decoder.raw_decode(text, text.index("{", end))

    DATA_DIR.mkdir(exist_ok=True)
    for name, value in (("flowers.json", flowers), ("lookups.json", lookups)):
        (DATA_DIR / name).write_text(
            json.dumps(value, ensure_ascii=False, indent=1) + "\n", encoding="utf-8"
        )
    print(f"{len(flowers)} plants, {len(lookups)} lookup tables -> {DATA_DIR}")


if __name__ == "__main__":
    main()
