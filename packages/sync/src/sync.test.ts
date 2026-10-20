import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createSyncedStore } from "./client";
import { chunkEntries, PUSH_LIMITS } from "./engine";
import { pgStorage } from "./pg";
import { LIMITS, type Entries } from "./protocol";
import { createSyncHandler, type SyncStorage } from "./server";
import { generateSyncToken } from "./token";
import type { KV } from "./types";

type TestKV = KV & { data: Map<string, unknown> };

const memKV = (failSet: (k: string) => boolean = () => false, afterSet?: (k: string) => Promise<void>): TestKV => {
  const data = new Map<string, unknown>();
  return {
    data,
    get: async (k) => (data.has(k) ? structuredClone(data.get(k)) : null),
    set: async (k, v) => {
      if (failSet(k)) return "disk full";
      data.set(k, structuredClone(v));
      await afterSet?.(k);
      return null;
    },
    del: async (k) => void data.delete(k),
    keys: async (p) => [...data.keys()].filter((k) => k.startsWith(p)),
  };
};

/** In-memory storage with the same contract as the real one: callers for one silo run one at a time. */
const memStorage = (): SyncStorage => {
  const silos = new Map<string, Entries>();
  const queues = new Map<string, Promise<unknown>>();
  return {
    withSilo(silo, fn) {
      const run = (queues.get(silo) ?? Promise.resolve()).then(() =>
        fn({
          load: async () => {
            const snapshot = structuredClone(silos.get(silo) ?? {});
            await new Promise((r) => setTimeout(r, 2)); // the window an unserialised caller would race in, holding a stale snapshot
            return snapshot;
          },
          save: async (updates) => void silos.set(silo, { ...silos.get(silo), ...updates }),
        }),
      );
      queues.set(
        silo,
        run.then(
          () => {},
          () => {},
        ),
      );
      return run;
    },
  };
};

interface Backend {
  storage: SyncStorage;
  cleanup?: () => Promise<void>;
}

// The Postgres adapter runs the same suite when TEST_DATABASE_URL points at a scratch database.
const backends: Record<string, () => Promise<Backend>> = { memory: async () => ({ storage: memStorage() }) };
if (process.env.TEST_DATABASE_URL) {
  backends.postgres = async () => {
    const { default: pg } = await import("pg");
    const pool = new pg.Pool({ connectionString: process.env.TEST_DATABASE_URL });
    // Pause right after each load, so transactions that aren't serialised by the adapter overlap on stale rows.
    const slow = {
      query: (text: string, params?: unknown[]) => pool.query(text, params),
      connect: async () => {
        const client = await pool.connect();
        return {
          query: async (text: string, params?: unknown[]) => {
            const result = await client.query(text, params);
            if (text.startsWith("select key")) await new Promise((r) => setTimeout(r, 25));
            return result;
          },
          release: () => client.release(),
        };
      },
    };
    const storage = pgStorage(slow);
    await storage.ready();
    await pool.query("truncate sync_entries");
    return { storage, cleanup: () => pool.end() };
  };
}

const user = (kv: TestKV) => [...kv.data.keys()].filter((k) => !k.startsWith("__sync:")).sort();

describe.each(Object.keys(backends))("sync (%s)", (name) => {
  let backend: Backend;
  let handler: ReturnType<typeof createSyncHandler>;
  let TOKEN: string;

  beforeEach(async () => {
    backend = await backends[name]!();
    handler = createSyncHandler({ storage: backend.storage });
    TOKEN = generateSyncToken();
  });
  afterEach(async () => backend.cleanup?.());

  const rawPost = (token: string, body: unknown) =>
    handler(
      new Request("http://x/api/sync", {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify(body),
      }),
    );
  const defaultFetch = ((_url: string, init: RequestInit) => handler(new Request("http://x/api/sync", init))) as unknown as typeof fetch;

  function device(opts: { token?: string | null; app?: string; local?: TestKV; fetch?: typeof fetch } = {}) {
    const local = opts.local ?? memKV();
    let token = opts.token === undefined ? TOKEN : opts.token;
    const store = createSyncedStore(local, {
      app: opts.app ?? "test",
      debounceMs: 1e9,
      getToken: () => token,
      setToken: (t) => void (token = t),
      fetch: opts.fetch ?? defaultFetch,
    });
    return { local, store, token: () => token };
  }

  describe("propagation", () => {
    it("propagates writes and deletes between devices", async () => {
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
      const a = device();
      const b = device();
      await a.store.set("k", "old");
      await new Promise((r) => setTimeout(r, 5));
      await b.store.set("k", "new");
      await b.store.sync();
      await a.store.sync();
      expect(await a.store.get("k")).toBe("new");
    });

    it("uploads pre-existing local data on first sync", async () => {
      const a = device();
      a.local.data.set("old", 1);
      await a.store.sync();
      const b = device();
      await b.store.sync();
      expect(await b.store.get("old")).toBe(1);
    });

    it("two devices that adopted different data converge on the server's copy", async () => {
      const a = device();
      const b = device();
      a.local.data.set("k", "from-a");
      b.local.data.set("k", "from-b");
      await a.store.sync(); // server keeps a's value at t=1
      await b.store.sync(); // same version number, different value: the server's copy wins
      expect(await b.store.get("k")).toBe("from-a");
      expect(b.store.getStatus().state).toBe("ok");
    });

    it("rejects a too-short token and stays usable locally", async () => {
      const a = device({ token: "short" });
      await a.store.set("k", 1);
      await a.store.sync();
      expect(a.store.getStatus().state).toBe("error");
      expect(await a.store.get("k")).toBe(1);
    });

    it("does nothing without a token", async () => {
      const a = device({ token: null });
      await a.store.set("k", 1);
      await a.store.sync();
      expect(a.store.getStatus().state).toBe("off");
    });
  });

  describe("isolation", () => {
    it("gives each token its own private data", async () => {
      const mine = device();
      const theirs = device({ token: generateSyncToken() });
      await mine.store.set("k", "mine");
      await mine.store.sync();
      await theirs.store.sync();
      expect(await theirs.store.get("k")).toBeNull();
      await theirs.store.set("k", "theirs");
      await theirs.store.sync();
      await mine.store.sync();
      expect(await mine.store.get("k")).toBe("mine");
      const mine2 = device(); // same token, another device
      await mine2.store.sync();
      expect(await mine2.store.get("k")).toBe("mine");
    });

    it("keeps apps separate under one token", async () => {
      const a = device({ app: "app-a" });
      const b = device({ app: "app-b" });
      await a.store.set("k", 1);
      await a.store.sync();
      await b.store.sync();
      expect(await b.store.get("k")).toBeNull();
    });
  });

  describe("switching accounts", () => {
    it("merge uploads this device's data to the new account (no stale-cache false success)", async () => {
      const first = device();
      await first.store.set("k", "data");
      await first.store.sync(); // synced to account A

      const other = generateSyncToken();
      expect(await first.store.connect(other, "merge")).toBeNull();
      expect(first.token()).toBe(other);

      const check = device({ token: other });
      await check.store.sync();
      expect(await check.store.get("k")).toBe("data"); // account B received this device's data
    });

    it("merge keeps both sides, the account's version wins a clash", async () => {
      const acct = device();
      await acct.store.set("shared", "account");
      await acct.store.set("remote-only", 1);
      await acct.store.sync();

      const dev = device({ token: null });
      dev.local.data.set("shared", "device");
      dev.local.data.set("local-only", 2);
      expect(await dev.store.connect(TOKEN, "merge")).toBeNull();
      expect(user(dev.local)).toEqual(["local-only", "remote-only", "shared"]);
      expect(await dev.store.get("shared")).toBe("account");
    });

    it("replace swaps this device's data for the account's", async () => {
      const acct = device();
      await acct.store.set("a", 1);
      await acct.store.sync();

      const dev = device({ token: null });
      dev.local.data.set("junk", "x");
      expect(await dev.store.connect(TOKEN, "replace")).toBeNull();
      expect(user(dev.local)).toEqual(["a"]);
      expect(dev.token()).toBe(TOKEN);
    });

    it("replace refuses an empty account and changes nothing", async () => {
      const dev = device({ token: null });
      dev.local.data.set("keep", 1);
      const err = await dev.store.connect(generateSyncToken(), "replace");
      expect(err).toMatch(/no data/);
      expect(user(dev.local)).toEqual(["keep"]);
      expect(dev.token()).toBeNull();
    });

    it("refuses a short token without changing anything", async () => {
      const dev = device({ token: null });
      expect(await dev.store.connect("tiny", "merge")).toMatch(/at least 32/);
      expect(dev.token()).toBeNull();
    });

    it("discards a response that belongs to the previous account", async () => {
      const acct = device();
      await acct.store.set("x", "from-A");
      await acct.store.sync();

      let release!: () => void;
      const gate = new Promise<void>((r) => (release = r));
      let held = false;
      const slow = (async (url: string, init: RequestInit) => {
        if (!held) {
          held = true;
          await gate; // the first round-trip (for account A) is stuck
        }
        return defaultFetch(url, init);
      }) as unknown as typeof fetch;

      const dev = device({ fetch: slow });
      const stuck = dev.store.sync();
      await new Promise((r) => setTimeout(r, 10));
      const connecting = dev.store.connect(generateSyncToken(), "merge"); // switch away while A's request is in flight
      await new Promise((r) => setTimeout(r, 10));
      release();
      await Promise.all([stuck, connecting]);
      expect(await dev.store.get("x")).toBeNull(); // A's data never landed in the new account's cache
    });

    it("disconnect stops syncing but keeps the data", async () => {
      const a = device();
      await a.store.set("k", 1);
      await a.store.disconnect();
      expect(a.token()).toBeNull();
      expect(a.store.getStatus().state).toBe("off");
      expect(await a.store.get("k")).toBe(1);
    });
  });

  describe("races", () => {
    it("a write made while a pull is in flight is not overwritten", async () => {
      await rawPost(TOKEN, { app: "test", entries: { k: { v: '"remote"', t: 5 } } });
      let release!: () => void;
      const gate = new Promise<void>((r) => (release = r));
      let first = true;
      const slow = (async (url: string, init: RequestInit) => {
        const res = await defaultFetch(url, init);
        if (first) {
          first = false;
          await gate; // the response is held back until after the local write
        }
        return res;
      }) as unknown as typeof fetch;

      const dev = device({ fetch: slow });
      const syncing = dev.store.sync();
      await new Promise((r) => setTimeout(r, 10));
      await dev.store.set("k", "local-new");
      release();
      await syncing;
      expect(await dev.store.get("k")).toBe("local-new");
      await dev.store.sync(); // the pending write goes out next round
      const other = device();
      await other.store.sync();
      expect(await other.store.get("k")).toBe("local-new");
    });

    it("two tabs writing the same local store don't lose each other's edits", async () => {
      const seed = device();
      for (let i = 0; i < 30; i++) await seed.store.set(`k${i}`, "old");
      await seed.store.sync();

      const local = memKV(); // one IndexedDB, two page instances
      const tab1 = device({ local });
      const tab2 = device({ local });
      await tab1.store.sync(); // both tabs now hold the 30 synced keys, all clean
      await Promise.all(Array.from({ length: 30 }, (_, i) => (i % 2 ? tab1 : tab2).store.set(`k${i}`, "new")));
      await tab1.store.sync();

      const other = device();
      await other.store.sync();
      for (let i = 0; i < 30; i++) expect(await other.store.get(`k${i}`)).toBe("new");
    });

    it("a pull can't interleave between a write's value and its bookkeeping", async () => {
      await rawPost(TOKEN, { app: "test", entries: { k: { v: '"remote"', t: 5 } } });
      let release!: () => void;
      const gate = new Promise<void>((r) => (release = r));
      const local = memKV(
        () => false,
        async (k) => {
          if (k === "k") await gate; // pause set() after the value is stored, before the ledger is updated
        },
      );
      const dev = device({ local });
      const writing = dev.store.set("k", "local-new");
      await new Promise((r) => setTimeout(r, 5));
      const syncing = dev.store.sync(); // must wait for the write to finish, not slip in between
      await new Promise((r) => setTimeout(r, 20));
      release();
      await Promise.all([writing, syncing]);
      await dev.store.sync();
      expect(await dev.store.get("k")).toBe("local-new");
      const other = device();
      await other.store.sync();
      expect(await other.store.get("k")).toBe("local-new");
    });

    it("reports a failure to save sync bookkeeping instead of claiming success", async () => {
      const dev = device({ local: memKV((k) => k === "__sync:ledger") });
      const err = await dev.store.set("a", 1);
      expect(err).toMatch(/bookkeeping/);
      expect(dev.store.getStatus().state).toBe("error");
    });
  });

  describe("limits", () => {
    it("pushes more keys than one request allows, in batches", async () => {
      const a = device();
      for (let i = 0; i < 1200; i++) a.local.data.set(`k${i}`, i);
      await a.store.sync();
      expect(a.store.getStatus().state).toBe("ok");
      const b = device();
      await b.store.sync();
      expect(user(b.local)).toHaveLength(1200);
    });

    it("enforces the per-silo key quota and persists nothing past it", async () => {
      const a = device();
      for (let i = 0; i < LIMITS.keysPerSilo; i++) a.local.data.set(`k${i}`, i);
      await a.store.sync();
      expect(a.store.getStatus().state).toBe("ok"); // exactly at the limit

      await a.store.set("one-too-many", 1);
      await a.store.sync();
      expect(a.store.getStatus().state).toBe("error");
      expect(a.store.getStatus().error).toMatch(/quota/);

      const b = device();
      await b.store.sync();
      expect(user(b.local)).toHaveLength(LIMITS.keysPerSilo);
      expect(user(b.local)).not.toContain("one-too-many");
      expect(b.store.getStatus().state).toBe("ok"); // a full silo can still be read
    });

    it("cannot be raced past the quota by concurrent requests", async () => {
      const fill = (from: number, to: number) =>
        rawPost(TOKEN, { app: "test", entries: Object.fromEntries(Array.from({ length: to - from }, (_, i) => [`k${from + i}`, { v: "1", t: 2 }])) });
      for (let from = 0; from < LIMITS.keysPerSilo - 1; from += 400) await fill(from, Math.min(from + 400, LIMITS.keysPerSilo - 1));
      const add = (k: string) => rawPost(TOKEN, { app: "test", entries: { [k]: { v: "1", t: 2 } } });
      const results = await Promise.all([add("x1"), add("x2"), add("x3")]);
      expect(results.map((r) => r.status).sort()).toEqual([200, 413, 413]);
      const state = (await (await rawPost(TOKEN, { app: "test", entries: {} })).json()) as { entries: Entries };
      expect(Object.keys(state.entries)).toHaveLength(LIMITS.keysPerSilo);
    });
  });

  describe("validation", () => {
    it("rejects an invalid entry outright and saves none of the request", async () => {
      const res = await rawPost(TOKEN, { app: "test", entries: { good: { v: "1", t: 2 }, bad: { v: 5, t: 2 } } });
      expect(res.status).toBe(400);
      expect(((await res.json()) as { error: string }).error).toMatch(/bad/);
      const state = (await (await rawPost(TOKEN, { app: "test", entries: {} })).json()) as { entries: Entries };
      expect(state.entries).toEqual({});
    });

    it("rejects an oversized value with 413 and a clear message", async () => {
      const res = await rawPost(TOKEN, { app: "test", entries: { big: { v: "x".repeat(LIMITS.value + 1), t: 2 } } });
      expect(res.status).toBe(413);
      expect(((await res.json()) as { error: string }).error).toMatch(/too large/);
    });

    it("surfaces the server's reason as the sync error", async () => {
      const a = device();
      a.local.data.set("big", "x".repeat(LIMITS.value + 1));
      await a.store.sync();
      expect(a.store.getStatus().state).toBe("error");
      expect(a.store.getStatus().error).toMatch(/big.*too large/);
    });
  });
});

describe("chunkEntries", () => {
  const entry = (n: number) => ({ v: "x".repeat(n), t: 2 });

  it("bounds batches by entry count", () => {
    const entries = Object.fromEntries(Array.from({ length: 1000 }, (_, i) => [`k${i}`, entry(1)]));
    const batches = chunkEntries(entries);
    expect(batches.map((b) => Object.keys(b).length)).toEqual([400, 400, 200]);
  });

  it("bounds batches by size, and never drops an entry", () => {
    const entries = Object.fromEntries(Array.from({ length: 7 }, (_, i) => [`k${i}`, entry(300_000)]));
    const batches = chunkEntries(entries);
    for (const b of batches) {
      const chars = Object.values(b).reduce((n, e) => n + e.v.length, 0);
      expect(chars).toBeLessThanOrEqual(PUSH_LIMITS.chars);
    }
    expect(batches.flatMap((b) => Object.keys(b))).toHaveLength(7);
  });

  it("gives an empty set no batches", () => {
    expect(chunkEntries({})).toEqual([]);
  });
});
