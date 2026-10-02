import type { Metadata } from "next";
import ProsePage from "@/components/Site/ProsePage";

export const metadata: Metadata = {
  title: "Terms of use",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <ProsePage title="Terms of use">
      <h2>Plans are guidance</h2>
      <p>
        TripBuddy itineraries are free travel guidance. We check them regularly, but opening hours, permits, prices,
        weather and road conditions change. Please confirm anything important (permits, ferries, safari slots, road
        openings) with the official source before you travel.
      </p>

      <h2>No payment on this site</h2>
      <p>
        TripBuddy never asks for payment on this website. Sending an enquiry is free and puts you under no obligation.
        If you choose to book with our help, the terms and price will be agreed with you directly before anything is
        confirmed.
      </p>

      <h2>Your safety</h2>
      <p>
        High-altitude, wildlife, water and desert activities carry real risks. Follow local guidance, use licensed
        operators and make sure you have suitable travel insurance.
      </p>

      <h2>Content</h2>
      <p>
        You&apos;re welcome to print and share plans for personal use. Please don&apos;t republish them commercially
        without permission.
      </p>
    </ProsePage>
  );
}
