import { useState } from "react";
import { Header } from "./components/Header";
import { SaveBar } from "./components/SaveBar";
import { Tabs } from "./components/Tabs";
import { LevelPicker } from "./components/LevelPicker";
import { useLevelTests } from "./hooks/useLevelTests";
import { useActiveLevel } from "./hooks/useActiveLevel";
import { useTracker } from "./hooks/useTracker";
import { blankEntries } from "./program/basic";
import { unlockedLevels } from "./program/levelTests";
import { LEVEL_LABEL } from "./program/registry";
import type { Level, Position } from "./program/types";
import { HistoryScreen } from "./screens/HistoryScreen";
import { TestScreen } from "./screens/TestScreen";
import { WorkoutScreen } from "./screens/WorkoutScreen";
import { keyOf } from "./hooks/useWorkoutLog";

type Tab = "today" | "history" | "test";

export default function App() {
  const active = useActiveLevel();
  const tests = useLevelTests();
  if (!active.loaded || !active.level || !tests.loaded) return <Loading />;
  // Keyed by level so switching Programs starts from fresh tracker state.
  return <Tracker key={active.level} level={active.level} tests={tests} onLevel={active.setLevel} />;
}

const Loading = () => (
  <main className="mx-auto max-w-lg px-3.5 pt-4 pb-24">
    <p className="py-6 text-center text-base text-mu">Loading…</p>
  </main>
);

function Tracker({ level, tests, onLevel }: { level: Level; tests: ReturnType<typeof useLevelTests>; onLevel: (l: Level) => void }) {
  const t = useTracker(level);
  const [tab, setTab] = useState<Tab>("today");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const flash = (m: string, ms = 1800) => {
    setToast(m);
    setTimeout(() => setToast(""), ms);
  };

  if (!t.ready || !t.pos) return <Loading />;

  const day = t.dayAt(t.pos);
  const logged = t.logs[keyOf(level, t.pos.w, t.pos.d)];
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

  const hasEntries =
    t.form.notes !== "" || JSON.stringify(t.form.entries) !== JSON.stringify(blankEntries(day));
  const onSwitch = (next: Level) => {
    if (next === level) return;
    if (hasEntries && !window.confirm(`Switch to ${LEVEL_LABEL[next]}? Unsaved entries for this workout will be lost.`)) return;
    onLevel(next);
  };

  return (
    <>
      <main className="mx-auto max-w-lg px-3.5 pt-4 pb-24">
        <LevelPicker value={level} levels={unlockedLevels(tests.results)} onChange={onSwitch} />
        <Header pos={t.pos} day={day} program={t.program} seq={t.seq} isDone={t.isDone} onPick={open} />
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            ["today", "Workout"],
            ["history", `History (${t.done.length}/${t.seq.length})`],
            ["test", "Test"],
          ]}
        />
        {tab === "today" ? (
          <WorkoutScreen day={day} form={t.form} loggedOn={logged?.date} onEntry={t.updateEntry} onNotes={t.setNotes} />
        ) : tab === "test" ? (
          <TestScreen active={level} results={tests.results} onRecord={tests.record} onSwitch={onSwitch} />
        ) : (
          <HistoryScreen t={t} onOpen={open} onReset={onReset} />
        )}
      </main>
      {tab === "today" && (
        <SaveBar label={toast || (logged ? "Update workout" : "Log workout")} disabled={saving} onClick={onSave} />
      )}
    </>
  );
}
