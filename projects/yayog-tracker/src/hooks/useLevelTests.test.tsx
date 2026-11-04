// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TestResult } from "../program/levelTests";

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

const { TESTS_KEY, useLevelTests } = await import("./useLevelTests");

const res = (date: string) => ({ level: "basic", date, scores: {} }) as unknown as TestResult;

const wrapper = ({ children }: { children: ReactNode }) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

beforeEach(() => {
  data.clear();
  failSet = null;
});

describe("useLevelTests remove", () => {
  it("removes the result at the index and persists the rest", async () => {
    data.set(TESTS_KEY, { results: [res("a"), res("b"), res("c")] });
    const { result } = renderHook(() => useLevelTests(), { wrapper });
    await waitFor(() => expect(result.current.loaded).toBe(true));
    await act(async () => {
      expect(await result.current.remove(1)).toBeNull();
    });
    await waitFor(() => expect(result.current.results.map((r) => r.date)).toEqual(["a", "c"]));
    expect(data.get(TESTS_KEY)).toEqual({ results: [res("a"), res("c")] });
  });

  it("keeps the results and reports the error when saving fails", async () => {
    data.set(TESTS_KEY, { results: [res("a")] });
    const { result } = renderHook(() => useLevelTests(), { wrapper });
    await waitFor(() => expect(result.current.loaded).toBe(true));
    failSet = "disk full";
    await act(async () => {
      expect(await result.current.remove(0)).toBe("disk full");
    });
    expect(result.current.results).toHaveLength(1);
  });
});
