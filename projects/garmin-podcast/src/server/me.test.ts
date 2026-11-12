import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import * as schema from "../db/schema";
import { handleMe } from "./me";

const db = drizzle(env.DB, { schema });

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
    const [signedIn] = await db.select().from(schema.user).where(eq(schema.user.id, "u1"));
    if (!signedIn) throw new Error("seeded user not found");

    const res = handleMe(signedIn);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ id: "u1", name: "Ada Runner", email: "ada@example.com" });
  });

  it("rejects a request with no sign-in", () => {
    expect(handleMe(null).status).toBe(401);
  });
});
