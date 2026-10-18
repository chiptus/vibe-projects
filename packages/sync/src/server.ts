import type { Entries, Entry, SyncRequest, SyncResponse } from "./protocol";

/** Where a deployment keeps its data — see pg.ts (Postgres on xhostd). */
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

/** Tokens are the only credential and anyone can mint one, so they must be unguessable. */
export const MIN_TOKEN_LENGTH = 32;
const MAX_TOKEN_LENGTH = 256;

export const LIMITS = {
  /** Request body, bytes (checked on the decoded text length). */
  body: 2_000_000,
  entriesPerRequest: 500,
  key: 200,
  value: 256_000,
  /** Per (user, app): number of keys and total value bytes. */
  keysPerSilo: 2000,
  bytesPerSilo: 5_000_000,
};

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Last-write-wins sync endpoint, one private silo per token.
 *
 * There are no accounts: whoever presents a long enough bearer token gets the
 * data stored under sha256(token) — the server never stores the token, and the
 * namespace comes from the token alone, never from anything the client names.
 * An incoming entry is stored only if it's newer than what's there; the
 * response is always the resulting full state for that (token, app).
 */
export function createSyncHandler({ storage }: { storage: SyncStorage }) {
  return async function handle(req: Request): Promise<Response> {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

    const match = /^Bearer (\S+)$/.exec(req.headers.get("authorization") ?? "");
    const token = match?.[1];
    if (!token || token.length < MIN_TOKEN_LENGTH || token.length > MAX_TOKEN_LENGTH) {
      return json({ error: `token must be ${MIN_TOKEN_LENGTH}+ characters` }, 401);
    }

    let body: SyncRequest;
    try {
      const text = await req.text();
      if (text.length > LIMITS.body) return json({ error: "request too large" }, 413);
      body = JSON.parse(text) as SyncRequest;
    } catch {
      return json({ error: "invalid JSON" }, 400);
    }
    if (typeof body.app !== "string" || !/^[a-z0-9-]{1,64}$/.test(body.app) || !body.entries || typeof body.entries !== "object") {
      return json({ error: "invalid request" }, 400);
    }
    const incoming = Object.entries(body.entries);
    if (incoming.length > LIMITS.entriesPerRequest) return json({ error: "too many entries" }, 413);

    const silo = `${await sha256Hex(token)}/${body.app}`;
    const current = await storage.load(silo);

    const updates: Entries = {};
    for (const [k, e] of incoming) {
      if (!isEntry(e) || k.length > LIMITS.key || e.v.length > LIMITS.value) continue;
      const existing = current[k];
      if (existing && existing.t >= e.t) continue;
      const entry: Entry = e.d ? { v: "null", t: e.t, d: true } : { v: e.v, t: e.t };
      current[k] = entry;
      updates[k] = entry;
    }

    const all = Object.values(current);
    if (all.length > LIMITS.keysPerSilo || all.reduce((n, e) => n + e.v.length, 0) > LIMITS.bytesPerSilo) {
      return json({ error: "storage quota exceeded" }, 413); // nothing has been saved yet
    }
    if (Object.keys(updates).length) await storage.save(silo, updates);

    const res: SyncResponse = { entries: current };
    return json(res);
  };
}
