import { createFileRoute } from "@tanstack/react-router";
import { handleApi } from "../server/api";
import { productionDeps } from "../server/session";

const handle = ({ request }: { request: Request }) => handleApi(request, productionDeps);

export const Route = createFileRoute("/api/$")({
  server: { handlers: { GET: handle, POST: handle, PUT: handle, DELETE: handle } },
});
