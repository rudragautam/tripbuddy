import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SceneVisual from "@/components/Scene/SceneVisual";
import type { DestinationCard as Card } from "@/lib/catalog";
import { themeVars, themes } from "@/lib/themes";

export default function DestinationCard({ card, days }: { card: Card; days?: number }) {
  const href = days ? `/destinations/${card.slug}?days=${days}` : `/destinations/${card.slug}`;
  return (
    <div style={themeVars(card.tourType)} className="h-full">
      <Link
        href={href}
        className="group flex h-full flex-col rounded-3xl bg-t-bg p-4 text-t-ink transition-transform hover:-translate-y-1 focus-visible:-translate-y-1"
      >
        <div className="px-1 pt-2 pb-3">
          <SceneVisual
            type={card.tourType}
            name={card.name}
            photo={card.heroImage}
            compact
            showCredit={false}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          />
        </div>
        <div className="tactile -mt-4 flex flex-1 flex-col p-5">
          <p className="text-xs font-semibold tracking-[0.18em] text-t-accent uppercase">
            {themes[card.tourType].label} · {card.state}
          </p>
          <h3 className="mt-1 text-xl font-bold">{card.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-t-muted">{card.summary}</p>
          <div className="mt-auto flex items-center justify-between pt-4 text-sm">
            <span className="text-t-muted">
              {card.minDays}–{card.dayCount} day plans · Best {card.bestTime.months.split(",")[0]}
            </span>
            <ArrowRight className="size-4 text-t-accent transition-transform group-hover:translate-x-1" aria-hidden />
          </div>
        </div>
      </Link>
    </div>
  );
}

export function CardGrid({ cards, days }: { cards: Card[]; days?: number }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <li key={c.slug}>
          <DestinationCard card={c} days={days} />
        </li>
      ))}
    </ul>
  );
}
