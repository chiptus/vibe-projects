"""Turn raw export records into cleaned note fields, media and tags."""

import html
import re
from dataclasses import dataclass, field

from .config import SITE
from .media import Media, media_url
from .tags import plant_tags
from .vocab import MONTHS, NOT_POPULAR_LIFE_FORMS, PROTECTED, UNKNOWN_VALUES

# Note field -> source key. The source names are misleading: "English_Audio"
# is the Latin name's pronunciation, and "Common_Audio" the English name's.
AUDIO_SOURCES = {
    "AudioHebrew": "Hebrew_Audio",
    "AudioLatin": "English_Audio",
    "AudioEnglish": "Common_Audio",
}


@dataclass
class Plant:
    raw: dict
    fields: dict = field(default_factory=dict)
    tags: list = field(default_factory=list)
    media: list[Media] = field(default_factory=list)

    @property
    def popular(self) -> bool:
        return is_popular(self.raw)


def clean(value: str) -> str:
    value = re.sub(r"\s+", " ", value or "").strip()
    return "" if value in UNKNOWN_VALUES else value


def split_list(value: str) -> list[str]:
    return [v for v in (clean(x) for x in (value or "").split(",")) if v]


def split_family(value: str) -> tuple[str, str]:
    """'קטניות Fabaceae' -> ('קטניות', 'Fabaceae')."""
    value = clean(value)
    m = re.match(r"^(.*?)\s+([A-Z][a-z]+)$", value)
    return (clean(m.group(1)), m.group(2)) if m else (value, "")


def is_popular(raw: dict) -> bool:
    """Well-known plants: the site recorded a pronunciation, or it is protected.

    Pronunciations exist for ~900 plants, and they are the familiar ones
    (anemone, poppy, crown daisy, sea daffodil, ...).
    """
    if clean(raw["Life_form"]) in NOT_POPULAR_LIFE_FORMS:
        return False
    return bool(raw["Hebrew_Audio"].strip()) or PROTECTED in raw["More_details"]


def build_plant(raw: dict, remote_images: bool) -> Plant:
    family_he, family_latin = split_family(raw["Flower_Family"])
    life_form = clean(raw["Life_form"])
    colors = split_list(raw["Flower_color"])
    months = sorted(
        split_list(raw["Flowering_month"]),
        key=lambda m: MONTHS.index(m) if m in MONTHS else 99,
    )
    habitats = split_list(raw["Plant_Place"])
    regions = split_list(raw["Country_distribution"])
    status = split_list(raw["More_details"])

    e = html.escape
    p = Plant(raw)
    p.fields = {
        "Id": raw["Id"],
        "Hebrew": e(clean(raw["Title"])),
        "Latin": e(clean(raw["Hebrew_Sciense"])),
        "English": e(clean(raw["Common_Name"])),
        "Arabic": e(clean(raw["Hebrew_Name"])),  # misnamed in the source
        "FamilyHebrew": e(family_he),
        "FamilyLatin": e(family_latin),
        "LifeForm": e(life_form),
        "Colors": e(", ".join(colors)),
        "Months": e(", ".join(months)),
        "Height": e(clean(raw["Flower_height"])),
        "Habitat": e(", ".join(habitats)),
        "Regions": e(", ".join(regions)),
        "Petals": e(clean(raw["Leaf_Count"])),
        "LeafShape": e(clean(raw["Leaf_Shape"])),
        "LeafEdge": e(clean(raw["Leaf_Lang"])),
        "Stem": e(clean(raw["Stem_Shape"])),
        "Hairiness": e(clean(raw["Kasut"])),
        "Status": e(", ".join(status)),
        "Credit": e(clean(raw["ImageDesc"])),
        "Link": e(SITE + raw["Link"].strip()),
        **{key: "" for key in AUDIO_SOURCES},
    }
    _attach_media(p, remote_images)
    p.tags = plant_tags(
        family_latin, life_form, colors, months, habitats, regions, status, p.popular
    )
    return p


def _attach_media(p: Plant, remote_images: bool) -> None:
    """Fill the Image and Audio* fields, and list the files to download."""
    pid = p.raw["Id"]
    image_url = media_url(p.raw["Image"])
    alt = p.fields["Hebrew"]
    if remote_images:
        p.fields["Image"] = f'<img src="{html.escape(image_url)}" alt="{alt}">'
        return

    image_name = f"wf-{pid}.jpg"
    p.media.append(Media(image_url, image_name, "image"))
    p.fields["Image"] = f'<img src="{image_name}" alt="{alt}">'
    for key, src in AUDIO_SOURCES.items():
        if p.raw[src].strip():
            name = f"wf-{pid}-{key.removeprefix('Audio').lower()}.mp3"
            p.media.append(Media(media_url(p.raw[src]), name, "audio"))
            p.fields[key] = f"[sound:{name}]"


def drop_missing_media(p: Plant, missing: set[str]) -> None:
    """Blank out fields whose file couldn't be downloaded."""
    for m in p.media:
        if m.filename not in missing:
            continue
        if m.kind == "image":
            p.fields["Image"] = ""
        else:
            for key in AUDIO_SOURCES:
                if m.filename in p.fields[key]:
                    p.fields[key] = ""
