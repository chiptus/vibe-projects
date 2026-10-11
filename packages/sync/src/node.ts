// Standalone Node entry for hosts that run a long-lived process (xhostd). Serves
// POST /api/sync from Postgres and, if STATIC_DIR exists, the built static site.
//   env: DATABASE_URL, XHOSTD_HTTP_PORT (or PORT), STATIC_DIR (default ./dist)
import { existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import pg from "pg";
import { pgStorage } from "./pg";
import { createSyncHandler } from "./server";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const storage = pgStorage(pool);
await storage.ready();

const handle = createSyncHandler({ storage });
const port = Number(process.env.XHOSTD_HTTP_PORT ?? process.env.PORT ?? 3000);
const staticDir = resolve(process.env.STATIC_DIR ?? "dist");

// Anyone can mint a token, so cap how fast one address can hit the sync endpoint (in-memory, per process).
const RATE = { windowMs: 60_000, max: 120 };
const hits = new Map<string, { count: number; reset: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now > h.reset) {
    hits.set(ip, { count: 1, reset: now + RATE.windowMs });
    return false;
  }
  return ++h.count > RATE.max;
}
setInterval(() => {
  const now = Date.now();
  for (const [ip, h] of hits) if (now > h.reset) hits.delete(ip);
}, RATE.windowMs).unref();

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

/** Resolve a URL path to a file under staticDir, or null. `/x/` serves `/x/index.html`. */
function resolveStatic(urlPath: string): string | null {
  const rel = normalize(decodeURIComponent(urlPath)).replace(/^([/\\])+/, "");
  const full = join(staticDir, rel);
  if (!full.startsWith(staticDir)) return null; // path traversal
  if (!existsSync(full)) return null;
  if (statSync(full).isDirectory()) {
    const index = join(full, "index.html");
    return existsSync(index) ? index : null;
  }
  return full;
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", "http://localhost");

    if (url.pathname === "/api/sync") {
      // Behind xhostd's proxy the client address is the first X-Forwarded-For entry.
      const ip = String(req.headers["x-forwarded-for"] ?? req.socket.remoteAddress ?? "").split(",")[0]!.trim();
      if (req.method === "POST" && rateLimited(ip)) {
        res.writeHead(429, { "content-type": "application/json", "retry-after": "60" }).end('{"error":"rate limited"}');
        return;
      }
      const chunks: Buffer[] = [];
      for await (const c of req) chunks.push(c as Buffer);
      const request = new Request(url, {
        method: req.method,
        headers: req.headers as Record<string, string>,
        body: req.method === "GET" || req.method === "HEAD" ? undefined : Buffer.concat(chunks),
      });
      const response = await handle(request);
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(Buffer.from(await response.arrayBuffer()));
      return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405).end();
      return;
    }
    const file = resolveStatic(url.pathname);
    if (!file) {
      res.writeHead(404, { "content-type": "text/plain" }).end("Not found");
      return;
    }
    const body = await readFile(file);
    const hashed = /\/assets\/.+-[\w-]{8,}\./.test(file); // vite's content-hashed bundles
    res.writeHead(200, {
      "content-type": TYPES[extname(file)] ?? "application/octet-stream",
      "cache-control": hashed ? "public, max-age=31536000, immutable" : "no-cache",
    });
    res.end(req.method === "HEAD" ? undefined : body);
  } catch (e) {
    console.error(e);
    res.writeHead(500, { "content-type": "text/plain" }).end("Internal error");
  }
}).listen(port, "0.0.0.0", () => console.log(`vibe-projects listening on 0.0.0.0:${port}`));
