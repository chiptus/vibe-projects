import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, test } from "vitest";
import { buildFilterArgs, isDeployedSeparately, listProjects } from "./deploy-config.ts";

describe("isDeployedSeparately", () => {
  test("a project is stitched unless it opts out", () => {
    expect(isDeployedSeparately({ name: "a" })).toBe(false);
    expect(isDeployedSeparately({ name: "a", deployedSeparately: false })).toBe(false);
    expect(isDeployedSeparately({ name: "a", deployedSeparately: true })).toBe(true);
  });
});

describe("buildFilterArgs", () => {
  test("excludes only separately deployed projects", () => {
    expect(buildFilterArgs([{ name: "hub" }, { name: "podcast", deployedSeparately: true }])).toEqual([
      "--filter=!podcast",
    ]);
    expect(buildFilterArgs([{ name: "hub" }])).toEqual([]);
  });
});

describe("listProjects", () => {
  let dir = "";
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  test("ignores folders and files without a package.json", () => {
    dir = mkdtempSync(join(tmpdir(), "projects-"));
    mkdirSync(join(dir, "real"));
    writeFileSync(join(dir, "real", "package.json"), JSON.stringify({ name: "real" }));
    mkdirSync(join(dir, "stray"));
    writeFileSync(join(dir, "notes.txt"), "x");

    expect(listProjects(dir)).toEqual([{ dir: "real", manifest: { name: "real" } }]);
  });
});
