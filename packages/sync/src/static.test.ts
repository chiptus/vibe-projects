import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveStatic } from "./static";

const dir = mkdtempSync(join(tmpdir(), "static-"));
mkdirSync(join(dir, "app/assets"), { recursive: true });
writeFileSync(join(dir, "index.html"), "hub");
writeFileSync(join(dir, "app/index.html"), "app");
writeFileSync(join(dir, "app/assets/a.js"), "js");

describe("resolveStatic", () => {
  it("serves the root and a project with a trailing slash", () => {
    expect(resolveStatic(dir, "/")).toEqual({ file: join(dir, "index.html") });
    expect(resolveStatic(dir, "/app/")).toEqual({ file: join(dir, "app/index.html") });
  });

  it("redirects a project path without the trailing slash", () => {
    expect(resolveStatic(dir, "/app")).toEqual({ redirect: "/app/" });
  });

  it("serves assets and 404s unknown paths", () => {
    expect(resolveStatic(dir, "/app/assets/a.js")).toEqual({ file: join(dir, "app/assets/a.js") });
    expect(resolveStatic(dir, "/nope")).toBeNull();
    expect(resolveStatic(dir, "/app/assets/")).toBeNull(); // directory with no index.html
  });

  it("never serves outside the root, and refuses bad encodings", () => {
    const sub = join(dir, "app");
    for (const p of ["/../index.html", "/%2e%2e/index.html", "/..%2f..%2findex.html", "/../../etc/passwd"]) {
      const r = resolveStatic(sub, p);
      // either not found, or a file that is still inside the served folder (never the parent's index.html)
      if (r && "file" in r) expect(r.file.startsWith(sub + "/")).toBe(true);
    }
    expect(resolveStatic(sub, "/../index.html")).not.toEqual({ file: join(dir, "index.html") });
    expect(resolveStatic(dir, "/%E0%A4%A")).toBeNull();
  });
});
