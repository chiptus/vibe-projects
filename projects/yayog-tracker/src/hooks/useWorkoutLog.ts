import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Level, WorkoutRecord } from "../program/types";
import { sleep, store } from "../storage";

export const INDEX_KEY = "yayog:index";
export const DRAFT_KEY = "yayog:draft";
export const keyOf = (level: Level, w: number, d: number) => `yayog:${level}:w${w}:d${d}`;

interface Index {
  done: string[];
}

interface LogData {
  done: string[];
  logs: Record<string, WorkoutRecord>;
}

interface SaveResult {
  error: string | null;
  /** The done list after this save (even on success but before any state update lands). */
  done: string[];
}

export const REMOTE_KEYS_QUERY = ["yayog", "remote-keys"] as const;
const logQuery = (level: Level) => ["yayog", "log", level] as const;
const EMPTY: LogData = { done: [], logs: {} };

async function loadLog(): Promise<LogData> {
  const idx = ((await store.get(INDEX_KEY)) as Index | null) || { done: [] };
  const logs: Record<string, WorkoutRecord> = {};
  await Promise.all(
    idx.done.map(async (k) => {
      const v = await store.get(k);
      if (v) logs[k] = v as WorkoutRecord;
    }),
  );
  return { done: idx.done, logs };
}

// Owns the persisted set of completed workouts: loading them on mount and
// every read/write against storage. Knows nothing about the current
// position or in-progress form.
export function useWorkoutLog(level: Level) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: logQuery(level), queryFn: loadLog, staleTime: Infinity });
  const data = query.data ?? EMPTY;
  const { done, logs } = data;

  // Local storage is the source of truth, so after a write we update the
  // cache directly rather than refetching everything.
  const commit = (next: LogData) => {
    qc.setQueryData(logQuery(level), next);
    qc.invalidateQueries({ queryKey: REMOTE_KEYS_QUERY });
  };

  const save = useMutation({
    mutationFn: async (rec: WorkoutRecord): Promise<SaveResult> => {
      const key = keyOf(level, rec.w, rec.d);
      const e1 = await store.set(key, rec);
      if (e1) return { error: e1, done };
      const newDone = done.includes(key) ? done : [...done, key];
      const e2 = await store.set(INDEX_KEY, { done: newDone });
      if (e2) return { error: e2, done };
      await store.del(DRAFT_KEY);
      commit({ done: newDone, logs: { ...logs, [key]: rec } });
      return { error: null, done: newDone };
    },
  });

  const reset = useMutation({
    mutationFn: async () => {
      await Promise.all(done.map((k) => store.del(k)));
      await store.del(INDEX_KEY);
      await store.del(DRAFT_KEY);
      commit(EMPTY);
    },
  });

  const importData = useMutation({
    mutationFn: async (text: string): Promise<string | null> => {
      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(text);
      } catch {
        return "Not valid JSON";
      }
      const keys = Object.keys(parsed).filter((k) => k.startsWith("yayog:") && k !== INDEX_KEY);
      for (const k of keys) {
        const e = await store.set(k, parsed[k]);
        if (e) return `Failed on ${k}: ${e}`;
        await sleep(250);
      }
      const imported = keys.filter((k) => k !== DRAFT_KEY && (parsed[k] as WorkoutRecord | undefined)?.w);
      const newDone = [...new Set([...done, ...imported])];
      const e = await store.set(INDEX_KEY, { done: newDone });
      if (e) return e;
      const nextLogs = { ...logs };
      imported.forEach((k) => {
        nextLogs[k] = parsed[k] as WorkoutRecord;
      });
      commit({ done: newDone, logs: nextLogs });
      return null;
    },
  });

  // Everything under yayog:* as one JSON blob (for moving between artifact versions).
  const exportAll = async (): Promise<string> => {
    const keys = (await store.keys("yayog:")) || [...done, INDEX_KEY, DRAFT_KEY];
    const out: Record<string, unknown> = {};
    for (const k of keys) {
      const v = await store.get(k);
      if (v) out[k] = v;
    }
    return JSON.stringify(out);
  };

  return {
    done,
    logs,
    loaded: query.isSuccess,
    saveRecord: save.mutateAsync,
    resetAll: reset.mutateAsync,
    exportAll,
    importAll: importData.mutateAsync,
  };
}
