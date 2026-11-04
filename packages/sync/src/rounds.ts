import { runSync, type EngineDeps } from "./engine";
import type { Status } from "./status";

const errorMessage = (e: unknown) => (e instanceof Error ? e.message : String(e));

/**
 * Runs sync rounds one at a time. Calls made while a round is in flight share a
 * single follow-up round that starts after it, so a caller always gets a round
 * that began after its call (and therefore sees whatever it just changed).
 */
export function createRounds(deps: EngineDeps, status: Status, debounceMs: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let current: Promise<string | null> | null = null;
  let next: Promise<string | null> | null = null;

  /** Debounced sync after a local write. */
  function schedule() {
    if (!deps.getToken()) return;
    clearTimeout(timer);
    timer = setTimeout(() => void syncNow(), debounceMs);
  }

  async function round(): Promise<string | null> {
    const token = deps.getToken();
    if (!token) {
      status.emit({ state: "off", error: null });
      return null;
    }
    status.emit({ state: "syncing", error: null });
    try {
      const result = await runSync(deps, token);
      // The account changed or sync was turned off meanwhile: this round no longer
      // describes the current state, so it says nothing.
      if (result.obsolete || deps.getToken() !== token) return null;
      status.emit({ state: "ok", lastSyncAt: Date.now(), error: null }, result.applied ? "remote" : null);
      if (result.pending) schedule(); // a write landed mid-request; send it next
      return null;
    } catch (e) {
      if (deps.getToken() !== token) return null;
      const message = errorMessage(e);
      status.emit({ state: "error", error: message });
      return message;
    }
  }

  const start = (): Promise<string | null> => {
    const p = round().finally(() => {
      if (current === p) current = null;
    });
    current = p;
    return p;
  };

  /** Run a round that starts now or right after the one in flight; resolves to its error, if any. */
  function syncNow(): Promise<string | null> {
    if (!current) return start();
    next ??= current.then(() => {
      next = null;
      return start();
    });
    return next;
  }

  return { syncNow, schedule, cancelScheduled: () => clearTimeout(timer) };
}

export type Rounds = ReturnType<typeof createRounds>;
