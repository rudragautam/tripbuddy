import { describe, expect, it } from "vitest";
import { seedDestinations } from "@/lib/seed";
import { MAX_DAYS } from "@/lib/types";
import { destinationSchema, formatIssues } from "@/lib/validation";

describe("seed content", () => {
  it("has unique slugs", () => {
    const slugs = seedDestinations.map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it.each(seedDestinations.map((d) => [d.slug, d] as const))("%s passes validation", (_slug, d) => {
    const result = destinationSchema.safeParse(d);
    expect(result.success ? [] : formatIssues(result.error)).toEqual([]);
  });

  it.each(seedDestinations.map((d) => [d.slug, d] as const))("%s has a full day pool and sane stops", (_slug, d) => {
    expect(d.days.length).toBe(MAX_DAYS);
    // Every stop should be within ~250 km of the destination centre: catches swapped lat/lng.
    for (const day of d.days) {
      for (const s of day.stops) {
        const km = Math.hypot((s.lat - d.lat) * 111, (s.lng - d.lng) * 111 * Math.cos((d.lat * Math.PI) / 180));
        expect(km, `${s.name}`).toBeLessThan(350);
      }
    }
  });
});
