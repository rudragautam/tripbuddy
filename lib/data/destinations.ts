import "server-only";
import { and, asc, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { getDb } from "@/lib/db";
import { destinations, type DestinationRow } from "@/lib/db/schema";
import type { DestinationCard } from "@/lib/catalog";
import type { Destination } from "@/lib/types";

export { filterCards, type CardFilters, type DestinationCard } from "@/lib/catalog";

export const DESTINATIONS_TAG = "destinations";
export const destinationTag = (slug: string) => `destination:${slug}`;


export function rowToDestination(row: DestinationRow): Destination {
  return {
    slug: row.slug,
    name: row.name,
    state: row.state,
    tagline: row.tagline,
    summary: row.summary,
    tourType: row.tourType,
    lat: row.lat,
    lng: row.lng,
    bestTime: { months: row.bestTimeMonths, note: row.bestTimeNote },
    bestMonths: row.bestMonths,
    howToReach: row.howToReach,
    budgetPerDay: row.budgetPerDay,
    facts: row.facts,
    experiences: row.experiences,
    days: row.days,
    minDays: row.minDays,
    sceneImage: row.sceneImage ?? undefined,
    heroImage: row.heroImage ?? undefined,
    lastChecked: row.lastChecked,
    featured: row.featured,
    published: row.published,
  };
}

function toCard(row: DestinationRow): DestinationCard {
  return {
    slug: row.slug,
    name: row.name,
    state: row.state,
    tagline: row.tagline,
    summary: row.summary,
    tourType: row.tourType,
    bestTime: { months: row.bestTimeMonths, note: row.bestTimeNote },
    bestMonths: row.bestMonths,
    minDays: row.minDays,
    featured: row.featured,
    dayCount: row.days.length,
    heroImage: row.heroImage ?? undefined,
  };
}

const REVALIDATE_SECONDS = 3600;

export const getPublishedCards = unstable_cache(
  async (): Promise<DestinationCard[]> => {
    const db = await getDb();
    const rows = await db
      .select()
      .from(destinations)
      .where(eq(destinations.published, true))
      .orderBy(desc(destinations.featured), asc(destinations.name));
    return rows.map(toCard);
  },
  ["published-cards"],
  { tags: [DESTINATIONS_TAG], revalidate: REVALIDATE_SECONDS },
);

export function getPublishedDestination(slug: string): Promise<Destination | null> {
  return unstable_cache(
    async () => {
      const db = await getDb();
      const [row] = await db
        .select()
        .from(destinations)
        .where(and(eq(destinations.slug, slug), eq(destinations.published, true)))
        .limit(1);
      return row ? rowToDestination(row) : null;
    },
    ["published-destination", slug],
    { tags: [DESTINATIONS_TAG, destinationTag(slug)], revalidate: REVALIDATE_SECONDS },
  )();
}

