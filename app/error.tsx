"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-start justify-center px-4 py-12">
      <p className="text-sm font-semibold tracking-widest text-t-accent uppercase">Something went wrong</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">We hit a bump in the road</h1>
      <p className="mt-3 text-t-muted">
        Please try again. If it keeps happening, let us know{error.digest ? ` (reference ${error.digest})` : ""}.
      </p>
      <div className="mt-6 flex gap-3">
        <button type="button" onClick={reset} className="rounded-full bg-t-accent px-5 py-3 font-semibold text-t-accent-ink">
          Try again
        </button>
        <Link href="/" className="rounded-full px-5 py-3 font-semibold text-t-accent">
          Go home
        </Link>
      </div>
    </main>
  );
}
