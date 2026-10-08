"""Download photos and audio once into a local cache, shrinking photos."""

import io
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from pathlib import Path

from PIL import Image

from .config import MEDIA_BASE, SITE

MAX_IMAGE_SIDE = 800
JPEG_QUALITY = 80


@dataclass
class Media:
    url: str
    filename: str
    kind: str  # "image" | "audio"


def media_url(path: str) -> str:
    return MEDIA_BASE + urllib.parse.quote(path.strip().lstrip("/"))


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


def ensure_media(m: Media, cache_dir: Path) -> Path | None:
    """Download (once) into the cache; return the cached path or None if missing.

    Files the site doesn't have are remembered in a .missing marker; network
    errors aren't, so the next run retries them.
    """
    path = cache_dir / m.filename
    missing = cache_dir / (m.filename + ".missing")
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


def download_all(media: list[Media], cache_dir: Path, workers: int) -> set[str]:
    """Fetch every file into cache_dir; return the filenames that couldn't be had."""
    cache_dir.mkdir(parents=True, exist_ok=True)

    # Fail fast if the site is unreachable, instead of retrying every file.
    probe = next((m for m in media if not (cache_dir / m.filename).exists()), None)
    if probe:
        try:
            fetch(probe.url, attempts=2)
        except OSError as err:
            sys.exit(f"Can't reach {SITE} ({err}). Check your network, "
                     "or build with --remote-images.")

    missing = set()
    with ThreadPoolExecutor(workers) as pool:
        results = pool.map(lambda m: (m, ensure_media(m, cache_dir)), media)
        for done, (m, path) in enumerate(results, 1):
            if done % 250 == 0 or done == len(media):
                print(f"  media {done}/{len(media)}", flush=True)
            if path is None:
                print(f"  missing: {m.url}", file=sys.stderr)
                missing.add(m.filename)
    print(f"  {len(media) - len(missing)}/{len(media)} media files available")
    return missing
