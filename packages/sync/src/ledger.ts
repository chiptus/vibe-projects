import type { KV } from "./types";

/** Per-key sync bookkeeping: version `t`, tombstone `d`, and whether the server still needs it. */
export interface LedgerKey {
  t: number;
  d?: boolean;
  dirty?: boolean;
}

/** `token` is the fingerprint of the account this device's cached data belongs to. */
export interface Ledger {
  token?: string;
  keys: Record<string, LedgerKey>;
}

const LEDGER_KEY = "__sync:ledger";
const LEGACY_KEY = "__sync:meta"; // flat key -> LedgerKey map from the first version
const INTERNAL_PREFIX = "__sync:";

export const isInternalKey = (k: string) => k.startsWith(INTERNAL_PREFIX);

export async function loadLedger(local: KV): Promise<Ledger> {
  const raw = (await local.get(LEDGER_KEY)) as Ledger | null;
  if (raw && typeof raw === "object" && raw.keys && typeof raw.keys === "object") return raw;
  const legacy = (await local.get(LEGACY_KEY)) as Record<string, LedgerKey> | null;
  return { keys: legacy && typeof legacy === "object" ? legacy : {} };
}

/** Resolves to null on success, or an error string. */
export async function saveLedger(local: KV, ledger: Ledger): Promise<string | null> {
  const err = await local.set(LEDGER_KEY, ledger);
  if (!err) await local.del(LEGACY_KEY);
  return err;
}
