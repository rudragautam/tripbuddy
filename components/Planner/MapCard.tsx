import { Navigation } from "lucide-react";
import type { DayPlan, Stop } from "@/lib/types";

const W = 400;
const H = 300;
const PAD = 40;

/** Fit lat/lng into the card, keeping the true aspect ratio (equirectangular with cos(lat)). */
export function projector(stops: Stop[]) {
  const lats = stops.map((s) => s.lat);
  const lngs = stops.map((s) => s.lng);
  const midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const k = Math.cos((midLat * Math.PI) / 180);

  const minX = Math.min(...lngs) * k;
  const maxX = Math.max(...lngs) * k;
  const minY = Math.min(...lats);
  const maxY = Math.max(...lats);
  const spanX = Math.max(maxX - minX, 0.02);
  const spanY = Math.max(maxY - minY, 0.02);
  const scale = Math.min((W - PAD * 2) / spanX, (H - PAD * 2) / spanY);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  return (s: Stop) => ({
    x: W / 2 + (s.lng * k - cx) * scale,
    y: H / 2 - (s.lat - cy) * scale,
  });
}

function directionsUrl(stops: Stop[]) {
  const pt = (s: Stop) => `${s.lat},${s.lng}`;
  if (stops.length === 1) return `https://www.google.com/maps/search/?api=1&query=${pt(stops[0])}`;
  const params = new URLSearchParams({
    api: "1",
    origin: pt(stops[0]),
    destination: pt(stops[stops.length - 1]),
  });
  if (stops.length > 2) params.set("waypoints", stops.slice(1, -1).map(pt).join("|"));
  return `https://www.google.com/maps/dir/?${params}`;
}

export default function MapCard({
  place,
  days,
  activeDay,
  onSelectDay,
}: {
  place: string;
  days: DayPlan[];
  activeDay: number;
  onSelectDay: (i: number) => void;
}) {
  const all = days.flatMap((d, di) => d.stops.map((s) => ({ ...s, day: di })));
  const project = projector(all);
  const active = days[activeDay];
  const route = all.map((s) => project(s));

  return (
    <section className="tactile flex flex-col p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3 px-1">
        <h2 className="font-semibold">{place} route</h2>
        <span className="text-xs text-t-muted">{all.length} stops</span>
      </div>

      <div className="relative mt-3 overflow-hidden rounded-2xl bg-t-map-land">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`Map of ${place} stops`}>
          {/* contour texture */}
          <g fill="none" stroke="var(--t-map-line)" strokeOpacity="0.35" strokeWidth="1">
            <path d="M-10 60 C 80 20, 160 90, 260 50 S 380 30, 420 70" />
            <path d="M-10 140 C 90 110, 170 170, 280 130 S 390 110, 420 150" />
            <path d="M-10 230 C 100 200, 180 260, 290 220 S 390 200, 420 240" />
            <path d="M120 -10 C 100 80, 160 160, 120 310" />
            <path d="M300 -10 C 330 90, 270 180, 320 310" />
          </g>
          {/* route */}
          <polyline
            points={route.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="var(--t-map-line)"
            strokeWidth="2.5"
            strokeDasharray="6 6"
            strokeLinecap="round"
          />
          {/* inactive pins first so the selected day's pins sit on top */}
          {[...all.keys()].sort((a, b) => Number(all[a].day === activeDay) - Number(all[b].day === activeDay)).map((i) => {
            const s = all[i];
            const p = route[i];
            const on = s.day === activeDay;
            return (
              <g
                key={`${s.name}-${i}`}
                transform={`translate(${p.x} ${p.y})`}
                className="cursor-pointer"
                onClick={() => onSelectDay(s.day)}
              >
                <title>{`Day ${s.day + 1}: ${s.name}`}</title>
                <circle r={on ? 15 : 11} fill={on ? "var(--t-accent)" : "var(--t-surface)"} stroke="var(--t-surface)" strokeWidth="3" />
                <text
                  textAnchor="middle"
                  y={on ? 5 : 4}
                  fontSize={on ? 13 : 11}
                  fontWeight="700"
                  fill={on ? "var(--t-accent-ink)" : "var(--t-ink)"}
                >
                  {s.day + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 px-1">
        <p className="min-w-0 truncate text-sm text-t-muted">
          <span className="font-semibold text-t-ink">Day {activeDay + 1}:</span>{" "}
          {active.stops.map((s) => s.name).join(" → ")}
        </p>
        <a
          href={directionsUrl(active.stops)}
          target="_blank"
          rel="noopener noreferrer"
          className="tactile-sm inline-flex shrink-0 items-center gap-1.5 px-3 py-2 text-sm font-semibold"
        >
          Directions <Navigation className="size-3.5" aria-hidden />
        </a>
      </div>
    </section>
  );
}
