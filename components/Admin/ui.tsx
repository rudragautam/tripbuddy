import type { ReactNode } from "react";
import type { EnquiryStatus } from "@/lib/db/schema";

export const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-t-accent focus:ring-2 focus:ring-t-accent-soft";

export const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-t-accent px-4 py-2 text-sm font-semibold text-t-accent-ink disabled:opacity-60";

export const ghostButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:border-black/20";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-t-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-black/5 bg-white p-5 shadow-sm ${className}`}>{children}</section>;
}

const statusStyles: Record<EnquiryStatus, string> = {
  new: "bg-amber-100 text-amber-900",
  contacted: "bg-sky-100 text-sky-900",
  converted: "bg-emerald-100 text-emerald-900",
  closed: "bg-neutral-200 text-neutral-700",
};

export const statusLabels: Record<EnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  converted: "Converted",
  closed: "Closed",
};

export function StatusBadge({ status }: { status: EnquiryStatus }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

export function formatDateTime(d: Date) {
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}
