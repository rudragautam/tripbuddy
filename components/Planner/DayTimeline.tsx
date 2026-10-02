import Image from "next/image";
import { BedDouble, Lightbulb, Moon, Sun, Sunrise } from "lucide-react";
import type { DayPlan } from "@/lib/types";

const parts = [
  { key: "morning", label: "Morning", Icon: Sunrise },
  { key: "afternoon", label: "Afternoon", Icon: Sun },
  { key: "evening", label: "Evening", Icon: Moon },
] as const;

export default function DayTimeline({
  days,
  activeDay,
  onSelectDay,
}: {
  days: DayPlan[];
  activeDay: number;
  onSelectDay: (i: number) => void;
}) {
  return (
    <ol className="relative space-y-3">
      {/* spine */}
      <span className="absolute top-6 bottom-6 left-[19px] w-0.5 bg-t-accent-soft" aria-hidden />

      {days.map((day, i) => {
        const open = i === activeDay;
        return (
          <li key={day.title} className="relative pl-12">
            <span
              className={`absolute top-4 left-0 grid size-10 place-items-center rounded-full text-sm font-bold transition-colors ${
                open ? "bg-t-accent text-t-accent-ink" : "tactile-sm text-t-ink"
              }`}
              aria-hidden
            >
              {i + 1}
            </span>

            <div className={`tactile overflow-hidden transition-shadow ${open ? "ring-2 ring-t-accent" : ""}`}>
              <button
                type="button"
                onClick={() => onSelectDay(i)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <span>
                  <span className="block text-xs font-semibold tracking-widest text-t-accent uppercase">
                    Day {i + 1}
                  </span>
                  <span className="block font-semibold">{day.title}</span>
                </span>
                <span className="text-xs text-t-muted">{open ? "Showing on map" : "View"}</span>
              </button>

              {open && (
                <div className="rise space-y-3 border-t border-black/5 px-5 pt-4 pb-5">
                  {day.stops.some((s) => s.image) && (
                    <ul className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-1">
                      {day.stops
                        .filter((s) => s.image)
                        .map((s) => (
                          <li key={s.name} className="w-40 shrink-0 snap-start sm:w-44">
                            <figure className="m-0">
                              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black/5 shadow-sm">
                                <Image
                                  src={s.image!.src}
                                  alt={s.image!.alt}
                                  fill
                                  sizes="176px"
                                  className="object-cover"
                                />
                              </div>
                              <figcaption className="mt-1.5">
                                <span className="block truncate text-xs font-semibold">{s.name}</span>
                                <a
                                  href={s.image!.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block truncate text-[10px] text-t-muted hover:underline"
                                >
                                  {s.image!.author} · {s.image!.license}
                                </a>
                              </figcaption>
                            </figure>
                          </li>
                        ))}
                    </ul>
                  )}
                  {parts.map(({ key, label, Icon }) => (
                    <div key={key} className="flex gap-3">
                      <Icon className="mt-0.5 size-4 shrink-0 text-t-accent" aria-hidden />
                      <p className="text-sm leading-relaxed">
                        <span className="font-semibold">{label}. </span>
                        <span className="text-t-muted">{day[key]}</span>
                      </p>
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-t-accent-soft px-3 py-1 text-xs font-medium">
                      <BedDouble className="size-3.5" aria-hidden /> Stay: {day.stay}
                    </span>
                  </div>
                  {day.tip && (
                    <p className="flex gap-2 rounded-2xl bg-t-bg px-4 py-3 text-sm">
                      <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-500" aria-hidden />
                      <span>{day.tip}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
