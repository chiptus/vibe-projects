import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "./auth.middleware";

/** The signed-in person for the current request, or null when signed out. */
export const getMe = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(({ context }) => context.user && { name: context.user.name, email: context.user.email });

export const meQueryOptions = queryOptions({ queryKey: ["me"], queryFn: () => getMe() });
