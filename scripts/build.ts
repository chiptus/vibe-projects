#!/usr/bin/env -S node
// Builds every project and stitches their `dist/` output into one root
// `dist/` for a single static deploy: hub's build lands at the root, every
// other project lands at `dist/<project-name>/` (matching the paths in
// projects/hub/src/projects.ts).
import { execSync } from "node:child_process";
import { cpSync, existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { buildFilterArgs, isDeployedSeparately, type ProjectManifest } from "./deploy-config.ts";

const root = new URL("..", import.meta.url).pathname;
const projectsDir = join(root, "projects");
const outDir = join(root, "dist");

const readManifest = (dir: string) =>
  JSON.parse(readFileSync(join(projectsDir, dir, "package.json"), "utf8")) as ProjectManifest;

const manifests = readdirSync(projectsDir, { withFileTypes: true })
  .filter((e) => e.isDirectory() && existsSync(join(projectsDir, e.name, "package.json")))
  .map((e) => readManifest(e.name));

console.log("Building all projects (pnpm -r build)...");
execSync(["pnpm", "-r", ...buildFilterArgs(manifests), "build"].join(" "), { cwd: root, stdio: "inherit" });

rmSync(outDir, { recursive: true, force: true });

for (const entry of readdirSync(projectsDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;

  const projectDir = join(projectsDir, entry.name);
  const projectDist = join(projectDir, "dist");
  if (isDeployedSeparately(readManifest(entry.name))) {
    console.log(`Skipping ${entry.name}: deployed separately.`);
    continue;
  }
  if (!existsSync(projectDist)) {
    console.warn(`Skipping ${entry.name}: no dist/ after build.`);
    continue;
  }

  const { name } = JSON.parse(readFileSync(join(projectDir, "package.json"), "utf8")) as { name: string };
  const dest = name === "hub" ? outDir : join(outDir, name);

  cpSync(projectDist, dest, { recursive: true });
  console.log(`${name} -> ${dest.replace(root, "")}`);
}

console.log("Done. Combined output in dist/");
