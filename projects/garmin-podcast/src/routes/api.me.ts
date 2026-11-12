import { createFileRoute } from "@tanstack/react-router";
import { authMiddleware } from "../server/auth.middleware";
import { handleMe } from "../server/me";

export const Route = createFileRoute("/api/me")({
  server: {
    middleware: [authMiddleware],
    handlers: {
      GET: ({ context }) => handleMe(context.user),
    },
  },
});
