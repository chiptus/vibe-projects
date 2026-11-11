"""Download photos and audio once into a local cache, shrinking photos."""

import http.client
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
PROBE_IMAGES = 5

# Pillow refuses images over ~180M pixels as possible decompression bombs.
# Every photo comes from the one site we chose, and shrink_jpeg decodes JPEGs
# at reduced scale, so a huge photo is shrunk like any other.
Image.MAX_IMAGE_PIXELS = None


class DownloadFailed(Exception):
    """A file couldn't be fetched or decoded this run; the next run retries it."""


@dataclass
class Media:
    url: str
    filename: str
    kind: str  # "image" | "audio"


def media_url(path: str) -> str:
    return MEDIA_BASE + urllib.parse.quote(path.strip().lstrip("/"))


def fetch(url: str, attempts: int = 3) -> bytes | None:
    """Return the body, None if the site says the file doesn't exist (4xx).

    Raises OSError or http.client.HTTPException if the site can't be reached
    or keeps cutting the transfer off after all attempts.
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
        # URLError, timeouts and connection resets are OSErrors; a transfer cut
        # off mid-body raises IncompleteRead, an HTTPException.
        except (OSError, http.client.HTTPException) as err:
            error = err
        if attempt < attempts - 1:
            time.sleep(2**attempt)
    raise error


def shrink_jpeg(data: bytes) -> bytes:
    """Re-encode a photo as JPEG, at most MAX_IMAGE_SIDE px on its longer side."""
    img = Image.open(io.BytesIO(data))
    # For JPEGs, decode straight at 1/2, 1/4 or 1/8 size, so a huge photo
    # never needs its full-size pixels in memory. No-op for other formats.
    img.draft("RGB", (MAX_IMAGE_SIDE, MAX_IMAGE_SIDE))
    img = img.convert("RGB")
    img.thumbnail((MAX_IMAGE_SIDE, MAX_IMAGE_SIDE))
    out = io.BytesIO()
    img.save(out, "JPEG", quality=JPEG_QUALITY, optimize=True)
    return out.getvalue()


def _marked_missing(m: Media, cache_dir: Path) -> bool:
    """True if an earlier run found this exact URL missing on the site.

    A marker written for a different URL (e.g. before MEDIA_BASE changed)
    doesn't count.
    """
    marker = cache_dir / (m.filename + ".missing")
    return marker.exists() and marker.read_text(encoding="utf-8") == m.url


def ensure_media(m: Media, cache_dir: Path) -> Path | None:
    """Download (once) into the cache; return the cached path or None if missing.

    Files the site doesn't have are remembered in a .missing marker holding
    their URL. A photo that won't decode is skipped for this run without a
    marker, so the next run retries it. Network errors raise DownloadFailed.
    """
    path = cache_dir / m.filename
    missing = cache_dir / (m.filename + ".missing")
    if path.exists():
        return path
    if _marked_missing(m, cache_dir):
        return None
    try:
        data = fetch(m.url)
    except (OSError, http.client.HTTPException) as err:
        raise DownloadFailed(f"{m.url}: {err}") from err
    if data is None:
        missing.write_text(m.url, encoding="utf-8")
        return None
    if m.kind == "image":
        try:
            data = shrink_jpeg(data)
        except (OSError, ValueError) as err:
            print(f"  can't decode {m.url} ({err}); skipping it this run", file=sys.stderr)
            return None
    tmp = path.with_suffix(".part")
    tmp.write_bytes(data)
    tmp.replace(path)
    missing.unlink(missing_ok=True)  # a stale marker from an old URL
    return path


def _probe(media: list[Media], cache_dir: Path) -> None:
    """Exit before the bulk download if the site is unreachable or MEDIA_BASE is wrong.

    Runs before any .missing marker is written, so a wrong MEDIA_BASE can't
    leave thousands of markers behind that block retries once it's fixed.
    """
    images = [m for m in media if m.kind == "image"]
    to_fetch = [
        m for m in images
        if not (cache_dir / m.filename).exists() and not _marked_missing(m, cache_dir)
    ]
    if not to_fetch:
        return
    # A photo already in the cache proves the base works; then one check for
    # reachability is enough, and later 404s are genuinely missing files.
    base_proven = any((cache_dir / m.filename).exists() for m in images)
    for m in to_fetch[: 1 if base_proven else PROBE_IMAGES]:
        try:
            if fetch(m.url, attempts=2) is not None:
                return
        except (OSError, http.client.HTTPException) as err:
            sys.exit(f"Can't reach {SITE} ({err}). Check your network, "
                     "or build with --remote-images.")
    if not base_proven:
        sys.exit(f"None of the first {PROBE_IMAGES} photos exist under {MEDIA_BASE}. "
                 "The media URL base looks wrong: fix MEDIA_BASE in "
                 "scripts/flower_anki/config.py.")


def download_all(media: list[Media], cache_dir: Path, workers: int) -> set[str]:
    """Fetch every file into cache_dir; return the filenames the site doesn't have.

    If any file failed to download, exits after trying them all,
    before a package is written, so a flaky connection can't silently leave
    plants out. Rerunning fetches only what's not cached yet.
    """
    cache_dir.mkdir(parents=True, exist_ok=True)

    _probe(media, cache_dir)

    def attempt(m: Media) -> tuple[Media, Path | None, str | None]:
        try:
            return m, ensure_media(m, cache_dir), None
        except DownloadFailed as err:
            return m, None, str(err)

    missing, failed = set(), []
    with ThreadPoolExecutor(workers) as pool:
        for done, (m, path, error) in enumerate(pool.map(attempt, media), 1):
            if done % 250 == 0 or done == len(media):
                print(f"  media {done}/{len(media)}", flush=True)
            if error:
                print(f"  failed: {error}", file=sys.stderr)
                failed.append(m)
            elif path is None:
                print(f"  missing: {m.url}", file=sys.stderr)
                missing.add(m.filename)
    if failed:
        sys.exit(f"{len(failed)} files failed to download (see above). Run again "
                 "to retry them; everything else is cached.")
    print(f"  {len(media) - len(missing)}/{len(media)} media files available")
    return missing
