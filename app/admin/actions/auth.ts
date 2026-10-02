"use server";

import { redirect } from "next/navigation";
import { login, logout } from "@/lib/auth";

export type LoginState = { error?: string; email?: string };

export async function loginAction(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "/admin");
  if (!email || !password) return { error: "Enter your email and password.", email };

  const result = await login(email, password);
  if (!result.ok) return { error: result.error, email };
  // Only redirect inside the admin area (no open redirects).
  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}
