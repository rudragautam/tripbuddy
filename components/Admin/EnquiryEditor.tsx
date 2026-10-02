"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import { updateEnquiry, type UpdateEnquiryState } from "@/app/admin/actions/enquiries";
import type { EnquiryStatus } from "@/lib/db/schema";
import { buttonClass, inputClass, statusLabels } from "./ui";

export default function EnquiryEditor({ id, status, adminNotes }: { id: number; status: EnquiryStatus; adminNotes: string }) {
  const [state, action, pending] = useActionState<UpdateEnquiryState, FormData>(updateEnquiry, {});
  // Dispatch manually: a plain <form action> would reset the fields after saving, so they would
  // show stale defaults (e.g. the first option of a select) even though the data is saved.
  function submitWithoutReset(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  }
  return (
    <form onSubmit={submitWithoutReset} className="grid gap-3">
      <input type="hidden" name="id" value={id} />
      <label className="grid gap-1.5 text-sm font-medium">
        Status
        <select name="status" defaultValue={status} className={inputClass}>
          {(Object.keys(statusLabels) as EnquiryStatus[]).map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Team notes (not shown to the traveller)
        <textarea name="adminNotes" rows={6} defaultValue={adminNotes} maxLength={5000} className={inputClass} />
      </label>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "Saving…" : "Save"}
        </button>
        <span aria-live="polite" className="text-sm">
          {state.ok && <span className="text-emerald-700">Saved</span>}
          {state.error && <span className="text-red-600">{state.error}</span>}
        </span>
      </div>
    </form>
  );
}
