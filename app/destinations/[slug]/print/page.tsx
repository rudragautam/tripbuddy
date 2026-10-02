import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PrintButton from "@/components/Planner/PrintButton";
import { getPublishedDestination } from "@/lib/data/destinations";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ days?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const d = await getPublishedDestination(slug);
  return { title: d ? `${d.name} itinerary (print)` : "Not found", robots: { index: false } };
}

/** Plain, ink-friendly version of the itinerary. "Save as PDF" in the print dialog gives the PDF. */
export default async function PrintPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { days: raw } = await searchParams;
  const d = await getPublishedDestination(slug);
  if (!d) notFound();
  const n = Number(raw);
  const days = Number.isInteger(n) ? Math.min(Math.max(n, d.minDays), d.days.length) : Math.min(3, d.days.length);

  return (
    <main className="mx-auto max-w-3xl bg-white px-6 py-10 text-[15px] leading-relaxed text-neutral-900 print:px-0 print:py-0">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <p className="text-sm text-neutral-500">Use “Save as PDF” in the print dialog to download.</p>
        <PrintButton />
      </div>

      <p className="text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase">
        {site.name} · Free trip plan
      </p>
      <h1 className="mt-1 text-3xl font-bold">
        {days}-day {d.name} itinerary
      </h1>
      <p className="text-neutral-600">
        {d.state} · Best time {d.bestTime.months} · Last checked {d.lastChecked}
      </p>

      <section className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-neutral-200 p-4 text-sm">
        <div>
          <p className="font-semibold">How to reach</p>
          <p className="text-neutral-700">{d.howToReach}</p>
        </div>
        <div>
          <p className="font-semibold">Rough budget per person, per day</p>
          <p className="text-neutral-700">
            Budget {d.budgetPerDay.budget} · Mid {d.budgetPerDay.mid} · Premium {d.budgetPerDay.premium}
          </p>
        </div>
      </section>

      <ol className="mt-6 space-y-5">
        {d.days.slice(0, days).map((day, i) => (
          <li key={day.title} className="break-inside-avoid border-l-4 border-neutral-300 pl-4">
            <h2 className="text-lg font-bold">
              Day {i + 1}: {day.title}
            </h2>
            <p>
              <strong>Morning.</strong> {day.morning}
            </p>
            <p>
              <strong>Afternoon.</strong> {day.afternoon}
            </p>
            <p>
              <strong>Evening.</strong> {day.evening}
            </p>
            <p className="text-sm text-neutral-600">
              Stay: {day.stay} · Stops: {day.stops.map((s) => s.name).join(", ")}
            </p>
            {day.tip && <p className="text-sm text-neutral-600">Tip: {day.tip}</p>}
          </li>
        ))}
      </ol>

      <p className="mt-8 border-t border-neutral-200 pt-4 text-sm text-neutral-600">
        Want help booking? Enquire free at {site.url}/enquire
        {site.whatsapp ? ` or WhatsApp +${site.whatsapp}` : ""}. Check timings, permits and road conditions before you
        travel.
      </p>
    </main>
  );
}
