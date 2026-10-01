import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
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
    <div className="yg-data">
      <p className="yg-small">{status}</p>
      <div className="yg-row">
        <button className="yg-danger" onClick={doExport}>
          Export JSON
        </button>
        <button className="yg-danger" onClick={doImport} disabled={!text.trim()}>
          Import JSON
        </button>
      </div>
      <textarea
        className="yg-note"
        placeholder="Paste exported JSON here to import"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {msg && <p className="yg-small">{msg}</p>}
    </div>
  );
}
