import { serveStatic } from "@hono/node-server/serve-static";
import { statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { rateLimiter } from "hono-rate-limiter";
import { LIMITS } from "./protocol";
import { createSyncHandler, type SyncStorage } from "./server";

export interface AppOptions {
  storage: SyncStorage;
  /** Built static site to serve alongside the API (the stitched `dist/`). */
  staticDir: string;
  /** Requests per window per client address on the sync endpoint. */
  rate?: { windowMs: number; limit: number };
}

const isDirectory = (path: string) => {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
};

/** The whole server: `POST /api/sync` plus the static site. */
export function createApp({ storage, staticDir, rate = { windowMs: 60_000, limit: 120 } }: AppOptions) {
  const app = new Hono();
  const handle = createSyncHandler({ storage });
  const root = resolve(staticDir);

  // Anyone can mint a token, so cap how fast one address can hit the endpoint. Behind
  // xhostd's proxy the client address is the first X-Forwarded-For entry.
  const limiter = rateLimiter({
    windowMs: rate.windowMs,
    limit: rate.limit,
    keyGenerator: (c) => c.req.header("x-forwarded-for")?.split(",")[0]?.trim() || "local",
    handler: (c) => c.json({ error: "rate limited" }, 429, { "retry-after": String(Math.ceil(rate.windowMs / 1000)) }),
  });
  const tooLarge = bodyLimit({ maxSize: LIMITS.body, onError: (c) => c.json({ error: "request too large" }, 413) });

  app.all(
    "/api/sync",
    (c, next) => (c.req.method === "POST" ? limiter(c, next) : next()),
    (c, next) => (c.req.method === "POST" ? tooLarge(c, next) : next()),
    (c) => handle(c.req.raw),
  );

  // Projects are built with relative asset URLs (`./assets/…`), so a folder must be served
  // from a path ending in `/`: `/yayog-tracker` redirects to `/yayog-tracker/`.
  app.use("*", async (c, next) => {
    const { pathname, search } = new URL(c.req.url);
    if (!pathname.endsWith("/") && isDirectory(join(root, pathname))) return c.redirect(`${pathname}/${search}`, 308);
    return next();
  });

  // vite's content-hashed bundles never change; everything else is revalidated.
  app.use("*", async (c, next) => {
    await next();
    if (c.res.status !== 200) return;
    c.res.headers.set(
      "cache-control",
      /\/assets\/.+-[\w-]{8,}\./.test(c.req.path) ? "public, max-age=31536000, immutable" : "no-cache",
    );
  });

  app.use("*", serveStatic({ root: relative(process.cwd(), root) || "." }));
  app.notFound((c) => c.text("Not found", 404));

  return app;
}
