import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Projects that deploy on their own (ADR 0003) set `"deployedSeparately": true`
// in their package.json; the root build neither builds nor stitches them.
export interface ProjectManifest {
  name: string;
  deployedSeparately?: boolean;
}

export interface Project {
  dir: string;
  manifest: ProjectManifest;
}

/** True when the project opts out of the stitched root build. */
export function isDeployedSeparately(manifest: ProjectManifest): boolean {
  return manifest.deployedSeparately === true;
}

/** `pnpm --filter` arguments that exclude every separately deployed project. */
export function buildFilterArgs(manifests: ProjectManifest[]): string[] {
  return manifests.filter(isDeployedSeparately).map((m) => `--filter=!${m.name}`);
}

/** Subfolders of `projectsDir` that have a package.json; other folders are ignored. */
export function listProjects(projectsDir: string): Project[] {
  return readdirSync(projectsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && existsSync(join(projectsDir, e.name, "package.json")))
    .map((e) => ({
      dir: e.name,
      manifest: JSON.parse(readFileSync(join(projectsDir, e.name, "package.json"), "utf8")) as ProjectManifest,
    }));
}
