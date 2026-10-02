import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { deleteEnquiry } from "@/app/admin/actions/enquiries";
import EnquiryEditor from "@/components/Admin/EnquiryEditor";
import { formatDateTime, PageHeader, Panel, StatusBadge } from "@/components/Admin/ui";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { enquiries, users } from "@/lib/db/schema";

export const metadata: Metadata = { title: "Enquiry" };

export default async function EnquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const db = await getDb();
  const [row] = await db
    .select({ e: enquiries, handler: users.name })
    .from(enquiries)
    .leftJoin(users, eq(users.id, enquiries.assignedTo))
    .where(eq(enquiries.id, id))
    .limit(1);
  if (!row) notFound();
  const e = row.e;

  const phoneDigits = e.phone.replace(/\D/g, "");
  const waNumber = phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits;
  const greeting = encodeURIComponent(
    `Hi ${e.name.split(" ")[0]}, this is TripBuddy about your ${e.destinationSlug ?? "trip"} enquiry.`,
  );

  const details: [string, string | number | null][] = [
    ["Phone", e.phone],
    ["Email", e.email],
    ["Destination", e.destinationSlug],
    ["Days", e.days],
    ["Travel date", e.travelDate],
    ["People", e.people],
    ["Budget", e.budget],
    ["Source", e.source],
  ];

  return (
    <>
      <Link href="/admin/enquiries" className="text-sm text-t-muted">
        ← All enquiries
      </Link>
      <PageHeader
        title={e.name}
        description={`Enquiry #${e.id} · received ${formatDateTime(e.createdAt)}`}
        actions={<StatusBadge status={e.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <dl className="grid gap-4 sm:grid-cols-2">
            {details.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-t-muted">{k}</dt>
                <dd className="font-medium">
                  {k === "Destination" && v ? (
                    <Link href={`/destinations/${v}${e.days ? `?days=${e.days}` : ""}`} target="_blank" className="text-t-accent underline">
                      {v} ↗
                    </Link>
                  ) : (
                    (v ?? "—")
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-6">
            <p className="text-xs text-t-muted">Notes from the traveller</p>
            <p className="mt-1 whitespace-pre-wrap">{e.notes ?? "—"}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <a href={`tel:${e.phone.replace(/[^\d+]/g, "")}`} className="rounded-full bg-t-accent px-4 py-2 text-sm font-semibold text-t-accent-ink">
              Call
            </a>
            <a
              href={`https://wa.me/${waNumber}?text=${greeting}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold"
            >
              WhatsApp
            </a>
            {e.email && (
              <a href={`mailto:${e.email}`} className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold">
                Email
              </a>
            )}
          </div>
        </Panel>

        <Panel>
          <h2 className="mb-3 font-semibold">Follow-up</h2>
          <EnquiryEditor id={e.id} status={e.status} adminNotes={e.adminNotes ?? ""} />
          <p className="mt-3 text-xs text-t-muted">
            Last updated {formatDateTime(e.updatedAt)}
            {row.handler ? ` by ${row.handler}` : ""}
          </p>
          {user.role === "admin" && (
            <form action={deleteEnquiry} className="mt-6 border-t border-black/5 pt-4">
              <input type="hidden" name="id" value={e.id} />
              <button type="submit" className="text-sm font-semibold text-red-600">
                Delete enquiry (e.g. on a data deletion request)
              </button>
            </form>
          )}
        </Panel>
      </div>
    </>
  );
}
