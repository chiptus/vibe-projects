import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

interface Me {
  name: string;
  email: string;
}

export const Route = createFileRoute("/")({ component: Home });

/** The signed-in person, or null when signed out (401). Other failures throw. */
async function fetchMe(): Promise<Me | null> {
  const res = await fetch("/api/me");
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`/api/me failed: ${res.status}`);
  return (await res.json()) as Me;
}

async function startGoogleSignIn() {
  const res = await fetch("/api/auth/sign-in/social", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ provider: "google", callbackURL: "/" }),
  });
  const { url } = (await res.json()) as { url?: string };
  if (!res.ok || !url) throw new Error("sign-in failed");
  window.location.href = url;
}

function Home() {
  const me = useQuery({ queryKey: ["me"], queryFn: fetchMe });
  const signIn = useMutation({ mutationFn: startGoogleSignIn });

  return (
    <main style={{ fontFamily: "system-ui", maxWidth: 480, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Garmin Podcast</h1>
      {me.isPending ? (
        <p>Loading…</p>
      ) : me.isError ? (
        <>
          <p role="alert">Couldn't load your account.</p>
          <button onClick={() => me.refetch()}>Retry</button>
        </>
      ) : me.data ? (
        <p>
          Signed in as {me.data.name} ({me.data.email})
        </p>
      ) : (
        <>
          <button onClick={() => signIn.mutate()}>Sign in with Google</button>
          {signIn.isError && <p role="alert">Sign-in failed, try again.</p>}
        </>
      )}
    </main>
  );
}
