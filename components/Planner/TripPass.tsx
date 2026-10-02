import Image from "next/image";
import { CalendarDays, Gift, Wallet } from "lucide-react";
import type { Destination } from "@/lib/types";
import { themes } from "@/lib/themes";

/** The "safari pass" card, reworked as a free trip plan: no barcode, no price. */
export default function TripPass({ destination, days }: { destination: Destination; days: number }) {
  const theme = themes[destination.tourType];

  return (
    <section className="tactile flex overflow-hidden">
      <div className="flex-1 p-5 sm:p-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-t-accent uppercase">Free trip plan</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{destination.name}</h1>
        <p className="mt-1 text-t-muted">{destination.tagline}</p>

        <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
          <div>
            <dt className="flex items-center gap-1.5 font-semibold">
              <CalendarDays className="size-4 text-t-accent" aria-hidden /> {days} Days
            </dt>
            <dd className="text-xs text-t-muted">Itinerary</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 font-semibold">
              <Wallet className="size-4 text-t-accent" aria-hidden /> {destination.budgetPerDay.budget.split("–")[0]}+
            </dt>
            <dd className="text-xs text-t-muted">Per day</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 font-semibold">
              <Gift className="size-4 text-t-accent" aria-hidden /> Free
            </dt>
            <dd className="text-xs text-t-muted">No sign-up</dd>
          </div>
        </dl>
      </div>

      {/* ticket stub */}
      <div
        className="relative hidden w-36 shrink-0 flex-col items-center justify-end gap-2 overflow-visible border-l-2 border-dashed border-white/60 pb-4 sm:flex"
        style={{ background: `linear-gradient(180deg, ${theme.accentSoft}, ${theme.accent})` }}
      >
        {destination.heroImage && (
          <>
            <Image src={destination.heroImage.src} alt="" fill sizes="144px" className="object-cover" />
            <span className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/55" aria-hidden />
          </>
        )}
        <span className="absolute -top-3 -left-3 z-10 size-6 rounded-full bg-t-bg" aria-hidden />
        <span className="absolute -bottom-3 -left-3 z-10 size-6 rounded-full bg-t-bg" aria-hidden />
        <span className="relative rotate-[-8deg] rounded-md border-2 border-white/90 px-2 py-1 text-[10px] font-bold tracking-widest text-white uppercase">
          No payment
        </span>
        <span className="relative text-[10px] font-semibold tracking-[0.2em] text-white/90 uppercase">{destination.state}</span>
      </div>
    </section>
  );
}
