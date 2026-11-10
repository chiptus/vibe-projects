# Each Program keeps its own log

Workouts are stored per Level under `yayog:<level>:w{N}:d{N}` (ids `basic`, `first-class`, `master`, `chief`), with an active-program setting choosing which log the app shows. We rejected one shared log with a Level field: positions (week/day) repeat across Programs, and the existing Basic data must keep working untouched, with no migration.
