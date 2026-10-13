"""Hierarchical Anki tags (wildflowers::<kind>::<value>) for filtered decks."""

import re

from .vocab import COLOR_TAGS, LIFE_FORM_TAGS, MONTHS, STATUS_TAGS


def tag_slug(value: str) -> str:
    return re.sub(r"[\s/]+", "_", value.strip())


def plant_tags(
    family_latin: str,
    life_form: str,
    colors: list[str],
    months: list[str],
    habitats: list[str],
    regions: list[str],
    status: list[str],
    popular: bool,
) -> list[str]:
    t = ["wildflowers"]
    if family_latin:
        t.append(f"wildflowers::family::{family_latin}")
    if life_form:
        t.append(f"wildflowers::lifeform::{LIFE_FORM_TAGS.get(life_form, tag_slug(life_form))}")
    t += [f"wildflowers::color::{COLOR_TAGS.get(c, tag_slug(c))}" for c in colors]
    t += [f"wildflowers::month::{MONTHS.index(m) + 1:02d}" for m in months if m in MONTHS]
    t += [f"wildflowers::habitat::{tag_slug(h)}" for h in habitats]
    t += [f"wildflowers::region::{tag_slug(r)}" for r in regions]
    t += [f"wildflowers::status::{STATUS_TAGS.get(s, tag_slug(s))}" for s in status]
    if popular:
        t.append("wildflowers::popular")
    return sorted(set(t))
