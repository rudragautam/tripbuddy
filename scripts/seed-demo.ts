import "./env";
import bcrypt from "bcryptjs";
import { eq, like } from "drizzle-orm";
import { createDb } from "../lib/db/client";
import { destinations, enquiries, users, type EnquiryStatus } from "../lib/db/schema";

/**
 * Demo data so the admin panel looks like a running business: ~70 enquiries over the last
 * 90 days in every status, with team notes, plus two demo editors.
 *
 *   npm run db:seed:demo              add demo data (run `npm run db:seed` first)
 *   npm run db:seed:demo -- --remove  delete all demo data again
 *
 * Everything is tagged (source "demo-seed", emails @tripbuddy.demo) so it can be removed cleanly.
 * Refuses to touch a non-local database unless --allow-remote is passed.
 */

const DEMO_SOURCE = "demo-seed";
const DEMO_DOMAIN = "@tripbuddy.demo";
const args = new Set(process.argv.slice(2));

function assertLocal() {
  const url = process.env.DATABASE_URL;
  if (!url || args.has("--allow-remote")) return;
  const host = new URL(url).hostname;
  if (!["localhost", "127.0.0.1", "::1"].includes(host)) {
    throw new Error(`Refusing to write demo data to ${host}. Pass --allow-remote if this is really a staging database.`);
  }
}

// Deterministic randomness so every run produces the same demo set.
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = rng(20261002);
const pick = <T>(list: readonly T[]) => list[Math.floor(rand() * list.length)];
const between = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1));

const FIRST = [
  "Aarav", "Ananya", "Rohan", "Priya", "Vikram", "Sneha", "Arjun", "Kavya", "Rahul", "Meera",
  "Siddharth", "Ishita", "Karthik", "Pooja", "Nikhil", "Divya", "Aditya", "Neha", "Manish", "Shreya",
  "Farhan", "Zoya", "Gurpreet", "Simran", "Tenzing", "Lalit", "Anjali", "Deepak", "Ritika", "Joseph",
];
const LAST = [
  "Sharma", "Iyer", "Mehta", "Nair", "Reddy", "Banerjee", "Kapoor", "Das", "Patel", "Menon",
  "Singh", "Khan", "Joshi", "Rao", "Gupta", "Bose", "Pillai", "Chatterjee", "Bhatia", "Fernandes",
];

const NOTES = [
  "Travelling with my parents (60+), so an easy pace please. Need a cab from the airport.",
  "Honeymoon trip. Looking for quiet stays with a view.",
  "Group of college friends, budget stays are fine. Can you help with a tempo traveller?",
  "Need 2 rooms and a cab for the full trip.",
  "First time travelling solo. Want safe, well-reviewed homestays.",
  "Kids aged 6 and 9. Anything to avoid with children?",
  "Can you add one extra day for rest? We're flying in from Bengaluru.",
  "Looking for help with train tickets and a hotel near the station.",
  "Want to do the itinerary as is, just need hotels booked.",
  "Is it possible to combine this with a nearby destination?",
  "Corporate offsite for 12 people. Need a venue with a meeting room.",
  "Vegetarian food is important for us.",
  "",
  "",
  "",
];

const CUSTOM_ASKS = [
  "Planning 8 days across Meghalaya and Kaziranga. Can you make a plan?",
  "We want a 10-day South India loop with temples and beaches.",
  "Any suggestions for a long weekend near Mumbai?",
  "Looking for a Northeast trip for 7 days in March.",
  "Want to see snow in December with family. Where should we go?",
];

const ADMIN_NOTES: Record<Exclude<EnquiryStatus, "new">, string[]> = {
  contacted: [
    "Called, they'll confirm dates by the weekend. Sent hotel options on WhatsApp.",
    "WhatsApp sent with 3 hotel options. Waiting for a reply.",
    "Spoke to them. Dates flexible by a week; checking cab availability.",
    "Shared a revised plan with an extra rest day.",
  ],
  converted: [
    "Booked: hotels for all nights + cab. Confirmation sent.",
    "Booked homestays and airport transfers. Customer very happy.",
    "Booked 2 rooms and the full-trip cab. Follow up after the trip for a review.",
  ],
  closed: [
    "Decided to book on their own. Thanked them for using the plan.",
    "No response after 3 follow-ups.",
    "Trip postponed to next year.",
    "Duplicate enquiry, merged with the earlier one.",
  ],
};

function statusFor(ageDays: number): EnquiryStatus {
  const r = rand();
  if (ageDays < 3) return r < 0.85 ? "new" : "contacted";
  if (ageDays < 14) return r < 0.25 ? "new" : r < 0.75 ? "contacted" : r < 0.85 ? "converted" : "closed";
  return r < 0.15 ? "contacted" : r < 0.6 ? "converted" : "closed";
}

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

async function main() {
  assertLocal();
  const { db, close } = await createDb();

  if (args.has("--remove")) {
    const e = await db.delete(enquiries).where(eq(enquiries.source, DEMO_SOURCE)).returning({ id: enquiries.id });
    const u = await db.delete(users).where(like(users.email, `%${DEMO_DOMAIN}`)).returning({ id: users.id });
    console.log(`Removed ${e.length} demo enquiries and ${u.length} demo users.`);
    await close();
    return;
  }

  const existing = await db.select({ id: enquiries.id }).from(enquiries).where(eq(enquiries.source, DEMO_SOURCE)).limit(1);
  if (existing.length) {
    console.log("Demo data is already loaded. Run with --remove first to reload it.");
    await close();
    return;
  }

  const places = await db
    .select({ slug: destinations.slug, featured: destinations.featured, minDays: destinations.minDays })
    .from(destinations)
    .where(eq(destinations.published, true));
  if (places.length === 0) throw new Error("No destinations found. Run `npm run db:seed` first.");
  // Featured places get more enquiries, as they would in real life.
  const weighted = places.flatMap((p) => (p.featured ? [p, p, p] : [p]));

  // Demo team
  const password = process.env.DEMO_PASSWORD ?? "demo-editor-pass-123";
  const hash = await bcrypt.hash(password, 12);
  const team = [
    { name: "Priya Nair", email: `priya${DEMO_DOMAIN}` },
    { name: "Rahul Verma", email: `rahul${DEMO_DOMAIN}` },
  ];
  for (const t of team) {
    await db
      .insert(users)
      .values({ ...t, role: "editor", passwordHash: hash, lastLoginAt: new Date(Date.now() - between(1, 48) * 3_600_000) })
      .onConflictDoNothing({ target: users.email });
  }
  const handlers = await db.select({ id: users.id }).from(users).where(eq(users.active, true));

  const now = Date.now();
  const rows = Array.from({ length: 72 }, () => {
    const ageDays = Math.pow(rand(), 1.6) * 90; // more recent enquiries than old ones
    const createdAt = new Date(now - ageDays * 86_400_000 - between(0, 600) * 60_000);
    const status = statusFor(ageDays);
    const custom = rand() < 0.08;
    const place = custom ? null : pick(weighted);
    const first = pick(FIRST);
    const last = pick(LAST);
    const travel = new Date(createdAt.getTime() + between(10, 100) * 86_400_000);
    const handled = status !== "new";
    return {
      destinationSlug: place?.slug ?? null,
      days: custom ? between(5, 10) : between(place!.minDays, 6),
      name: `${first} ${last}`,
      phone: `+91 90000 ${String(between(10000, 99999))}`,
      email: rand() < 0.65 ? `${first}.${last}${between(1, 99)}@example.com`.toLowerCase() : null,
      travelDate: rand() < 0.85 ? isoDate(travel) : null,
      people: pick([1, 2, 2, 2, 3, 4, 4, 5, 6]),
      budget: pick(["budget", "mid", "mid", "mid", "premium"] as const),
      notes: custom ? pick(CUSTOM_ASKS) : pick(NOTES) || null,
      status,
      adminNotes: handled ? pick(ADMIN_NOTES[status as Exclude<EnquiryStatus, "new">]) : null,
      assignedTo: handled ? pick(handlers).id : null,
      source: DEMO_SOURCE,
      ipHash: null,
      createdAt,
      updatedAt: handled ? new Date(createdAt.getTime() + between(2, 72) * 3_600_000) : createdAt,
    };
  });

  await db.insert(enquiries).values(rows);

  const byStatus = rows.reduce<Record<string, number>>((acc, r) => ((acc[r.status] = (acc[r.status] ?? 0) + 1), acc), {});
  console.log(`Added ${rows.length} demo enquiries (${Object.entries(byStatus).map(([k, v]) => `${v} ${k}`).join(", ")}).`);
  console.log(`Demo editors: ${team.map((t) => t.email).join(", ")} (password: ${password})`);
  await close();
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
