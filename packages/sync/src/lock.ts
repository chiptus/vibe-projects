export type Lock = <T>(fn: () => Promise<T>) => Promise<T>;

// In-process fallback, shared by name so two stores in one page serialise like two tabs would.
const chains = new Map<string, Promise<unknown>>();

/**
 * Serialises critical sections that touch both a value and the sync ledger. Uses the
 * Web Locks API so it holds across browser tabs on the same origin; where that's
 * missing, falls back to an in-process queue. Not re-entrant: never nest calls.
 */
export function createLock(name: string): Lock {
  return (fn) => {
    const locks = (globalThis as { navigator?: { locks?: { request<T>(n: string, cb: () => Promise<T>): Promise<T> } } })
      .navigator?.locks;
    if (locks?.request) return locks.request(name, fn);
    const run = (chains.get(name) ?? Promise.resolve()).then(fn, fn);
    chains.set(
      name,
      run.then(
        () => {},
        () => {},
      ),
    );
    return run;
  };
}
