#!/usr/bin/env node
// Builds every project and stitches their `dist/` output into one root
// `dist/` for a single static deploy: hub's build lands at the root, every
// other project lands at `dist/<project-name>/` (matching the paths in
// projects/hub/src/projects.ts).
import { execSync } from "node:child_process";
import { cpSync, existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const projectsDir = join(root, "projects");
const outDir = join(root, "dist");

console.log("Building all projects (pnpm -r build)...");
execSync("pnpm -r build", { cwd: root, stdio: "inherit" });

rmSync(outDir, { recursive: true, force: true });

for (const entry of readdirSync(projectsDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;

  const projectDir = join(projectsDir, entry.name);
  const projectDist = join(projectDir, "dist");
  if (!existsSync(projectDist)) {
    console.warn(`Skipping ${entry.name}: no dist/ after build.`);
    continue;
  }

  const { name } = JSON.parse(readFileSync(join(projectDir, "package.json"), "utf8"));
  const dest = name === "hub" ? outDir : join(outDir, name);

  cpSync(projectDist, dest, { recursive: true });
  console.log(`${name} -> ${dest.replace(root, "")}`);
}

console.log("Done. Combined output in dist/");
