"use client";

import Link from "next/link";
import { useActionState, type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitEnquiry, type EnquiryState } from "@/app/enquire/actions";

type Place = { slug: string; name: string };

const field =
  "w-full rounded-2xl border border-black/10 bg-t-bg px-4 py-3 outline-none transition focus:border-t-accent focus:ring-2 focus:ring-t-accent-soft aria-[invalid=true]:border-red-500";

function Field({
  label,
  name,
  error,
  className = "",
  children,
}: {
  label: string;
  name: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`grid gap-1.5 text-sm font-medium ${className}`}>
      <label htmlFor={name}>{label}</label>
      {children}
      {error && (
        <p id={`${name}-error`} className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function EnquiryForm({
  places,
  place,
  days,
  whatsapp,
}: {
  places: Place[];
  place?: string;
  days?: number;
  whatsapp: string;
}) {
  const [state, action, pending] = useActionState<EnquiryState, FormData>(submitEnquiry, { ok: false });
  const fe = state.fieldErrors ?? {};
  const v = state.values ?? {};
  const err = (name: string) =>
    fe[name] ? { "aria-invalid": true as const, "aria-describedby": `${name}-error` } : {};

  if (state.ok) {
    return (
      <div className="tactile rise p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto size-12 text-t-accent" aria-hidden />
        <h2 className="mt-4 text-2xl font-bold">Thanks, {state.name}!</h2>
        <p className="mt-2 text-t-muted">
          We&apos;ve got your enquiry and will reach you on WhatsApp or phone, usually within a day.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-t-accent px-5 py-3 text-sm font-semibold text-t-accent-ink"
            >
              Message us on WhatsApp
            </a>
          )}
          <Link href="/destinations" className="rounded-full px-5 py-3 text-sm font-semibold text-t-accent">
            Keep exploring free plans →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form key={JSON.stringify(v)} action={action} className="tactile grid gap-4 p-6 sm:grid-cols-2 sm:p-8" noValidate>
      {/* honeypot */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input type="hidden" name="source" value={place ? `destination:${place}` : "enquire-page"} />

      <Field label="Destination" name="place">
        <select id="place" name="place" defaultValue={v.place ?? place ?? ""} className={field}>
          <option value="">Not sure yet / somewhere else</option>
          {places.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Number of days" name="days" error={fe.days}>
        <input id="days" name="days" type="number" min={1} max={60} defaultValue={v.days ?? days ?? ""} className={field} {...err("days")} />
      </Field>
      <Field label="Your name *" name="name" error={fe.name}>
        <input id="name" name="name" required autoComplete="name" defaultValue={v.name} className={field} {...err("name")} />
      </Field>
      <Field label="Phone / WhatsApp *" name="phone" error={fe.phone}>
        <input
          id="phone"
          name="phone"
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+91 98xxx xxxxx"
          defaultValue={v.phone}
          className={field}
          {...err("phone")}
        />
      </Field>
      <Field label="Email" name="email" error={fe.email}>
        <input id="email" name="email" type="email" autoComplete="email" defaultValue={v.email} className={field} {...err("email")} />
      </Field>
      <Field label="Travel date" name="travelDate" error={fe.travelDate}>
        <input id="travelDate" name="travelDate" type="date" defaultValue={v.travelDate} className={field} {...err("travelDate")} />
      </Field>
      <Field label="People" name="people" error={fe.people}>
        <input id="people" name="people" type="number" min={1} max={100} defaultValue={v.people ?? 2} className={field} {...err("people")} />
      </Field>
      <Field label="Budget" name="budget">
        <select id="budget" name="budget" defaultValue={v.budget ?? "mid"} className={field}>
          <option value="budget">Budget</option>
          <option value="mid">Mid-range</option>
          <option value="premium">Premium</option>
        </select>
      </Field>
      <Field label="Anything else?" name="notes" error={fe.notes} className="sm:col-span-2">
        <textarea
          id="notes"
          name="notes"
          rows={3}
          maxLength={1500}
          defaultValue={v.notes}
          placeholder="Hotels, cabs, a custom route, special requests…"
          className={field}
          {...err("notes")}
        />
      </Field>

      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" name="consent" required defaultChecked={v.consent === "on"} className="mt-1 size-4 accent-[var(--t-accent)]" {...err("consent")} />
          <span>
            You can contact me by phone, WhatsApp or email about this trip. See our{" "}
            <Link href="/privacy" className="font-semibold text-t-accent underline">
              privacy policy
            </Link>
            .
          </span>
        </label>
        {fe.consent && (
          <p id="consent-error" className="mt-1 text-xs font-medium text-red-600">
            {fe.consent}
          </p>
        )}
      </div>

      {state.error && (
        <p role="alert" className="text-sm font-medium text-red-600 sm:col-span-2">
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
        <p className="text-xs text-t-muted">Nothing to pay. We only use your details to reply to you.</p>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-t-accent px-6 py-3 font-semibold text-t-accent-ink disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send enquiry"}
        </button>
      </div>
    </form>
  );
}
