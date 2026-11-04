"""Paths, source URLs and fixed Anki IDs."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA_FILE = ROOT / "data" / "flowers.json"
CACHE_DIR = ROOT / ".media-cache"
OUT_DIR = ROOT / "out"

SITE = "https://www.wildflowers.co.il"
MEDIA_BASE = f"{SITE}/wild-flower/"

# Fixed IDs so re-importing a rebuilt package updates notes instead of duplicating.
MODEL_ID = 1_729_384_501
DECK_POPULAR_ID = 1_729_384_503
DECK_REST_ID = 1_729_384_504
PARENT_DECK = "צמחי בר בישראל"
