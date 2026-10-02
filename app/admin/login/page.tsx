import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/Admin/LoginForm";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin sign in", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await getCurrentUser()) redirect("/admin");
  return (
    <main id="main" className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm">
        <p className="text-center text-lg font-bold">
          Trip<span className="text-t-accent">Buddy</span> admin
        </p>
        <LoginForm next={next?.startsWith("/admin") ? next : "/admin"} />
      </div>
    </main>
  );
}
