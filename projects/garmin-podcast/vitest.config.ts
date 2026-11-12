import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig(async () => {
  const migrations = await readD1Migrations("./drizzle");
  return {
    plugins: [
      cloudflareTest({
        wrangler: { configPath: "./test/wrangler.jsonc" },
        miniflare: { bindings: { TEST_MIGRATIONS: migrations } },
      }),
    ],
    test: { include: ["src/**/*.test.ts"], setupFiles: ["./test/apply-migrations.ts"] },
  };
});
