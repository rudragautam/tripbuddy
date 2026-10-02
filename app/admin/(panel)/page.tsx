import Link from "next/link";
import { count, desc, eq, gte, sql } from "drizzle-orm";
import { formatDateTime, PageHeader, Panel, StatusBadge } from "@/components/Admin/ui";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { destinations, enquiries } from "@/lib/db/schema";

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const user = await requireUser();
  const { denied } = await searchParams;
  const db = await getDb();
  const weekAgo = daysAgo(7);

  const [[newCount], [weekCount], [published], [drafts], recent, top] = await Promise.all([
    db.select({ n: count() }).from(enquiries).where(eq(enquiries.status, "new")),
    db.select({ n: count() }).from(enquiries).where(gte(enquiries.createdAt, weekAgo)),
    db.select({ n: count() }).from(destinations).where(eq(destinations.published, true)),
    db.select({ n: count() }).from(destinations).where(eq(destinations.published, false)),
    db.select().from(enquiries).orderBy(desc(enquiries.createdAt)).limit(8),
    db
      .select({ slug: enquiries.destinationSlug, n: sql<number>`count(*)::int` })
      .from(enquiries)
      .where(gte(enquiries.createdAt, daysAgo(30)))
      .groupBy(enquiries.destinationSlug)
      .orderBy(desc(sql`count(*)`))
      .limit(5),
  ]);

  const stats = [
    { label: "New enquiries", value: newCount.n, href: "/admin/enquiries?status=new" },
    { label: "Enquiries, last 7 days", value: weekCount.n, href: "/admin/enquiries" },
    { label: "Published destinations", value: published.n, href: "/admin/destinations" },
    { label: "Drafts", value: drafts.n, href: "/admin/destinations?status=draft" },
  ];

  return (
    <>
      {denied && (
        <p role="alert" className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          That page is for admins only.
        </p>
      )}
      <PageHeader title={`Hello, ${user.name.split(" ")[0]}`} description="Here's what's happening on TripBuddy." />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <li key={s.label}>
            <Link href={s.href} className="block rounded-2xl border border-black/5 bg-white p-5 shadow-sm hover:border-t-accent">
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="mt-1 text-sm text-t-muted">{s.label}</p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Latest enquiries</h2>
            <Link href="/admin/enquiries" className="text-sm font-semibold text-t-accent">
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-t-muted">No enquiries yet.</p>
          ) : (
            <ul className="divide-y divide-black/5">
              {recent.map((e) => (
                <li key={e.id}>
                  <Link href={`/admin/enquiries/${e.id}`} className="flex items-center justify-between gap-3 py-3 hover:text-t-accent">
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{e.name}</span>
                      <span className="block truncate text-xs text-t-muted">
                        {e.destinationSlug ?? "No destination"} {e.days ? `· ${e.days} days` : ""} · {formatDateTime(e.createdAt)}
                      </span>
                    </span>
                    <StatusBadge status={e.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel>
          <h2 className="mb-3 font-semibold">Most enquired, last 30 days</h2>
          {top.length === 0 ? (
            <p className="text-sm text-t-muted">Nothing yet.</p>
          ) : (
            <ol className="space-y-2 text-sm">
              {top.map((t) => (
                <li key={t.slug ?? "none"} className="flex justify-between">
                  <span>{t.slug ?? "No destination"}</span>
                  <span className="font-semibold">{t.n}</span>
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>
    </>
  );
}
