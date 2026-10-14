import { existsSync, statSync } from "node:fs";
import { join, normalize, resolve } from "node:path";

export type StaticResult = { file: string } | { redirect: string } | null;

/**
 * Resolve a URL path to a file under `dir`. Projects are built with relative
 * asset URLs (`./assets/…`), so a directory must be served from a path ending
 * in `/` — `/yayog-tracker` redirects to `/yayog-tracker/` or its assets would
 * resolve against the site root.
 */
export function resolveStatic(dir: string, pathname: string): StaticResult {
  const root = resolve(dir);
  let decoded: string;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  const full = join(root, normalize(decoded).replace(/^([/\\])+/, ""));
  if (full !== root && !full.startsWith(root + "/")) return null; // path traversal
  if (!existsSync(full)) return null;
  if (!statSync(full).isDirectory()) return { file: full };

  if (!pathname.endsWith("/")) return { redirect: `${pathname}/` };
  const index = join(full, "index.html");
  return existsSync(index) ? { file: index } : null;
}
