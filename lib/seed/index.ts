import type { Destination, Photo } from "../types";
import { core } from "./core";
import { east } from "./east";
import { extraCoast } from "./extra-coast";
import { extraHeritage } from "./extra-heritage";
import { extraHills } from "./extra-hills";
import imagesJson from "./images.json";
import { north } from "./north";
import { south } from "./south";
import { west } from "./west";

/** Photos fetched from Wikimedia Commons by `npm run images:fetch`. */
const images = imagesJson as Record<string, { hero?: Photo; stops: Record<string, Photo> }>;

function withImages(d: Destination): Destination {
  const found = images[d.slug];
  if (!found) return d;
  return {
    ...d,
    heroImage: d.heroImage ?? found.hero,
    days: d.days.map((day) => ({
      ...day,
      stops: day.stops.map((s) => ({ ...s, image: s.image ?? found.stops[s.name] })),
    })),
  };
}

/** Text content only (no photos): what the writers produced. */
export const seedContent: Destination[] = [
  ...core,
  ...north,
  ...south,
  ...west,
  ...east,
  ...extraHills,
  ...extraHeritage,
  ...extraCoast,
];

export const seedDestinations: Destination[] = seedContent.map(withImages);
