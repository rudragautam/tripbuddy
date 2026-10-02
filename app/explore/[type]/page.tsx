import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CardGrid } from "@/components/Destination/DestinationCard";
import SceneVisual from "@/components/Scene/SceneVisual";
import { SiteFooter, SiteHeader } from "@/components/Site/SiteChrome";
import { getPublishedCards } from "@/lib/data/destinations";
import { themeVars, themes } from "@/lib/themes";
import { TOUR_TYPES, type TourType } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ type: string }> };

function parse(type: string): TourType | null {
  return TOUR_TYPES.includes(type as TourType) ? (type as TourType) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = parse((await params).type);
  if (!t) return { title: "Not found" };
  return {
    title: `${themes[t].label} trips in India: free itineraries`,
    description: `${themes[t].blurb}. Free day-by-day ${themes[t].label.toLowerCase()} itineraries across India.`,
    alternates: { canonical: `/explore/${t}` },
  };
}

export default async function ExplorePage({ params }: Props) {
  const type = parse((await params).type);
  if (!type) notFound();
  const theme = themes[type];
  const cards = (await getPublishedCards()).filter((c) => c.tourType === type);

  return (
    <div style={themeVars(type)} className="flex min-h-screen flex-col bg-t-bg text-t-ink">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
        <section className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-t-accent uppercase">Trip type</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{theme.label}</h1>
            <p className="mt-3 text-lg text-t-muted">{theme.blurb}.</p>
            <p className="mt-1 text-t-muted">
              {cards.length} free {cards.length === 1 ? "plan" : "plans"} so far.
            </p>
          </div>
          <div className="mx-auto w-full max-w-md">
            <SceneVisual type={type} name={theme.label} photo={cards.find((c) => c.heroImage)?.heroImage} priority />
          </div>
        </section>

        <div className="mt-10">
          {cards.length > 0 ? (
            <CardGrid cards={cards} />
          ) : (
            <div className="tactile p-8 text-center">
              <p className="font-semibold">Plans for this trip type are on the way.</p>
              <Link href="/enquire" className="mt-3 inline-block font-semibold text-t-accent">
                Ask us to plan one for you →
              </Link>
            </div>
          )}
        </div>

        <nav aria-label="Other trip types" className="mt-12 flex flex-wrap gap-2">
          {TOUR_TYPES.filter((t) => t !== type).map((t) => (
            <Link key={t} href={`/explore/${t}`} className="tactile-sm px-4 py-2 text-sm font-medium text-t-muted hover:text-t-ink">
              {themes[t].label}
            </Link>
          ))}
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}
