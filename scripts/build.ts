#!/usr/bin/env -S node
// Builds every project and stitches their `dist/` output into one root
// `dist/` for a single static deploy: hub's build lands at the root, every
// other project lands at `dist/<project-name>/` (matching the paths in
// projects/hub/src/projects.ts).
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { buildFilterArgs, isDeployedSeparately, listProjects } from "./deploy-config.ts";

const root = new URL("..", import.meta.url).pathname;
const projectsDir = join(root, "projects");
const outDir = join(root, "dist");

const projects = listProjects(projectsDir);

console.log("Building all projects (pnpm -r build)...");
execFileSync("pnpm", ["-r", ...buildFilterArgs(projects.map((p) => p.manifest)), "build"], {
  cwd: root,
  stdio: "inherit",
});

rmSync(outDir, { recursive: true, force: true });

for (const { dir, manifest } of projects) {
  if (isDeployedSeparately(manifest)) {
    console.log(`Skipping ${dir}: deployed separately.`);
    continue;
  }

  const projectDist = join(projectsDir, dir, "dist");
  if (!existsSync(projectDist)) {
    console.warn(`Skipping ${dir}: no dist/ after build.`);
    continue;
  }

  const { name } = manifest;
  const dest = name === "hub" ? outDir : join(outDir, name);

  cpSync(projectDist, dest, { recursive: true });
  console.log(`${name} -> ${dest.replace(root, "")}`);
}

console.log("Done. Combined output in dist/");
