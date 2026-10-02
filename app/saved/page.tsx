import type { Metadata } from "next";
import SavedList from "@/components/Destination/SavedList";
import { SiteFooter, SiteHeader } from "@/components/Site/SiteChrome";
import { getPublishedCards } from "@/lib/data/destinations";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Saved trips",
  robots: { index: false },
};

export default async function SavedPage() {
  const cards = await getPublishedCards();
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Saved trips</h1>
        <p className="mt-2 mb-8 text-t-muted">Kept in this browser. No account needed.</p>
        <SavedList cards={cards} />
      </main>
      <SiteFooter />
    </div>
  );
}
