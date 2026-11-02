import { generateSyncToken, getSyncToken, MIN_TOKEN_LENGTH, type ConnectMode, type SyncedStore, type SyncStatus } from "@vibe/sync";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { z } from "zod";
import { Button } from "./ui/Button";

const statusLabel = (s: SyncStatus, hasToken: boolean): string => {
  if (!hasToken || s.state === "off") return "Sync is off. Set up a token to keep your data in step across devices.";
  if (s.state === "syncing") return "Syncing…";
  if (s.state === "error") return `Sync error: ${s.error}`;
  return `Synced ${s.lastSyncAt ? new Date(s.lastSyncAt).toLocaleTimeString() : ""}`;
};

interface TokenDialogProps {
  store: SyncedStore;
  switching: boolean;
  onClose: () => void;
}

const tokenSchema = z.object({
  token: z.string().trim().min(MIN_TOKEN_LENGTH, `The token must be at least ${MIN_TOKEN_LENGTH} characters.`),
});

function TokenDialog({ store, switching, onClose }: TokenDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // A failed connect resolves to a message; turn it into a mutation error so it renders as one.
  const connect = useMutation({
    mutationFn: async ({ token, mode }: { token: string; mode: ConnectMode }) => {
      const err = await store.connect(token, mode);
      if (err) throw new Error(err);
    },
    onSuccess: onClose,
  });
  const busy = connect.isPending;

  const form = useForm({
    defaultValues: { token: "" },
    validators: { onChange: tokenSchema },
    onSubmitMeta: { mode: "merge" as ConnectMode },
    onSubmit: ({ value, meta }) => connect.mutateAsync({ token: value.token, mode: meta.mode }).catch(() => undefined),
  });

  // A native modal gives focus containment, Escape, and focus restore for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="sync-token-title"
      className="m-auto w-full max-w-md rounded-lg border border-ln bg-sf p-4 text-tx backdrop:bg-black/60"
      onCancel={(e) => {
        e.preventDefault(); // we close it ourselves, and never while connecting
        if (!busy) onClose();
      }}
      onClick={(e) => e.target === e.currentTarget && !busy && onClose()}
    >
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <h2 id="sync-token-title" className="mb-1 text-base font-bold">
          {switching ? "Change sync token" : "Set up sync"}
        </h2>
        <p className="mb-3 text-xs text-mu">
          Your token is your sync account. Use the same token on every device, and keep it in a password manager: it can't be recovered.
        </p>

        <form.Field name="token">
          {(field) => (
            <>
              <label className="mb-1 block text-xs text-mu" htmlFor="sync-token-input">
                Token ({MIN_TOKEN_LENGTH}+ characters)
              </label>
              <input
                id="sync-token-input"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder="Paste a token, or generate one"
                className="mb-1.5 w-full rounded-lg border border-ln bg-bg p-2.5 font-mono text-sm text-tx"
              />
              <button type="button" className="mb-3 text-xs text-mu underline" onClick={() => field.handleChange(generateSyncToken())}>
                Generate a new token
              </button>
            </>
          )}
        </form.Field>

        {switching && (
          <p className="mb-3 rounded-md border border-ln p-2 text-xs text-mu">
            You're switching accounts. Merge also copies this device's current data into the new account.
          </p>
        )}

        <form.Subscribe selector={(s) => s.canSubmit && tokenSchema.safeParse(s.values).success}>
          {(valid) => (
            <div className="grid gap-2">
              <Button type="button" className="w-full" disabled={!valid || busy} onClick={() => void form.handleSubmit({ mode: "merge" })}>
                {busy ? "Working…" : "Merge"}
              </Button>
              <p className="-mt-1 text-xs text-mu">Keep this device's data and the account's. If an item is in both, the account's version is kept.</p>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={!valid || busy}
                onClick={() => void form.handleSubmit({ mode: "replace" })}
              >
                Replace this device's data
              </Button>
              <p className="-mt-1 text-xs text-mu">Discard this device's data and use the account's. The account must already have data.</p>
              <Button type="button" variant="outline" className="w-full" disabled={busy} onClick={onClose}>
                Cancel
              </Button>
            </div>
          )}
        </form.Subscribe>

        {connect.error && (
          <p role="alert" className="mt-3 text-xs break-words text-red-400">
            {connect.error.message}
          </p>
        )}
      </form>
    </dialog>
  );
}

export function SyncPanel({ store }: { store: SyncedStore }) {
  const status = useSyncExternalStore(store.subscribe, store.getStatus);
  const [open, setOpen] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [copied, setCopied] = useState(false);
  const token = getSyncToken();
  const disconnect = useMutation({ mutationFn: () => store.disconnect() });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(token ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setReveal(true); // clipboard unavailable: show the token so it can be copied by hand
    }
  };

  return (
    <div className="mb-3">
      <p className="mb-1.5 text-xs break-words text-mu">{statusLabel(status, !!token)}</p>
      <input
        readOnly
        aria-label="Sync token"
        type={reveal ? "text" : "password"}
        value={token ?? ""}
        placeholder="No token set"
        className="mb-1.5 w-full rounded-lg border border-ln bg-bg p-2.5 font-mono text-sm text-mu"
      />
      <div className="flex flex-wrap items-center gap-3 text-xs text-mu">
        <button type="button" className="underline" onClick={() => setOpen(true)}>
          {token ? "Change token…" : "Set up sync…"}
        </button>
        {token && (
          <>
            <button type="button" className="underline" onClick={() => setReveal((v) => !v)}>
              {reveal ? "Hide" : "Show"}
            </button>
            <button type="button" className="underline" onClick={copy}>
              {copied ? "Copied" : "Copy"}
            </button>
            <button type="button" className="underline" onClick={() => disconnect.mutate()}>
              Turn off
            </button>
          </>
        )}
      </div>
      {open && <TokenDialog store={store} switching={!!token} onClose={() => setOpen(false)} />}
    </div>
  );
}
