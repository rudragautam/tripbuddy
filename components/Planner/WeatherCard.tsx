import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Moon, Sun } from "lucide-react";
import { skyLabel, type Sky, type Weather } from "@/lib/weather";

function SkyIcon({ sky, isDay, className }: { sky: Sky; isDay: boolean; className?: string }) {
  const props = { className, strokeWidth: 1.75, "aria-hidden": true } as const;
  if (sky === "clear") return isDay ? <Sun {...props} /> : <Moon {...props} />;
  if (sky === "partly") return isDay ? <CloudSun {...props} /> : <Moon {...props} />;
  if (sky === "cloudy") return <Cloud {...props} />;
  if (sky === "fog") return <CloudFog {...props} />;
  if (sky === "snow") return <CloudSnow {...props} />;
  if (sky === "storm") return <CloudLightning {...props} />;
  return <CloudRain {...props} />;
}

export default function WeatherCard({ weather, place }: { weather: Weather; place: string }) {
  if (!weather.live) {
    return (
      <section className="rounded-3xl bg-t-weather-bg p-5 text-t-weather-ink shadow-xl">
        <p className="text-sm opacity-80">Weather in {place}</p>
        <p className="mt-2 text-lg font-semibold">Live weather is unavailable right now.</p>
      </section>
    );
  }

  return (
    <section
      aria-label={`Weather in ${place}`}
      className="rounded-3xl bg-t-weather-bg p-5 text-t-weather-ink shadow-[0_18px_40px_-18px_rgb(0_0_0/0.5)]"
    >
      <div className="flex items-center gap-3">
        <SkyIcon sky={weather.sky} isDay={weather.isDay} className="size-12 text-amber-300" />
        <div>
          <p className="text-4xl font-semibold leading-none">{weather.temp}°</p>
          <p className="mt-1 text-sm opacity-80">
            {weather.sky === "clear" && !weather.isDay ? "Clear" : skyLabel[weather.sky]} · {place}
          </p>
        </div>
      </div>
      <ul className="mt-5 grid grid-cols-5 gap-1 text-center">
        {weather.slots.map((s) => (
          <li key={s.label} className="flex flex-col items-center gap-1.5">
            <span className="text-xs opacity-75">{s.label}</span>
            <SkyIcon sky={s.sky} isDay={s.isDay} className="size-5 text-amber-200" />
            <span className="text-sm font-semibold">{s.temp}°</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
