import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TripBuddy: free trip plans for India",
    short_name: "TripBuddy",
    description: "Free day-by-day itineraries for India. No sign-up, no payment.",
    start_url: "/",
    display: "standalone",
    background_color: "#f1eee8",
    theme_color: "#2f6b4f",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
