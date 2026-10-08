import { Redis } from "@upstash/redis";
import { redisStorage } from "../packages/sync/src/redis";
import { createSyncHandler } from "../packages/sync/src/server";

// Vercel's Upstash integration injects KV_REST_API_*; a hand-made Upstash DB uses UPSTASH_REDIS_REST_*.
const redis = new Redis({
  url: process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "",
  token: process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
  automaticDeserialization: false,
});

const handle = createSyncHandler({ storage: redisStorage(redis), token: process.env.SYNC_TOKEN ?? "" });

export default { fetch: handle };
