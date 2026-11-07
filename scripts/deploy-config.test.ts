import assert from "node:assert/strict";
import { test } from "node:test";
import { buildFilterArgs, isDeployedSeparately } from "./deploy-config.ts";

test("a project is stitched unless it opts out", () => {
  assert.equal(isDeployedSeparately({ name: "a" }), false);
  assert.equal(isDeployedSeparately({ name: "a", deployedSeparately: false }), false);
  assert.equal(isDeployedSeparately({ name: "a", deployedSeparately: true }), true);
});

test("only separately deployed projects are excluded from the recursive build", () => {
  assert.deepEqual(
    buildFilterArgs([{ name: "hub" }, { name: "podcast", deployedSeparately: true }]),
    ["--filter=!podcast"],
  );
  assert.deepEqual(buildFilterArgs([{ name: "hub" }]), []);
});
