import type { Metadata } from "next";
import Link from "next/link";
import { CardGrid } from "@/components/Destination/DestinationCard";
import { SiteFooter, SiteHeader } from "@/components/Site/SiteChrome";
import { filterCards, getPublishedCards } from "@/lib/data/destinations";
import { MONTHS } from "@/lib/site";
import { themes } from "@/lib/themes";
import { MAX_DAYS, MIN_DAYS, TOUR_TYPES, type TourType } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All destinations: free itineraries across India",
  description: "Browse free 2 to 6 day itineraries for hills, beaches, deserts, heritage cities, wildlife parks and more.",
  alternates: { canonical: "/destinations" },
};

type Search = { q?: string; type?: string; month?: string; days?: string };

const select =
  "w-full rounded-2xl border border-black/10 bg-t-surface px-4 py-3 text-sm outline-none focus:border-t-accent focus:ring-2 focus:ring-t-accent-soft";

export default async function DestinationsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const type = TOUR_TYPES.includes(sp.type as TourType) ? (sp.type as TourType) : undefined;
  const month = Number(sp.month) >= 1 && Number(sp.month) <= 12 ? Number(sp.month) : undefined;
  const days = Number(sp.days) >= MIN_DAYS && Number(sp.days) <= MAX_DAYS ? Number(sp.days) : undefined;
  const q = sp.q?.slice(0, 60);

  const all = await getPublishedCards();
  const cards = filterCards(all, { q, type, month, days });
  const filtered = Boolean(q || type || month || days);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Free trip plans across India</h1>
        <p className="mt-2 text-t-muted">
          {all.length} destinations, each with 2 to 6 day itineraries. Pick one, choose your days, and go.
        </p>

        <form method="get" className="tactile mt-8 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5" role="search">
          <label className="lg:col-span-2">
            <span className="sr-only">Search</span>
            <input name="q" defaultValue={q} placeholder="Search a place or state…" className={select} />
          </label>
          <label>
            <span className="sr-only">Trip type</span>
            <select name="type" defaultValue={type ?? ""} className={select}>
              <option value="">Any trip type</option>
              {TOUR_TYPES.map((t) => (
                <option key={t} value={t}>
                  {themes[t].label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Travel month</span>
            <select name="month" defaultValue={month ?? ""} className={select}>
              <option value="">Any month</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>
                  Good in {m}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-2">
            <label className="flex-1">
              <span className="sr-only">Days</span>
              <select name="days" defaultValue={days ?? ""} className={select}>
                <option value="">Any length</option>
                {Array.from({ length: MAX_DAYS - MIN_DAYS + 1 }, (_, i) => MIN_DAYS + i).map((n) => (
                  <option key={n} value={n}>
                    {n} days
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="rounded-2xl bg-t-accent px-5 text-sm font-semibold text-t-accent-ink">
              Go
            </button>
          </div>
        </form>

        <div className="mt-8 mb-4 flex items-center justify-between text-sm text-t-muted">
          <p aria-live="polite">
            {cards.length} {cards.length === 1 ? "destination" : "destinations"}
            {filtered ? " match" : ""}
          </p>
          {filtered && (
            <Link href="/destinations" className="font-semibold text-t-accent">
              Clear filters
            </Link>
          )}
        </div>

        {cards.length > 0 ? (
          <CardGrid cards={cards} days={days} />
        ) : (
          <div className="tactile p-8 text-center">
            <p className="text-lg font-semibold">No plans match yet</p>
            <p className="mt-1 text-t-muted">
              Try fewer filters, or tell us where you want to go and we&apos;ll plan it for you, free.
            </p>
            <Link href="/enquire" className="mt-4 inline-block font-semibold text-t-accent">
              Ask for a custom plan →
            </Link>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
