"""Build Anki decks (.apkg) of Israeli wildflowers from data/flowers.json.

Writes one package, out/israeli-wildflowers.apkg, holding a parent deck with
two subdecks. Every plant is in exactly one of them:

  צמחי בר בישראל::פופולריים    - the well-known plants (see is_popular)
  צמחי בר בישראל::שאר הצמחים   - everything else

Each plant becomes one note with two cards: photo -> Hebrew name, and Hebrew
name -> photo. Photos and pronunciation audio (Hebrew, Latin, English) are
downloaded from wildflowers.co.il once, cached in .media-cache/, shrunk, and
embedded. The cards only play the Hebrew audio; the Latin and English clips
sit in their own fields for future card types.

Usage:
  python3 scripts/build_decks.py                  # download media, embed it
  python3 scripts/build_decks.py --remote-images  # no downloads: images load
                                                  # from the site, no audio
"""

import argparse
import html
import io
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field
from pathlib import Path

import genanki
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = ROOT / "data" / "flowers.json"
CACHE_DIR = ROOT / ".media-cache"
OUT_DIR = ROOT / "out"

SITE = "https://www.wildflowers.co.il"
MEDIA_BASE = f"{SITE}/wild-flower/"
MAX_IMAGE_SIDE = 800
JPEG_QUALITY = 80

# Fixed IDs so re-importing a rebuilt deck updates notes instead of duplicating.
MODEL_ID = 1_729_384_501
DECK_POPULAR_ID = 1_729_384_503
DECK_REST_ID = 1_729_384_504
PARENT_DECK = "צמחי בר בישראל"

NOT_POPULAR_LIFE_FORMS = {"טחבים", "שרכים"}  # mosses, ferns
UNKNOWN_VALUES = {"לא יודע", "לא נמסר מידע"}

LIFE_FORM_TAGS = {
    "חד-שנתי": "annual",
    "עשבוני רב-שנתי": "perennial",
    "שיח ובן-שיח": "shrub",
    "בעל בצל או פקעת (גיאופיט)": "geophyte",
    "עץ": "tree",
    "מטפס": "climber",
    "טפיל": "parasite",
    "טחבים": "moss",
    "שרכים": "fern",
}
COLOR_TAGS = {
    "צהוב": "yellow",
    "לבן": "white",
    "ורוד": "pink",
    "ירוק": "green",
    "קרם": "cream",
    "סגול": "purple",
    "בורדו": "bordeaux",
    "חום": "brown",
    "כחול": "blue",
    "תכלת": "light-blue",
    "אדום": "red",
    "כתום": "orange",
}
STATUS_TAGS = {
    "בסכנת הכחדה": "endangered",
    "צמח מוגן": "protected",
    "צמח צופני": "nectar",
    "צמח המשומש לרפואה": "medicinal",
    "תבלין ו/או צמח מאכל": "edible",
    "צמח רעיל": "poisonous",
    "צמח אלרגני": "allergenic",
    "צמח פולש": "invasive",
    "צמח מיובא": "introduced",
}
MONTHS = [
    "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
    "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
]  # fmt: skip

FIELDS = [
    "Id", "Hebrew", "Latin", "English", "Arabic",
    "FamilyHebrew", "FamilyLatin", "LifeForm", "Colors", "Months",
    "Height", "Habitat", "Regions", "Petals", "LeafShape", "LeafEdge",
    "Stem", "Hairiness", "Status", "Image", "Credit",
    "AudioHebrew", "AudioLatin", "AudioEnglish", "Link",
]  # fmt: skip

# Collapsed on the back so the Hebrew name and photo stay the focus.
MORE_DETAILS = """
<details class="more">
  <summary>פרטים נוספים</summary>
  <div class="latin">{{Latin}}</div>
  {{#English}}<div class="english">{{English}}</div>{{/English}}
  {{#Arabic}}<div class="arabic">{{Arabic}}</div>{{/Arabic}}
  <table class="details">
    {{#FamilyHebrew}}<tr><th>משפחה</th><td>{{FamilyHebrew}} <span class="latin">{{FamilyLatin}}</span></td></tr>{{/FamilyHebrew}}
    {{#LifeForm}}<tr><th>צורת חיים</th><td>{{LifeForm}}</td></tr>{{/LifeForm}}
    {{#Colors}}<tr><th>צבע</th><td>{{Colors}}</td></tr>{{/Colors}}
    {{#Months}}<tr><th>פריחה</th><td>{{Months}}</td></tr>{{/Months}}
    {{#Height}}<tr><th>גובה</th><td>{{Height}}</td></tr>{{/Height}}
    {{#Habitat}}<tr><th>בית גידול</th><td>{{Habitat}}</td></tr>{{/Habitat}}
    {{#Regions}}<tr><th>תפוצה</th><td>{{Regions}}</td></tr>{{/Regions}}
    {{#Petals}}<tr><th>עלי כותרת</th><td>{{Petals}}</td></tr>{{/Petals}}
    {{#LeafShape}}<tr><th>צורת העלה</th><td>{{LeafShape}}</td></tr>{{/LeafShape}}
    {{#LeafEdge}}<tr><th>שפת העלה</th><td>{{LeafEdge}}</td></tr>{{/LeafEdge}}
    {{#Stem}}<tr><th>גבעול</th><td>{{Stem}}</td></tr>{{/Stem}}
    {{#Hairiness}}<tr><th>כסות</th><td>{{Hairiness}}</td></tr>{{/Hairiness}}
    {{#Status}}<tr><th>מידע נוסף</th><td>{{Status}}</td></tr>{{/Status}}
  </table>
  <div class="link"><a href="{{Link}}">צמח השדה ↗</a></div>
</details>
<div class="credit">{{Credit}}</div>
"""

CSS = """
.card { font-family: system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
  font-size: 18px; text-align: center; direction: rtl; color: #222; background: #fff; }
.nightMode.card, .night_mode .card { color: #eee; background: #1e1e1e; }
.photo img { max-width: 100%; max-height: 60vh; border-radius: 8px; }
.prompt { font-size: 15px; opacity: .6; margin-bottom: 8px; }
.hebrew { font-size: 32px; font-weight: 600; }
.latin { font-style: italic; direction: ltr; unicode-bidi: isolate; }
.more { margin-top: 14px; font-size: 15px; }
.more summary { cursor: pointer; opacity: .6; }
.more .latin { font-size: 18px; margin-top: 8px; }
.english { direction: ltr; opacity: .8; }
.arabic { opacity: .8; }
.details { width: 100%; margin: 12px auto; border-collapse: collapse; font-size: 15px; text-align: right; }
.details th { font-weight: 500; opacity: .6; padding: 2px 10px; white-space: nowrap; vertical-align: top; }
.details td { padding: 2px 10px; }
.credit, .link { font-size: 12px; opacity: .6; margin-top: 6px; }
.audio-btn { margin-top: 4px; }
"""

MODEL = genanki.Model(
    MODEL_ID,
    "Israeli Wildflower",
    fields=[{"name": f} for f in FIELDS],
    templates=[
        # Only the Hebrew audio is placed on a card; AudioLatin/AudioEnglish
        # are kept in the note for future Latin/English card types.
        {
            "name": "Photo → Hebrew",
            "qfmt": '<div class="prompt">מה שם הצמח?</div><div class="photo">{{Image}}</div>',
            "afmt": '{{FrontSide}}<hr id="answer"><div class="hebrew">{{Hebrew}}</div>'
            '<div class="audio-btn">{{AudioHebrew}}</div>' + MORE_DETAILS,
        },
        {
            "name": "Hebrew → Photo",
            "qfmt": '<div class="prompt">איך נראה הצמח?</div><div class="hebrew">{{Hebrew}}</div>',
            "afmt": '{{FrontSide}}<div class="audio-btn">{{AudioHebrew}}</div>'
            '<hr id="answer"><div class="photo">{{Image}}</div>' + MORE_DETAILS,
        },
    ],
    css=CSS,
    sort_field_index=FIELDS.index("Hebrew"),
)


@dataclass
class Media:
    url: str
    filename: str
    kind: str  # "image" | "audio"


@dataclass
class Plant:
    raw: dict
    fields: dict = field(default_factory=dict)
    tags: list = field(default_factory=list)
    media: list = field(default_factory=list)


def clean(value: str) -> str:
    value = re.sub(r"\s+", " ", value or "").strip()
    return "" if value in UNKNOWN_VALUES else value


def split_list(value: str) -> list[str]:
    return [v for v in (clean(x) for x in (value or "").split(",")) if v]


def tag_slug(value: str) -> str:
    return re.sub(r"[\s/]+", "_", value.strip())


def split_family(value: str) -> tuple[str, str]:
    value = clean(value)
    m = re.match(r"^(.*?)\s+([A-Z][a-z]+)$", value)
    return (clean(m.group(1)), m.group(2)) if m else (value, "")


def media_url(path: str) -> str:
    return MEDIA_BASE + urllib.parse.quote(path.strip().lstrip("/"))


def is_popular(raw: dict) -> bool:
    """Well-known plants: the site recorded a pronunciation, or it is protected.

    Pronunciations exist for ~900 plants, and they are the familiar ones
    (anemone, poppy, crown daisy, sea daffodil, ...).
    """
    if clean(raw["Life_form"]) in NOT_POPULAR_LIFE_FORMS:
        return False
    return bool(raw["Hebrew_Audio"].strip()) or "צמח מוגן" in raw["More_details"]


def build_plant(raw: dict, remote_images: bool) -> Plant:
    p = Plant(raw)
    pid = raw["Id"]
    family_he, family_latin = split_family(raw["Flower_Family"])
    life_form = clean(raw["Life_form"])
    colors = split_list(raw["Flower_color"])
    months = sorted(split_list(raw["Flowering_month"]), key=lambda m: MONTHS.index(m) if m in MONTHS else 99)
    habitats = split_list(raw["Plant_Place"])
    regions = split_list(raw["Country_distribution"])
    status = split_list(raw["More_details"])

    e = html.escape
    p.fields = {
        "Id": pid,
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
        "AudioHebrew": "",
        "AudioLatin": "",
        "AudioEnglish": "",
    }

    image_url = media_url(raw["Image"])
    alt = p.fields["Hebrew"]
    if remote_images:
        p.fields["Image"] = f'<img src="{e(image_url)}" alt="{alt}">'
    else:
        image_name = f"wf-{pid}.jpg"
        p.media.append(Media(image_url, image_name, "image"))
        p.fields["Image"] = f'<img src="{image_name}" alt="{alt}">'
        for key, src in (
            ("AudioHebrew", "Hebrew_Audio"),
            ("AudioLatin", "English_Audio"),  # the "English" audio is the Latin name
            ("AudioEnglish", "Common_Audio"),
        ):
            if raw[src].strip():
                name = f"wf-{pid}-{key[5:].lower()}.mp3"
                p.media.append(Media(media_url(raw[src]), name, "audio"))
                p.fields[key] = f"[sound:{name}]"

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
    if is_popular(raw):
        t.append("wildflowers::popular")
    p.tags = sorted(set(t))
    return p


def fetch(url: str, attempts: int = 3) -> bytes | None:
    """Return the body, None if the site says the file doesn't exist (4xx).

    Raises OSError if the site can't be reached after all attempts.
    """
    for attempt in range(attempts):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "flower-anki/1.0"})
            with urllib.request.urlopen(req, timeout=30) as resp:
                return resp.read()
        except urllib.error.HTTPError as err:
            if 400 <= err.code < 500:
                return None
            error = err
        except OSError as err:  # URLError, timeouts, connection resets
            error = err
        if attempt < attempts - 1:
            time.sleep(2**attempt)
    raise error


def shrink_jpeg(data: bytes) -> bytes:
    img = Image.open(io.BytesIO(data))
    img = img.convert("RGB")
    img.thumbnail((MAX_IMAGE_SIDE, MAX_IMAGE_SIDE))
    out = io.BytesIO()
    img.save(out, "JPEG", quality=JPEG_QUALITY, optimize=True)
    return out.getvalue()


def ensure_media(m: Media) -> Path | None:
    """Download (once) into the cache; return the cached path or None if missing.

    Files the site doesn't have are remembered in a .missing marker; network
    errors aren't, so the next run retries them.
    """
    path = CACHE_DIR / m.filename
    missing = CACHE_DIR / (m.filename + ".missing")
    if path.exists():
        return path
    if missing.exists():
        return None
    try:
        data = fetch(m.url)
    except OSError:
        return None
    if data is not None and m.kind == "image":
        try:
            data = shrink_jpeg(data)
        except OSError:
            data = None
    if data is None:
        missing.write_text(m.url)
        return None
    tmp = path.with_suffix(".part")
    tmp.write_bytes(data)
    tmp.replace(path)
    return path


def download_all(plants: list[Plant], workers: int) -> None:
    CACHE_DIR.mkdir(exist_ok=True)
    jobs = [(p, m) for p in plants for m in p.media]
    done = 0

    # Fail fast if the site is unreachable, instead of retrying every file.
    probe = next((m for _, m in jobs if not (CACHE_DIR / m.filename).exists()), None)
    if probe:
        try:
            fetch(probe.url, attempts=2)
        except OSError as err:
            sys.exit(f"Can't reach {SITE} ({err}). Check your network, "
                     "or build with --remote-images.")

    def run(job):
        return job, ensure_media(job[1])

    with ThreadPoolExecutor(workers) as pool:
        for (p, m), path in pool.map(run, jobs):
            done += 1
            if done % 250 == 0 or done == len(jobs):
                print(f"  media {done}/{len(jobs)}", flush=True)
            if path is None:
                print(f"  missing: {m.url}", file=sys.stderr)
                if m.kind == "image":
                    p.fields["Image"] = ""
                else:
                    for key in ("AudioHebrew", "AudioLatin", "AudioEnglish"):
                        if m.filename in p.fields[key]:
                            p.fields[key] = ""

    found = sum(1 for _, m in jobs if (CACHE_DIR / m.filename).exists())
    print(f"  {found}/{len(jobs)} media files available")


def sort_key(p: Plant):
    # Popular plants first so new cards start with familiar ones, then by family.
    return (not is_popular(p.raw), p.fields["FamilyLatin"], p.fields["Hebrew"])


def write_package(plants: list[Plant], out_path: Path) -> None:
    decks = {
        True: genanki.Deck(DECK_POPULAR_ID, f"{PARENT_DECK}::פופולריים"),
        False: genanki.Deck(DECK_REST_ID, f"{PARENT_DECK}::שאר הצמחים"),
    }
    media_files = []
    for p in plants:
        if not p.fields["Image"]:
            continue  # a card without its photo is useless
        decks[is_popular(p.raw)].add_note(genanki.Note(
            model=MODEL,
            fields=[p.fields[f] for f in FIELDS],
            tags=p.tags,
            guid=genanki.guid_for("wildflower", p.raw["Id"]),
        ))
        media_files += [
            str(CACHE_DIR / m.filename)
            for m in p.media
            if (CACHE_DIR / m.filename).exists()
        ]
    OUT_DIR.mkdir(exist_ok=True)
    genanki.Package(list(decks.values()), media_files).write_to_file(out_path)
    size = out_path.stat().st_size / 1_000_000
    counts = ", ".join(f"{d.name.split('::')[-1]} {len(d.notes)}" for d in decks.values())
    print(f"{out_path.relative_to(ROOT)}: {counts} notes, "
          f"{len(media_files)} media files, {size:.1f} MB")


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
    popular = [p for p in plants if is_popular(p.raw)]
    print(f"{len(plants)} plants, {len(popular)} popular")

    if not args.remote_images:
        download_all(plants, args.workers)

    suffix = "-remote" if args.remote_images else ""
    write_package(plants, OUT_DIR / f"israeli-wildflowers{suffix}.apkg")


if __name__ == "__main__":
    main()
