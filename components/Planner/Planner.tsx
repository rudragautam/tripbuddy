"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ArrowRight, Heart, Printer } from "lucide-react";
import type { Destination } from "@/lib/types";
import { useSaved } from "@/components/Destination/useSaved";
import TripPass from "./TripPass";
import MapCard from "./MapCard";
import DaySwitcher from "./DaySwitcher";
import DayTimeline from "./DayTimeline";
import { BestTimeCard, ExperiencesCard, FactsBar, PracticalCard } from "./InfoCards";
import { BottomNav, SideNav } from "./Navs";

/**
 * Destination dashboard. On mobile the two columns dissolve (display: contents)
 * so `order-*` can interleave cards; on desktop they are real columns.
 */
export default function Planner({
  destination,
  initialDays,
  weather,
  scene,
  related,
  whatsapp,
}: {
  destination: Destination;
  initialDays: number;
  weather: ReactNode;
  scene: ReactNode;
  related: ReactNode;
  whatsapp: string;
}) {
  const [days, setDays] = useState(initialDays);
  const [activeDay, setActiveDay] = useState(0);
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(destination.slug);
  const plan = destination.days.slice(0, days);
  const enquireHref = `/enquire?place=${destination.slug}&days=${days}`;

  function changeDays(n: number) {
    setDays(n);
    setActiveDay((d) => Math.min(d, n - 1));
    const url = new URL(window.location.href);
    url.searchParams.set("days", String(n));
    window.history.replaceState(null, "", url);
  }

  const waText = encodeURIComponent(
    `Hi TripBuddy! I'm looking at the ${days}-day ${destination.name} plan and would like help booking it.`,
  );

  return (
    <>
      <SideNav enquireHref={enquireHref} />

      <main id="main" className="mx-auto max-w-7xl px-4 pt-6 pb-32 sm:px-6 lg:pl-28">
        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-12 lg:items-start lg:gap-6">
          {/* left column */}
          <div className="contents lg:col-span-7 lg:flex lg:flex-col lg:gap-6">
            <header className="rise order-1 flex flex-wrap items-end justify-between gap-4 lg:order-none">
              <div>
                <nav aria-label="Breadcrumb" className="text-sm text-t-muted">
                  <Link href="/" className="hover:text-t-accent">
                    TripBuddy
                  </Link>{" "}
                  /{" "}
                  <Link href={`/explore/${destination.tourType}`} className="hover:text-t-accent">
                    {destination.state}
                  </Link>
                </nav>
                <p className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Hello, Explorer 👋</p>
                <p className="text-t-muted">How many days do you have?</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <DaySwitcher
                  min={destination.minDays}
                  max={destination.days.length}
                  value={days}
                  onChange={changeDays}
                />
                <button
                  type="button"
                  onClick={() => toggle(destination.slug)}
                  aria-pressed={saved}
                  aria-label={saved ? "Remove from saved trips" : "Save this trip"}
                  className="tactile-sm grid size-11 place-items-center"
                >
                  <Heart className={`size-5 ${saved ? "fill-t-accent text-t-accent" : "text-t-muted"}`} aria-hidden />
                </button>
                <a
                  href={`/destinations/${destination.slug}/print?days=${days}`}
                  target="_blank"
                  rel="noopener"
                  aria-label="Print or save as PDF"
                  className="tactile-sm grid size-11 place-items-center text-t-muted"
                >
                  <Printer className="size-5" aria-hidden />
                </a>
              </div>
            </header>

            <div className="rise order-2 lg:order-none" style={{ animationDelay: "60ms" }}>
              <TripPass destination={destination} days={days} />
            </div>

            <div className="rise relative order-3 lg:order-none" style={{ animationDelay: "120ms" }}>
              <div className="-mx-2 sm:mx-0">{scene}</div>
              <div className="mt-4 lg:absolute lg:bottom-2 lg:left-0 lg:mt-0 lg:w-64">
                <BestTimeCard destination={destination} />
              </div>
            </div>

            <section id="plan" aria-labelledby="plan-heading" className="order-5 scroll-mt-6 lg:order-none">
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <h1 id="plan-heading" className="text-xl font-bold tracking-tight">
                  {days}-day {destination.name} itinerary
                </h1>
                <span className="text-xs text-t-muted">Last checked {formatDate(destination.lastChecked)}</span>
              </div>
              <DayTimeline days={plan} activeDay={activeDay} onSelectDay={setActiveDay} />
            </section>
          </div>

          {/* right column */}
          <div className="contents lg:col-span-5 lg:flex lg:flex-col lg:gap-6">
            <div className="rise order-6 lg:order-none" style={{ animationDelay: "90ms" }}>
              {weather}
            </div>
            <div className="rise order-4 lg:order-none" style={{ animationDelay: "150ms" }}>
              <MapCard place={destination.name} days={plan} activeDay={activeDay} onSelectDay={setActiveDay} />
            </div>
            <div className="order-7 lg:order-none">
              <ExperiencesCard destination={destination} />
            </div>
            <div className="order-8 lg:order-none">
              <PracticalCard destination={destination} />
            </div>
            <div className="order-9 lg:order-none">
              <FactsBar destination={destination} />
            </div>
            <section className="order-10 rounded-3xl bg-t-accent p-6 text-t-accent-ink lg:order-none">
              <h2 className="text-lg font-bold">Like this plan?</h2>
              <p className="mt-1 text-sm opacity-90">
                Planning is free and always will be. If you want help with hotels, cabs or tickets, ask us. There&apos;s
                nothing to pay to enquire.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={enquireHref}
                  className="inline-flex items-center gap-2 rounded-full bg-t-surface px-5 py-3 text-sm font-semibold text-t-ink"
                >
                  Help me book this <ArrowRight className="size-4" aria-hidden />
                </Link>
                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp}?text=${waText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-white/50 px-5 py-3 text-sm font-semibold"
                  >
                    WhatsApp us
                  </a>
                )}
              </div>
            </section>
          </div>

          <div className="order-11 lg:col-span-12">{related}</div>
        </div>
      </main>

      <BottomNav enquireHref={enquireHref} title={`${days}-day ${destination.name} trip plan · TripBuddy`} />
    </>
  );
}

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}
