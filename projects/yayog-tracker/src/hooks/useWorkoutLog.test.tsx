// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { WorkoutRecord } from "../program/types";

const data = new Map<string, unknown>();
let failSet: string | null = null;

vi.mock("../storage", () => ({
  sleep: async () => {},
  store: {
    isRemote: false,
    get: async (k: string) => data.get(k) ?? null,
    set: async (k: string, v: unknown) => {
      if (failSet) return failSet;
      data.set(k, v);
      return null;
    },
    del: async (k: string) => {
      data.delete(k);
    },
    keys: async (prefix: string) => [...data.keys()].filter((k) => k.startsWith(prefix)),
  },
}));

const { DRAFT_KEY, INDEX_KEY, keyOf, useWorkoutLog } = await import("./useWorkoutLog");

const rec = (w: number, d: number): WorkoutRecord => ({ level: "basic", w, d, date: "2026-01-01", entries: [], notes: "" }) as WorkoutRecord;

const wrapper = ({ children }: { children: ReactNode }) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

beforeEach(() => {
  data.clear();
  failSet = null;
});

describe("useWorkoutLog", () => {
  it("loads the done list and logs from storage", async () => {
    const k = keyOf("basic", 1, 1);
    data.set(INDEX_KEY, { done: [k] });
    data.set(k, rec(1, 1));
    const { result } = renderHook(() => useWorkoutLog("basic"), { wrapper });
    expect(result.current.loaded).toBe(false);
    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.done).toEqual([k]);
    expect(result.current.logs[k]).toEqual(rec(1, 1));
  });

  it("saves a record, updates the index, clears the draft and the cached log", async () => {
    data.set(DRAFT_KEY, { w: 1, d: 1 });
    const { result } = renderHook(() => useWorkoutLog("basic"), { wrapper });
    await waitFor(() => expect(result.current.loaded).toBe(true));
    const k = keyOf("basic", 1, 1);
    let res;
    await act(async () => {
      res = await result.current.saveRecord(rec(1, 1));
    });
    expect(res).toEqual({ error: null, done: [k] });
    expect(data.get(INDEX_KEY)).toEqual({ done: [k] });
    expect(data.has(DRAFT_KEY)).toBe(false);
    await waitFor(() => expect(result.current.done).toEqual([k]));
    expect(result.current.logs[k]).toEqual(rec(1, 1));
  });

  it("returns the storage error and leaves the log unchanged when a save fails", async () => {
    const { result } = renderHook(() => useWorkoutLog("basic"), { wrapper });
    await waitFor(() => expect(result.current.loaded).toBe(true));
    failSet = "boom";
    let res;
    await act(async () => {
      res = await result.current.saveRecord(rec(1, 1));
    });
    expect(res).toEqual({ error: "boom", done: [] });
    expect(result.current.done).toEqual([]);
  });

  it("resets everything", async () => {
    const k = keyOf("basic", 1, 1);
    data.set(INDEX_KEY, { done: [k] });
    data.set(k, rec(1, 1));
    const { result } = renderHook(() => useWorkoutLog("basic"), { wrapper });
    await waitFor(() => expect(result.current.done).toEqual([k]));
    await act(async () => {
      await result.current.resetAll();
    });
    expect(data.size).toBe(0);
    await waitFor(() => expect(result.current.done).toEqual([]));
  });

  it("imports records and merges them into the done list", async () => {
    const { result } = renderHook(() => useWorkoutLog("basic"), { wrapper });
    await waitFor(() => expect(result.current.loaded).toBe(true));
    const k = keyOf("basic", 2, 1);
    let err;
    await act(async () => {
      err = await result.current.importAll(JSON.stringify({ [k]: rec(2, 1) }));
    });
    expect(err).toBeNull();
    await waitFor(() => expect(result.current.done).toEqual([k]));
    expect(result.current.logs[k]).toEqual(rec(2, 1));
  });

  it("rejects invalid JSON on import", async () => {
    const { result } = renderHook(() => useWorkoutLog("basic"), { wrapper });
    await waitFor(() => expect(result.current.loaded).toBe(true));
    let err;
    await act(async () => {
      err = await result.current.importAll("nope");
    });
    expect(err).toBe("Not valid JSON");
  });
});
