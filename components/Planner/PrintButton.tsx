"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white"
    >
      Print / Save as PDF
    </button>
  );
}
