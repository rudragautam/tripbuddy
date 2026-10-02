"use server";

import { createHash } from "node:crypto";
import { and, eq, gte, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { after } from "next/server";
import { getDb } from "@/lib/db";
import { enquiries } from "@/lib/db/schema";
import { notifyNewEnquiry } from "@/lib/notify";
import { enquirySchema } from "@/lib/validation";

export type EnquiryState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  /** Submitted values, echoed back so a failed submit never wipes what the visitor typed. */
  values?: Record<string, string>;
  name?: string;
};

const WINDOW_MINUTES = 10;
const MAX_PER_WINDOW = 3;

export async function submitEnquiry(_prev: EnquiryState, form: FormData): Promise<EnquiryState> {
  // Honeypot: real people never see or fill this field.
  if (String(form.get("company") ?? "").trim()) return { ok: true, name: "there" };

  const raw = Object.fromEntries(form);
  const values = Object.fromEntries(
    Object.entries(raw)
      .filter(([k, v]) => typeof v === "string" && k !== "company" && !k.startsWith("$ACTION"))
      .map(([k, v]) => [k, String(v).slice(0, 2000)]),
  );
  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors, values };
  }
  const v = parsed.data;

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const ipHash = createHash("sha256")
    .update(`${process.env.AUTH_SECRET ?? "dev"}:${ip}`)
    .digest("hex")
    .slice(0, 32);

  const db = await getDb();
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000);
  const [{ recent }] = await db
    .select({ recent: sql<number>`count(*)::int` })
    .from(enquiries)
    .where(and(eq(enquiries.ipHash, ipHash), gte(enquiries.createdAt, since)));
  if (recent >= MAX_PER_WINDOW) {
    return { ok: false, error: "We've already received a few enquiries from you. We'll be in touch shortly.", values };
  }

  const [row] = await db
    .insert(enquiries)
    .values({
      destinationSlug: v.place ?? null,
      days: v.days ?? null,
      name: v.name,
      phone: v.phone,
      email: v.email ?? null,
      travelDate: v.travelDate ?? null,
      people: v.people ?? null,
      budget: v.budget ?? null,
      notes: v.notes ?? null,
      ipHash,
      source: String(form.get("source") ?? "").slice(0, 120) || null,
    })
    .returning();

  after(() => notifyNewEnquiry(row));

  return { ok: true, name: v.name.split(" ")[0] };
}
