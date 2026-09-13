import { useState } from "react";
import { Header } from "./components/Header";
import { SaveBar } from "./components/SaveBar";
import { Tabs } from "./components/Tabs";
import { useTracker } from "./hooks/useTracker";
import type { Position } from "./program/types";
import { HistoryScreen } from "./screens/HistoryScreen";
import { WorkoutScreen } from "./screens/WorkoutScreen";

const keyOf = (level: "basic", w: number, d: number) => `yayog:${level}:w${w}:d${d}`;

type Tab = "today" | "history";

export default function App() {
  const t = useTracker("basic");
  const [tab, setTab] = useState<Tab>("today");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const flash = (m: string, ms = 1800) => {
    setToast(m);
    setTimeout(() => setToast(""), ms);
  };

  if (!t.ready || !t.pos) {
    return (
      <div className="yg">
        <div className="yg-wrap yg-empty">Loading…</div>
      </div>
    );
  }

  const day = t.dayAt(t.pos);
  const logged = t.logs[keyOf("basic", t.pos.w, t.pos.d)];
  const open = (p: Position) => {
    t.goTo(p);
    setTab("today");
  };
  const onSave = async () => {
    setSaving(true);
    const err = await t.save();
    setSaving(false);
    flash(err ? `Save failed: ${err}` : "Logged", err ? 5000 : 1800);
  };
  const onReset = () => {
    if (window.confirm("Delete all logged workouts?")) t.resetAll();
  };

  return (
    <div className="yg">
      <div className="yg-wrap">
        <Header pos={t.pos} day={day} program={t.program} seq={t.seq} isDone={t.isDone} onPick={open} />
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            ["today", "Workout"],
            ["history", `History (${t.done.length}/${t.seq.length})`],
          ]}
        />
        {tab === "today" ? (
          <WorkoutScreen day={day} form={t.form} loggedOn={logged?.date} onEntry={t.updateEntry} onNotes={t.setNotes} />
        ) : (
          <HistoryScreen t={t} onOpen={open} onReset={onReset} />
        )}
      </div>
      {tab === "today" && (
        <SaveBar label={toast || (logged ? "Update workout" : "Log workout")} disabled={saving} onClick={onSave} />
      )}
    </div>
  );
}
