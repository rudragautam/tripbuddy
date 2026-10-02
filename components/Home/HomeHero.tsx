"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import SceneVisual from "@/components/Scene/SceneVisual";
import { themeVars, themes } from "@/lib/themes";
import { TOUR_TYPES, type Photo, type TourType } from "@/lib/types";

export type HeroOption = {
  slug: string;
  name: string;
  state: string;
  tagline: string;
  tourType: TourType;
  minDays: number;
  dayCount: number;
  heroImage?: Photo;
};

export default function HomeHero({ options }: { options: HeroOption[] }) {
  const router = useRouter();
  const [slug, setSlug] = useState(options[0]?.slug ?? "");
  const [days, setDays] = useState(3);
  const current = options.find((o) => o.slug === slug) ?? options[0];
  const types = TOUR_TYPES.filter((t) => options.some((o) => o.tourType === t));

  if (!current) return null;
  const dayOptions = Array.from({ length: current.dayCount - current.minDays + 1 }, (_, i) => current.minDays + i);
  const safeDays = Math.min(Math.max(days, current.minDays), current.dayCount);

  return (
    <section
      style={themeVars(current.tourType)}
      className="relative overflow-hidden bg-t-bg pt-16 text-t-ink transition-colors duration-500"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pt-10 pb-16 sm:px-6 lg:grid-cols-2 lg:pt-14">
        <div className="rise">
          <p className="inline-flex items-center gap-2 rounded-full bg-t-accent-soft px-3 py-1 text-xs font-semibold text-t-accent">
            Free · No sign-up · No payment
          </p>
          <h1 className="mt-5 text-4xl leading-[1.05] font-bold tracking-tight sm:text-6xl">
            Your trip to anywhere in India, <span className="text-t-accent">planned free.</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-t-muted">
            Pick a place and how many days you have. Get a day-by-day plan with a map, weather and budget. Need help
            booking? Just ask.
          </p>

          <form
            className="tactile mt-8 flex flex-col gap-2 p-2 sm:flex-row sm:items-center"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/destinations/${current.slug}?days=${safeDays}`);
            }}
          >
            <label className="flex flex-1 items-center gap-2 rounded-2xl px-4 py-3 sm:py-2">
              <MapPin className="size-4 shrink-0 text-t-accent" aria-hidden />
              <span className="sr-only">Destination</span>
              <select
                value={current.slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full min-w-0 bg-transparent font-semibold outline-none"
              >
                {types.map((t) => (
                  <optgroup key={t} label={themes[t].label}>
                    {options
                      .filter((o) => o.tourType === t)
                      .map((o) => (
                        <option key={o.slug} value={o.slug}>
                          {o.name}, {o.state}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 rounded-2xl px-4 py-3 sm:border-l sm:border-black/10 sm:py-2">
              <CalendarDays className="size-4 shrink-0 text-t-accent" aria-hidden />
              <span className="sr-only">Number of days</span>
              <select
                value={safeDays}
                onChange={(e) => setDays(Number(e.target.value))}
                className="bg-transparent font-semibold outline-none"
              >
                {dayOptions.map((n) => (
                  <option key={n} value={n}>
                    {n} days
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-t-accent px-6 py-3 font-semibold text-t-accent-ink transition-transform active:scale-[0.98]"
            >
              Get my free plan <ArrowRight className="size-4" aria-hidden />
            </button>
          </form>

          <div role="group" aria-label="Preview a trip type" className="mt-6 flex flex-wrap gap-2">
            {types.map((t) => {
              const on = current.tourType === t;
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSlug(options.find((o) => o.tourType === t)!.slug)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    on ? "bg-t-ink text-t-bg" : "tactile-sm text-t-muted hover:text-t-ink"
                  }`}
                >
                  {themes[t].label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <div key={current.slug} className="rise">
            <SceneVisual type={current.tourType} name={current.name} photo={current.heroImage} priority />
          </div>
          <div className="tactile absolute top-2 right-0 w-48 p-4 sm:right-4" aria-live="polite">
            <p className="text-xs font-semibold tracking-[0.18em] text-t-accent uppercase">{current.state}</p>
            <p className="mt-1 text-xl font-bold">{current.name}</p>
            <p className="text-sm text-t-muted">{current.tagline}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
