import type { Entries, Entry, SyncRequest, SyncResponse } from "./protocol";
import { LIMITS, MAX_TOKEN_LENGTH, MIN_TOKEN_LENGTH } from "./protocol";

/** One (token, app) silo, held exclusively for the duration of a `withSilo` callback. */
export interface SiloTx {
  load(): Promise<Entries>;
  /** Persist entries that already passed the newest-wins and quota checks. */
  save(updates: Entries): Promise<void>;
}

/**
 * Where a deployment keeps its data — see pg.ts (Postgres on xhostd). `withSilo` must
 * serialise concurrent callers for the same silo, so the load/check/save sequence in
 * the handler is atomic and quotas cannot be raced past.
 */
export interface SyncStorage {
  withSilo<T>(silo: string, fn: (tx: SiloTx) => Promise<T>): Promise<T>;
}

// The API may be hosted on a different origin than the app; auth is a bearer token, not cookies.
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, content-type",
  "access-control-allow-methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...CORS } });

const isEntry = (e: unknown): e is Entry => {
  if (!e || typeof e !== "object") return false;
  const { v, t, d } = e as Entry;
  return typeof v === "string" && typeof t === "number" && Number.isFinite(t) && (d === undefined || typeof d === "boolean");
};

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const size = (entries: Entries) => Object.values(entries).reduce((n, e) => n + e.v.length, 0);

/**
 * Last-write-wins sync endpoint, one private silo per token.
 *
 * There are no accounts: whoever presents a long enough bearer token gets the
 * data stored under sha256(token) — the server never stores the token, and the
 * namespace comes from the token alone, never from anything the client names.
 * An incoming entry is stored only if it's newer than what's there; the
 * response is always the resulting full state for that (token, app). Invalid or
 * oversized input is rejected as a whole, before anything is saved.
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
    if (
      !body ||
      typeof body.app !== "string" ||
      !/^[a-z0-9-]{1,64}$/.test(body.app) ||
      !body.entries ||
      typeof body.entries !== "object" ||
      Array.isArray(body.entries)
    ) {
      return json({ error: "invalid request" }, 400);
    }

    const incoming = Object.entries(body.entries);
    if (incoming.length > LIMITS.entriesPerRequest) {
      return json({ error: `too many entries (max ${LIMITS.entriesPerRequest} per request)` }, 413);
    }
    for (const [k, e] of incoming) {
      if (!isEntry(e)) return json({ error: `invalid entry "${k.slice(0, 60)}"` }, 400);
      if (k.length === 0 || k.length > LIMITS.key) return json({ error: `invalid key "${k.slice(0, 60)}"` }, 400);
      if (e.v.length > LIMITS.value) {
        return json({ error: `value for "${k.slice(0, 60)}" is too large (max ${LIMITS.value} characters)` }, 413);
      }
    }

    const silo = `${await sha256Hex(token)}/${body.app}`;
    return storage.withSilo(silo, async (tx) => {
      const current = await tx.load();
      const before = { keys: Object.keys(current).length, chars: size(current) };

      const updates: Entries = {};
      for (const [k, e] of incoming) {
        const existing = current[k];
        if (existing && existing.t >= e.t) continue;
        const entry: Entry = e.d ? { v: "null", t: e.t, d: true } : { v: e.v, t: e.t };
        current[k] = entry;
        updates[k] = entry;
      }

      if (Object.keys(updates).length) {
        // Only growth is refused, so a silo that is over quota can still delete its way back under.
        const after = { keys: Object.keys(current).length, chars: size(current) };
        const grew = after.keys > before.keys || after.chars > before.chars;
        if (grew && (after.keys > LIMITS.keysPerSilo || after.chars > LIMITS.bytesPerSilo)) {
          return json({ error: "storage quota exceeded for this token" }, 413); // nothing saved
        }
        await tx.save(updates);
      }

      const res: SyncResponse = { entries: current };
      return json(res);
    });
  };
}
