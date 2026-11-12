import { env } from "cloudflare:workers";
import { createAuth } from "./auth";
import type { ApiUser } from "./me";

/** The signed-in person for a request (from the Better Auth session cookie), or null. */
export async function getUser(request: Request): Promise<ApiUser | null> {
  const session = await createAuth(env).api.getSession({ headers: request.headers });
  if (!session) return null;
  const { id, name, email } = session.user;
  return { id, name, email };
}
