"use client";

import { useActionState, useEffect, useRef } from "react";
import { changeOwnPassword, createUser, resetUserPassword, type UserFormState } from "@/app/admin/actions/users";
import { buttonClass, ghostButtonClass, inputClass } from "./ui";

function Feedback({ state }: { state: UserFormState }) {
  if (state.error) return <p role="alert" className="text-sm text-red-600">{state.error}</p>;
  if (state.message) return <p role="status" className="text-sm text-emerald-700">{state.message}</p>;
  return null;
}

export function CreateUserForm() {
  const [state, action, pending] = useActionState<UserFormState, FormData>(createUser, {});
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) ref.current?.reset();
  }, [state]);
  return (
    <form ref={ref} action={action} className="grid gap-3 sm:grid-cols-2">
      <label className="grid gap-1.5 text-sm font-medium">
        Name
        <input name="name" required className={inputClass} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Email
        <input name="email" type="email" required className={inputClass} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Role
        <select name="role" defaultValue="editor" className={inputClass}>
          <option value="editor">Editor: content and enquiries</option>
          <option value="admin">Admin: everything, including users</option>
        </select>
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Temporary password
        <input name="password" type="text" minLength={12} required autoComplete="new-password" className={inputClass} />
      </label>
      <div className="flex items-center gap-3 sm:col-span-2">
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "Adding…" : "Add user"}
        </button>
        <Feedback state={state} />
      </div>
    </form>
  );
}

export function ResetPasswordForm({ id }: { id: number }) {
  const [state, action, pending] = useActionState<UserFormState, FormData>(resetUserPassword, {});
  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <input
        name="password"
        type="text"
        placeholder="New password (12+)"
        minLength={12}
        required
        autoComplete="new-password"
        aria-label="New password"
        className={`${inputClass} w-44 py-1.5`}
      />
      <button type="submit" disabled={pending} className={`${ghostButtonClass} py-1.5`}>
        Reset
      </button>
      <Feedback state={state} />
    </form>
  );
}

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState<UserFormState, FormData>(changeOwnPassword, {});
  return (
    <form action={action} className="grid max-w-sm gap-3">
      <label className="grid gap-1.5 text-sm font-medium">
        Current password
        <input name="current" type="password" required autoComplete="current-password" className={inputClass} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        New password
        <input name="next" type="password" minLength={12} required autoComplete="new-password" className={inputClass} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Confirm new password
        <input name="confirm" type="password" minLength={12} required autoComplete="new-password" className={inputClass} />
      </label>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "Saving…" : "Change password"}
        </button>
      </div>
      <Feedback state={state} />
    </form>
  );
}
