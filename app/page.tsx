import Link from "next/link";
import { ArrowRight, MessageCircle, Route, ShieldCheck } from "lucide-react";
import { CardGrid } from "@/components/Destination/DestinationCard";
import HomeHero from "@/components/Home/HomeHero";
import TypeTile from "@/components/Destination/TypeTile";
import { SiteFooter, SiteHeader } from "@/components/Site/SiteChrome";
import { getPublishedCards } from "@/lib/data/destinations";
import { MONTHS, site } from "@/lib/site";
import { coverCard } from "@/lib/themes";
import { TOUR_TYPES } from "@/lib/types";

export const dynamic = "force-dynamic";

const steps = [
  {
    Icon: Route,
    title: "Pick a place and your days",
    body: "Choose from 2 to 6 days. The plan, map and stops change as you switch.",
  },
  {
    Icon: ShieldCheck,
    title: "Get an honest plan",
    body: "Checked by people who know the place, with a last-checked date on every plan. No sign-up, no payment.",
  },
  {
    Icon: MessageCircle,
    title: "Ask only if you want help",
    body: "Hotels, cabs, tickets: send an enquiry and we'll get back to you. There's no pressure to book.",
  },
];

export default async function Home() {
  const cards = await getPublishedCards();
  const monthIndex = Number(
    new Intl.DateTimeFormat("en-IN", { month: "numeric", timeZone: "Asia/Kolkata" }).format(new Date()),
  );
  const thisMonth = cards.filter((c) => c.bestMonths.includes(monthIndex)).slice(0, 6);
  // Popular avoids repeating what "where to go this month" already shows.
  const shown = new Set(thisMonth.map((c) => c.slug));
  const featuredAll = cards.filter((c) => c.featured);
  const fresh = featuredAll.filter((c) => !shown.has(c.slug));
  const featured = (fresh.length >= 3 ? fresh : featuredAll).slice(0, 6);
  const counts = new Map(TOUR_TYPES.map((t) => [t, cards.filter((c) => c.tourType === t).length]));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.url}/destinations?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <SiteHeader overlay />
      <main id="main" className="flex-1">
        {cards.length > 0 && (
          <HomeHero
            options={cards.map((c) => ({
              slug: c.slug,
              name: c.name,
              state: c.state,
              tagline: c.tagline,
              tourType: c.tourType,
              minDays: c.minDays,
              dayCount: c.dayCount,
              heroImage: c.heroImage,
            }))}
          />
        )}

        <section aria-labelledby="types-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 id="types-heading" className="text-3xl font-bold tracking-tight">
            Browse by trip type
          </h2>
          <p className="mt-2 text-t-muted">Every trip type has its own look, from tea hills to tiger country.</p>
          <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {TOUR_TYPES.map((t) => (
              <li key={t}>
                <TypeTile type={t} count={counts.get(t) ?? 0} photo={coverCard(cards, t)?.heroImage} />
              </li>
            ))}
          </ul>
        </section>

        {thisMonth.length > 0 && (
          <section aria-labelledby="month-heading" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id="month-heading" className="text-3xl font-bold tracking-tight">
                  Where to go in {MONTHS[monthIndex - 1]}
                </h2>
                <p className="mt-2 text-t-muted">Places that are at their best right now.</p>
              </div>
              <Link href={`/destinations?month=${monthIndex}`} className="flex items-center gap-1 font-semibold text-t-accent">
                See all <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <div className="mt-8">
              <CardGrid cards={thisMonth} />
            </div>
          </section>
        )}

        {featured.length > 0 && (
          <section aria-labelledby="popular-heading" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 id="popular-heading" className="text-3xl font-bold tracking-tight">
                Popular free itineraries
              </h2>
              <Link href="/destinations" className="flex items-center gap-1 font-semibold text-t-accent">
                All {cards.length} destinations <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <div className="mt-8">
              <CardGrid cards={featured} />
            </div>
          </section>
        )}

        <section id="how" aria-labelledby="how-heading" className="mx-auto max-w-7xl scroll-mt-6 px-4 pb-20 sm:px-6">
          <h2 id="how-heading" className="text-3xl font-bold tracking-tight">
            Why it&apos;s free
          </h2>
          <p className="mt-2 max-w-2xl text-t-muted">
            A good buddy helps you plan first. If you like the plan and want a hand booking, that&apos;s when we talk.
          </p>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map(({ Icon, title, body }, i) => (
              <li key={title} className="tactile p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-t-accent-soft text-t-accent">
                  <Icon className="size-5" aria-hidden />
                </span>
                <p className="mt-4 text-xs font-semibold tracking-widest text-t-muted uppercase">Step {i + 1}</p>
                <h3 className="mt-1 text-lg font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-t-muted">{body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl bg-t-accent p-8 text-t-accent-ink sm:flex-row sm:items-center">
            <div>
              <p className="text-2xl font-bold">Going somewhere we haven&apos;t covered?</p>
              <p className="mt-1 opacity-90">Tell us where and for how long. We&apos;ll plan it for you, free.</p>
            </div>
            <Link href="/enquire" className="rounded-full bg-t-surface px-6 py-3 font-semibold text-t-ink">
              Ask for a free plan
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
