// Standalone Node entry for hosts that run a long-lived process (xhostd). Serves
// POST /api/sync from Postgres and the built static site.
//   env: DATABASE_URL, XHOSTD_HTTP_PORT (or PORT), STATIC_DIR (default ./dist)
import { serve } from "@hono/node-server";
import pg from "pg";
import { createApp } from "./app";
import { pgStorage } from "./pg";

const storage = pgStorage(new pg.Pool({ connectionString: process.env.DATABASE_URL }));
await storage.ready();

const port = Number(process.env.XHOSTD_HTTP_PORT ?? process.env.PORT ?? 3000);
const app = createApp({ storage, staticDir: process.env.STATIC_DIR ?? "dist" });

serve({ fetch: app.fetch, port, hostname: "0.0.0.0" }, () => console.log(`vibe-projects listening on 0.0.0.0:${port}`));
