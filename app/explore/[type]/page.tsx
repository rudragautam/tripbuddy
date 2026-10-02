import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowRight, CalendarDays, Compass, MapPin, Sun } from "lucide-react";
import { CardGrid } from "@/components/Destination/DestinationCard";
import TypeTile from "@/components/Destination/TypeTile";
import SceneVisual from "@/components/Scene/SceneVisual";
import { SiteFooter, SiteHeader } from "@/components/Site/SiteChrome";
import { getPublishedCards } from "@/lib/data/destinations";
import { MONTHS } from "@/lib/site";
import { coverCard, themeVars, themes } from "@/lib/themes";
import { TOUR_TYPES, type TourType } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ type: string }> };

// Alternative spellings (/explore/hill) are redirected in next.config.ts.
function resolve(type: string): TourType | null {
  return TOUR_TYPES.includes(type as TourType) ? (type as TourType) : null;
}

/** Months as runs, wrapping past December: [10, 11, 12, 1, 2, 3] → "Oct – Mar"; [3..6, 10..12] → "Mar – Jun, Oct – Dec". */
function monthRange(months: number[]): string {
  if (months.length === 0) return "Varies";
  if (months.length === 12) return "All year";
  const set = new Set(months);
  const next = (m: number) => (m === 12 ? 1 : m + 1);
  const starts = [...set].filter((m) => !set.has(m === 1 ? 12 : m - 1)).sort((a, b) => a - b);
  return starts
    .map((start) => {
      let end = start;
      while (set.has(next(end))) end = next(end);
      return end === start ? MONTHS[start - 1] : `${MONTHS[start - 1]} – ${MONTHS[end - 1]}`;
    })
    .join(", ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = resolve((await params).type);
  if (!t) return { title: "Not found" };
  return {
    title: `${themes[t].label} trips in India: free itineraries`,
    description: `${themes[t].blurb}. Free day-by-day ${themes[t].label.toLowerCase()} itineraries across India.`,
    alternates: { canonical: `/explore/${t}` },
  };
}

export default async function ExplorePage({ params }: Props) {
  const type = resolve((await params).type);
  if (!type) notFound();

  const theme = themes[type];
  const label = theme.label.toLowerCase();
  const all = await getPublishedCards();
  const cards = all.filter((c) => c.tourType === type);
  const cover = coverCard(all, type);
  const n = cards.length;

  const states = [...new Set(cards.map((c) => c.state))];
  const minDays = n ? Math.min(...cards.map((c) => c.minDays)) : 2;
  const maxDays = n ? Math.max(...cards.map((c) => c.dayCount)) : 6;
  const perMonth = MONTHS.map((_, i) => cards.filter((c) => c.bestMonths.includes(i + 1)).length);
  const peak = Math.max(1, Math.ceil(n / 2));
  const bestMonths = perMonth.flatMap((count, i) => (count >= peak ? [i + 1] : []));
  const monthIndex = Number(
    new Intl.DateTimeFormat("en-IN", { month: "numeric", timeZone: "Asia/Kolkata" }).format(new Date()),
  );
  const counts = new Map(TOUR_TYPES.map((t) => [t, all.filter((c) => c.tourType === t).length]));

  const facts = [
    {
      Icon: MapPin,
      value: `${n} ${n === 1 ? "place" : "places"}`,
      note: states.length > 2 ? `across ${states.length} states` : states.join(" & ") || "coming soon",
    },
    { Icon: CalendarDays, value: `${minDays}–${maxDays} days`, note: "day-by-day plans" },
    { Icon: Sun, value: monthRange(bestMonths), note: "best time to go" },
  ];

  return (
    <div style={themeVars(type)} className="flex min-h-screen flex-col bg-t-bg text-t-ink">
      <SiteHeader overlay />
      <main id="main" className="flex-1">
        <section className="relative overflow-hidden pt-16">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pt-10 pb-10 sm:px-6 lg:grid-cols-2 lg:pt-14">
            <div className="rise">
              <nav aria-label="Breadcrumb" className="text-sm text-t-muted">
                <Link href="/" className="hover:text-t-accent">
                  Home
                </Link>
                <span aria-hidden> / </span>
                <Link href="/destinations" className="hover:text-t-accent">
                  Trip types
                </Link>
                <span aria-hidden> / </span>
                <span aria-current="page" className="text-t-ink">
                  {theme.label}
                </span>
              </nav>
              <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-t-accent-soft px-3 py-1 text-xs font-semibold text-t-accent">
                {n} free {n === 1 ? "plan" : "plans"} · No sign-up
              </p>
              <h1 className="mt-5 text-4xl leading-[1.05] font-bold tracking-tight sm:text-6xl">
                {theme.label} trips, <span className="text-t-accent">planned free.</span>
              </h1>
              <p className="mt-5 max-w-lg text-lg text-t-muted">
                {theme.blurb}. Pick a place, choose how many days you have, and get a day-by-day plan with a map,
                weather and budget.
              </p>

              <ul className="mt-8 grid gap-3 sm:grid-cols-3">
                {facts.map(({ Icon, value, note }) => (
                  <li key={note} className="tactile-sm flex items-center gap-3 p-3 sm:flex-col sm:items-start">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-t-accent-soft text-t-accent">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span>
                      <span className="block font-bold">{value}</span>
                      <span className="block text-xs text-t-muted">{note}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                {n > 0 && (
                  <a
                    href="#plans"
                    className="inline-flex items-center gap-2 rounded-2xl bg-t-accent px-6 py-3 font-semibold text-t-accent-ink transition-transform active:scale-[0.98]"
                  >
                    See the {n} {n === 1 ? "plan" : "plans"} <ArrowDown className="size-4" aria-hidden />
                  </a>
                )}
                <Link href="/enquire" className="font-semibold text-t-accent hover:underline">
                  Ask for a custom plan
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rise">
                <SceneVisual type={type} name={cover?.name ?? theme.label} photo={cover?.heroImage} priority />
              </div>
              {cover && (
                <Link
                  href={`/destinations/${cover.slug}`}
                  className="tactile group absolute top-2 right-0 w-52 p-4 transition-transform hover:-translate-y-0.5 sm:right-4"
                >
                  <p className="text-xs font-semibold tracking-[0.18em] text-t-accent uppercase">Start here</p>
                  <p className="mt-1 text-xl font-bold">{cover.name}</p>
                  <p className="text-sm text-t-muted">{cover.tagline}</p>
                  <p className="mt-2 flex items-center gap-1 text-sm font-semibold text-t-accent">
                    View plan <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </p>
                </Link>
              )}
            </div>
          </div>

          <nav aria-label="Trip types" className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
            <ul className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible">
              {TOUR_TYPES.map((t) => {
                const on = t === type;
                return (
                  <li key={t} className="shrink-0">
                    <Link
                      href={`/explore/${t}`}
                      aria-current={on ? "page" : undefined}
                      className={`inline-block rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        on ? "bg-t-ink text-t-bg" : "tactile-sm text-t-muted hover:text-t-ink"
                      }`}
                    >
                      {themes[t].label}
                      <span className={on ? "ml-1.5 opacity-70" : "ml-1.5 opacity-60"}>{counts.get(t)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </section>

        <section id="plans" aria-labelledby="plans-heading" className="mx-auto max-w-7xl scroll-mt-6 px-4 py-12 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="plans-heading" className="text-3xl font-bold tracking-tight">
                {n > 0 ? `Free ${label} itineraries` : `${theme.label} plans are on the way`}
              </h2>
              <p className="mt-2 text-t-muted">
                {n > 0
                  ? "Our favourites first. Every plan works for 2 to 6 days, so pick the one that fits."
                  : "We're still checking these places. Tell us where you want to go and we'll plan it for you."}
              </p>
            </div>
            <Link href={`/destinations?type=${type}`} className="flex items-center gap-1 font-semibold text-t-accent">
              Filter by month or days <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          {n > 0 && (
            <div className="mt-8">
              <CardGrid cards={cards} />
            </div>
          )}
        </section>

        {n > 0 && (
          <section aria-labelledby="when-heading" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
            <h2 id="when-heading" className="text-3xl font-bold tracking-tight">
              When to go
            </h2>
            <p className="mt-2 text-t-muted">How many {label} plans are at their best each month. Tap a month to see them.</p>
            <ol className="tactile mt-8 grid grid-cols-6 gap-2 p-4 sm:grid-cols-12 sm:p-5">
              {MONTHS.map((m, i) => {
                const count = perMonth[i];
                const now = i + 1 === monthIndex;
                const bar = (
                  <>
                    <span className="flex h-16 w-full items-end overflow-hidden rounded-xl bg-t-accent-soft">
                      <span
                        className="w-full rounded-xl bg-t-accent transition-[height]"
                        style={{ height: `${(count / Math.max(1, n)) * 100}%`, opacity: count ? 1 : 0 }}
                      />
                    </span>
                    <span className={`mt-2 block text-sm ${now ? "font-bold text-t-ink" : "font-medium"}`}>{m}</span>
                    <span className="block text-xs text-t-muted">{count ? `${count} of ${n}` : "–"}</span>
                  </>
                );
                return (
                  <li key={m} className={`rounded-2xl p-1.5 text-center ${now ? "ring-2 ring-t-accent" : ""}`}>
                    {count > 0 ? (
                      <Link
                        href={`/destinations?type=${type}&month=${i + 1}`}
                        aria-label={`${count} ${label} ${count === 1 ? "plan" : "plans"} good in ${m}`}
                        className="block transition-transform hover:-translate-y-0.5"
                      >
                        {bar}
                      </Link>
                    ) : (
                      <div className="opacity-60">{bar}</div>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        <section aria-labelledby="more-heading" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <h2 id="more-heading" className="text-3xl font-bold tracking-tight">
            More ways to travel
          </h2>
          <p className="mt-2 text-t-muted">Every trip type has its own look, from tea hills to tiger country.</p>
          <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {TOUR_TYPES.filter((t) => t !== type).map((t) => (
              <li key={t}>
                <TypeTile type={t} count={counts.get(t) ?? 0} photo={coverCard(all, t)?.heroImage} />
              </li>
            ))}
            <li>
              <Link
                href="/destinations"
                className="group flex h-full min-h-40 flex-col justify-between rounded-3xl bg-t-accent-soft p-5 text-t-ink transition-transform hover:-translate-y-1"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-t-surface text-t-accent">
                  <Compass className="size-5" aria-hidden />
                </span>
                <p className="mt-6 text-lg font-bold">All {all.length} destinations</p>
                <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-t-accent">
                  Browse everything <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </p>
              </Link>
            </li>
          </ul>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-t-accent p-8 text-t-accent-ink sm:flex-row sm:items-center">
            <div>
              <p className="text-2xl font-bold">Want a {label} trip we haven&apos;t covered?</p>
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
