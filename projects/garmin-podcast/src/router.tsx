import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  // staleTime keeps the server-hydrated data from being refetched as soon as the page mounts.
  const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000 } } });
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
