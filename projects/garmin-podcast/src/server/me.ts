export interface ApiUser {
  id: string;
  name: string;
  email: string;
}

/** GET /api/me: who the signed-in person is, or 401. */
export function handleMe(user: ApiUser | null): Response {
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });
  return Response.json({ id: user.id, name: user.name, email: user.email });
}
