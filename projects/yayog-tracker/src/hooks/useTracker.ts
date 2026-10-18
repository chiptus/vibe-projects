import { useEffect, useMemo, useRef, useState } from "react";
import { blankEntries } from "../program/basic";
import { sequence } from "../program/basic/workout";
import { PROGRAMS } from "../program/registry";
import type { Day, Entry, Level, Position, WorkoutRecord } from "../program/types";
import { store, syncedStore } from "../storage";
import { useDraftPersistence } from "./useDraftPersistence";
import { DRAFT_KEY, keyOf, loadLog, useWorkoutLog } from "./useWorkoutLog";

interface Draft {
  /** Missing on drafts written before Levels existed; those are Basic. */
  level?: Level;
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
  const program = PROGRAMS[level];
  const seq = useMemo(() => sequence(program), [program]);
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

  const draft = useDraftPersistence({ level, ready, pos, entries: form.entries, notes: form.notes });

  // True once the user has changed anything since the form was loaded.
  const touched = useRef(false);

  // Pick up an in-progress draft, or continue after the last completed workout.
  const initialise = async (data: { done: string[]; logs: Record<string, WorkoutRecord> }) => {
    const saved = (await store.get(DRAFT_KEY)) as Draft | null;
    let at: Position;
    let next: Form;
    if (saved && (saved.level ?? "basic") === level && program.weeks[saved.w]?.[saved.d]) {
      at = { w: saved.w, d: saved.d };
      next = { entries: saved.entries, notes: saved.notes || "" };
    } else {
      const lastKey = data.done.length ? data.done[data.done.length - 1] : undefined;
      const last = lastKey ? data.logs[lastKey] : null;
      const start = last ? nextAfter(last, data.done) || last : seq[0]!;
      at = { w: start.w, d: start.d };
      next = formFor(start, data.logs);
    }
    setPos(at);
    setForm(next);
    draft.markBaseline({ ...at, ...next });
  };
  // The sync listener below outlives renders, so it reads the latest values through refs.
  const initialiseRef = useRef(initialise);
  const readyRef = useRef(false);
  useEffect(() => {
    initialiseRef.current = initialise;
    readyRef.current = ready;
  });

  // Once the log has loaded, do the first initialisation.
  useEffect(() => {
    if (!log.loaded || ready) return;
    initialise({ done: log.done, logs: log.logs }).then(() => setReady(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [log.loaded]);

  // When data syncs in from another device, refresh the form from it, but only while the
  // user hasn't started editing: their in-progress edits always win.
  useEffect(() => {
    if (!syncedStore) return;
    return syncedStore.subscribe((_status, remoteApplied) => {
      if (!remoteApplied || !readyRef.current || touched.current) return;
      void loadLog().then((data) => {
        if (!touched.current) return initialiseRef.current(data); // re-check: an edit may have landed meanwhile
      });
    });
  }, []);

  const goTo = (p: Position, logMap: Record<string, WorkoutRecord> = log.logs) => {
    touched.current = true;
    setForm(formFor(p, logMap));
    setPos(p);
  };
  const updateEntry = (i: number, patch: Partial<Entry>) => {
    touched.current = true;
    setForm((f) => ({
      ...f,
      entries: f.entries.map((e, j) => (j === i ? ({ ...e, ...patch } as Entry) : e)),
    }));
  };
  const setNotes = (notes: string) => {
    touched.current = true;
    setForm((f) => ({ ...f, notes }));
  };

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
      const onScreen = next ? formFor(next, { ...log.logs, [key]: rec }) : form;
      if (next) goTo(next, { ...log.logs, [key]: rec });
      draft.markSaved({ ...(next ?? pos), ...onScreen });
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
