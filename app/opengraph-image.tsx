import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/** Default social preview for pages without their own photo (home, listings, about, enquire). */
export const alt = "TripBuddy: free day-by-day trip plans for India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #2f6b4f 0%, #1c4a36 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "#f1eee8",
              color: "#2f6b4f",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            TB
          </div>
          <div style={{ fontSize: 40, fontWeight: 700 }}>{site.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
            Free trip plans for India
          </div>
          <div style={{ fontSize: 34, opacity: 0.9 }}>Day-by-day itineraries with map, weather and budget</div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 26 }}>
          {["Free", "No sign-up", "No payment"].map((t) => (
            <div key={t} style={{ padding: "10px 22px", borderRadius: 999, background: "rgba(241,238,232,0.18)" }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
