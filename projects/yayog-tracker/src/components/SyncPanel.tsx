import { useMutation } from "@tanstack/react-query";
import { getSyncToken, type SyncedStore, type SyncStatus } from "@vibe/sync";
import { useState, useSyncExternalStore } from "react";
import { TokenDialog } from "./TokenDialog";
import { TokenField } from "./TokenField";

const statusLabel = (s: SyncStatus, hasToken: boolean): string => {
  if (!hasToken || s.state === "off") return "Sync is off. Set up a token to keep your data in step across devices.";
  if (s.state === "syncing") return "Syncing…";
  if (s.state === "error") return `Sync error: ${s.error}`;
  return `Synced ${s.lastSyncAt ? new Date(s.lastSyncAt).toLocaleTimeString() : ""}`;
};

export function SyncPanel({ store }: { store: SyncedStore }) {
  const status = useSyncExternalStore(store.subscribe, store.getStatus);
  const [open, setOpen] = useState(false);
  const token = getSyncToken();
  const turnOff = useMutation({ mutationFn: () => store.disconnect() });

  return (
    <div className="mb-3">
      <p className="mb-1.5 text-xs break-words text-mu">{statusLabel(status, !!token)}</p>
      <TokenField token={token} onChange={() => setOpen(true)} onTurnOff={() => turnOff.mutate()} />
      {turnOff.error && (
        <p role="alert" className="mt-1.5 text-xs break-words text-red-400">
          {turnOff.error.message}
        </p>
      )}
      {open && <TokenDialog store={store} switching={!!token} onClose={() => setOpen(false)} />}
    </div>
  );
}
