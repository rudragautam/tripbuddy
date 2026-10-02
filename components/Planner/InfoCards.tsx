import {
  Bike,
  Binoculars,
  Bookmark,
  Camera,
  Castle,
  Church,
  Fish,
  Footprints,
  Landmark,
  Leaf,
  Mountain,
  MountainSnow,
  Music,
  Plane,
  Sailboat,
  ShoppingBag,
  Sunrise,
  Tent,
  TrainFront,
  UtensilsCrossed,
  Waves,
} from "lucide-react";
import type { Destination, ExperienceIcon } from "@/lib/types";

const experienceIcons: Record<ExperienceIcon, typeof Leaf> = {
  train: TrainFront,
  sunrise: Sunrise,
  leaf: Leaf,
  camel: Footprints,
  castle: Castle,
  tent: Tent,
  waves: Waves,
  church: Church,
  fish: Fish,
  mountain: Mountain,
  boat: Sailboat,
  temple: Landmark,
  camera: Camera,
  bike: Bike,
  ski: MountainSnow,
  binoculars: Binoculars,
  food: UtensilsCrossed,
  hike: Footprints,
  shopping: ShoppingBag,
  music: Music,
};

export function BestTimeCard({ destination }: { destination: Destination }) {
  return (
    <section className="tactile p-5">
      <h2 className="font-semibold">Best time to visit</h2>
      <p className="mt-1 font-semibold text-t-accent">{destination.bestTime.months}</p>
      <p className="mt-1 text-sm leading-relaxed text-t-muted">{destination.bestTime.note}</p>
    </section>
  );
}

export function ExperiencesCard({ destination }: { destination: Destination }) {
  return (
    <section className="tactile p-5">
      <h2 className="font-semibold">Top experiences</h2>
      <ul className="mt-3 space-y-2.5">
        {destination.experiences.map((e) => {
          const Icon = experienceIcons[e.icon];
          return (
            <li key={e.name} className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-t-accent-soft text-t-accent">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{e.name}</span>
                <span className="block text-xs text-t-muted">{e.duration}</span>
              </span>
              <Bookmark className="size-4 text-t-muted" aria-hidden />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function FactsBar({ destination }: { destination: Destination }) {
  return (
    <section className="tactile p-5">
      <h2 className="text-xs font-semibold tracking-[0.18em] text-t-muted uppercase">
        {destination.name}, {destination.state}
      </h2>
      <dl className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {destination.facts.map((f) => (
          <div key={f.label}>
            <dt className="text-xs text-t-muted">{f.label}</dt>
            <dd className="font-semibold">{f.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function PracticalCard({ destination }: { destination: Destination }) {
  const b = destination.budgetPerDay;
  return (
    <section className="tactile space-y-4 p-5">
      <div>
        <h2 className="flex items-center gap-2 font-semibold">
          <Plane className="size-4 text-t-accent" aria-hidden /> How to reach
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-t-muted">{destination.howToReach}</p>
      </div>
      <div>
        <h2 className="font-semibold">Rough budget per person, per day</h2>
        <dl className="mt-2 grid grid-cols-3 gap-2 text-center">
          {(
            [
              ["Budget", b.budget],
              ["Mid", b.mid],
              ["Premium", b.premium],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-t-bg px-2 py-3">
              <dt className="text-xs text-t-muted">{label}</dt>
              <dd className="text-sm font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
