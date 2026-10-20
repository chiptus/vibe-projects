import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { levelSwitch } from "../../hooks/levelSwitch";
import type { useLevelTests } from "../../hooks/useLevelTests";
import { useTracker } from "../../hooks/useTracker";
import { keyOf } from "../../hooks/useWorkoutLog";
import type { Level, Position } from "../../program/types";
import { HistoryScreen } from "../../screens/HistoryScreen";
import { TestScreen } from "../../screens/TestScreen";
import { WorkoutScreen } from "../../screens/WorkoutScreen";
import { Header } from "./Header";
import { Loading } from "./Loading";
import { MainMenu, type View } from "./MainMenu";
import { SaveBar } from "./SaveBar";
import { ViewHeader } from "./ViewHeader";

interface TrackerProps {
  level: Level;
  tests: ReturnType<typeof useLevelTests>;
  onLevel: (level: Level) => void;
}

export function Tracker({ level, tests, onLevel }: TrackerProps) {
  const t = useTracker(level);
  const [tab, setTab] = useState<View>("today");
  const [toast, setToast] = useState("");
  const flash = (m: string, ms = 1800) => {
    setToast(m);
    setTimeout(() => setToast(""), ms);
  };

  const save = useMutation({
    mutationFn: async () => {
      const err = await t.save();
      if (err) throw new Error(err);
    },
    onSuccess: () => flash("Logged"),
    onError: (e: Error) => flash(`Save failed: ${e.message}`, 5000),
  });

  if (!t.ready || !t.pos) return <Loading />;

  const day = t.dayAt(t.pos);
  const logged = t.logs[keyOf(level, t.pos.w, t.pos.d)];
  const open = (p: Position) => {
    t.goTo(p);
    setTab("today");
  };
  const onReset = () => {
    if (window.confirm("Delete all logged workouts?")) t.resetAll();
  };
  const onSwitch = levelSwitch(level, day, t.form, onLevel);

  const menu = (
    <MainMenu
      level={level}
      view={tab}
      historyLabel={`History (${t.done.length}/${t.seq.length})`}
      onLevel={onSwitch}
      onView={setTab}
    />
  );

  return (
    <>
      <main className="mx-auto max-w-lg px-3.5 pt-4 pb-24">
        {tab === "today" && (
          <>
            <Header pos={t.pos} day={day} program={t.program} seq={t.seq} isDone={t.isDone} onPick={open} menu={menu} />
            <div className="mt-4" />
            <WorkoutScreen day={day} form={t.form} loggedOn={logged?.date} onEntry={t.updateEntry} onNotes={t.setNotes} />
          </>
        )}
        {tab === "history" && (
          <>
            <ViewHeader title="History" subtitle={`${t.program.name} · ${t.done.length} of ${t.seq.length} logged`} menu={menu} />
            <HistoryScreen t={t} onOpen={open} onReset={onReset} />
          </>
        )}
        {tab === "test" && (
          <>
            <ViewHeader title="Level test" subtitle={`Training at ${t.program.name}`} menu={menu} />
            <TestScreen active={level} results={tests.results} onRecord={tests.record} onSwitch={onSwitch} />
          </>
        )}
      </main>
      {tab === "today" && (
        <SaveBar label={toast || (logged ? "Update workout" : "Log workout")} disabled={save.isPending} onClick={() => save.mutate()} />
      )}
    </>
  );
}
