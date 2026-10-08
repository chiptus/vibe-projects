import type { Entries } from "./protocol";
import type { SyncStorage } from "./server";

/** The slice of a `pg` Pool/Client needed here. */
export interface PgLike {
  query(text: string, params?: unknown[]): Promise<{ rows: Record<string, unknown>[] }>;
}

const SCHEMA = `create table if not exists sync_entries (
  app text not null,
  key text not null,
  v text not null,
  t bigint not null,
  d boolean not null default false,
  primary key (app, key)
)`;

/** One row per (app, key). Call `ready` once before serving. */
export function pgStorage(db: PgLike): SyncStorage & { ready(): Promise<void> } {
  return {
    async ready() {
      await db.query(SCHEMA);
    },
    async load(app) {
      const { rows } = await db.query("select key, v, t, d from sync_entries where app = $1", [app]);
      const entries: Entries = {};
      for (const r of rows) {
        entries[String(r.key)] = { v: String(r.v), t: Number(r.t), ...(r.d ? { d: true } : {}) };
      }
      return entries;
    },
    async save(app, updates) {
      for (const [k, e] of Object.entries(updates)) {
        await db.query(
          `insert into sync_entries (app, key, v, t, d) values ($1, $2, $3, $4, $5)
           on conflict (app, key) do update set v = excluded.v, t = excluded.t, d = excluded.d
           where excluded.t > sync_entries.t`,
          [app, k, e.v, e.t, !!e.d],
        );
      }
    },
  };
}
