import "server-only";
import { createDb, type Database } from "./client";

// One connection pool per server process (survives dev hot reloads).
const globalForDb = globalThis as unknown as { tripbuddyDb?: Promise<Database> };

export function getDb(): Promise<Database> {
  globalForDb.tripbuddyDb ??= createDb().then((r) => r.db);
  return globalForDb.tripbuddyDb;
}

export * as schema from "./schema";
