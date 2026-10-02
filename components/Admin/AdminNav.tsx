"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const items = [
    { href: "/admin", label: "Dashboard", exact: true },
    { href: "/admin/enquiries", label: "Enquiries" },
    { href: "/admin/destinations", label: "Destinations" },
    ...(isAdmin ? [{ href: "/admin/users", label: "Users" }] : []),
  ];
  return (
    <nav aria-label="Admin" className="flex flex-wrap gap-1 text-sm">
      {items.map((i) => {
        const active = i.exact ? pathname === i.href : pathname.startsWith(i.href);
        return (
          <Link
            key={i.href}
            href={i.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 font-medium ${active ? "bg-t-accent-soft text-t-accent" : "text-t-muted hover:text-t-ink"}`}
          >
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
