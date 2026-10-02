"use client";

import Link from "next/link";
import { CalendarDays, Compass, Heart, House, MessageCircle, Send, Share2 } from "lucide-react";

export function SideNav({ enquireHref }: { enquireHref: string }) {
  const items = [
    { href: "/", label: "Home", Icon: House },
    { href: "/destinations", label: "Explore", Icon: Compass },
    { href: "#plan", label: "Plan", Icon: CalendarDays },
    { href: "/saved", label: "Saved", Icon: Heart },
    { href: enquireHref, label: "Enquire", Icon: MessageCircle },
  ];

  return (
    <nav aria-label="Main" className="fixed top-6 left-6 z-30 hidden flex-col gap-3 lg:flex">
      <Link
        href="/"
        className="mb-3 grid size-14 place-items-center rounded-2xl bg-t-accent text-lg font-bold text-t-accent-ink shadow-lg"
        aria-label="TripBuddy home"
      >
        TB
      </Link>
      {items.map(({ href, label, Icon }) => (
        <Link
          key={label}
          href={href}
          className="tactile-sm flex size-14 flex-col items-center justify-center gap-1 text-[10px] font-medium text-t-muted transition-colors hover:text-t-accent"
        >
          <Icon className="size-5" aria-hidden />
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function BottomNav({ enquireHref, title }: { enquireHref: string; title: string }) {
  async function share() {
    const data = { title, url: window.location.href };
    if (navigator.share) {
      await navigator.share(data).catch(() => {});
    } else {
      await navigator.clipboard.writeText(data.url);
      alert("Link copied");
    }
  }

  return (
    <nav
      aria-label="Trip actions"
      className="tactile fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-md items-center justify-around rounded-full px-3 py-2"
    >
      <Link href="/" className="flex flex-col items-center gap-0.5 px-2 text-[11px] text-t-muted">
        <Compass className="size-5" aria-hidden /> Explore
      </Link>
      <a href="#plan" className="flex flex-col items-center gap-0.5 px-2 text-[11px] text-t-muted">
        <CalendarDays className="size-5" aria-hidden /> Itinerary
      </a>
      <Link
        href={enquireHref}
        className="-mt-8 grid size-16 place-items-center rounded-full bg-t-accent text-t-accent-ink shadow-[0_10px_24px_-8px_var(--t-accent)] ring-4 ring-t-bg"
        aria-label="Enquire about this trip"
      >
        <Send className="size-6" aria-hidden />
      </Link>
      <button type="button" onClick={share} className="flex flex-col items-center gap-0.5 px-2 text-[11px] text-t-muted">
        <Share2 className="size-5" aria-hidden /> Share
      </button>
      <Link href={enquireHref} className="flex flex-col items-center gap-0.5 px-2 text-[11px] text-t-muted">
        <MessageCircle className="size-5" aria-hidden /> Help
      </Link>
    </nav>
  );
}
