import Link from "next/link";
import { Heart } from "lucide-react";
import { themes } from "@/lib/themes";
import { TOUR_TYPES } from "@/lib/types";
import { site } from "@/lib/site";

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  return (
    <header className={overlay ? "absolute inset-x-0 top-0 z-20" : "border-b border-black/5"}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="grid size-8 place-items-center rounded-xl bg-t-accent text-sm text-t-accent-ink">TB</span>
          <span>
            Trip<span className="text-t-accent">Buddy</span>
          </span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 text-sm font-medium sm:gap-5">
          <Link href="/destinations" className="hidden px-2 py-1 hover:text-t-accent sm:inline">
            Destinations
          </Link>
          <Link href="/about" className="hidden px-2 py-1 hover:text-t-accent md:inline">
            How it works
          </Link>
          <Link href="/saved" className="flex items-center gap-1 px-2 py-1 hover:text-t-accent" aria-label="Saved trips">
            <Heart className="size-4" aria-hidden />
            <span className="hidden sm:inline">Saved</span>
          </Link>
          <Link href="/enquire" className="rounded-full bg-t-ink px-4 py-2 text-t-bg">
            Enquire
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-black/5">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 text-sm sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-lg font-bold">
            Trip<span className="text-t-accent">Buddy</span>
          </p>
          <p className="mt-2 max-w-sm text-t-muted">
            Free day-by-day trip plans for India. No sign-up, no payment. Ask us only if you want help booking.
          </p>
          {site.whatsapp && (
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block font-semibold text-t-accent"
            >
              Chat on WhatsApp →
            </a>
          )}
        </div>
        <div>
          <p className="font-semibold">Trip types</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-t-muted md:grid-cols-1">
            {TOUR_TYPES.map((t) => (
              <li key={t}>
                <Link href={`/explore/${t}`} className="hover:text-t-accent">
                  {themes[t].label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold">TripBuddy</p>
          <ul className="mt-3 space-y-2 text-t-muted">
            <li>
              <Link href="/destinations" className="hover:text-t-accent">
                All destinations
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-t-accent">
                How it works
              </Link>
            </li>
            <li>
              <Link href="/enquire" className="hover:text-t-accent">
                Enquire
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-t-accent">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-t-accent">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/credits" className="hover:text-t-accent">
                Photo credits
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="mx-auto max-w-7xl px-4 pb-8 text-xs text-t-muted sm:px-6">
        © {new Date().getFullYear()} {site.name}. Plans are guidance; check timings, permits and road conditions before you
        travel.
      </p>
    </footer>
  );
}
