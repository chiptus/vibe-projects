export interface ApiUser {
  id: string;
  name: string;
  email: string;
}

export interface ApiDeps {
  /** Resolves the signed-in person for a request, or null. Stubbed in tests. */
  getUser(request: Request): Promise<ApiUser | null>;
}

const json = (body: unknown, status = 200) => Response.json(body, { status });

/** The app's HTTP API (everything under /api except Better Auth's own /api/auth/*). */
export async function handleApi(request: Request, deps: ApiDeps): Promise<Response> {
  const { pathname } = new URL(request.url);

  if (pathname === "/api/me" && request.method === "GET") {
    const user = await deps.getUser(request);
    if (!user) return json({ error: "unauthorized" }, 401);
    return json({ id: user.id, name: user.name, email: user.email });
  }

  return json({ error: "not found" }, 404);
}
