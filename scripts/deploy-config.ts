// Projects that deploy on their own (ADR 0003) set `"deployedSeparately": true`
// in their package.json; the root build neither builds nor stitches them.
export interface ProjectManifest {
  name: string;
  deployedSeparately?: boolean;
}

export function isDeployedSeparately(manifest: ProjectManifest): boolean {
  return manifest.deployedSeparately === true;
}

export function buildFilterArgs(manifests: ProjectManifest[]): string[] {
  return manifests.filter(isDeployedSeparately).map((m) => `--filter=!${m.name}`);
}
