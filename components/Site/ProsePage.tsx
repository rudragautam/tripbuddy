import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "./SiteChrome";

export default function ProsePage({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {intro && <p className="mt-3 text-lg text-t-muted">{intro}</p>}
        <div className="mt-8 space-y-6 leading-relaxed [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_p]:text-t-ink/85 [&_ul]:space-y-2">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
