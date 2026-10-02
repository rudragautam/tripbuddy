import type { Metadata } from "next";
import Link from "next/link";
import { logoutAction } from "@/app/admin/actions/auth";
import AdminNav from "@/components/Admin/AdminNav";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: { default: "Admin", template: "%s · TripBuddy admin" }, robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-[#f4f4f2] text-t-ink">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-bold">
              Trip<span className="text-t-accent">Buddy</span> <span className="font-medium text-t-muted">admin</span>
            </Link>
            <AdminNav isAdmin={user.role === "admin"} />
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/" target="_blank" className="text-t-muted hover:text-t-ink">
              View site ↗
            </Link>
            <Link href="/admin/account" className="text-t-muted hover:text-t-ink">
              {user.name} · {user.role}
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="rounded-full border border-black/10 px-3 py-1.5 font-semibold">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
