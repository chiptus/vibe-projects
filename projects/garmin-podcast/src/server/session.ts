import { env } from "cloudflare:workers";
import { createAuth } from "./auth";
import type { MeDeps } from "./me";

export const productionDeps: MeDeps = {
  async getUser(request) {
    const session = await createAuth(env).api.getSession({ headers: request.headers });
    if (!session) return null;
    const { id, name, email } = session.user;
    return { id, name, email };
  },
};
