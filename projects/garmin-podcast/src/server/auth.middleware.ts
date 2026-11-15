import { createMiddleware } from "@tanstack/react-start";
import { getUser } from "./session";

/** Resolves the signed-in person once per request and passes it on as `context.user` (null when signed out). */
export const authMiddleware = createMiddleware().server(async ({ request, next }) => {
  const user = await getUser(request);
  return next({ context: { user } });
});
