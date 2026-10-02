import "server-only";
import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getDb } from "@/lib/db";
import { users, type UserRole, type UserRow } from "@/lib/db/schema";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, signSession, verifySession } from "./session";

const MAX_FAILED_LOGINS = 5;
const LOCK_MINUTES = 15;
let dummyHash: string | undefined;

export type CurrentUser = Pick<UserRow, "id" | "email" | "name" | "role">;

/** Verifies the cookie AND the database row, so deactivation or a password change logs people out. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const store = await cookies();
  const claims = await verifySession(store.get(SESSION_COOKIE)?.value);
  if (!claims) return null;

  const db = await getDb();
  const [user] = await db.select().from(users).where(eq(users.id, claims.uid)).limit(1);
  if (!user || !user.active || user.sessionVersion !== claims.ver) return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role };
});

export async function requireUser(role?: UserRole): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (role === "admin" && user.role !== "admin") redirect("/admin?denied=1");
  return user;
}

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function login(emailRaw: string, password: string): Promise<LoginResult> {
  const email = emailRaw.trim().toLowerCase();
  const db = await getDb();
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  // Same message for unknown email and wrong password.
  const invalid = { ok: false as const, error: "Email or password is incorrect." };
  if (!user || !user.active) {
    await bcrypt.compare(password, (dummyHash ??= await bcrypt.hash("timing-equaliser", 12))); // even out timing
    return invalid;
  }
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return { ok: false, error: `Too many attempts. Try again after ${LOCK_MINUTES} minutes.` };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const failed = user.failedLogins + 1;
    await db
      .update(users)
      .set({
        failedLogins: failed >= MAX_FAILED_LOGINS ? 0 : failed,
        lockedUntil: failed >= MAX_FAILED_LOGINS ? new Date(Date.now() + LOCK_MINUTES * 60_000) : null,
      })
      .where(eq(users.id, user.id));
    return invalid;
  }

  await db
    .update(users)
    .set({ failedLogins: 0, lockedUntil: null, lastLoginAt: new Date() })
    .where(eq(users.id, user.id));

  await setSessionCookie({ uid: user.id, ver: user.sessionVersion, role: user.role });
  return { ok: true };
}

export async function setSessionCookie(claims: Parameters<typeof signSession>[0]) {
  const token = await signSession(claims);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

/** Invalidates every session for a user (password change, deactivation). */
export async function bumpSessionVersion(userId: number) {
  const db = await getDb();
  const [row] = await db
    .update(users)
    .set({ sessionVersion: sql`${users.sessionVersion} + 1` })
    .where(eq(users.id, userId))
    .returning({ ver: users.sessionVersion, role: users.role });
  return row;
}

export const PASSWORD_RULE = "At least 12 characters.";
export function passwordProblem(password: string): string | null {
  return password.length >= 12 ? null : PASSWORD_RULE;
}
