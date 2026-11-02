import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createApp } from "./app";
import { LIMITS } from "./protocol";
import type { SyncStorage } from "./server";

// A project dir inside the cwd-relative root is what serveStatic needs, so build the fixture under cwd.
const dir = mkdtempSync(join(tmpdir(), "app-"));
mkdirSync(join(dir, "proj/assets"), { recursive: true });
writeFileSync(join(dir, "index.html"), "hub");
writeFileSync(join(dir, "proj/index.html"), "proj");
writeFileSync(join(dir, "proj/assets/index-abcdef12.js"), "js");

const storage: SyncStorage = {
  withSilo: async (_s, fn) => fn({ load: async () => ({}), save: async () => {} }),
};
const TOKEN = "t".repeat(40);
const post = (app: ReturnType<typeof createApp>, body: string, ip = "1.1.1.1") =>
  app.request("/api/sync", {
    method: "POST",
    headers: { authorization: `Bearer ${TOKEN}`, "content-type": "application/json", "x-forwarded-for": ip },
    body,
  });

describe("app", () => {
  const app = createApp({ storage, staticDir: dir, rate: { windowMs: 60_000, limit: 3 } });

  it("serves the hub and a project, redirecting a project path without a trailing slash", async () => {
    expect(await (await app.request("/")).text()).toBe("hub");
    expect(await (await app.request("/proj/")).text()).toBe("proj");
    const redirect = await app.request("/proj?x=1");
    expect(redirect.status).toBe(308);
    expect(redirect.headers.get("location")).toBe("/proj/?x=1");
  });

  it("caches hashed bundles forever and revalidates the rest; unknown paths 404", async () => {
    expect((await app.request("/proj/assets/index-abcdef12.js")).headers.get("cache-control")).toMatch(/immutable/);
    expect((await app.request("/proj/")).headers.get("cache-control")).toBe("no-cache");
    expect((await app.request("/nope")).status).toBe(404);
  });

  it("never serves files outside the root", async () => {
    const res = await app.request("/../../etc/passwd");
    expect(res.status).not.toBe(200);
  });

  it("answers the sync endpoint, and rejects an oversized body with 413", async () => {
    const ok = await post(app, JSON.stringify({ app: "x", entries: {} }), "2.2.2.2");
    expect(ok.status).toBe(200);
    const big = await post(app, JSON.stringify({ app: "x", pad: "a".repeat(LIMITS.body) }), "3.3.3.3");
    expect(big.status).toBe(413);
  });

  it("rate limits one address, not others", async () => {
    const body = JSON.stringify({ app: "x", entries: {} });
    const statuses = [];
    for (let i = 0; i < 5; i++) statuses.push((await post(app, body, "9.9.9.9")).status);
    expect(statuses).toEqual([200, 200, 200, 429, 429]);
    expect((await post(app, body, "8.8.8.8")).status).toBe(200);
  });
});
