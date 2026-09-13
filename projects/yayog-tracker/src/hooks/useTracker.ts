import { useEffect, useMemo, useState } from "react";
import { BASIC_PROGRAM, blankEntries, sequence } from "../program/basic";
import type { Day, Entry, Level, Position, WorkoutRecord } from "../program/types";
import { store } from "../storage";
import { useDraftPersistence } from "./useDraftPersistence";
import { DRAFT_KEY, keyOf, useWorkoutLog } from "./useWorkoutLog";

interface Draft {
  w: number;
  d: number;
  entries: Entry[];
  notes: string;
  at?: number;
}

interface Form {
  entries: Entry[];
  notes: string;
}

export function useTracker(level: Level) {
  const program = BASIC_PROGRAM;
  const seq = useMemo(() => sequence(), []);
  const dayAt = (p: Position): Day => program.weeks[p.w]![p.d]!;

  const log = useWorkoutLog(level);

  const [pos, setPos] = useState<Position | null>(null);
  const [form, setForm] = useState<Form>({ entries: [], notes: "" });
  const [ready, setReady] = useState(false);

  const formFor = (p: Position, logMap: Record<string, WorkoutRecord>): Form => {
    const rec = logMap[keyOf(level, p.w, p.d)];
    return rec ? { entries: rec.entries, notes: rec.notes || "" } : { entries: blankEntries(dayAt(p)), notes: "" };
  };
  const nextAfter = (from: Position, doneList: string[]): Position | null => {
    const i = seq.findIndex(({ w, d }) => w === from.w && d === from.d);
    return seq.slice(i + 1).find(({ w, d }) => !doneList.includes(keyOf(level, w, d))) || null;
  };

  // Once the log has loaded, pick up an in-progress draft or continue after
  // the last completed workout.
  useEffect(() => {
    if (!log.loaded || ready) return;
    (async () => {
      const draft = (await store.get(DRAFT_KEY)) as Draft | null;
      if (draft && program.weeks[draft.w]?.[draft.d]) {
        setPos({ w: draft.w, d: draft.d });
        setForm({ entries: draft.entries, notes: draft.notes || "" });
      } else {
        const lastKey = log.done.length ? log.done[log.done.length - 1] : undefined;
        const last = lastKey ? log.logs[lastKey] : null;
        const start = last ? nextAfter(last, log.done) || last : seq[0]!;
        setPos({ w: start.w, d: start.d });
        setForm(formFor(start, log.logs));
      }
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [log.loaded]);

  const draft = useDraftPersistence({ ready, pos, entries: form.entries, notes: form.notes });

  const goTo = (p: Position, logMap: Record<string, WorkoutRecord> = log.logs) => {
    setForm(formFor(p, logMap));
    setPos(p);
  };
  const updateEntry = (i: number, patch: Partial<Entry>) =>
    setForm((f) => ({
      ...f,
      entries: f.entries.map((e, j) => (j === i ? ({ ...e, ...patch } as Entry) : e)),
    }));
  const setNotes = (notes: string) => setForm((f) => ({ ...f, notes }));

  // Resolves to null on success or an error string.
  const save = async (): Promise<string | null> => {
    if (!pos) return "not ready";
    draft.setSaving(true);
    try {
      const key = keyOf(level, pos.w, pos.d);
      const rec: WorkoutRecord = {
        level,
        w: pos.w,
        d: pos.d,
        date: new Date().toISOString().slice(0, 10),
        ...form,
      };
      const { error, done: newDone } = await log.saveRecord(rec);
      if (error) return error;
      const next = nextAfter(pos, newDone);
      if (next) goTo(next, { ...log.logs, [key]: rec });
      draft.markSaved();
      return null;
    } finally {
      draft.setSaving(false);
    }
  };

  const resetAll = async () => {
    await log.resetAll();
    goTo(seq[0]!, {});
  };

  return {
    program,
    seq,
    done: log.done,
    logs: log.logs,
    pos,
    form,
    ready,
    dayAt,
    goTo,
    updateEntry,
    setNotes,
    save,
    resetAll,
    exportAll: log.exportAll,
    importAll: log.importAll,
    isDone: (p: Position) => log.done.includes(keyOf(level, p.w, p.d)),
  };
}
