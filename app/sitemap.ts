import type { MetadataRoute } from "next";
import { getPublishedCards } from "@/lib/data/destinations";
import { site } from "@/lib/site";
import { TOUR_TYPES } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cards = await getPublishedCards();
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/destinations`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...TOUR_TYPES.map((t) => ({ url: `${site.url}/explore/${t}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...cards.map((c) => ({
      url: `${site.url}/destinations/${c.slug}`,
      changeFrequency: "monthly" as const,
      priority: c.featured ? 0.9 : 0.8,
    })),
    { url: `${site.url}/about`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${site.url}/enquire`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${site.url}/credits`, changeFrequency: "monthly", priority: 0.2 },
  ];
}
