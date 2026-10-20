// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ConnectMode, SyncedStore, SyncStatus } from "@vibe/sync";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SyncPanel } from "./SyncPanel";

const TOKEN = "a".repeat(64);

function fakeStore(connect: SyncedStore["connect"]) {
  let status: SyncStatus = { state: "off", lastSyncAt: null, error: null };
  const listeners = new Set<() => void>();
  const store = {
    getStatus: () => status,
    subscribe: (l: () => void) => (listeners.add(l), () => void listeners.delete(l)),
    connect,
    disconnect: vi.fn(async () => {
      localStorage.removeItem("vibe-sync-token");
      status = { ...status, state: "off" };
      listeners.forEach((l) => l());
    }),
  } as unknown as SyncedStore;
  return { store, setStatus: (s: SyncStatus) => ((status = s), listeners.forEach((l) => l())) };
}

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe("SyncPanel", () => {
  it("shows a read-only token field and only opens the editor on request", () => {
    localStorage.setItem("vibe-sync-token", TOKEN);
    const { store } = fakeStore(vi.fn(async () => null));
    render(<SyncPanel store={store} />);

    const field = screen.getByLabelText("Sync token") as HTMLInputElement;
    expect(field.readOnly).toBe(true);
    expect(field.type).toBe("password");
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(screen.getByText("Show"));
    expect(field.type).toBe("text");
    fireEvent.click(screen.getByText("Change token…"));
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("won't connect with a short token, and sends the chosen mode with a valid one", async () => {
    const connect = vi.fn(async (_t: string, _m: ConnectMode) => null);
    const { store } = fakeStore(connect);
    render(<SyncPanel store={store} />);
    fireEvent.click(screen.getByText("Set up sync…"));

    const input = screen.getByLabelText(/^Token/);
    fireEvent.change(input, { target: { value: "too short" } });
    expect((screen.getByText("Merge") as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByText("Replace this device's data") as HTMLButtonElement).disabled).toBe(true);

    fireEvent.change(input, { target: { value: TOKEN } });
    fireEvent.click(screen.getByText("Replace this device's data"));
    await waitFor(() => expect(connect).toHaveBeenCalledWith(TOKEN, "replace"));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull()); // closes on success

    fireEvent.click(screen.getByText("Set up sync…"));
    fireEvent.change(screen.getByLabelText(/^Token/), { target: { value: TOKEN } });
    fireEvent.click(screen.getByText("Merge"));
    await waitFor(() => expect(connect).toHaveBeenLastCalledWith(TOKEN, "merge"));
  });

  it("keeps the dialog open and shows the reason when connecting fails", async () => {
    const { store } = fakeStore(vi.fn(async () => "This token has no data yet."));
    render(<SyncPanel store={store} />);
    fireEvent.click(screen.getByText("Set up sync…"));
    fireEvent.change(screen.getByLabelText(/^Token/), { target: { value: TOKEN } });
    fireEvent.click(screen.getByText("Replace this device's data"));

    expect((await screen.findByRole("alert")).textContent).toMatch(/no data yet/);
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("generates a token that is long enough to use, and warns when switching accounts", () => {
    localStorage.setItem("vibe-sync-token", TOKEN);
    const { store } = fakeStore(vi.fn(async () => null));
    render(<SyncPanel store={store} />);
    fireEvent.click(screen.getByText("Change token…"));
    expect(screen.getByText(/switching accounts/i)).toBeTruthy();

    fireEvent.click(screen.getByText("Generate a new token"));
    expect((screen.getByLabelText(/^Token/) as HTMLInputElement).value).toHaveLength(64);
    expect((screen.getByText("Merge") as HTMLButtonElement).disabled).toBe(false);
  });

  it("closes with Escape, and turns sync off without touching data", async () => {
    localStorage.setItem("vibe-sync-token", TOKEN);
    const { store, setStatus } = fakeStore(vi.fn(async () => null));
    render(<SyncPanel store={store} />);
    fireEvent.click(screen.getByText("Change token…"));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();

    act(() => setStatus({ state: "ok", lastSyncAt: Date.now(), error: null }));
    expect(screen.getByText(/^Synced/)).toBeTruthy();
    fireEvent.click(screen.getByText("Turn off"));
    expect(store.disconnect).toHaveBeenCalled();
    await waitFor(() => expect(screen.getByText(/Sync is off/)).toBeTruthy());
  });
});
