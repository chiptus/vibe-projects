#!/usr/bin/env -S node
// Assembles `.xhostd/`, a self-contained folder for xhostd's `app` template:
// the bundled server (static files + /api/sync on Postgres), the stitched
// `dist/` from `pnpm build`, and a package.json for `pg`. The root install.sh runs
// this on xhostd; launch.sh starts `.xhostd/server.mjs`. See docs/deploy-xhostd.md.
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const out = join(root, ".xhostd");

if (!existsSync(join(root, "dist"))) throw new Error("Run `pnpm build` first (no dist/).");

rmSync(out, { recursive: true, force: true });
mkdirSync(out);

// `pg` stays external (CommonJS, installed by install.sh); everything else is bundled.
execSync(
  `pnpm exec esbuild packages/sync/src/node.ts --bundle --platform=node --format=esm --target=node22 --external:pg --outfile=.xhostd/server.mjs`,
  { cwd: root, stdio: "inherit" },
);
cpSync(join(root, "dist"), join(out, "dist"), { recursive: true });

writeFileSync(
  join(out, "package.json"),
  JSON.stringify({ name: "vibe-projects", version: "1.0.0", private: true, type: "module", dependencies: { pg: "8.13.1" } }, null, 2) + "\n",
);
console.log("Assembled .xhostd/");
