import type { Entries } from "./protocol";
import type { SiloTx, SyncStorage } from "./server";

/** The slice of a `pg` client needed here. */
export interface PgClientLike {
  query(text: string, params?: unknown[]): Promise<{ rows: Record<string, unknown>[] }>;
}

/** The slice of a `pg` Pool needed here. */
export interface PgLike extends PgClientLike {
  connect(): Promise<PgClientLike & { release(): void }>;
}

const SCHEMA = `create table if not exists sync_entries (
  app text not null,
  key text not null,
  v text not null,
  t bigint not null,
  d boolean not null default false,
  primary key (app, key)
)`;

const tx = (db: PgClientLike, silo: string): SiloTx => ({
  async load() {
    const { rows } = await db.query("select key, v, t, d from sync_entries where app = $1", [silo]);
    const entries: Entries = {};
    for (const r of rows) {
      entries[String(r.key)] = { v: String(r.v), t: Number(r.t), ...(r.d ? { d: true } : {}) };
    }
    return entries;
  },
  async save(updates) {
    for (const [k, e] of Object.entries(updates)) {
      await db.query(
        `insert into sync_entries (app, key, v, t, d) values ($1, $2, $3, $4, $5)
         on conflict (app, key) do update set v = excluded.v, t = excluded.t, d = excluded.d
         where excluded.t > sync_entries.t`,
        [silo, k, e.v, e.t, !!e.d],
      );
    }
  },
});

/**
 * One row per (silo, key). Each `withSilo` call runs in a transaction holding a
 * per-silo advisory lock, so concurrent requests for a silo run one after another
 * and the quota check cannot be raced. Call `ready` once before serving.
 */
export function pgStorage(db: PgLike): SyncStorage & { ready(): Promise<void> } {
  return {
    async ready() {
      await db.query(SCHEMA);
    },
    async withSilo(silo, fn) {
      const client = await db.connect();
      try {
        await client.query("begin");
        await client.query("select pg_advisory_xact_lock(hashtext($1))", [silo]);
        const out = await fn(tx(client, silo));
        await client.query("commit");
        return out;
      } catch (e) {
        await client.query("rollback").catch(() => {});
        throw e;
      } finally {
        client.release();
      }
    },
  };
}
