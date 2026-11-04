import { applyRemoteEntry, pullRemote, type EngineDeps } from "./engine";
import { isInternalKey, saveLedger, type Ledger } from "./ledger";
import { MIN_TOKEN_LENGTH } from "./protocol";
import type { Rounds } from "./rounds";
import type { Status } from "./status";
import { tokenFingerprint } from "./token";
import type { ConnectMode, KV, SyncedStore } from "./types";

const errorMessage = (e: unknown) => (e instanceof Error ? e.message : String(e));

const mustSave = async (local: KV, ledger: Ledger) => {
  const err = await saveLedger(local, ledger);
  if (err) throw new Error(`Could not save sync state: ${err}`);
};

/**
 * Joining, switching and leaving accounts. The active token only ever changes
 * while holding the lock, together with the data and ledger it belongs to, so a
 * sync round can never observe half of a switch.
 */
export function createAccount(
  deps: EngineDeps,
  status: Status,
  rounds: Rounds,
  setToken: (token: string | null) => void,
): Pick<SyncedStore, "connect" | "disconnect"> {
  const { local, lock } = deps;

  async function replace(token: string): Promise<string | null> {
    // Read the account first so nothing changes if the token is wrong or the account is empty.
    let remote;
    try {
      remote = await pullRemote(deps, token);
    } catch (e) {
      return errorMessage(e);
    }
    if (!Object.values(remote).some((e) => !e.d)) {
      return "This token has no data yet, so there is nothing to replace this device's data with. Use Merge to upload this device's data instead.";
    }
    // Validate every value before deleting anything locally.
    try {
      for (const r of Object.values(remote)) if (!r.d) JSON.parse(r.v);
    } catch {
      return "The account holds data that could not be read, so this device's data was left untouched.";
    }
    try {
      await lock(async () => {
        const existing = await local.keys("");
        if (!existing) throw new Error("Could not list this device's data, so it was left untouched.");
        try {
          const ledger: Ledger = { token: tokenFingerprint(token), keys: {} };
          for (const k of existing) if (!isInternalKey(k)) await local.del(k);
          for (const [k, r] of Object.entries(remote)) await applyRemoteEntry(local, ledger, k, r);
          await mustSave(local, ledger);
          setToken(token);
        } catch (e) {
          // Half-replaced data must never be uploaded to either account: stop syncing here and
          // forget the bookkeeping. The old account still has its copy; Replace again to recover.
          try {
            setToken(null);
            await saveLedger(local, { keys: {} });
          } catch {
            // nothing more can be done; the error below tells the user
          }
          throw new Error(`Replace failed part-way and sync was turned off (${errorMessage(e)}). Try Replace again.`);
        }
      });
    } catch (e) {
      return errorMessage(e);
    }
    status.emit({ state: "ok", lastSyncAt: Date.now(), error: null }, "replaced");
    return null;
  }

  // Merge: forget the previous account's bookkeeping; every local key is re-adopted and
  // uploaded, and wherever the account already has the same key its version wins.
  async function merge(token: string): Promise<string | null> {
    try {
      await lock(async () => {
        const previous = deps.getToken();
        setToken(token); // can throw (storage unavailable): nothing has changed yet
        try {
          await mustSave(local, { token: tokenFingerprint(token), keys: {} });
        } catch (e) {
          setToken(previous); // keep the old token paired with its untouched ledger
          throw e;
        }
      });
    } catch (e) {
      return errorMessage(e);
    }
    return rounds.syncNow(); // a round that starts after the switch, and its own result
  }

  return {
    async connect(rawToken, mode: ConnectMode) {
      const token = rawToken.trim();
      if (token.length < MIN_TOKEN_LENGTH) return `The token must be at least ${MIN_TOKEN_LENGTH} characters.`;
      return mode === "replace" ? replace(token) : merge(token);
    },

    async disconnect() {
      rounds.cancelScheduled();
      await lock(async () => setToken(null)); // throws if the token could not be removed: still syncing
      status.emit({ state: "off", error: null });
    },
  };
}
