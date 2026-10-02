import Link from "next/link";
import Diorama from "@/components/Scene/Diorama";
import { SiteFooter, SiteHeader } from "@/components/Site/SiteChrome";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold tracking-widest text-t-accent uppercase">404</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">This trail doesn&apos;t go anywhere</h1>
          <p className="mt-3 text-t-muted">
            The page may have moved, or the plan isn&apos;t published yet. Try our destinations, or ask us to plan it.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/destinations" className="rounded-full bg-t-accent px-5 py-3 font-semibold text-t-accent-ink">
              Browse destinations
            </Link>
            <Link href="/enquire" className="rounded-full px-5 py-3 font-semibold text-t-accent">
              Ask for a plan
            </Link>
          </div>
        </div>
        <Diorama type="mountain" alt="" />
      </main>
      <SiteFooter />
    </div>
  );
}
