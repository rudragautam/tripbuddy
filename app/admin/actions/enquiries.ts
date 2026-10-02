"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { enquiries, enquiryStatusEnum } from "@/lib/db/schema";

const updateSchema = z.object({
  id: z.coerce.number().int().positive(),
  status: z.enum(enquiryStatusEnum.enumValues),
  adminNotes: z.string().max(5000).optional(),
});

export type UpdateEnquiryState = { ok?: boolean; error?: string };

export async function updateEnquiry(_prev: UpdateEnquiryState, form: FormData): Promise<UpdateEnquiryState> {
  const user = await requireUser();
  const parsed = updateSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Invalid update." };

  const db = await getDb();
  await db
    .update(enquiries)
    .set({ status: parsed.data.status, adminNotes: parsed.data.adminNotes?.trim() || null, assignedTo: user.id })
    .where(eq(enquiries.id, parsed.data.id));

  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${parsed.data.id}`);
  return { ok: true };
}

export async function deleteEnquiry(form: FormData) {
  await requireUser("admin");
  const id = Number(form.get("id"));
  if (!Number.isInteger(id)) return;
  const db = await getDb();
  await db.delete(enquiries).where(eq(enquiries.id, id));
  revalidatePath("/admin/enquiries");
  redirect("/admin/enquiries");
}
