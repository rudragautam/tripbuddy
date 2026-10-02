import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { deleteDestination } from "@/app/admin/actions/destinations";
import DestinationEditor from "@/components/Admin/DestinationEditor";
import { PageHeader } from "@/components/Admin/ui";
import { requireUser } from "@/lib/auth";
import { rowToDestination } from "@/lib/data/destinations";
import { getDb } from "@/lib/db";
import { destinations } from "@/lib/db/schema";

export const metadata: Metadata = { title: "Edit destination" };

export default async function EditDestination({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const user = await requireUser();
  const id = Number((await params).id);
  const { created } = await searchParams;
  if (!Number.isInteger(id)) notFound();

  const db = await getDb();
  const [row] = await db.select().from(destinations).where(eq(destinations.id, id)).limit(1);
  if (!row) notFound();
  const d = rowToDestination(row);

  return (
    <>
      <Link href="/admin/destinations" className="text-sm text-t-muted">
        ← All destinations
      </Link>
      <PageHeader
        title={d.name}
        description={`/${d.slug} · ${d.published ? "Published" : "Draft"}`}
        actions={
          d.published && (
            <Link href={`/destinations/${d.slug}`} target="_blank" className="text-sm font-semibold text-t-accent">
              View on site ↗
            </Link>
          )
        }
      />
      {created && (
        <p role="status" className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Destination created.
        </p>
      )}
      <DestinationEditor
        id={row.id}
        initial={{
          ...d,
          featured: d.featured ?? false,
          published: d.published ?? false,
        }}
      />
      {user.role === "admin" && (
        <form action={deleteDestination} className="mt-10 border-t border-black/10 pt-6">
          <input type="hidden" name="id" value={row.id} />
          <button type="submit" className="text-sm font-semibold text-red-600">
            Delete this destination permanently
          </button>
          <p className="mt-1 text-xs text-t-muted">To hide it temporarily, untick Published instead.</p>
        </form>
      )}
    </>
  );
}
