import { useEffect, useState } from "react";
import { store } from "../storage";
import type { useTracker } from "../hooks/useTracker";

interface DataPanelProps {
  t: ReturnType<typeof useTracker>;
}

type RemoteKeys = "loading" | "error" | string[];

export function DataPanel({ t }: DataPanelProps) {
  const [remoteKeys, setRemoteKeys] = useState<RemoteKeys>("loading");
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!store.isRemote) return;
    store.keys("yayog:").then((keys) => setRemoteKeys(keys === null ? "error" : keys));
  }, [t.done]);

  const status = !store.isRemote
    ? "Using local (IndexedDB) storage — not inside a claude.ai artifact"
    : remoteKeys === "loading"
      ? "Checking storage…"
      : remoteKeys === "error"
        ? "storage.list failed"
        : `${remoteKeys.length} keys: ${remoteKeys.map((k) => k.replace("yayog:", "")).join(", ") || "none"}`;

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
