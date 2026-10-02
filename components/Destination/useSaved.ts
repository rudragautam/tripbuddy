"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "tripbuddy:saved";
const EVENT = "tripbuddy:saved-change";

function read(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

let snapshot: string[] | null = null;
function getSnapshot() {
  snapshot ??= read();
  return snapshot;
}
const empty: string[] = [];

function subscribe(onChange: () => void) {
  const handler = () => {
    snapshot = null;
    onChange();
  };
  window.addEventListener("storage", handler);
  window.addEventListener(EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(EVENT, handler);
  };
}

/** Saved destination slugs, kept in this browser only (no account needed). */
export function useSaved() {
  const saved = useSyncExternalStore(subscribe, getSnapshot, () => empty);

  const toggle = useCallback((slug: string) => {
    const current = read();
    const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // storage blocked (private mode); the toggle simply won't persist
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { saved, toggle, isSaved: (slug: string) => saved.includes(slug) };
}
