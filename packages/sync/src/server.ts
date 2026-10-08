import type { Entries, Entry, SyncRequest, SyncResponse } from "./protocol";

/** Where a deployment keeps its data: Redis (Vercel) or Postgres (xhostd) — see redis.ts / pg.ts. */
export interface SyncStorage {
  load(app: string): Promise<Entries>;
  /** Persist entries that already passed the newest-wins check. */
  save(app: string, updates: Entries): Promise<void>;
}

// The API may be hosted on a different origin than the app; auth is a bearer token, not cookies.
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, content-type",
  "access-control-allow-methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...CORS } });

const isEntry = (e: unknown): e is Entry =>
  !!e && typeof e === "object" && typeof (e as Entry).v === "string" && typeof (e as Entry).t === "number";

/** Constant-time-ish comparison so the token check doesn't leak length/prefix timing. */
function tokenMatches(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

/**
 * Last-write-wins sync endpoint. Each app's data is a
 * set of key -> `Entry` rows in the storage. An incoming entry is stored only if it's
 * newer than what's there; the response is always the resulting full state.
 */
export function createSyncHandler({ storage, token }: { storage: SyncStorage; token: string }) {
  return async function handle(req: Request): Promise<Response> {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
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

    const current = await storage.load(body.app);

    const updates: Entries = {};
    for (const [k, e] of Object.entries(body.entries)) {
      if (!isEntry(e)) continue;
      const existing = current[k];
      if (existing && existing.t >= e.t) continue;
      const entry: Entry = e.d ? { v: "null", t: e.t, d: true } : { v: e.v, t: e.t };
      current[k] = entry;
      updates[k] = entry;
    }
    if (Object.keys(updates).length) await storage.save(body.app, updates);

    const res: SyncResponse = { entries: current };
    return json(res);
  };
}
