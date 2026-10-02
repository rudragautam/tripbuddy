import { desc, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { csvCell } from "@/lib/csv";
import { getDb } from "@/lib/db";
import { enquiries, enquiryStatusEnum, type EnquiryStatus } from "@/lib/db/schema";

export const dynamic = "force-dynamic";


export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const status = new URL(request.url).searchParams.get("status");
  const filter = enquiryStatusEnum.enumValues.includes(status as EnquiryStatus)
    ? eq(enquiries.status, status as EnquiryStatus)
    : undefined;

  const db = await getDb();
  const rows = await db.select().from(enquiries).where(filter).orderBy(desc(enquiries.createdAt));

  const columns = [
    "id",
    "createdAt",
    "status",
    "name",
    "phone",
    "email",
    "destinationSlug",
    "days",
    "travelDate",
    "people",
    "budget",
    "notes",
    "adminNotes",
    "source",
  ] as const;
  const csv = [columns.join(","), ...rows.map((r) => columns.map((c) => csvCell(r[c])).join(","))].join("\r\n");

  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="tripbuddy-enquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
