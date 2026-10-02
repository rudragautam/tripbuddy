import Link from "next/link";
import SceneVisual from "@/components/Scene/SceneVisual";
import { themeVars, themes } from "@/lib/themes";
import type { Photo, TourType } from "@/lib/types";

/** "Browse by trip type" tile: the type's own colours, a cover photo, and how many plans it has. */
export default function TypeTile({ type, count, photo }: { type: TourType; count: number; photo?: Photo }) {
  return (
    <div style={themeVars(type)} className="h-full">
      <Link
        href={`/explore/${type}`}
        className="group block h-full rounded-3xl bg-t-bg p-3 text-t-ink transition-transform hover:-translate-y-1"
      >
        <div className="px-1 pt-1 pb-3">
          <SceneVisual
            type={type}
            name={themes[type].label}
            photo={photo}
            compact
            showCredit={false}
            sizes="(min-width: 768px) 22vw, 45vw"
          />
        </div>
        <div className="px-2 pb-2">
          <p className="font-bold">{themes[type].label}</p>
          <p className="text-xs text-t-muted">
            {count} {count === 1 ? "plan" : "plans"} · {themes[type].blurb}
          </p>
        </div>
      </Link>
    </div>
  );
}
