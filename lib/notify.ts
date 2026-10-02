import "server-only";
import type { EnquiryRow } from "@/lib/db/schema";
import { site } from "@/lib/site";

function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/**
 * Emails the team about a new enquiry through Resend (https://resend.com) when configured.
 * Never throws: the enquiry is already saved, so a mail outage must not fail the visitor's request.
 */
export async function notifyNewEnquiry(e: EnquiryRow) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_NOTIFY_EMAIL;
  const from = process.env.EMAIL_FROM ?? "TripBuddy <onboarding@resend.dev>";
  if (!key || !to) return;

  const rows: [string, string | number | null | undefined][] = [
    ["Name", e.name],
    ["Phone", e.phone],
    ["Email", e.email],
    ["Destination", e.destinationSlug],
    ["Days", e.days],
    ["Travel date", e.travelDate],
    ["People", e.people],
    ["Budget", e.budget],
    ["Notes", e.notes],
  ];
  const html = `<h2>New enquiry #${e.id}</h2><table cellpadding="6">${rows
    .filter(([, v]) => v != null && v !== "")
    .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${escape(String(v))}</td></tr>`)
    .join("")}</table><p><a href="${site.url}/admin/enquiries/${e.id}">Open in admin</a></p>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        subject: `New enquiry: ${e.name}${e.destinationSlug ? ` · ${e.destinationSlug}` : ""}`,
        html,
        reply_to: e.email ?? undefined,
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error("[notify] Resend responded", res.status, await res.text());
  } catch (err) {
    console.error("[notify] failed", err);
  }
}
