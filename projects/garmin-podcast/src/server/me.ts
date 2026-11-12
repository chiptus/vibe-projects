export interface ApiUser {
  id: string;
  name: string;
  email: string;
}

export interface MeDeps {
  /** Resolves the signed-in person for a request, or null. Stubbed in tests. */
  getUser(request: Request): Promise<ApiUser | null>;
}

/** GET /api/me: who the signed-in person is, or 401. */
export async function handleMe(request: Request, deps: MeDeps): Promise<Response> {
  const user = await deps.getUser(request);
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });
  return Response.json({ id: user.id, name: user.name, email: user.email });
}
