"use client";

import Link from "next/link";
import type { DestinationCard as Card } from "@/lib/catalog";
import { CardGrid } from "./DestinationCard";
import { useSaved } from "./useSaved";

export default function SavedList({ cards }: { cards: Card[] }) {
  const { saved } = useSaved();
  const list = cards.filter((c) => saved.includes(c.slug));

  if (list.length === 0) {
    return (
      <div className="tactile p-8 text-center">
        <p className="text-lg font-semibold">Nothing saved yet</p>
        <p className="mt-1 text-t-muted">Tap the heart on any trip plan to keep it here. Saved trips stay in this browser.</p>
        <Link href="/destinations" className="mt-4 inline-block font-semibold text-t-accent">
          Browse destinations →
        </Link>
      </div>
    );
  }
  return <CardGrid cards={list} />;
}
