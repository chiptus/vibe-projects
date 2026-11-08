import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface Me {
  name: string;
  email: string;
}

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [me, setMe] = useState<Me | null | undefined>(undefined);
  const [signInFailed, setSignInFailed] = useState(false);

  useEffect(() => {
    fetch("/api/me")
      .then(async (res) => setMe(res.ok ? ((await res.json()) as Me) : null))
      .catch(() => setMe(null));
  }, []);

  async function signIn() {
    setSignInFailed(false);
    try {
      const res = await fetch("/api/auth/sign-in/social", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ provider: "google", callbackURL: "/" }),
      });
      const { url } = (await res.json()) as { url?: string };
      if (!res.ok || !url) throw new Error("sign-in failed");
      window.location.href = url;
    } catch {
      setSignInFailed(true);
    }
  }

  return (
    <main style={{ fontFamily: "system-ui", maxWidth: 480, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Garmin Podcast</h1>
      {me === undefined ? (
        <p>Loading…</p>
      ) : me ? (
        <p>
          Signed in as {me.name} ({me.email})
        </p>
      ) : (
        <>
          <button onClick={signIn}>Sign in with Google</button>
          {signInFailed && <p role="alert">Sign-in failed, try again.</p>}
        </>
      )}
    </main>
  );
}
