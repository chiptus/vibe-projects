import { useEffect, useState } from "react";
import { store } from "../storage";
import type { useTracker } from "../hooks/useTracker";

interface DataPanelProps {
  t: ReturnType<typeof useTracker>;
}

export function DataPanel({ t }: DataPanelProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      if (!store.isRemote) {
        setStatus("Using local (IndexedDB) storage — not inside a claude.ai artifact");
        return;
      }
      const keys = await store.keys("yayog:");
      setStatus(keys === null ? "storage.list failed" : `${keys.length} keys: ${keys.map((k) => k.replace("yayog:", "")).join(", ") || "none"}`);
    })();
  }, [t.done]);

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
      <p className="yg-small">{status || "Checking storage…"}</p>
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
