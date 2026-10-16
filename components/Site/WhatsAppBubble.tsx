"use client";

import { usePathname } from "next/navigation";

/**
 * Floating "chat on WhatsApp" button, fixed bottom-right on every public page.
 * Hidden on admin pages. On destination pages it sits above the mobile bottom nav.
 */
export default function WhatsAppBubble({ number }: { number: string }) {
  const pathname = usePathname();
  if (!number || pathname.startsWith("/admin")) return null;

  const onPlanner = /^\/destinations\/[^/]+$/.test(pathname);
  const text = encodeURIComponent("Hi TripBuddy, I'd like help planning a trip.");

  return (
    <a
      href={`https://wa.me/${number}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`fixed right-4 z-40 flex size-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 focus-visible:scale-105 sm:right-6 ${
        onPlanner ? "bottom-24 lg:bottom-6" : "bottom-6"
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-7" fill="currentColor" aria-hidden>
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8Zm-3 4.4c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.3s1 2.7 1.1 2.9c.2.2 2 3.1 4.9 4.3 2.4 1 2.9.8 3.4.7.5 0 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.5-.3l-1.9-.9c-.3-.1-.4-.1-.6.1l-.8 1c-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5L9.6 8.6c-.2-.4-.4-.4-.6-.4Z" />
      </svg>
    </a>
  );
}
