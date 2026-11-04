import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ACTIVE_QUERY } from "./hooks/useActiveLevel";
import { syncedStore } from "./storage";
import "./styles.css";

const queryClient = new QueryClient();

// Remote changes land in the local store behind react-query's back; refetch. The active
// Level is left alone on an ordinary change: refetching it could swap the program under a
// workout being edited. Replacing this device's data refreshes everything.
syncedStore?.subscribe((_status, change) => {
  if (!change) return;
  void queryClient.invalidateQueries({
    predicate: (q) => change === "replaced" || q.queryKey[0] !== ACTIVE_QUERY[0] || q.queryKey[1] !== ACTIVE_QUERY[1],
  });
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
