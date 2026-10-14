import type { Entries, Entry } from "./protocol";
import type { SyncStorage } from "./server";

/** The slice of a Redis client needed here (satisfied by @upstash/redis with automaticDeserialization off). */
export interface RedisLike {
  hgetall(key: string): Promise<Record<string, string> | null>;
  hset(key: string, values: Record<string, string>): Promise<unknown>;
}

/** One Redis hash per app (`sync:<app>`): key -> JSON `Entry`. */
export function redisStorage(redis: RedisLike): SyncStorage {
  return {
    async load(app) {
      const stored = (await redis.hgetall(`sync:${app}`)) ?? {};
      const entries: Entries = {};
      for (const [k, raw] of Object.entries(stored)) {
        try {
          const e = (typeof raw === "string" ? JSON.parse(raw) : raw) as Entry;
          if (typeof e?.v === "string" && typeof e.t === "number") entries[k] = e;
        } catch {
          // skip corrupt entry
        }
      }
      return entries;
    },
    async save(app, updates) {
      const values: Record<string, string> = {};
      for (const [k, e] of Object.entries(updates)) values[k] = JSON.stringify(e);
      await redis.hset(`sync:${app}`, values);
    },
  };
}
