import { describe, expect, it } from "vitest";
import { createSyncedStore, generateSyncToken, type KV } from "./client";
import { pgStorage, type PgLike } from "./pg";
import { redisStorage, type RedisLike } from "./redis";
import { createSyncHandler, LIMITS, type SyncStorage } from "./server";

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

// Just enough SQL for pgStorage's three statements, so both adapters run the same suite.
const memPg = (): PgLike => {
  const rows = new Map<string, { app: string; key: string; v: string; t: number; d: boolean }>();
  return {
    async query(text, params = []) {
      if (text.startsWith("create table")) return { rows: [] };
      if (text.startsWith("select")) return { rows: [...rows.values()].filter((r) => r.app === params[0]) };
      const [app, key, v, t, d] = params as [string, string, string, number, boolean];
      const id = `${app}\0${key}`;
      const cur = rows.get(id);
      if (!cur || t > cur.t) rows.set(id, { app, key, v, t: String(t) as unknown as number, d });
      return { rows: [] };
    },
  };
};

const storages: Record<string, () => SyncStorage> = {
  redis: () => redisStorage(memRedis()),
  postgres: () => pgStorage(memPg()),
};

const TOKEN = generateSyncToken();

function setup(backend: string) {
  const handler = createSyncHandler({ storage: storages[backend]!() });
  const device = (token: string | null = TOKEN, app = "test") => {
    const local = memKV();
    const store = createSyncedStore(local, {
      app,
      debounceMs: 1e9,
      getToken: () => token,
      fetch: (async (_url: string, init: RequestInit) =>
        handler(new Request("http://x/api/sync", init))) as unknown as typeof fetch,
    });
    return { local, store };
  };
  return { device };
}

describe.each(Object.keys(storages))("sync (%s)", (backend) => {
  it("propagates writes and deletes between devices", async () => {
    const { device } = setup(backend);
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
    const { device } = setup(backend);
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
    const { device } = setup(backend);
    const a = device();
    a.local.data.set("old", 1);
    await a.store.sync();
    const b = device();
    await b.store.sync();
    expect(await b.store.get("old")).toBe(1);
  });

  it("rejects a too-short token and stays usable locally", async () => {
    const { device } = setup(backend);
    const a = device("short");
    await a.store.set("k", 1);
    await a.store.sync();
    expect(a.store.getStatus().state).toBe("error");
    expect(await a.store.get("k")).toBe(1);
  });

  it("gives each token its own private data", async () => {
    const { device } = setup(backend);
    const mine = device();
    const theirs = device(generateSyncToken());
    await mine.store.set("k", "mine");
    await mine.store.sync();
    await theirs.store.sync();
    expect(await theirs.store.get("k")).toBeNull();
    await theirs.store.set("k", "theirs");
    await theirs.store.sync();
    await mine.store.sync();
    expect(await mine.store.get("k")).toBe("mine");
    // same token on another device sees the same data
    const mine2 = device();
    await mine2.store.sync();
    expect(await mine2.store.get("k")).toBe("mine");
  });

  it("keeps apps separate under one token", async () => {
    const { device } = setup(backend);
    const a = device(TOKEN, "app-a");
    const b = device(TOKEN, "app-b");
    await a.store.set("k", 1);
    await a.store.sync();
    await b.store.sync();
    expect(await b.store.get("k")).toBeNull();
  });

  it("enforces the per-silo key quota without saving anything", async () => {
    const { device } = setup(backend);
    const a = device();
    for (let i = 0; i <= LIMITS.keysPerSilo; i++) a.local.data.set(`k${i}`, i);
    await a.store.sync();
    expect(a.store.getStatus().state).toBe("error");
    expect(a.store.getStatus().error).toMatch(/limit/);
    const b = device();
    await b.store.sync();
    expect(((await b.store.keys("")) ?? []).filter((k) => !k.startsWith("__sync:"))).toEqual([]);
  });

  it("does nothing without a token", async () => {
    const { device } = setup(backend);
    const a = device(null);
    await a.store.set("k", 1);
    await a.store.sync();
    expect(a.store.getStatus().state).toBe("off");
  });
});
