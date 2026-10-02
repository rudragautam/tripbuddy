"use server";

import { and, count, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { bumpSessionVersion, hashPassword, passwordProblem, requireUser, setSessionCookie, verifyPassword } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";

export type UserFormState = { ok?: boolean; error?: string; message?: string };

const createSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email(),
  role: z.enum(["admin", "editor"]),
  password: z.string().min(12, "Password must be at least 12 characters."),
});

export async function createUser(_prev: UserFormState, form: FormData): Promise<UserFormState> {
  await requireUser("admin");
  const parsed = createSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid details." };
  const v = parsed.data;

  const db = await getDb();
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, v.email)).limit(1);
  if (existing) return { error: "A user with that email already exists." };

  await db.insert(users).values({ name: v.name, email: v.email, role: v.role, passwordHash: await hashPassword(v.password) });
  revalidatePath("/admin/users");
  return { ok: true, message: `${v.name} can now sign in. Share the password with them privately.` };
}

/** Never leave the system without an active admin. */
async function isLastActiveAdmin(userId: number) {
  const db = await getDb();
  const [{ n }] = await db
    .select({ n: count() })
    .from(users)
    .where(and(eq(users.role, "admin"), eq(users.active, true), ne(users.id, userId)));
  return n === 0;
}

export async function updateUser(form: FormData) {
  const me = await requireUser("admin");
  const id = Number(form.get("id"));
  const op = String(form.get("op"));
  const db = await getDb();
  const [target] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!target) return;

  if (op === "toggle-active") {
    if (target.id === me.id) return;
    if (target.active && target.role === "admin" && (await isLastActiveAdmin(target.id))) return;
    await db.update(users).set({ active: !target.active }).where(eq(users.id, id));
    await bumpSessionVersion(id);
  } else if (op === "toggle-role") {
    if (target.id === me.id) return;
    const role = target.role === "admin" ? "editor" : "admin";
    if (role === "editor" && (await isLastActiveAdmin(target.id))) return;
    await db.update(users).set({ role }).where(eq(users.id, id));
    await bumpSessionVersion(id);
  }
  revalidatePath("/admin/users");
}

export async function resetUserPassword(_prev: UserFormState, form: FormData): Promise<UserFormState> {
  await requireUser("admin");
  const id = Number(form.get("id"));
  const password = String(form.get("password") ?? "");
  const problem = passwordProblem(password);
  if (problem) return { error: problem };
  const db = await getDb();
  await db
    .update(users)
    .set({ passwordHash: await hashPassword(password), failedLogins: 0, lockedUntil: null })
    .where(eq(users.id, id));
  await bumpSessionVersion(id);
  return { ok: true, message: "Password reset. They've been signed out everywhere." };
}

export async function changeOwnPassword(_prev: UserFormState, form: FormData): Promise<UserFormState> {
  const me = await requireUser();
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  if (next !== confirm) return { error: "The new passwords don't match." };
  const problem = passwordProblem(next);
  if (problem) return { error: problem };

  const db = await getDb();
  const [row] = await db.select().from(users).where(eq(users.id, me.id)).limit(1);
  if (!row || !(await verifyPassword(current, row.passwordHash))) return { error: "Your current password is incorrect." };

  await db.update(users).set({ passwordHash: await hashPassword(next) }).where(eq(users.id, me.id));
  const bumped = await bumpSessionVersion(me.id);
  // Keep this browser signed in; every other session is invalidated.
  await setSessionCookie({ uid: me.id, ver: bumped.ver, role: bumped.role });
  return { ok: true, message: "Password changed. Other devices have been signed out." };
}
