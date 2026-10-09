#!/bin/sh
# xhostd `app` template, BOOT time (non-root). exec so node is PID 1.
set -eu

cd .xhostd
exec node server.mjs
