import type { Metadata } from "next";
import Link from "next/link";
import EnquiryForm from "@/components/Enquiry/EnquiryForm";
import { SiteFooter, SiteHeader } from "@/components/Site/SiteChrome";
import { getPublishedCards, getPublishedDestination } from "@/lib/data/destinations";
import { site } from "@/lib/site";
import { themeVars } from "@/lib/themes";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Enquire",
  description: "Want help booking your trip, or a plan for somewhere we haven't covered? Ask us. Planning stays free.",
  alternates: { canonical: "/enquire" },
};

export default async function EnquirePage({
  searchParams,
}: {
  searchParams: Promise<{ place?: string; days?: string }>;
}) {
  const { place, days } = await searchParams;
  const [destination, cards] = await Promise.all([
    place ? getPublishedDestination(place) : Promise.resolve(null),
    getPublishedCards(),
  ]);

  return (
    <div
      style={destination ? themeVars(destination.tourType) : undefined}
      className="flex min-h-screen flex-col bg-t-bg text-t-ink"
    >
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        {destination && (
          <Link href={`/destinations/${destination.slug}?days=${days ?? 3}`} className="text-sm text-t-muted">
            ← Back to the {destination.name} plan
          </Link>
        )}
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {destination ? `Help me book ${destination.name}` : "Tell us about your trip"}
        </h1>
        <p className="mt-2 mb-8 text-t-muted">
          The plan is yours either way. If you&apos;d like help with hotels, cabs or tickets, or a plan for somewhere
          else, leave your details. Enquiring is free.
        </p>
        <EnquiryForm
          places={cards.map(({ slug, name }) => ({ slug, name })).sort((a, b) => a.name.localeCompare(b.name))}
          place={destination?.slug}
          days={Number(days) || undefined}
          whatsapp={site.whatsapp}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
