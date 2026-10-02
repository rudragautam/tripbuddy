import type { Metadata } from "next";
import Link from "next/link";
import { and, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { formatDateTime, ghostButtonClass, inputClass, PageHeader, Panel, StatusBadge, statusLabels } from "@/components/Admin/ui";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { enquiries, enquiryStatusEnum, type EnquiryStatus } from "@/lib/db/schema";

export const metadata: Metadata = { title: "Enquiries" };

const PAGE_SIZE = 25;

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  await requireUser();
  const sp = await searchParams;
  const status = enquiryStatusEnum.enumValues.includes(sp.status as EnquiryStatus) ? (sp.status as EnquiryStatus) : undefined;
  const q = sp.q?.trim().slice(0, 60);
  const page = Math.max(1, Number(sp.page) || 1);

  const filters: SQL[] = [];
  if (status) filters.push(eq(enquiries.status, status));
  if (q) {
    const like = `%${q.replace(/[%_]/g, "\\$&")}%`;
    filters.push(or(ilike(enquiries.name, like), ilike(enquiries.phone, like), ilike(enquiries.email, like), ilike(enquiries.destinationSlug, like))!);
  }
  const where = filters.length ? and(...filters) : undefined;

  const db = await getDb();
  const [rows, [{ total }]] = await Promise.all([
    db
      .select()
      .from(enquiries)
      .where(where)
      .orderBy(desc(enquiries.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ total: count() }).from(enquiries).where(where),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const qs = (p: number) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return s ? `?${s}` : "";
  };
  const exportQs = new URLSearchParams({ ...(status ? { status } : {}) }).toString();

  return (
    <>
      <PageHeader
        title="Enquiries"
        description={`${total} ${total === 1 ? "enquiry" : "enquiries"}`}
        actions={
          <a href={`/admin/export/enquiries${exportQs ? `?${exportQs}` : ""}`} className={ghostButtonClass}>
            Export CSV
          </a>
        }
      />

      <form method="get" className="mb-4 grid gap-2 sm:grid-cols-[minmax(0,24rem)_12rem_auto] sm:justify-start">
        <input name="q" defaultValue={q} placeholder="Search name, phone, email, destination" className={inputClass} />
        <select name="status" defaultValue={status ?? ""} className={inputClass}>
          <option value="">All statuses</option>
          {enquiryStatusEnum.enumValues.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
        <button type="submit" className={ghostButtonClass}>
          Filter
        </button>
      </form>

      <Panel className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-black/5 text-xs text-t-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-semibold">Received</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">Trip</th>
              <th className="px-4 py-3 font-semibold">Travel date</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {rows.map((e) => (
              <tr key={e.id} className="hover:bg-black/[0.02]">
                <td className="px-4 py-3 whitespace-nowrap text-t-muted">{formatDateTime(e.createdAt)}</td>
                <td className="px-4 py-3 font-medium">
                  <Link href={`/admin/enquiries/${e.id}`} className="hover:text-t-accent">
                    {e.name}
                  </Link>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{e.phone}</td>
                <td className="px-4 py-3">
                  {e.destinationSlug ?? "—"}
                  {e.days ? ` · ${e.days}d` : ""}
                  {e.people ? ` · ${e.people} ppl` : ""}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{e.travelDate ?? "—"}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={e.status} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-t-muted">
                  No enquiries match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Panel>

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-4 flex items-center justify-between text-sm">
          {page > 1 ? (
            <Link href={`/admin/enquiries${qs(page - 1)}`} className={ghostButtonClass}>
              ← Newer
            </Link>
          ) : (
            <span />
          )}
          <span className="text-t-muted">
            Page {page} of {pages}
          </span>
          {page < pages ? (
            <Link href={`/admin/enquiries${qs(page + 1)}`} className={ghostButtonClass}>
              Older →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </>
  );
}
