import "./env";
import { createDb } from "../lib/db/client";

async function main() {
  const { db, close, driver } = await createDb();
  if (driver === "postgres") {
    const { migrate } = await import("drizzle-orm/postgres-js/migrator");
    await migrate(db, { migrationsFolder: "drizzle" });
  } else {
    const { migrate } = await import("drizzle-orm/pglite/migrator");
    // Same query builder underneath; the PGlite migrator only needs the dialect + session.
    await migrate(db as never, { migrationsFolder: "drizzle" });
  }
  console.log(`Migrations applied (${driver}).`);
  await close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
