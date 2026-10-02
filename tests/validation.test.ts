import { describe, expect, it } from "vitest";
import { enquirySchema } from "@/lib/validation";

const base = { name: "Asha Rao", phone: "+91 98765 43210", consent: "on" };

describe("enquiry validation", () => {
  it("accepts a minimal enquiry and drops empty optionals", () => {
    const r = enquirySchema.parse({ ...base, email: "", days: "", travelDate: "", notes: "" });
    expect(r).toMatchObject({ name: "Asha Rao", email: undefined, days: undefined, notes: undefined });
  });

  it("coerces numbers", () => {
    expect(enquirySchema.parse({ ...base, days: "4", people: "2" })).toMatchObject({ days: 4, people: 2 });
  });

  it.each([
    ["missing consent", { ...base, consent: undefined }],
    ["short phone", { ...base, phone: "12345" }],
    ["letters in phone", { ...base, phone: "call me maybe" }],
    ["bad email", { ...base, email: "nope" }],
    ["one-letter name", { ...base, name: "A" }],
    ["bad date", { ...base, travelDate: "next week" }],
  ])("rejects %s", (_label, input) => {
    expect(enquirySchema.safeParse(input).success).toBe(false);
  });
});
