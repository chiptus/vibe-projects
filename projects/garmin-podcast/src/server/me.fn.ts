import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { productionDeps } from "./session";

/** The signed-in person for the current request, or null when signed out. */
export const getMe = createServerFn({ method: "GET" }).handler(async () => {
  const user = await productionDeps.getUser(getRequest());
  return user && { name: user.name, email: user.email };
});

export const meQueryOptions = queryOptions({ queryKey: ["me"], queryFn: () => getMe() });
