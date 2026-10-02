import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type { DayPlan, Experience, Photo } from "../types";
import { TOUR_TYPES } from "../types";

export const tourTypeEnum = pgEnum("tour_type", TOUR_TYPES);
export const enquiryStatusEnum = pgEnum("enquiry_status", ["new", "contacted", "converted", "closed"]);
export const userRoleEnum = pgEnum("user_role", ["admin", "editor"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("editor"),
  active: boolean("active").notNull().default(true),
  /** Bumped on password change or deactivation to invalidate existing sessions. */
  sessionVersion: integer("session_version").notNull().default(1),
  failedLogins: integer("failed_logins").notNull().default(0),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  ...timestamps,
});

/**
 * Itinerary content is document-shaped (days → stops), always read and written whole,
 * so it lives in JSONB validated by zod (lib/validation.ts) rather than child tables.
 */
export const destinations = pgTable(
  "destinations",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    state: text("state").notNull(),
    tagline: text("tagline").notNull(),
    summary: text("summary").notNull(),
    tourType: tourTypeEnum("tour_type").notNull(),
    lat: doublePrecision("lat").notNull(),
    lng: doublePrecision("lng").notNull(),
    bestTimeMonths: text("best_time_months").notNull(),
    bestTimeNote: text("best_time_note").notNull(),
    bestMonths: integer("best_months").array().notNull(),
    howToReach: text("how_to_reach").notNull(),
    budgetPerDay: jsonb("budget_per_day").$type<{ budget: string; mid: string; premium: string }>().notNull(),
    facts: jsonb("facts").$type<{ label: string; value: string }[]>().notNull(),
    experiences: jsonb("experiences").$type<Experience[]>().notNull(),
    days: jsonb("days").$type<DayPlan[]>().notNull(),
    minDays: integer("min_days").notNull().default(2),
    sceneImage: text("scene_image"),
    heroImage: jsonb("hero_image").$type<Photo>(),
    lastChecked: text("last_checked").notNull(),
    featured: boolean("featured").notNull().default(false),
    published: boolean("published").notNull().default(false),
    updatedBy: integer("updated_by").references(() => users.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (t) => [index("destinations_tour_type_idx").on(t.tourType), index("destinations_published_idx").on(t.published)],
);

export const enquiries = pgTable(
  "enquiries",
  {
    id: serial("id").primaryKey(),
    destinationSlug: text("destination_slug"),
    days: integer("days"),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    travelDate: text("travel_date"),
    people: integer("people"),
    budget: text("budget"),
    notes: text("notes"),
    status: enquiryStatusEnum("status").notNull().default("new"),
    adminNotes: text("admin_notes"),
    assignedTo: integer("assigned_to").references(() => users.id, { onDelete: "set null" }),
    /** Salted hash of the client IP, used only for rate limiting. */
    ipHash: text("ip_hash"),
    source: text("source"),
    ...timestamps,
  },
  (t) => [
    index("enquiries_status_idx").on(t.status),
    index("enquiries_created_idx").on(t.createdAt),
    index("enquiries_ip_idx").on(t.ipHash, t.createdAt),
  ],
);

export type UserRow = typeof users.$inferSelect;
export type DestinationRow = typeof destinations.$inferSelect;
export type EnquiryRow = typeof enquiries.$inferSelect;
export type EnquiryStatus = (typeof enquiryStatusEnum.enumValues)[number];
export type UserRole = (typeof userRoleEnum.enumValues)[number];
