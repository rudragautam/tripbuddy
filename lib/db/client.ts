import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type Database = ReturnType<typeof drizzlePg<typeof schema>>;

/**
 * Production: DATABASE_URL (any Postgres — Neon, Supabase, RDS).
 * Local development without DATABASE_URL: PGlite, an embedded Postgres stored in .data/pglite.
 * PGlite allows one process at a time, so stop `npm run dev` before running db scripts.
 */
export async function createDb(): Promise<{ db: Database; close: () => Promise<void>; driver: "postgres" | "pglite" }> {
  const url = process.env.DATABASE_URL;

  if (url) {
    const sql = postgres(url, {
      max: Number(process.env.DATABASE_POOL_SIZE ?? 5),
      prepare: false, // compatible with transaction-mode poolers (PgBouncer, Supabase, Neon)
    });
    return { db: drizzlePg(sql, { schema }), close: () => sql.end(), driver: "postgres" };
  }

  if (process.env.NODE_ENV === "production" && process.env.ALLOW_PGLITE !== "1") {
    throw new Error("DATABASE_URL is required in production.");
  }

  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle: drizzlePglite } = await import("drizzle-orm/pglite");
  const { mkdirSync } = await import("node:fs");
  const dir = process.env.PGLITE_DIR ?? ".data/pglite";
  mkdirSync(dir, { recursive: true });
  const client = new PGlite(dir);
  const db = drizzlePglite(client, { schema }) as unknown as Database;
  return { db, close: () => client.close(), driver: "pglite" };
}
