"""Offline regression tests. Run: uv run python -m unittest discover -s tests -v."""

import contextlib
import http.client
import io
import json
from pathlib import Path
import sqlite3
import sys
import tempfile
import unittest
from unittest.mock import Mock, patch
import urllib.error
import zipfile

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))

import build_decks
import split_source
from flower_anki import media
from flower_anki.config import DECK_POPULAR_ID, DECK_REST_ID, MEDIA_BASE
from flower_anki.note_model import FIELDS, MODEL
from flower_anki.package import write_package
from flower_anki.plants import build_plant, clean, drop_missing_media, is_popular, split_family, split_list
from flower_anki.tags import plant_tags


def record(**changes):
    """Minimal synthetic export with all required source fields."""
    raw = dict.fromkeys([
        "Id", "Title", "Hebrew_Sciense", "Common_Name", "Hebrew_Name",
        "Flower_Family", "Life_form", "Flower_color", "Flowering_month",
        "Flower_height", "Plant_Place", "Country_distribution", "Leaf_Count",
        "Leaf_Shape", "Leaf_Lang", "Stem_Shape", "Kasut", "More_details",
        "ImageDesc", "Link", "Image", "Hebrew_Audio", "English_Audio", "Common_Audio",
    ], "")
    raw.update(Id="42", Title="כלנית", Image="photos/flower.jpg", Link="/plant/42")
    raw.update(changes)
    return raw


class PlantTests(unittest.TestCase):
    def test_clean_and_split_unknown_values(self):
        for value in (None, "", "  לא יודע \n", "לא נמסר מידע"):
            with self.subTest(value=value):
                self.assertEqual(clean(value), "")
        self.assertEqual(clean("  a\n\t b  "), "a b")
        self.assertEqual(split_list(" a, לא יודע, , b \n"), ["a", "b"])
        self.assertEqual(split_list(None), [])

    def test_family_requires_a_separate_latin_suffix(self):
        for value, expected in [
            (" קטניות  Fabaceae ", ("קטניות", "Fabaceae")),
            ("קטניות", ("קטניות", "")), ("Fabaceae", ("Fabaceae", "")),
            ("לא יודע", ("", "")), ("קטניות fabaceae", ("קטניות fabaceae", "")),
        ]:
            with self.subTest(value=value):
                self.assertEqual(split_family(value), expected)

    def test_popularity_audio_protection_and_excluded_lifeforms(self):
        for life, audio, status, expected in [
            ("", "", "", False), ("", " \t", "", False),
            ("", "he.mp3", "", True), ("", "", "צמח מוגן", True),
            ("טחבים", "he.mp3", "צמח מוגן", False),
            (" שרכים ", "he.mp3", "צמח מוגן", False),
        ]:
            with self.subTest(life=life, audio=audio, status=status):
                self.assertEqual(is_popular(record(Life_form=life, Hebrew_Audio=audio, More_details=status)), expected)

    def test_build_cleans_escapes_and_maps_misnamed_fields(self):
        p = build_plant(record(
            Title=' <כלנית> & "שם" ', Hebrew_Name="Arabic", Hebrew_Sciense="Latin",
            Common_Name="English", Flower_Family="קטניות Fabaceae",
            Flowering_month="דצמבר, מרץ, ינואר, unknown", Leaf_Count="5",
            Leaf_Lang="edge", Kasut="hair", Flower_height="לא יודע",
        ), False)
        self.assertEqual(set(p.fields), set(FIELDS))
        self.assertEqual(p.fields["Hebrew"], '&lt;כלנית&gt; &amp; &quot;שם&quot;')
        for key, value in {"Arabic": "Arabic", "Latin": "Latin", "English": "English",
                           "FamilyHebrew": "קטניות", "FamilyLatin": "Fabaceae",
                           "Months": "ינואר, מרץ, דצמבר, unknown", "Petals": "5",
                           "LeafEdge": "edge", "Hairiness": "hair", "Height": ""}.items():
            self.assertEqual(p.fields[key], value, key)
        self.assertIn('alt="&lt;כלנית&gt; &amp; &quot;שם&quot;"', p.fields["Image"])

    def test_audio_source_names_and_remote_mode(self):
        raw = record(Hebrew_Audio="he.mp3", English_Audio="la.mp3", Common_Audio="en.mp3")
        p = build_plant(raw, False)
        self.assertEqual([(m.filename, m.url) for m in p.media], [
            ("wf-42.jpg", MEDIA_BASE + "photos/flower.jpg"),
            ("wf-42-hebrew.mp3", MEDIA_BASE + "he.mp3"),
            ("wf-42-latin.mp3", MEDIA_BASE + "la.mp3"),
            ("wf-42-english.mp3", MEDIA_BASE + "en.mp3"),
        ])
        for field, suffix in [("AudioHebrew", "hebrew"), ("AudioLatin", "latin"), ("AudioEnglish", "english")]:
            self.assertEqual(p.fields[field], f"[sound:wf-42-{suffix}.mp3]")
        remote = build_plant(raw, True)
        self.assertEqual(remote.media, [])
        self.assertIn(MEDIA_BASE + "photos/flower.jpg", remote.fields["Image"])
        self.assertTrue(all(remote.fields[f] == "" for f in ("AudioHebrew", "AudioLatin", "AudioEnglish")))

    def test_missing_media_only_clears_affected_fields(self):
        p = build_plant(record(Hebrew_Audio="he.mp3", English_Audio="la.mp3"), False)
        drop_missing_media(p, {"wf-42-hebrew.mp3", "unrelated.mp3"})
        self.assertEqual(p.fields["AudioHebrew"], "")
        self.assertEqual(p.fields["AudioLatin"], "[sound:wf-42-latin.mp3]")
        self.assertTrue(p.fields["Image"])
        drop_missing_media(p, {"wf-42.jpg"})
        self.assertEqual(p.fields["Image"], "")

    def test_tags_translate_deduplicate_and_preserve_unknown_values(self):
        self.assertEqual(plant_tags("Fabaceae", "חד-שנתי", ["אדום", "אדום", "new color"],
                                    ["ינואר", "דצמבר", "unknown"], [" חולות / חוף "],
                                    ["גליל"], ["צמח מוגן", "new status"], True), sorted([
            "wildflowers", "wildflowers::family::Fabaceae", "wildflowers::lifeform::annual",
            "wildflowers::color::red", "wildflowers::color::new_color", "wildflowers::month::01",
            "wildflowers::month::12", "wildflowers::habitat::חולות_חוף", "wildflowers::region::גליל",
            "wildflowers::status::protected", "wildflowers::status::new_status", "wildflowers::popular",
        ]))
        self.assertEqual(plant_tags("", "", [], [], [], [], [], False), ["wildflowers"])


class MediaTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.cache = Path(self.tmp.name)
        self.audio = media.Media("https://example.test/a.mp3", "a.mp3", "audio")

    def test_media_urls(self):
        for source, expected in [(" /images/a b.jpg ", MEDIA_BASE + "images/a%20b.jpg"),
                                 ("תמונה.jpg", MEDIA_BASE + "%D7%AA%D7%9E%D7%95%D7%A0%D7%94.jpg"),
                                 (" HTTPS://example.test/a.jpg ", "HTTPS://example.test/a.jpg")]:
            with self.subTest(source=source):
                self.assertEqual(media.media_url(source), expected)

    @patch.object(media.time, "sleep")
    @patch.object(media.urllib.request, "urlopen")
    def test_fetch_success_request_and_timeout(self, open_url, sleep):
        open_url.return_value.__enter__.return_value.read.return_value = b"audio"
        self.assertEqual(media.fetch(self.audio.url), b"audio")
        req = open_url.call_args.args[0]
        self.assertEqual(req.full_url, self.audio.url)
        self.assertEqual(req.get_header("User-agent"), "flower-anki/1.0")
        self.assertEqual(open_url.call_args.kwargs["timeout"], 30)
        sleep.assert_not_called()

    @patch.object(media.time, "sleep")
    @patch.object(media.urllib.request, "urlopen")
    def test_fetch_permanent_errors_do_not_retry(self, open_url, sleep):
        for code in (400, 403, 404, 410):
            with self.subTest(code=code):
                open_url.reset_mock()
                open_url.side_effect = urllib.error.HTTPError(self.audio.url, code, "missing", {}, None)
                self.assertIsNone(media.fetch(self.audio.url))
                self.assertEqual(open_url.call_count, 1)
        sleep.assert_not_called()

    @patch.object(media.time, "sleep")
    @patch.object(media.urllib.request, "urlopen")
    def test_fetch_transient_errors_retry_then_raise(self, open_url, sleep):
        for error in [OSError("offline"), http.client.IncompleteRead(b"partial"),
                      *[urllib.error.HTTPError(self.audio.url, code, "retry", {}, None) for code in (408, 429, 503)]]:
            with self.subTest(error=error):
                open_url.reset_mock()
                sleep.reset_mock()
                open_url.side_effect = error
                with self.assertRaises(type(error)):
                    media.fetch(self.audio.url)
                self.assertEqual(open_url.call_count, 3)
                self.assertEqual([c.args[0] for c in sleep.call_args_list], [1, 2])

    @patch.object(media.time, "sleep")
    @patch.object(media.urllib.request, "urlopen")
    def test_rate_limit_recovers_and_honors_retry_after(self, open_url, sleep):
        response = Mock()
        response.__enter__ = Mock(return_value=Mock(read=Mock(return_value=b"ok")))
        response.__exit__ = Mock(return_value=False)
        open_url.side_effect = [urllib.error.HTTPError(self.audio.url, 429, "retry", {"Retry-After": "7"}, None), response]
        self.assertEqual(media.fetch(self.audio.url), b"ok")
        sleep.assert_called_once_with(7)

    def test_retry_after_invalid_past_and_clamped_values(self):
        for value, expected in [(None, None), ("garbage", None), ("0", 0), ("999", 60),
                                ("Thu, 01 Jan 1970 00:00:00 GMT", 0)]:
            with self.subTest(value=value):
                err = urllib.error.HTTPError(self.audio.url, 429, "retry", {"Retry-After": value} if value else {}, None)
                self.assertEqual(media._retry_after(err), expected)

    @patch.object(media, "fetch", return_value=b"audio")
    def test_cache_hit_and_stale_missing_marker(self, fetch):
        marker = self.cache / "a.mp3.missing"
        marker.write_text("https://old.test/a.mp3")
        path = media.ensure_media(self.audio, self.cache)
        self.assertEqual(path.read_bytes(), b"audio")
        self.assertFalse(marker.exists())
        self.assertFalse((self.cache / "a.part").exists())
        self.assertEqual(media.ensure_media(self.audio, self.cache), path)
        fetch.assert_called_once_with(self.audio.url)

    @patch.object(media, "fetch", return_value=None)
    def test_missing_is_cached_for_exact_url(self, fetch):
        self.assertIsNone(media.ensure_media(self.audio, self.cache))
        self.assertEqual((self.cache / "a.mp3.missing").read_text(), self.audio.url)
        self.assertIsNone(media.ensure_media(self.audio, self.cache))
        fetch.assert_called_once()

    @patch.object(media, "fetch", side_effect=OSError("offline"))
    def test_network_failure_does_not_poison_cache(self, fetch):
        with self.assertRaises(media.DownloadFailed):
            media.ensure_media(self.audio, self.cache)
        self.assertEqual(list(self.cache.iterdir()), [])

    @patch.object(media, "fetch", return_value=b"not an image")
    def test_corrupt_image_is_retried_without_missing_marker(self, fetch):
        image = media.Media("https://example.test/a.jpg", "a.jpg", "image")
        for _ in range(2):
            self.assertIsNone(media.ensure_media(image, self.cache))
        self.assertEqual(fetch.call_count, 2)
        self.assertEqual(list(self.cache.iterdir()), [])

    def test_shrink_jpeg_converts_and_preserves_aspect_ratio(self):
        for size, expected in [((1600, 400), (800, 200)), ((400, 1600), (200, 800)), ((20, 10), (20, 10))]:
            with self.subTest(size=size):
                source = io.BytesIO()
                Image.new("RGBA", size, "red").save(source, "PNG")
                with Image.open(io.BytesIO(media.shrink_jpeg(source.getvalue()))) as image:
                    self.assertEqual((image.format, image.mode, image.size), ("JPEG", "RGB", expected))

    @patch.object(media, "fetch", return_value=None)
    def test_probe_wrong_base_aborts_without_writing_markers(self, fetch):
        images = [media.Media(f"https://example.test/{i}.jpg", f"{i}.jpg", "image") for i in range(8)]
        with self.assertRaisesRegex(SystemExit, "MEDIA_BASE"):
            media._probe(images, self.cache)
        self.assertEqual(fetch.call_count, 5)
        self.assertEqual(list(self.cache.iterdir()), [])

    @patch.object(media, "fetch")
    def test_probe_accepts_existing_cache_and_skips_marked_urls(self, fetch):
        image = media.Media("https://example.test/a.jpg", "a.jpg", "image")
        (self.cache / "a.jpg.missing").write_text(image.url)
        media._probe([image, self.audio], self.cache)
        fetch.assert_not_called()
        (self.cache / "a.jpg").write_bytes(b"cached")
        fetch.return_value = None
        media._probe([image, media.Media("https://example.test/b.jpg", "b.jpg", "image")], self.cache)
        fetch.assert_called_once_with("https://example.test/b.jpg", attempts=2)

    @patch.object(media, "fetch", side_effect=OSError("offline"))
    def test_probe_network_failure_reports_recovery(self, fetch):
        with self.assertRaisesRegex(SystemExit, "remote-images"):
            media._probe([media.Media("https://example.test/a.jpg", "a.jpg", "image")], self.cache)

    @patch.object(media, "_probe")
    @patch.object(media, "ensure_media")
    def test_download_all_collects_missing_but_aborts_on_any_failure(self, ensure, probe):
        items = [media.Media(f"https://example.test/{i}", f"{i}.mp3", "audio") for i in range(3)]
        def result(item, cache):
            if item.filename == "2.mp3":
                raise media.DownloadFailed("offline")
            return cache / item.filename if item.filename == "0.mp3" else None
        ensure.side_effect = result
        with self.assertRaisesRegex(SystemExit, "1 files failed"):
            media.download_all(items, self.cache, workers=1)
        self.assertEqual(ensure.call_count, 3)
        ensure.side_effect = lambda item, cache: None if item.filename == "1.mp3" else cache / item.filename
        self.assertEqual(media.download_all(items, self.cache, workers=1), {"1.mp3"})
        self.assertEqual(media.download_all([], self.cache, workers=1), set())


class PackageAndCommandTests(unittest.TestCase):
    def test_card_templates_keep_answers_and_non_hebrew_audio_off_front(self):
        photo, hebrew = MODEL.templates
        self.assertIn("{{Image}}", photo["qfmt"])
        self.assertNotIn("{{Hebrew}}", photo["qfmt"])
        self.assertIn("{{Hebrew}}", hebrew["qfmt"])
        self.assertNotIn("{{Image}}", hebrew["qfmt"])
        for template in MODEL.templates:
            self.assertNotIn("{{AudioHebrew}}", template["qfmt"])
            self.assertIn("{{AudioHebrew}}", template["afmt"])
            self.assertIn('<details class="more">', template["afmt"])
            self.assertNotIn("<details open", template["afmt"])
            for side in ("qfmt", "afmt"):
                self.assertNotIn("{{AudioLatin}}", template[side])
                self.assertNotIn("{{AudioEnglish}}", template[side])

    def test_real_package_has_two_cards_per_note_correct_decks_and_stable_guids(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            popular = build_plant(record(Hebrew_Audio="he.mp3"), False)
            rest = build_plant(record(Id="43"), True)
            omitted = build_plant(record(Id="44"), False)
            drop_missing_media(omitted, {"wf-44.jpg"})
            (root / "wf-42.jpg").write_bytes(b"synthetic photo")
            guids = []
            for index in range(2):
                target = root / "out" / f"{index}.apkg"
                write_package([popular, rest, omitted], root, target)
                with zipfile.ZipFile(target) as archive:
                    manifest = json.loads(archive.read("media"))
                    self.assertEqual(list(manifest.values()), ["wf-42.jpg"])
                    self.assertEqual(archive.read(next(iter(manifest))), b"synthetic photo")
                    db_path = root / f"{index}.db"
                    db_path.write_bytes(archive.read("collection.anki2"))
                with contextlib.closing(sqlite3.connect(db_path)) as db:
                    notes = db.execute("select guid, flds from notes order by flds").fetchall()
                    self.assertEqual({n[1].split('\x1f')[0] for n in notes}, {"42", "43"})
                    guids.append({n[1].split('\x1f')[0]: n[0] for n in notes})
                    cards = db.execute("select notes.flds, cards.did, cards.ord from cards join notes on cards.nid = notes.id").fetchall()
                    self.assertEqual({(f.split('\x1f')[0], did, ordinal) for f, did, ordinal in cards},
                                     {("42", DECK_POPULAR_ID, 0), ("42", DECK_POPULAR_ID, 1),
                                      ("43", DECK_REST_ID, 0), ("43", DECK_REST_ID, 1)})
                    self.assertEqual(len(cards), 4)
            self.assertEqual(guids[0], guids[1])

    def test_cli_remote_skips_downloads_local_drops_missing_and_forwards_workers(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "flowers.json"
            source.write_text(json.dumps([record(Id="2"), record(Id="1", Hebrew_Audio="he.mp3")]))
            for remote in (False, True):
                with self.subTest(remote=remote), patch.object(build_decks, "DATA_FILE", source), \
                     patch.object(build_decks, "CACHE_DIR", root / "cache"), \
                     patch.object(build_decks, "OUT_DIR", root / "out"), \
                     patch.object(build_decks, "download_all", return_value={"wf-1.jpg"}) as download, \
                     patch.object(build_decks, "write_package") as write, \
                     patch.object(sys, "argv", ["build_decks.py", "--workers", "2"] + (["--remote-images"] if remote else [])):
                    build_decks.main()
                    plants, cache, target = write.call_args.args
                    self.assertEqual([p.raw["Id"] for p in plants], ["1", "2"])
                    self.assertEqual(cache, root / "cache")
                    self.assertEqual(target.name, "israeli-wildflowers-remote.apkg" if remote else "israeli-wildflowers.apkg")
                    if remote:
                        download.assert_not_called()
                        self.assertTrue(plants[0].fields["Image"])
                    else:
                        self.assertEqual(download.call_args.args[2], 2)
                        self.assertEqual(plants[0].fields["Image"], "")
                        self.assertTrue(plants[1].fields["Image"])

    def test_cli_download_failure_prevents_package_write(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / "flowers.json"
            source.write_text(json.dumps([record()]))
            with patch.object(build_decks, "DATA_FILE", source), patch.object(sys, "argv", ["build_decks.py"]), \
                 patch.object(build_decks, "download_all", side_effect=SystemExit("offline")), \
                 patch.object(build_decks, "write_package") as write:
                with self.assertRaises(SystemExit):
                    build_decks.main()
                write.assert_not_called()

    def test_split_concatenated_export_preserves_unicode(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "export.json"
            flowers, lookups = [record()], {"families": ["כלנית"]}
            source.write_text(json.dumps(flowers) + "\n\n" + json.dumps(lookups))
            with patch.object(split_source, "DATA_DIR", root / "data"), patch.object(sys, "argv", ["split_source.py", str(source)]):
                split_source.main()
            for name, value in [("flowers", flowers), ("lookups", lookups)]:
                text = (root / "data" / f"{name}.json").read_text()
                self.assertEqual(json.loads(text), value)
                self.assertIn("כלנית", text)
                self.assertTrue(text.endswith("\n"))

    def test_split_requires_exactly_one_argument(self):
        for argv in (["split_source.py"], ["split_source.py", "a", "b"]):
            with self.subTest(argv=argv), patch.object(sys, "argv", argv):
                with self.assertRaisesRegex(SystemExit, "Usage"):
                    split_source.main()


if __name__ == "__main__":
    unittest.main()
