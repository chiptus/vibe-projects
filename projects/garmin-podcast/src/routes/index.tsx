import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { authClient } from "../auth-client";
import { meQueryOptions } from "../server/me.fn";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(meQueryOptions),
  pendingComponent: () => <p>Loading…</p>,
  errorComponent: MeError,
  component: Home,
});

async function startGoogleSignIn() {
  const { error } = await authClient.signIn.social({ provider: "google", callbackURL: "/" });
  if (error) throw new Error(error.message ?? "sign-in failed");
}

function MeError() {
  const router = useRouter();
  return (
    <Page>
      <p role="alert">Couldn't load your account.</p>
      <button onClick={() => router.invalidate()}>Retry</button>
    </Page>
  );
}

function Page({ children }: { children: ReactNode }) {
  return (
    <main style={{ fontFamily: "system-ui", maxWidth: 480, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Garmin Podcast</h1>
      {children}
    </main>
  );
}

function Home() {
  const { data: me } = useSuspenseQuery(meQueryOptions);
  const signIn = useMutation({ mutationFn: startGoogleSignIn });

  return (
    <Page>
      {me ? (
        <p>
          Signed in as {me.name} ({me.email})
        </p>
      ) : (
        <>
          <button onClick={() => signIn.mutate()}>Sign in with Google</button>
          {signIn.isError && <p role="alert">Sign-in failed, try again.</p>}
        </>
      )}
    </Page>
  );
}
