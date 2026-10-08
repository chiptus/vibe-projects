// Standalone Node entry for hosts that run a long-lived process (xhostd):
//   DATABASE_URL (Postgres), SYNC_TOKEN, and XHOSTD_HTTP_PORT (or PORT) from the environment.
import { createServer } from "node:http";
import pg from "pg";
import { pgStorage } from "./pg";
import { createSyncHandler } from "./server";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const storage = pgStorage(pool);
await storage.ready();

const handle = createSyncHandler({ storage, token: process.env.SYNC_TOKEN ?? "" });
const port = Number(process.env.XHOSTD_HTTP_PORT ?? process.env.PORT ?? 3000);

createServer(async (req, res) => {
  if (req.url === "/" || req.url === "/healthz") {
    res.writeHead(200, { "content-type": "text/plain" }).end("ok");
    return;
  }
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  const request = new Request(`http://localhost${req.url}`, {
    method: req.method,
    headers: req.headers as Record<string, string>,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : Buffer.concat(chunks),
  });
  const response = await handle(request);
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
}).listen(port, "0.0.0.0", () => console.log(`vibe-sync listening on :${port}`));
