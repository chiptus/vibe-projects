// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const data = new Map<string, unknown>();
const writes: string[] = [];
let syncListener: ((status: unknown, change: "remote" | "replaced" | null) => void) | null = null;
let draftReadDelay = 0;

vi.mock("../storage", () => ({
  sleep: async () => {},
  store: {
    isRemote: false,
    get: async (k: string) => {
      const value = data.get(k) ?? null; // read first, so a slow read returns what was there when it began
      if (k === "yayog:draft" && draftReadDelay) await new Promise((r) => setTimeout(r, draftReadDelay));
      return value;
    },
    set: async (k: string, v: unknown) => {
      writes.push(k);
      data.set(k, v);
      return null;
    },
    del: async (k: string) => void data.delete(k),
    keys: async (prefix: string) => [...data.keys()].filter((k) => k.startsWith(prefix)),
  },
  syncedStore: {
    subscribe: (l: (status: unknown, change: "remote" | "replaced" | null) => void) => {
      syncListener = l;
      return () => void (syncListener = null);
    },
  },
}));

const { useTracker } = await import("./useTracker");
const { DRAFT_KEY } = await import("./useWorkoutLog");

const wrapper = ({ children }: { children: ReactNode }) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

const draftWrites = () => writes.filter((k) => k === DRAFT_KEY).length;
const hide = () => {
  Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
  document.dispatchEvent(new Event("visibilitychange"));
};
const remoteDraft = (notes: string) => data.set(DRAFT_KEY, { w: 1, d: 1, entries: [], notes, at: Date.now() });
const remoteArrives = async (change: "remote" | "replaced" = "remote") => {
  await act(async () => {
    syncListener?.({}, change);
    await new Promise((r) => setTimeout(r, 20));
  });
};

afterEach(cleanup); // unmount between tests so one test's hook doesn't react to another's events

beforeEach(() => {
  data.clear();
  writes.length = 0;
  syncListener = null;
  draftReadDelay = 0;
});

async function readyTracker() {
  const hook = renderHook(() => useTracker("basic"), { wrapper });
  await waitFor(() => expect(hook.result.current.ready).toBe(true));
  return hook;
}

describe("useTracker with sync", () => {
  it("loads a draft that syncs in before the user has edited anything", async () => {
    const { result } = await readyTracker();
    expect(result.current.form.notes).toBe("");

    remoteDraft("from my other device");
    await remoteArrives();

    expect(result.current.pos).toEqual({ w: 1, d: 1 });
    expect(result.current.form.notes).toBe("from my other device");
  });

  it("keeps the user's in-progress edits when remote data arrives", async () => {
    const { result } = await readyTracker();
    act(() => result.current.setNotes("typing on this device"));

    remoteDraft("from my other device");
    await remoteArrives();

    expect(result.current.form.notes).toBe("typing on this device");
  });

  it("does not autosave a form the user hasn't touched", async () => {
    await readyTracker();
    hide();
    await new Promise((r) => setTimeout(r, 10));
    expect(draftWrites()).toBe(0);
  });

  it("does not write a stale copy over a draft it just received", async () => {
    await readyTracker();
    remoteDraft("from my other device");
    await remoteArrives();
    hide();
    await new Promise((r) => setTimeout(r, 10));
    expect(draftWrites()).toBe(0);
    expect(data.get(DRAFT_KEY)).toMatchObject({ notes: "from my other device" });
  });

  it("still saves a draft once the user edits", async () => {
    const { result } = await readyTracker();
    act(() => result.current.setNotes("my edit"));
    hide();
    await waitFor(() => expect(draftWrites()).toBe(1));
    expect(data.get(DRAFT_KEY)).toMatchObject({ notes: "my edit" });
  });

  it("resets an edited form when this device's data is replaced", async () => {
    const { result } = await readyTracker();
    act(() => result.current.setNotes("typing on this device"));

    remoteDraft("the account's draft");
    await remoteArrives("replaced");

    expect(result.current.form.notes).toBe("the account's draft");
    // ...and the form is clean again, so a later plain remote change can refresh it.
    remoteDraft("a later change");
    await remoteArrives();
    expect(result.current.form.notes).toBe("a later change");
  });

  it("keeps an edit made while the incoming draft was still being read", async () => {
    const { result } = await readyTracker();
    remoteDraft("from my other device");
    draftReadDelay = 60;
    const arriving = remoteArrives();
    await new Promise((r) => setTimeout(r, 15));
    act(() => result.current.setNotes("typed meanwhile"));
    await arriving;
    await act(async () => void (await new Promise((r) => setTimeout(r, 80)))); // the slow draft read finishes
    expect(result.current.form.notes).toBe("typed meanwhile");
  });

  it("continues from this Level's workouts only", async () => {
    const { result } = await readyTracker();
    const master = { level: "master", w: 2, d: 1, date: "2026-01-01", entries: [], notes: "" };
    data.set("yayog:master:w2:d1", master); // arrives by sync, from another Level
    data.set("yayog:index", { done: ["yayog:master:w2:d1"] });
    await remoteArrives();
    expect(result.current.pos).toEqual({ w: result.current.seq[0]!.w, d: result.current.seq[0]!.d }); // the Program's start
  });

  it("applies a change that arrived while the tracker was still initialising", async () => {
    draftReadDelay = 60;
    const hook = renderHook(() => useTracker("basic"), { wrapper });
    await act(async () => void (await new Promise((r) => setTimeout(r, 20)))); // mid-initialisation
    remoteDraft("arrived early");
    draftReadDelay = 0;
    await remoteArrives();
    await waitFor(() => expect(hook.result.current.ready).toBe(true));
    await waitFor(() => expect(hook.result.current.form.notes).toBe("arrived early"));
  });

  it("accepts remote drafts again after a save, unless something was typed meanwhile", async () => {
    const { result } = await readyTracker();
    act(() => result.current.setNotes("done"));
    await act(async () => void (await result.current.save()));

    remoteDraft("from my other device");
    await remoteArrives();
    expect(result.current.form.notes).toBe("from my other device");
  });
});
