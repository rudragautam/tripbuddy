"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions/auth";
import { inputClass } from "./ui";

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  return (
    <form action={action} className="tactile mt-6 grid gap-4 p-6">
      <input type="hidden" name="next" value={next} />
      <label className="grid gap-1.5 text-sm font-medium">
        Email
        <input name="email" type="email" autoComplete="username" required defaultValue={state.email} key={state.email} className={inputClass} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Password
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </label>
      {state.error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-t-accent px-5 py-3 font-semibold text-t-accent-ink disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
