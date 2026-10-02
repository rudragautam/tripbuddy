import type { Destination, TourType } from "./types";

/** Everything a listing card needs (no day-by-day content). */
export type DestinationCard = Pick<
  Destination,
  | "slug"
  | "name"
  | "state"
  | "tagline"
  | "summary"
  | "tourType"
  | "bestTime"
  | "bestMonths"
  | "minDays"
  | "featured"
  | "heroImage"
> & { dayCount: number };

export type CardFilters = { q?: string; type?: TourType; month?: number; days?: number; state?: string };

/** Filtering happens in memory: the catalogue is small (hundreds, not millions) and already cached. */
export function filterCards(cards: DestinationCard[], f: CardFilters) {
  const q = f.q?.trim().toLowerCase();
  return cards.filter(
    (c) =>
      (!q || `${c.name} ${c.state} ${c.tagline} ${c.summary}`.toLowerCase().includes(q)) &&
      (!f.type || c.tourType === f.type) &&
      (!f.month || c.bestMonths.includes(f.month)) &&
      (!f.days || (f.days >= c.minDays && f.days <= c.dayCount)) &&
      (!f.state || c.state === f.state),
  );
}
