import { describe, expect, it } from "vitest";
import { filterCards, type DestinationCard } from "@/lib/catalog";
import { csvCell } from "@/lib/csv";

const card = (over: Partial<DestinationCard>): DestinationCard => ({
  slug: "x",
  name: "X",
  state: "S",
  tagline: "",
  summary: "",
  tourType: "hills",
  bestTime: { months: "", note: "" },
  bestMonths: [10, 11],
  minDays: 2,
  dayCount: 6,
  featured: false,
  ...over,
});

describe("filterCards", () => {
  const cards = [
    card({ slug: "a", name: "Darjeeling", state: "West Bengal" }),
    card({ slug: "b", name: "Goa", tourType: "beach", bestMonths: [12, 1] }),
    card({ slug: "c", name: "Leh", tourType: "mountain", minDays: 4 }),
  ];
  const slugs = (r: DestinationCard[]) => r.map((c) => c.slug);

  it("searches name and state case-insensitively", () => {
    expect(slugs(filterCards(cards, { q: "bengal" }))).toEqual(["a"]);
  });
  it("filters by type and month", () => {
    expect(slugs(filterCards(cards, { type: "beach" }))).toEqual(["b"]);
    expect(slugs(filterCards(cards, { month: 1 }))).toEqual(["b"]);
  });
  it("respects minimum trip length", () => {
    expect(slugs(filterCards(cards, { days: 3 }))).toEqual(["a", "b"]);
  });
});

describe("csvCell", () => {
  it("quotes commas and quotes", () => expect(csvCell('a,"b"')).toBe('"a,""b"""'));
  it("neutralises formulas", () => expect(csvCell("=HYPERLINK()")).toBe("'=HYPERLINK()"));
  it("handles null", () => expect(csvCell(null)).toBe(""));
});
