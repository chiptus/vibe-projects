import { useEffect, useMemo, useRef, useState } from "react";
import { blankEntries } from "../program/basic";
import { sequence } from "../program/basic/workout";
import { PROGRAMS } from "../program/registry";
import type { Day, Entry, Level, Position, WorkoutRecord } from "../program/types";
import { store, syncedStore } from "../storage";
import type { DataChange } from "@vibe/sync";
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
  // Counts edits, so a save can tell whether anything was typed while it was in flight.
  const edits = useRef(0);
  // A sync change that arrived before the first initialisation finished; replayed afterwards.
  const pendingChange = useRef<DataChange | null>(null);

  // Pick up an in-progress draft, or continue after the last completed workout.
  // `force` is for a Replace, which throws away what's on screen along with the old data.
  const initialise = async (all: { done: string[]; logs: Record<string, WorkoutRecord> }, force = false) => {
    // The shared log holds every Level; this form only continues its own.
    const prefix = `yayog:${level}:`;
    const data = {
      done: all.done.filter((k) => k.startsWith(prefix)),
      logs: Object.fromEntries(Object.entries(all.logs).filter(([k]) => k.startsWith(prefix))),
    };
    const saved = (await store.get(DRAFT_KEY)) as Draft | null;
    if (!force && touched.current) return; // an edit landed while the draft was being read: it wins
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
    initialise({ done: log.done, logs: log.logs }).then(() => {
      setReady(true);
      const missed = pendingChange.current;
      pendingChange.current = null;
      if (missed) refreshRef.current(missed);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [log.loaded]);

  // When data syncs in from another device, refresh the form from it, but only while the
  // user hasn't started editing: their in-progress edits always win. Replacing this device's
  // data with an account's is the user's explicit choice, so that always resets the form.
  const refresh = (change: DataChange) => {
    const force = change === "replaced";
    if (force) touched.current = false;
    else if (touched.current) return;
    void loadLog().then((data) => initialiseRef.current(data, force)); // re-checks for edits itself
  };
  const refreshRef = useRef(refresh);
  useEffect(() => {
    refreshRef.current = refresh;
  });

  useEffect(() => {
    if (!syncedStore) return;
    return syncedStore.subscribe((_status, change) => {
      if (!change) return;
      if (!readyRef.current) {
        // Still initialising: remember it (a Replace outranks an ordinary change) and apply it once ready.
        pendingChange.current = pendingChange.current === "replaced" ? "replaced" : change;
        return;
      }
      refreshRef.current(change);
    });
  }, []);

  const goTo = (p: Position, logMap: Record<string, WorkoutRecord> = log.logs) => {
    touched.current = true;
    setForm(formFor(p, logMap));
    setPos(p);
  };
  const updateEntry = (i: number, patch: Partial<Entry>) => {
    touched.current = true;
    edits.current++;
    setForm((f) => ({
      ...f,
      entries: f.entries.map((e, j) => (j === i ? ({ ...e, ...patch } as Entry) : e)),
    }));
  };
  const setNotes = (notes: string) => {
    touched.current = true;
    edits.current++;
    setForm((f) => ({ ...f, notes }));
  };

  // Resolves to null on success or an error string.
  const save = async (): Promise<string | null> => {
    if (!pos) return "not ready";
    draft.setSaving(true);
    const editsAtStart = edits.current;
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
      // The next workout is a clean form again, so remote drafts may refresh it. Anything typed
      // while the save was in flight keeps the guard on.
      if (edits.current === editsAtStart) touched.current = false;
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
