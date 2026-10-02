import "./env";
import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import { createDb } from "../lib/db/client";
import { users } from "../lib/db/schema";

/**
 * Create an admin, or reset an existing user's password and make them an active admin.
 * Recovery tool for when nobody can sign in.
 *   npm run user:admin -- you@example.com "Your Name"
 * Reads the password from ADMIN_PASSWORD (kept out of shell history and process lists).
 */
async function main() {
  const [emailArg, ...nameParts] = process.argv.slice(2);
  const email = emailArg?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error('Usage: ADMIN_PASSWORD=... npm run user:admin -- you@example.com "Your Name"');
  }
  if (password.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters.");

  const { db, close } = await createDb();
  const passwordHash = await bcrypt.hash(password, 12);
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);

  if (existing) {
    await db
      .update(users)
      .set({
        passwordHash,
        role: "admin",
        active: true,
        failedLogins: 0,
        lockedUntil: null,
        sessionVersion: sql`${users.sessionVersion} + 1`,
      })
      .where(eq(users.id, existing.id));
    console.log(`Updated ${email}: active admin with a new password.`);
  } else {
    await db.insert(users).values({ email, name: nameParts.join(" ") || "Admin", passwordHash, role: "admin" });
    console.log(`Created admin ${email}.`);
  }
  await close();
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
