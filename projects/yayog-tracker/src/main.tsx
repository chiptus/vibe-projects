import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { syncedStore } from "./storage";
import "./styles.css";

const queryClient = new QueryClient();

// Remote changes land in the local store behind react-query's back; refetch everything.
syncedStore?.subscribe((_status, remoteApplied) => {
  if (remoteApplied) void queryClient.invalidateQueries();
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
