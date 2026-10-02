import type { Metadata } from "next";
import Link from "next/link";
import DestinationEditor from "@/components/Admin/DestinationEditor";
import { PageHeader } from "@/components/Admin/ui";
import { requireUser } from "@/lib/auth";
import type { DestinationForm } from "@/components/Admin/DestinationEditor";

export const metadata: Metadata = { title: "New destination" };

const emptyDay = { title: "", morning: "", afternoon: "", evening: "", stay: "", tip: "", stops: [{ name: "", lat: 0, lng: 0 }] };

export default async function NewDestination() {
  await requireUser();
  const blank: DestinationForm = {
    slug: "",
    name: "",
    state: "",
    tagline: "",
    summary: "",
    tourType: "hills",
    lat: 0,
    lng: 0,
    bestTime: { months: "", note: "" },
    bestMonths: [],
    howToReach: "",
    budgetPerDay: { budget: "", mid: "", premium: "" },
    facts: [
      { label: "Altitude", value: "" },
      { label: "Landscape", value: "" },
      { label: "Best time", value: "" },
      { label: "Famous for", value: "" },
    ],
    experiences: [{ name: "", duration: "", icon: "camera" }],
    days: [emptyDay, emptyDay, emptyDay],
    minDays: 2,
    sceneImage: undefined,
    lastChecked: new Date().toISOString().slice(0, 10),
    featured: false,
    published: false,
  };

  return (
    <>
      <Link href="/admin/destinations" className="text-sm text-t-muted">
        ← All destinations
      </Link>
      <PageHeader title="New destination" description="Saved as a draft until you tick Published." />
      <DestinationEditor initial={blank} />
    </>
  );
}
