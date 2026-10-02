import type { Metadata } from "next";
import Link from "next/link";
import ProsePage from "@/components/Site/ProsePage";

export const metadata: Metadata = {
  title: "How TripBuddy works",
  description: "Why TripBuddy trip plans are free, who checks them, and how booking help works.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <ProsePage
      title="How TripBuddy works"
      intro="We plan your trip for free. If you'd like help booking it, we're here, but you never have to."
    >
      <h2>Free plans, no catch</h2>
      <p>
        Every itinerary on TripBuddy is free to read, save, print and share. You don&apos;t need an account and we
        never ask for payment details. Pick a place, choose how many days you have, and the plan, map and stops adjust
        to fit.
      </p>

      <h2>Who writes the plans</h2>
      <p>
        Plans are written and checked by our team and local contacts. Each one shows a &quot;last checked&quot; date.
        Timings, permits, ferry schedules and road openings change, so always confirm the important ones before you
        travel. If you spot something out of date, <Link href="/enquire" className="font-semibold text-t-accent underline">tell us</Link> and
        we&apos;ll fix it.
      </p>

      <h2>Booking help, only if you ask</h2>
      <p>
        Some travellers ask us to help book hotels, cabs or tickets for their plan. Asking is free and there&apos;s no
        obligation. There&apos;s never a payment on this website; if you go ahead, everything is agreed with you
        directly before anything is confirmed.
      </p>

      <h2>What you can do here</h2>
      <ul>
        <li>Get a day-by-day plan for 2 to 6 days, with a route map and live weather.</li>
        <li>Save plans in your browser and print them or save them as PDF.</li>
        <li>Share a plan on WhatsApp or anywhere else with one link.</li>
        <li>Ask us for help booking, or for a plan for somewhere we haven&apos;t covered yet.</li>
      </ul>
    </ProsePage>
  );
}
