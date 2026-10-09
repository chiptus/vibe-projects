#!/bin/sh
# xhostd `app` template, BUILD time (runs as root, once per deploy).
# Builds every project, then assembles .xhostd/ (bundled server + dist/ + pg).
set -eu

command -v pnpm >/dev/null || corepack enable
STORE=/tmp/pnpm-store

pnpm install --frozen-lockfile --store-dir "$STORE"
pnpm build
node --experimental-strip-types scripts/package-xhostd.ts
(cd .xhostd && npm install --omit=dev --no-audit --no-fund)

# Keep the image small: only .xhostd/ is needed at runtime.
rm -rf "$STORE" node_modules projects/*/node_modules packages/*/node_modules dist
