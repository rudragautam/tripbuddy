import type { Metadata } from "next";
import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { refreshPublicCache, setPublished } from "@/app/admin/actions/destinations";
import { buttonClass, formatDateTime, ghostButtonClass, PageHeader, Panel } from "@/components/Admin/ui";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { destinations } from "@/lib/db/schema";
import { themes } from "@/lib/themes";

export const metadata: Metadata = { title: "Destinations" };

export default async function AdminDestinations({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireUser();
  const { status } = await searchParams;
  const db = await getDb();
  const rows = await db
    .select({
      id: destinations.id,
      slug: destinations.slug,
      name: destinations.name,
      state: destinations.state,
      tourType: destinations.tourType,
      published: destinations.published,
      featured: destinations.featured,
      lastChecked: destinations.lastChecked,
      updatedAt: destinations.updatedAt,
    })
    .from(destinations)
    .where(status === "draft" ? eq(destinations.published, false) : undefined)
    .orderBy(asc(destinations.name));

  return (
    <>
      <PageHeader
        title="Destinations"
        description={`${rows.length} ${status === "draft" ? "drafts" : "destinations"}`}
        actions={
          <>
            <form action={refreshPublicCache}>
              <button type="submit" className={ghostButtonClass} title="Use after seeding or editing the database directly">
                Refresh site cache
              </button>
            </form>
            <Link href="/admin/destinations/new" className={buttonClass}>
              New destination
            </Link>
          </>
        }
      />
      <Panel className="overflow-x-auto p-0">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-black/5 text-xs text-t-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Last checked</th>
              <th className="px-4 py-3 font-semibold">Updated</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {rows.map((d) => (
              <tr key={d.id} className="hover:bg-black/[0.02]">
                <td className="px-4 py-3">
                  <Link href={`/admin/destinations/${d.id}`} className="font-medium hover:text-t-accent">
                    {d.name}
                  </Link>
                  <span className="block text-xs text-t-muted">
                    {d.state}
                    {d.featured ? " · Featured" : ""}
                  </span>
                </td>
                <td className="px-4 py-3">{themes[d.tourType].label}</td>
                <td className="px-4 py-3 text-t-muted">{d.lastChecked}</td>
                <td className="px-4 py-3 whitespace-nowrap text-t-muted">{formatDateTime(d.updatedAt)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${d.published ? "bg-emerald-100 text-emerald-900" : "bg-neutral-200 text-neutral-700"}`}
                  >
                    {d.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <form action={setPublished} className="inline">
                    <input type="hidden" name="id" value={d.id} />
                    <input type="hidden" name="published" value={String(!d.published)} />
                    <button type="submit" className="text-xs font-semibold text-t-accent">
                      {d.published ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  {d.published && (
                    <Link href={`/destinations/${d.slug}`} target="_blank" className="ml-4 text-xs font-semibold text-t-muted">
                      View ↗
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
