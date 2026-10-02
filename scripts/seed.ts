import "./env";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { createDb } from "../lib/db/client";
import { destinations, users } from "../lib/db/schema";
import { seedDestinations } from "../lib/seed";
import { destinationSchema, formatIssues } from "../lib/validation";

/**
 * Loads seed destinations and the first admin.
 *   npm run db:seed            insert destinations that don't exist yet (keeps admin edits)
 *   npm run db:seed -- --force overwrite seed destinations with the seed content
 */
async function main() {
  const force = process.argv.includes("--force");
  const { db, close } = await createDb();

  // Validate everything first so a bad entry never half-seeds the database.
  const rows = seedDestinations.map((d) => {
    const parsed = destinationSchema.safeParse({ ...d, published: d.published ?? true });
    if (!parsed.success) {
      throw new Error(`Seed "${d.slug}" is invalid:\n  ${formatIssues(parsed.error).join("\n  ")}`);
    }
    const v = parsed.data;
    return {
      slug: v.slug,
      name: v.name,
      state: v.state,
      tagline: v.tagline,
      summary: v.summary,
      tourType: v.tourType,
      lat: v.lat,
      lng: v.lng,
      bestTimeMonths: v.bestTime.months,
      bestTimeNote: v.bestTime.note,
      bestMonths: v.bestMonths,
      howToReach: v.howToReach,
      budgetPerDay: v.budgetPerDay,
      facts: v.facts,
      experiences: v.experiences,
      days: v.days,
      minDays: v.minDays,
      sceneImage: v.sceneImage ?? null,
      heroImage: v.heroImage ?? null,
      lastChecked: v.lastChecked,
      featured: v.featured,
      published: v.published,
    };
  });

  const slugs = new Set<string>();
  for (const r of rows) {
    if (slugs.has(r.slug)) throw new Error(`Duplicate slug in seed: ${r.slug}`);
    slugs.add(r.slug);
  }

  for (const row of rows) {
    const q = db.insert(destinations).values(row);
    if (force) {
      await q.onConflictDoUpdate({ target: destinations.slug, set: row });
    } else {
      await q.onConflictDoNothing({ target: destinations.slug });
    }
  }
  console.log(`Destinations: ${rows.length} in seed (${force ? "overwritten" : "missing ones inserted"}).`);
  console.log("If the site is already running, click \"Refresh site cache\" in Admin › Destinations.");

  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
  if (count === 0) {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) {
      console.warn("No users yet. Set ADMIN_EMAIL and ADMIN_PASSWORD, then run `npm run db:seed` again.");
    } else if (password.length < 12) {
      throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
    } else {
      await db.insert(users).values({
        email,
        name: process.env.ADMIN_NAME ?? "Admin",
        passwordHash: await bcrypt.hash(password, 12),
        role: "admin",
      });
      console.log(`Admin user created: ${email}`);
    }
  }

  await close();
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
