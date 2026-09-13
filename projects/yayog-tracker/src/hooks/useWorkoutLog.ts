import { useEffect, useState } from "react";
import type { Level, WorkoutRecord } from "../program/types";
import { sleep, store } from "../storage";

export const INDEX_KEY = "yayog:index";
export const DRAFT_KEY = "yayog:draft";
export const keyOf = (level: Level, w: number, d: number) => `yayog:${level}:w${w}:d${d}`;

interface Index {
  done: string[];
}

interface SaveResult {
  error: string | null;
  /** The done list after this save (even on success but before any state update lands). */
  done: string[];
}

// Owns the persisted set of completed workouts: loading them on mount and
// every read/write against storage. Knows nothing about the current
// position or in-progress form.
export function useWorkoutLog(level: Level) {
  const [done, setDone] = useState<string[] | null>(null);
  const [logs, setLogs] = useState<Record<string, WorkoutRecord>>({});
  const [loaded, setLoaded] = useState(false);

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
      setLoaded(true);
    })();
  }, [level]);

  const saveRecord = async (rec: WorkoutRecord): Promise<SaveResult> => {
    const key = keyOf(level, rec.w, rec.d);
    const e1 = await store.set(key, rec);
    if (e1) return { error: e1, done: done || [] };
    const newDone = done && done.includes(key) ? done : [...(done || []), key];
    const e2 = await store.set(INDEX_KEY, { done: newDone });
    if (e2) return { error: e2, done: done || [] };
    await store.del(DRAFT_KEY);
    setDone(newDone);
    setLogs((l) => ({ ...l, [key]: rec }));
    return { error: null, done: newDone };
  };

  const resetAll = async () => {
    if (!done) return;
    await Promise.all(done.map((k) => store.del(k)));
    await store.del(INDEX_KEY);
    await store.del(DRAFT_KEY);
    setDone([]);
    setLogs({});
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
    setDone(newDone);
    setLogs((l) => {
      const next = { ...l };
      imported.forEach((k) => {
        next[k] = data[k] as WorkoutRecord;
      });
      return next;
    });
    return null;
  };

  return { done: done || [], logs, loaded, saveRecord, resetAll, exportAll, importAll };
}
