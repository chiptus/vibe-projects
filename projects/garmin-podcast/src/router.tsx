import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultNotFoundComponent: () => <p>Page not found.</p>,
    defaultErrorComponent: () => <p role="alert">Something went wrong.</p>,
    context: { queryClient },
  });
  // Provides the QueryClient and carries the server's query cache to the browser.
  setupRouterSsrQueryIntegration({ router, queryClient });
  return router;
}
