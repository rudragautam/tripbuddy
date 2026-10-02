import { z } from "zod";
import { EXPERIENCE_ICONS, MAX_DAYS, MIN_DAYS, TOUR_TYPES } from "./types";

const text = (max: number) => z.string().trim().min(1, "Required").max(max);

/** Remote photo hosts the site can optimise (keep in sync with images.remotePatterns in next.config.ts). */
export const PHOTO_HOSTS = ["upload.wikimedia.org", "images.unsplash.com", "res.cloudinary.com"];

function allowedPhotoSrc(v: string) {
  if (v.startsWith("/") && !v.startsWith("//")) return true;
  try {
    const u = new URL(v);
    return u.protocol === "https:" && PHOTO_HOSTS.includes(u.hostname);
  } catch {
    return false;
  }
}

export const photoSchema = z.object({
  src: z
    .string()
    .trim()
    .min(1)
    .max(500)
    .refine(allowedPhotoSrc, `Use a /path, or an https URL on ${PHOTO_HOSTS.join(", ")}`),
  alt: z.string().trim().max(200),
  width: z.coerce.number().int().positive(),
  height: z.coerce.number().int().positive(),
  author: z.string().trim().min(1, "Photo credit is required").max(200),
  license: z.string().trim().min(1, "Photo licence is required").max(80),
  licenseUrl: z.string().trim().max(500).optional(),
  sourceUrl: z.string().trim().max(500).optional(),
});

export const stopSchema = z.object({
  name: text(80),
  lat: z.coerce.number().min(6).max(37.5, "Latitude must be inside India"),
  lng: z.coerce.number().min(68).max(97.5, "Longitude must be inside India"),
  image: photoSchema.optional(),
});

export const daySchema = z.object({
  title: text(80),
  morning: text(400),
  afternoon: text(400),
  evening: text(400),
  stay: text(80),
  tip: z
    .string()
    .trim()
    .max(300)
    .optional()
    .transform((v) => (v ? v : undefined)),
  stops: z.array(stopSchema).min(1, "Add at least one stop").max(6),
});

export const experienceSchema = z.object({
  name: text(60),
  duration: text(30),
  icon: z.enum(EXPERIENCE_ICONS),
});

export const destinationSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .min(2)
      .max(60)
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens"),
    name: text(60),
    state: text(60),
    tagline: text(60),
    summary: text(200),
    tourType: z.enum(TOUR_TYPES),
    lat: z.coerce.number().min(6).max(37.5),
    lng: z.coerce.number().min(68).max(97.5),
    bestTime: z.object({ months: text(60), note: text(300) }),
    bestMonths: z.array(z.coerce.number().int().min(1).max(12)).min(1, "Pick at least one month"),
    howToReach: text(500),
    budgetPerDay: z.object({ budget: text(30), mid: text(30), premium: text(30) }),
    facts: z.array(z.object({ label: text(24), value: text(30) })).min(1).max(4),
    experiences: z.array(experienceSchema).min(1).max(6),
    days: z.array(daySchema).min(MIN_DAYS).max(MAX_DAYS),
    minDays: z.coerce.number().int().min(MIN_DAYS).max(MAX_DAYS),
    sceneImage: z
      .string()
      .trim()
      .max(500)
      .optional()
      .transform((v) => (v ? v : undefined))
      .refine((v) => !v || v.startsWith("/") || v.startsWith("https://"), "Use a /path or https:// URL"),
    heroImage: photoSchema.optional(),
    lastChecked: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
    featured: z.boolean().default(false),
    published: z.boolean().default(false),
  })
  .refine((d) => d.days.length >= d.minDays, {
    message: "Write at least as many days as the minimum trip length",
    path: ["days"],
  });

export type DestinationInput = z.infer<typeof destinationSchema>;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

export const enquirySchema = z.object({
  place: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z
      .string()
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Unknown destination")
      .max(60)
      .optional(),
  ),
  days: z.preprocess((v) => (v === "" || v == null ? undefined : v), z.coerce.number().int().min(1).max(60).optional()),
  name: z.string().trim().min(2, "Please tell us your name.").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s-]{8,18}$/, "Please enter a phone or WhatsApp number we can reach you on."),
  email: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.string().trim().email("That email doesn't look right.").max(120).optional(),
  ),
  travelDate: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
  ),
  people: z.preprocess((v) => (v === "" || v == null ? undefined : v), z.coerce.number().int().min(1).max(100).optional()),
  budget: z.enum(["budget", "mid", "premium"]).optional(),
  notes: optionalText(1500),
  consent: z.literal("on", { message: "Please agree so we can contact you." }),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

/** Readable "field: message" list from a zod error. */
export function formatIssues(error: z.ZodError): string[] {
  return error.issues.map((i) => (i.path.length ? `${i.path.join(" › ")}: ${i.message}` : i.message));
}
