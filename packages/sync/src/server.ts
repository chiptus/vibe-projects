import type { Entries, Entry, SyncRequest, SyncResponse } from "./protocol";

/** The slice of a Redis client the handler needs (satisfied by @upstash/redis). */
export interface RedisLike {
  hgetall(key: string): Promise<Record<string, string> | null>;
  hset(key: string, values: Record<string, string>): Promise<unknown>;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

const isEntry = (e: unknown): e is Entry =>
  !!e && typeof e === "object" && typeof (e as Entry).v === "string" && typeof (e as Entry).t === "number";

/** Constant-time-ish comparison so the token check doesn't leak length/prefix timing. */
function tokenMatches(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

/**
 * Last-write-wins sync endpoint. Each app's data is one Redis hash
 * (`sync:<app>`), key -> JSON `Entry`. An incoming entry is stored only if it's
 * newer than what's there; the response is always the resulting full state.
 */
export function createSyncHandler({ redis, token }: { redis: RedisLike; token: string }) {
  return async function handle(req: Request): Promise<Response> {
    if (!token) return json({ error: "SYNC_TOKEN is not configured" }, 500);
    if (req.method !== "POST") return json({ error: "method not allowed" }, 405);
    const auth = req.headers.get("authorization") ?? "";
    if (!tokenMatches(auth, `Bearer ${token}`)) return json({ error: "unauthorized" }, 401);

    let body: SyncRequest;
    try {
      body = (await req.json()) as SyncRequest;
    } catch {
      return json({ error: "invalid JSON" }, 400);
    }
    if (typeof body.app !== "string" || !/^[a-z0-9-]{1,64}$/.test(body.app) || !body.entries || typeof body.entries !== "object") {
      return json({ error: "invalid request" }, 400);
    }

    const hash = `sync:${body.app}`;
    const stored = (await redis.hgetall(hash)) ?? {};
    const current: Entries = {};
    for (const [k, raw] of Object.entries(stored)) {
      try {
        const e: unknown = typeof raw === "string" ? JSON.parse(raw) : raw;
        if (isEntry(e)) current[k] = e;
      } catch {
        // skip corrupt entry
      }
    }

    const updates: Record<string, string> = {};
    for (const [k, e] of Object.entries(body.entries)) {
      if (!isEntry(e)) continue;
      const existing = current[k];
      if (existing && existing.t >= e.t) continue;
      const entry: Entry = e.d ? { v: "null", t: e.t, d: true } : { v: e.v, t: e.t };
      current[k] = entry;
      updates[k] = JSON.stringify(entry);
    }
    if (Object.keys(updates).length) await redis.hset(hash, updates);

    const res: SyncResponse = { entries: current };
    return json(res);
  };
}
