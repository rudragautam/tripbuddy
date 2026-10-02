"use server";

import { and, eq, ne } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { DESTINATIONS_TAG, destinationTag } from "@/lib/data/destinations";
import { getDb } from "@/lib/db";
import { destinations } from "@/lib/db/schema";
import { destinationSchema, formatIssues, type DestinationInput } from "@/lib/validation";

export type SaveDestinationState = { ok?: boolean; errors?: string[]; savedPayload?: string };

function toRow(v: DestinationInput) {
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
    bestMonths: [...new Set(v.bestMonths)].sort((a, b) => a - b),
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
}

function refreshCaches(...slugs: string[]) {
  // updateTag: the editor sees its own change immediately (read-your-own-writes).
  updateTag(DESTINATIONS_TAG);
  for (const s of new Set(slugs)) updateTag(destinationTag(s));
}

export async function saveDestination(_prev: SaveDestinationState, form: FormData): Promise<SaveDestinationState> {
  const user = await requireUser();
  const idRaw = form.get("id");
  const id = idRaw ? Number(idRaw) : null;

  let payload: unknown;
  try {
    payload = JSON.parse(String(form.get("payload") ?? ""));
  } catch {
    return { errors: ["The form data could not be read. Reload and try again."] };
  }

  const parsed = destinationSchema.safeParse(payload);
  if (!parsed.success) return { errors: formatIssues(parsed.error) };
  const row = toRow(parsed.data);

  const db = await getDb();
  const [clash] = await db
    .select({ id: destinations.id })
    .from(destinations)
    .where(id ? and(eq(destinations.slug, row.slug), ne(destinations.id, id)) : eq(destinations.slug, row.slug))
    .limit(1);
  if (clash) return { errors: [`slug: "${row.slug}" is already used by another destination`] };

  if (id) {
    const [before] = await db.select({ slug: destinations.slug }).from(destinations).where(eq(destinations.id, id)).limit(1);
    if (!before) return { errors: ["This destination no longer exists."] };
    await db
      .update(destinations)
      .set({ ...row, updatedBy: user.id })
      .where(eq(destinations.id, id));
    refreshCaches(before.slug, row.slug);
    return { ok: true, savedPayload: String(form.get("payload")) };
  }

  const [created] = await db
    .insert(destinations)
    .values({ ...row, updatedBy: user.id })
    .returning({ id: destinations.id });
  refreshCaches(row.slug);
  redirect(`/admin/destinations/${created.id}?created=1`);
}

/** After changes made outside the admin (seed scripts, direct SQL), make the public site re-read the database. */
export async function refreshPublicCache() {
  await requireUser();
  refreshCaches();
}

export async function setPublished(form: FormData) {
  await requireUser();
  const id = Number(form.get("id"));
  const published = form.get("published") === "true";
  const db = await getDb();
  const [row] = await db
    .update(destinations)
    .set({ published })
    .where(eq(destinations.id, id))
    .returning({ slug: destinations.slug });
  if (row) refreshCaches(row.slug);
}

export async function deleteDestination(form: FormData) {
  await requireUser("admin");
  const id = Number(form.get("id"));
  const db = await getDb();
  const [row] = await db.delete(destinations).where(eq(destinations.id, id)).returning({ slug: destinations.slug });
  if (row) refreshCaches(row.slug);
  redirect("/admin/destinations");
}
