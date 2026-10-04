import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "./ui/Button";
import { Textarea } from "./ui/Textarea";
import { store } from "../storage";
import { REMOTE_KEYS_QUERY } from "../hooks/useWorkoutLog";
import type { useTracker } from "../hooks/useTracker";

interface DataPanelProps {
  t: ReturnType<typeof useTracker>;
}

export function DataPanel({ t }: DataPanelProps) {
  const remoteKeys = useQuery({
    queryKey: REMOTE_KEYS_QUERY,
    queryFn: () => store.keys("yayog:"),
    enabled: store.isRemote,
    staleTime: Infinity,
  });
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");

  const status = !store.isRemote
    ? "Using local (IndexedDB) storage — not inside a claude.ai artifact"
    : remoteKeys.isPending
      ? "Checking storage…"
      : !remoteKeys.data
        ? "storage.list failed"
        : `${remoteKeys.data.length} keys: ${remoteKeys.data.map((k) => k.replace("yayog:", "")).join(", ") || "none"}`;

  const doExport = async () => {
    setText(await t.exportAll());
    setMsg("Copy the JSON below and paste it into the new version.");
  };
  const doImport = async () => {
    const e = await t.importAll(text);
    setMsg(e ? `Import failed: ${e}` : "Imported.");
  };

  return (
    <div className="mt-6 border-t border-ln pt-3">
      <p className="mb-2.5 text-xs break-words text-mu">{status}</p>
      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" className="flex-1" onClick={doExport}>
          Export JSON
        </Button>
        <Button variant="outline" className="flex-1" onClick={doImport} disabled={!text.trim()}>
          Import JSON
        </Button>
      </div>
      <Textarea
        placeholder="Paste exported JSON here to import"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {msg && <p className="mb-2.5 text-xs break-words text-mu">{msg}</p>}
    </div>
  );
}
