"""The "Israeli Wildflower" note type. Card HTML and CSS live in templates/."""

from pathlib import Path

import genanki

from .config import MODEL_ID

TEMPLATES = Path(__file__).parent / "templates"

FIELDS = [
    "Id", "Hebrew", "Latin", "English", "Arabic",
    "FamilyHebrew", "FamilyLatin", "LifeForm", "Colors", "Months",
    "Height", "Habitat", "Regions", "Petals", "LeafShape", "LeafEdge",
    "Stem", "Hairiness", "Status", "Image", "Credit",
    "AudioHebrew", "AudioLatin", "AudioEnglish", "Link",
]  # fmt: skip


def _read(name: str) -> str:
    return (TEMPLATES / name).read_text(encoding="utf-8")


def _back(name: str) -> str:
    # Every back ends with the collapsed details section.
    return _read(name).rstrip("\n") + "\n" + _read("details.html")


# Cards only use AudioHebrew; AudioLatin and AudioEnglish are kept in the note
# for future Latin/English card types.
MODEL = genanki.Model(
    MODEL_ID,
    "Israeli Wildflower",
    fields=[{"name": f} for f in FIELDS],
    templates=[
        {
            "name": "Photo → Hebrew",
            "qfmt": _read("photo_front.html"),
            "afmt": _back("photo_back.html"),
        },
        {
            "name": "Hebrew → Photo",
            "qfmt": _read("hebrew_front.html"),
            "afmt": _back("hebrew_back.html"),
        },
    ],
    css=_read("card.css"),
    sort_field_index=FIELDS.index("Hebrew"),
)
