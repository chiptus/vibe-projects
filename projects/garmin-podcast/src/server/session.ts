import { env } from "cloudflare:workers";
import type { ApiDeps } from "./api";
import { createAuth } from "./auth";

export const productionDeps: ApiDeps = {
  async getUser(request) {
    const session = await createAuth(env as never).api.getSession({ headers: request.headers });
    if (!session) return null;
    const { id, name, email } = session.user;
    return { id, name, email };
  },
};
