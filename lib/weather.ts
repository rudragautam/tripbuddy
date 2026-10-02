export type Sky = "clear" | "partly" | "cloudy" | "fog" | "rain" | "snow" | "storm";

export type WeatherSlot = { label: string; temp: number; sky: Sky; isDay: boolean };

export type Weather = {
  temp: number;
  sky: Sky;
  isDay: boolean;
  slots: WeatherSlot[];
  live: boolean;
};

function skyFromCode(code: number): Sky {
  if (code === 0) return "clear";
  if (code <= 2) return "partly";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 95) return "storm";
  return "rain";
}

export const skyLabel: Record<Sky, string> = {
  clear: "Sunny",
  partly: "Partly cloudy",
  cloudy: "Cloudy",
  fog: "Foggy",
  rain: "Rain",
  snow: "Snow",
  storm: "Thunderstorm",
};

type OpenMeteo = {
  current: { temperature_2m: number; weather_code: number; is_day: number };
  hourly: { time: string[]; temperature_2m: number[]; weather_code: number[]; is_day: number[] };
};

function hourLabel(iso: string) {
  const h = Number(iso.slice(11, 13));
  const suffix = h < 12 ? "AM" : "PM";
  return `${h % 12 === 0 ? 12 : h % 12}${suffix}`;
}

/** Current weather plus four 3-hourly slots, refreshed every 30 minutes. */
export async function getWeather(lat: number, lng: number): Promise<Weather> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,weather_code,is_day` +
    `&hourly=temperature_2m,weather_code,is_day&forecast_hours=13&timezone=Asia%2FKolkata`;

  try {
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
    const data = (await res.json()) as OpenMeteo;
    const { current, hourly } = data;

    const slots: WeatherSlot[] = [
      {
        label: "Now",
        temp: Math.round(current.temperature_2m),
        sky: skyFromCode(current.weather_code),
        isDay: current.is_day === 1,
      },
    ];
    for (const i of [3, 6, 9, 12]) {
      if (hourly.time[i] === undefined) break;
      slots.push({
        label: hourLabel(hourly.time[i]),
        temp: Math.round(hourly.temperature_2m[i]),
        sky: skyFromCode(hourly.weather_code[i]),
        isDay: hourly.is_day[i] === 1,
      });
    }

    return {
      temp: Math.round(current.temperature_2m),
      sky: skyFromCode(current.weather_code),
      isDay: current.is_day === 1,
      slots,
      live: true,
    };
  } catch {
    return { temp: 0, sky: "clear", isDay: true, slots: [], live: false };
  }
}
