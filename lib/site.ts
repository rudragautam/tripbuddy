/** Public site settings, configurable per environment. */
export const site = {
  name: "TripBuddy",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  /** International format without "+", e.g. 919800000000. Empty hides WhatsApp links. */
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, ""),
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
};

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;
