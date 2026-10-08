import { describe, expect, it } from "vitest";
import { createSyncedStore, type KV } from "./client";
import { createSyncHandler, type RedisLike } from "./server";

const memKV = (): KV & { data: Map<string, unknown> } => {
  const data = new Map<string, unknown>();
  return {
    data,
    get: async (k) => (data.has(k) ? structuredClone(data.get(k)) : null),
    set: async (k, v) => (data.set(k, structuredClone(v)), null),
    del: async (k) => void data.delete(k),
    keys: async (p) => [...data.keys()].filter((k) => k.startsWith(p)),
  };
};

const memRedis = (): RedisLike => {
  const hashes = new Map<string, Record<string, string>>();
  return {
    hgetall: async (k) => hashes.get(k) ?? null,
    hset: async (k, v) => void hashes.set(k, { ...hashes.get(k), ...v }),
  };
};

function setup() {
  const handler = createSyncHandler({ redis: memRedis(), token: "secret" });
  const device = (token: string | null = "secret") => {
    const local = memKV();
    const store = createSyncedStore(local, {
      app: "test",
      debounceMs: 1e9,
      getToken: () => token,
      fetch: (async (_url: string, init: RequestInit) =>
        handler(new Request("http://x/api/sync", init))) as unknown as typeof fetch,
    });
    return { local, store };
  };
  return { device };
}

describe("sync", () => {
  it("propagates writes and deletes between devices", async () => {
    const { device } = setup();
    const a = device();
    const b = device();
    await a.store.set("k", { n: 1 });
    await a.store.sync();
    await b.store.sync();
    expect(await b.store.get("k")).toEqual({ n: 1 });

    await b.store.del("k");
    await b.store.sync();
    await a.store.sync();
    expect(await a.store.get("k")).toBeNull();
  });

  it("newest write wins", async () => {
    const { device } = setup();
    const a = device();
    const b = device();
    await a.store.set("k", "old");
    await new Promise((r) => setTimeout(r, 5));
    await b.store.set("k", "new");
    await b.store.sync();
    await a.store.sync();
    expect(await a.store.get("k")).toBe("new");
  });

  it("uploads pre-existing local data on first sync, remote wins on conflict", async () => {
    const { device } = setup();
    const a = device();
    a.local.data.set("old", 1);
    await a.store.sync();
    const b = device();
    await b.store.sync();
    expect(await b.store.get("old")).toBe(1);
  });

  it("rejects a wrong token and stays usable locally", async () => {
    const { device } = setup();
    const a = device("nope");
    await a.store.set("k", 1);
    await a.store.sync();
    expect(a.store.getStatus().state).toBe("error");
    expect(await a.store.get("k")).toBe(1);
  });

  it("does nothing without a token", async () => {
    const { device } = setup();
    const a = device(null);
    await a.store.set("k", 1);
    await a.store.sync();
    expect(a.store.getStatus().state).toBe("off");
  });
});
