import type { AuthEnv } from "./server/auth";

// Secrets set with `wrangler secret put` are not in wrangler.jsonc, so `wrangler types` omits them.
declare global {
  namespace Cloudflare {
    interface Env extends Omit<AuthEnv, "DB"> {}
  }
}
