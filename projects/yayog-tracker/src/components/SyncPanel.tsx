import { generateSyncToken, getSyncToken, MIN_TOKEN_LENGTH, type ConnectMode, type SyncedStore, type SyncStatus } from "@vibe/sync";
import { useEffect, useState, useSyncExternalStore } from "react";
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

function TokenDialog({ store, switching, onClose }: TokenDialogProps) {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const valid = value.trim().length >= MIN_TOKEN_LENGTH;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  const connect = async (mode: ConnectMode) => {
    setBusy(true);
    setError(null);
    const err = await store.connect(value, mode);
    setBusy(false);
    if (err) setError(err);
    else onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center" onClick={() => !busy && onClose()}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sync-token-title"
        className="w-full max-w-md rounded-lg border border-ln bg-sf p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="sync-token-title" className="mb-1 text-base font-bold">
          {switching ? "Change sync token" : "Set up sync"}
        </h2>
        <p className="mb-3 text-xs text-mu">
          Your token is your sync account. Use the same token on every device, and keep it in a password manager: it can't be recovered.
        </p>

        <label className="mb-1 block text-xs text-mu" htmlFor="sync-token-input">
          Token ({MIN_TOKEN_LENGTH}+ characters)
        </label>
        <input
          id="sync-token-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="Paste a token, or generate one"
          className="mb-1.5 w-full rounded-lg border border-ln bg-bg p-2.5 font-mono text-sm text-tx"
        />
        <button type="button" className="mb-3 text-xs text-mu underline" onClick={() => setValue(generateSyncToken())}>
          Generate a new token
        </button>

        {switching && (
          <p className="mb-3 rounded-md border border-ln p-2 text-xs text-mu">
            You're switching accounts. Merge also copies this device's current data into the new account.
          </p>
        )}

        <div className="grid gap-2">
          <Button className="w-full" disabled={!valid || busy} onClick={() => connect("merge")}>
            {busy ? "Working…" : "Merge"}
          </Button>
          <p className="-mt-1 text-xs text-mu">Keep this device's data and the account's. If an item is in both, the account's version is kept.</p>
          <Button variant="outline" className="w-full" disabled={!valid || busy} onClick={() => connect("replace")}>
            Replace this device's data
          </Button>
          <p className="-mt-1 text-xs text-mu">Discard this device's data and use the account's. The account must already have data.</p>
          <Button variant="outline" className="w-full" disabled={busy} onClick={onClose}>
            Cancel
          </Button>
        </div>

        {error && (
          <p role="alert" className="mt-3 text-xs break-words text-red-400">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export function SyncPanel({ store }: { store: SyncedStore }) {
  const status = useSyncExternalStore(store.subscribe, store.getStatus);
  const [open, setOpen] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [copied, setCopied] = useState(false);
  const token = getSyncToken();

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
            <button type="button" className="underline" onClick={() => void store.disconnect()}>
              Turn off
            </button>
          </>
        )}
      </div>
      {open && <TokenDialog store={store} switching={!!token} onClose={() => setOpen(false)} />}
    </div>
  );
}
