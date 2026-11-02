# Garmin Podcast

A web app and Garmin watch app that put podcast episodes on a Garmin Forerunner 165 Music for offline listening on runs. Inspired by playrun.app.

## Language

**Podcast**:
A show, identified by its RSS feed URL.
_Avoid_: Channel, feed (say "feed" only for the RSS document itself)

**Episode**:
One item in a Podcast's feed, with its audio file.
_Avoid_: Track, item

**Playlist**:
An ordered list of Episodes the person chooses to put on the watch.
_Avoid_: Queue, list

**Sync**:
The watch pulling its Playlist's audio from the server over Wi-Fi.
_Avoid_: Download, update

**Storage budget**:
The most audio the Playlist may occupy on the watch. When a Playlist exceeds it, the oldest Episodes by publish date are dropped from the sync.
_Avoid_: Quota, limit

**Pairing code**:
The short code the watch shows so a signed-in person can link that watch to their account.
_Avoid_: Token, PIN

**Search provider**:
A source of Podcast search results (iTunes first). Providers are interchangeable behind one interface.
_Avoid_: Directory, source

**Listening position**:
How far into an Episode the person has listened, reported back by the watch at Sync.
_Avoid_: Progress, bookmark

## Deliberately not in the language yet

**Flow**: in playrun, podcasts added to a "flow" automatically supply new episodes. Out of scope for now; do not reuse the word for the Playlist.
