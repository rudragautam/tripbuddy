import type { CSSProperties } from "react";
import type { TourType } from "./types";

export type Theme = {
  label: string;
  /** One line used on the "browse by trip type" tiles */
  blurb: string;
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  accent: string;
  accentInk: string;
  accentSoft: string;
  /** Weather card can invert (dark card on the desert theme, as in the reference) */
  weatherBg: string;
  weatherInk: string;
  mapLand: string;
  mapLine: string;
};

export const themes: Record<TourType, Theme> = {
  hills: {
    label: "Hills",
    blurb: "Tea gardens, toy trains and cool air",
    bg: "#eef1ea",
    surface: "#fbfcf8",
    ink: "#1d2a22",
    muted: "#5d6b60",
    accent: "#2f6b4f",
    accentInk: "#ffffff",
    accentSoft: "#dce9df",
    weatherBg: "#2f6b4f",
    weatherInk: "#ffffff",
    mapLand: "#d9e6d3",
    mapLine: "#ffffff",
  },
  mountain: {
    label: "Mountains",
    blurb: "High passes, monasteries and big skies",
    bg: "#ecf0f4",
    surface: "#fbfcfd",
    ink: "#18232e",
    muted: "#5a6773",
    accent: "#3b5f86",
    accentInk: "#ffffff",
    accentSoft: "#dbe5ef",
    weatherBg: "#26394f",
    weatherInk: "#ffffff",
    mapLand: "#d6dfe8",
    mapLine: "#ffffff",
  },
  desert: {
    label: "Desert",
    blurb: "Dunes, forts and nights under the stars",
    bg: "#f3ece4",
    surface: "#fcf8f3",
    ink: "#2a1d16",
    muted: "#735f52",
    accent: "#b9502a",
    accentInk: "#ffffff",
    accentSoft: "#f4dccd",
    weatherBg: "#2b2a29",
    weatherInk: "#ffffff",
    mapLand: "#e9b48c",
    mapLine: "#fff6ee",
  },
  beach: {
    label: "Beaches",
    blurb: "Shacks, coves and sunsets on the sea",
    bg: "#eaf1f1",
    surface: "#fafcfc",
    ink: "#12292c",
    muted: "#54696d",
    accent: "#1c7177",
    accentInk: "#ffffff",
    accentSoft: "#d3e9ea",
    weatherBg: "#1c7177",
    weatherInk: "#ffffff",
    mapLand: "#bfe0df",
    mapLine: "#ffffff",
  },
  backwaters: {
    label: "Backwaters",
    blurb: "Houseboats, palms and slow canals",
    bg: "#edf0e6",
    surface: "#fbfcf7",
    ink: "#1c2618",
    muted: "#5b6652",
    accent: "#3d6b2c",
    accentInk: "#ffffff",
    accentSoft: "#e0e9d2",
    weatherBg: "#2f4a24",
    weatherInk: "#ffffff",
    mapLand: "#cfe0c2",
    mapLine: "#f2f7ea",
  },
  heritage: {
    label: "Heritage",
    blurb: "Palaces, ghats and old city lanes",
    bg: "#f5ece9",
    surface: "#fdf9f7",
    ink: "#2b1a1a",
    muted: "#735b58",
    accent: "#a8434f",
    accentInk: "#ffffff",
    accentSoft: "#f2dade",
    weatherBg: "#a8434f",
    weatherInk: "#ffffff",
    mapLand: "#ecc9bf",
    mapLine: "#fff7f3",
  },
  wildlife: {
    label: "Wildlife",
    blurb: "Jeep safaris, tigers and rhinos",
    bg: "#f0ede1",
    surface: "#fcfbf5",
    ink: "#232214",
    muted: "#646149",
    accent: "#5c6b2a",
    accentInk: "#ffffff",
    accentSoft: "#e6e8cf",
    weatherBg: "#5c6b2a",
    weatherInk: "#ffffff",
    mapLand: "#dedcb4",
    mapLine: "#fbfaee",
  },
  snow: {
    label: "Snow",
    blurb: "Ski slopes, gondolas and white valleys",
    bg: "#eef2f6",
    surface: "#ffffff",
    ink: "#142033",
    muted: "#56647a",
    accent: "#27467a",
    accentInk: "#ffffff",
    accentSoft: "#dde6f3",
    weatherBg: "#27467a",
    weatherInk: "#ffffff",
    mapLand: "#e3eaf3",
    mapLine: "#ffffff",
  },
};

/** CSS variables consumed by the `t-*` Tailwind colors in globals.css */
export function themeVars(type: TourType): CSSProperties {
  const t = themes[type];
  return {
    "--t-bg": t.bg,
    "--t-surface": t.surface,
    "--t-ink": t.ink,
    "--t-muted": t.muted,
    "--t-accent": t.accent,
    "--t-accent-ink": t.accentInk,
    "--t-accent-soft": t.accentSoft,
    "--t-weather-bg": t.weatherBg,
    "--t-weather-ink": t.weatherInk,
    "--t-map-land": t.mapLand,
    "--t-map-line": t.mapLine,
  } as CSSProperties;
}
