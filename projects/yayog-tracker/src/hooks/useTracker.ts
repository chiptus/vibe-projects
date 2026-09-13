import { useEffect, useMemo, useRef, useState } from "react";
import { BASIC_PROGRAM, blankEntries, sequence } from "../program/basic";
import type { Day, Entry, Level, Position, WorkoutRecord } from "../program/types";
import { sleep, store } from "../storage";

const keyOf = (level: Level, w: number, d: number) => `yayog:${level}:w${w}:d${d}`;

const INDEX_KEY = "yayog:index";
const DRAFT_KEY = "yayog:draft";

interface Index {
  done: string[];
}

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

  const [done, setDone] = useState<string[] | null>(null);
  const [logs, setLogs] = useState<Record<string, WorkoutRecord>>({});
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

  useEffect(() => {
    (async () => {
      const idx = ((await store.get(INDEX_KEY)) as Index | null) || { done: [] };
      const logMap: Record<string, WorkoutRecord> = {};
      await Promise.all(
        idx.done.map(async (k) => {
          const v = await store.get(k);
          if (v) logMap[k] = v as WorkoutRecord;
        }),
      );
      setDone(idx.done);
      setLogs(logMap);

      const draft = (await store.get(DRAFT_KEY)) as Draft | null;
      if (draft && program.weeks[draft.w]?.[draft.d]) {
        setPos({ w: draft.w, d: draft.d });
        setForm({ entries: draft.entries, notes: draft.notes || "" });
      } else {
        const lastKey = idx.done.length ? idx.done[idx.done.length - 1] : undefined;
        const last = lastKey ? logMap[lastKey] : null;
        const start = last ? nextAfter(last, idx.done) || last : seq[0]!;
        setPos({ w: start.w, d: start.d });
        setForm(formFor(start, logMap));
      }
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  // Draft persistence. Primary trigger: the page being hidden (phone
  // locked, app backgrounded). Fallback: 5 s of inactivity. Never during
  // a save, and only if something changed.
  const lastDraft = useRef("");
  const savingRef = useRef(false);
  const draftRef = useRef<Draft | null>(null);
  draftRef.current = ready && pos ? { w: pos.w, d: pos.d, ...form } : null;

  const writeDraft = () => {
    if (!draftRef.current || savingRef.current) return;
    const payload = JSON.stringify(draftRef.current);
    if (payload === lastDraft.current) return;
    lastDraft.current = payload;
    store.set(DRAFT_KEY, { ...draftRef.current, at: Date.now() });
  };

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") writeDraft();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready || !pos) return;
    const t = setTimeout(() => writeDraft(), 5000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, pos, form]);

  const goTo = (p: Position, logMap: Record<string, WorkoutRecord> = logs) => {
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
    if (!pos || !done) return "not ready";
    savingRef.current = true;
    try {
      const key = keyOf(level, pos.w, pos.d);
      const rec: WorkoutRecord = {
        level,
        w: pos.w,
        d: pos.d,
        date: new Date().toISOString().slice(0, 10),
        ...form,
      };
      const e1 = await store.set(key, rec);
      if (e1) return e1;
      const newDone = done.includes(key) ? done : [...done, key];
      const e2 = await store.set(INDEX_KEY, { done: newDone });
      if (e2) return e2;
      await store.del(DRAFT_KEY);
      const newLogs = { ...logs, [key]: rec };
      setDone(newDone);
      setLogs(newLogs);
      const next = nextAfter(pos, newDone);
      if (next) goTo(next, newLogs);
      lastDraft.current = ""; // next form change may write a fresh draft
      return null;
    } finally {
      savingRef.current = false;
    }
  };

  const resetAll = async () => {
    if (!done) return;
    await Promise.all(done.map((k) => store.del(k)));
    await store.del(INDEX_KEY);
    await store.del(DRAFT_KEY);
    setDone([]);
    setLogs({});
    goTo(seq[0]!, {});
  };

  // Everything under yayog:* as one JSON blob (for moving between artifact versions).
  const exportAll = async (): Promise<string> => {
    const keys = (await store.keys("yayog:")) || [...(done || []), INDEX_KEY, DRAFT_KEY];
    const out: Record<string, unknown> = {};
    for (const k of keys) {
      const v = await store.get(k);
      if (v) out[k] = v;
    }
    return JSON.stringify(out);
  };

  const importAll = async (text: string): Promise<string | null> => {
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(text);
    } catch {
      return "Not valid JSON";
    }
    const keys = Object.keys(data).filter((k) => k.startsWith("yayog:") && k !== INDEX_KEY);
    for (const k of keys) {
      const e = await store.set(k, data[k]);
      if (e) return `Failed on ${k}: ${e}`;
      await sleep(250);
    }
    const imported = keys.filter((k) => k !== DRAFT_KEY && (data[k] as WorkoutRecord | undefined)?.w);
    const newDone = [...new Set([...(done || []), ...imported])];
    const e = await store.set(INDEX_KEY, { done: newDone });
    if (e) return e;
    const newLogs = { ...logs };
    imported.forEach((k) => {
      newLogs[k] = data[k] as WorkoutRecord;
    });
    setDone(newDone);
    setLogs(newLogs);
    return null;
  };

  return {
    program,
    seq,
    done: done || [],
    logs,
    pos,
    form,
    ready,
    dayAt,
    goTo,
    updateEntry,
    setNotes,
    save,
    resetAll,
    exportAll,
    importAll,
    isDone: (p: Position) => !!done && done.includes(keyOf(level, p.w, p.d)),
  };
}
