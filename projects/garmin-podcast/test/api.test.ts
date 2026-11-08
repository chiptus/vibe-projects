import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import * as schema from "../src/db/schema";
import { handleApi, type ApiDeps } from "../src/server/api";

const db = drizzle(env.DB, { schema });

// Stubbed Google sign-in: the "signed-in person" is named by a header and read from the test D1.
const stubSignIn: ApiDeps = {
  async getUser(request) {
    const id = request.headers.get("x-test-user");
    if (!id) return null;
    const [row] = await db.select().from(schema.user).where(eq(schema.user.id, id));
    return row ? { id: row.id, name: row.name, email: row.email } : null;
  },
};

const call = (path: string, headers: Record<string, string> = {}) =>
  handleApi(new Request(`https://test.local${path}`, { headers }), stubSignIn);

describe("GET /api/me", () => {
  it("tells a signed-in person who they are", async () => {
    const now = new Date();
    await db.insert(schema.user).values({
      id: "u1",
      name: "Ada Runner",
      email: "ada@example.com",
      createdAt: now,
      updatedAt: now,
    });

    const res = await call("/api/me", { "x-test-user": "u1" });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ id: "u1", name: "Ada Runner", email: "ada@example.com" });
  });

  it("rejects a request with no sign-in", async () => {
    const res = await call("/api/me");
    expect(res.status).toBe(401);
  });
});
