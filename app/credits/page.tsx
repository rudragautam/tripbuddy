import type { Metadata } from "next";
import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import ProsePage from "@/components/Site/ProsePage";
import { DESTINATIONS_TAG } from "@/lib/data/destinations";
import { getDb } from "@/lib/db";
import { destinations } from "@/lib/db/schema";
import type { Photo } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Photo credits",
  description: "Photographers and licences for the photos used on TripBuddy.",
  alternates: { canonical: "/credits" },
};

const getCredits = unstable_cache(
  async () => {
    const db = await getDb();
    const rows = await db
      .select({ slug: destinations.slug, name: destinations.name, hero: destinations.heroImage, days: destinations.days })
      .from(destinations)
      .where(eq(destinations.published, true))
      .orderBy(asc(destinations.name));
    return rows.map((r) => {
      const photos = new Map<string, Photo>();
      if (r.hero) photos.set(r.hero.src, r.hero);
      for (const day of r.days) for (const s of day.stops) if (s.image) photos.set(s.image.src, s.image);
      return { slug: r.slug, name: r.name, photos: [...photos.values()] };
    });
  },
  ["photo-credits"],
  { tags: [DESTINATIONS_TAG], revalidate: 3600 },
);

export default async function CreditsPage() {
  const groups = (await getCredits()).filter((g) => g.photos.length > 0);
  const total = groups.reduce((n, g) => n + g.photos.length, 0);

  return (
    <ProsePage
      title="Photo credits"
      intro={`TripBuddy uses ${total} photos shared under free licences, mostly from Wikimedia Commons. Thank you to every photographer below.`}
    >
      {groups.map((g) => (
        <section key={g.slug}>
          <h2>
            <Link href={`/destinations/${g.slug}`} className="hover:text-t-accent">
              {g.name}
            </Link>
          </h2>
          <ul>
            {g.photos.map((p) => (
              <li key={p.src} className="text-sm">
                {p.alt}: {p.sourceUrl ? <a href={p.sourceUrl} className="underline" target="_blank" rel="noopener noreferrer">{p.author}</a> : p.author}
                {", "}
                {p.licenseUrl ? <a href={p.licenseUrl} className="underline" target="_blank" rel="noopener noreferrer license">{p.license}</a> : p.license}
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="text-sm">
        Photos may be cropped or resized. If you&apos;re a photographer and want a credit changed or a photo removed,{" "}
        <Link href="/enquire" className="underline">tell us</Link>.
      </p>
    </ProsePage>
  );
}
