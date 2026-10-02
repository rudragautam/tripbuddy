export const MIN_DAYS = 2;
export const MAX_DAYS = 6;

export const TOUR_TYPES = [
  "hills",
  "mountain",
  "desert",
  "beach",
  "backwaters",
  "heritage",
  "wildlife",
  "snow",
] as const;
export type TourType = (typeof TOUR_TYPES)[number];

export const EXPERIENCE_ICONS = [
  "train",
  "sunrise",
  "leaf",
  "camel",
  "castle",
  "tent",
  "waves",
  "church",
  "fish",
  "mountain",
  "boat",
  "temple",
  "camera",
  "bike",
  "ski",
  "binoculars",
  "food",
  "hike",
  "shopping",
  "music",
] as const;
export type ExperienceIcon = (typeof EXPERIENCE_ICONS)[number];

/** A real photo with the attribution its licence requires. */
export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  author: string;
  license: string;
  licenseUrl?: string;
  sourceUrl?: string;
};

export type Stop = {
  name: string;
  lat: number;
  lng: number;
  image?: Photo;
};

export type DayPlan = {
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  stay: string;
  tip?: string;
  stops: Stop[];
};

export type Experience = {
  name: string;
  duration: string;
  icon: ExperienceIcon;
};

export type Destination = {
  slug: string;
  name: string;
  state: string;
  tagline: string;
  /** 1–2 sentence intro used on cards and in search results */
  summary: string;
  tourType: TourType;
  lat: number;
  lng: number;
  bestTime: { months: string; note: string };
  /** Month numbers 1–12 that are good to visit; drives the season filter */
  bestMonths: number[];
  howToReach: string;
  budgetPerDay: { budget: string; mid: string; premium: string };
  facts: { label: string; value: string }[];
  experiences: Experience[];
  /** Ordered day pool. An N-day itinerary uses the first N days. */
  days: DayPlan[];
  minDays: number;
  /** Optional rendered 3D scene; falls back to the theme's illustrated diorama. */
  sceneImage?: string;
  /** Real landmark photo used for the hero slab, cards and sharing. */
  heroImage?: Photo;
  /** ISO date (YYYY-MM-DD) the plan was last checked */
  lastChecked: string;
  featured?: boolean;
  published?: boolean;
};
