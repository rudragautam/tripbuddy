import type { Metadata } from "next";
import ProsePage from "@/components/Site/ProsePage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <ProsePage title="Privacy policy" intro="Short version: we only collect what you give us to answer your enquiry.">
      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Enquiries.</strong> When you send an enquiry we store your name, phone number and anything else you
          fill in (email, dates, number of people, budget, notes).
        </li>
        <li>
          <strong>Abuse protection.</strong> We store a one-way hash of your IP address with each enquiry to stop spam.
          It can&apos;t be turned back into your IP address.
        </li>
        <li>
          <strong>Saved trips.</strong> Trips you save stay in your own browser. We never receive them.
        </li>
      </ul>
      <p>
        Browsing plans needs no account. We don&apos;t use advertising trackers.
      </p>

      <h2>How we use it</h2>
      <p>
        Only to reply to your enquiry and help with your trip. We don&apos;t sell your details. If you ask us to book
        something, we share only what a hotel, cab or ticket provider needs to make that booking.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep enquiries for up to 24 months so we can help with follow-up questions, then delete them. You can ask us
        to delete yours sooner.
      </p>

      <h2>Your rights</h2>
      <p>
        Under India&apos;s Digital Personal Data Protection Act, 2023, you can ask to see, correct or delete your
        data, or withdraw consent.
        {site.contactEmail ? ` Email ${site.contactEmail}` : " Contact us through the enquiry form"} and we&apos;ll
        respond promptly.
      </p>
    </ProsePage>
  );
}
