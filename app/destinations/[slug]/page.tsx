import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CardGrid } from "@/components/Destination/DestinationCard";
import Planner from "@/components/Planner/Planner";
import WeatherCard from "@/components/Planner/WeatherCard";
import SceneVisual from "@/components/Scene/SceneVisual";
import { getPublishedCards, getPublishedDestination } from "@/lib/data/destinations";
import { site } from "@/lib/site";
import { themeVars, themes } from "@/lib/themes";
import type { Destination } from "@/lib/types";
import { getWeather } from "@/lib/weather";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ days?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const d = await getPublishedDestination(slug);
  if (!d) return { title: "Destination not found" };
  const title = `${d.name} itinerary: free ${d.minDays} to ${d.days.length} day plans`;
  const description = `${d.summary} Free day-by-day ${d.name} itinerary with map, weather, best time to visit and budget.`;
  return {
    title,
    description,
    alternates: { canonical: `/destinations/${d.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/destinations/${d.slug}`,
      ...(d.heroImage ? { images: [{ url: d.heroImage.src, width: d.heroImage.width, height: d.heroImage.height, alt: d.heroImage.alt }] } : {}),
    },
  };
}

function clampDays(raw: string | undefined, d: Destination) {
  const n = Number(raw);
  const fallback = Math.min(Math.max(3, d.minDays), d.days.length);
  return Number.isInteger(n) ? Math.min(Math.max(n, d.minDays), d.days.length) : fallback;
}

function jsonLd(d: Destination, days: number) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: `${days}-day ${d.name} itinerary`,
    description: d.summary,
    url: `${site.url}/destinations/${d.slug}`,
    touristType: themes[d.tourType].label,
    offers: { "@type": "Offer", price: 0, priceCurrency: "INR", description: "Free itinerary" },
    itinerary: {
      "@type": "ItemList",
      itemListElement: d.days.slice(0, days).map((day, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "TouristAttraction",
          name: `Day ${i + 1}: ${day.title}`,
          description: `${day.morning} ${day.afternoon} ${day.evening}`,
        },
      })),
    },
    subjectOf: {
      "@type": "TouristDestination",
      name: d.name,
      address: { "@type": "PostalAddress", addressRegion: d.state, addressCountry: "IN" },
      geo: { "@type": "GeoCoordinates", latitude: d.lat, longitude: d.lng },
    },
  };
}

export default async function DestinationPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { days: daysParam } = await searchParams;
  const destination = await getPublishedDestination(slug);
  if (!destination) notFound();

  const initialDays = clampDays(daysParam, destination);
  const [weather, cards] = await Promise.all([getWeather(destination.lat, destination.lng), getPublishedCards()]);
  const related = cards
    .filter((c) => c.slug !== destination.slug)
    .sort((a, b) => Number(b.tourType === destination.tourType) - Number(a.tourType === destination.tourType))
    .slice(0, 3);

  return (
    <div style={themeVars(destination.tourType)} className="min-h-screen bg-t-bg text-t-ink">
      <script
        type="application/ld+json"
        // JSON.stringify output with "<" escaped cannot break out of the script tag
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(destination, initialDays)).replace(/</g, "\\u003c") }}
      />
      <Planner
        destination={destination}
        initialDays={initialDays}
        whatsapp={site.whatsapp}
        weather={<WeatherCard weather={weather} place={destination.name} />}
        scene={
          <SceneVisual
            type={destination.tourType}
            name={destination.name}
            sceneImage={destination.sceneImage}
            photo={destination.heroImage}
            priority
          />
        }
        related={
          related.length > 0 && (
            <section aria-labelledby="related-heading" className="pt-6">
              <h2 id="related-heading" className="mb-4 text-xl font-bold tracking-tight">
                You might also like
              </h2>
              <CardGrid cards={related} />
            </section>
          )
        }
      />
    </div>
  );
}
