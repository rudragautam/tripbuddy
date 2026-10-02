import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // PGlite ships WASM + data files that must be loaded from node_modules, not bundled.
  serverExternalPackages: ["@electric-sql/pglite"],
  turbopack: { root: __dirname },
  images: {
    // Hosts editors may use for photos (keep in sync with PHOTO_HOSTS in lib/validation.ts).
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  async redirects() {
    // Spellings people type for trip types (/explore/hill → /explore/hills).
    const aliases: Record<string, string> = {
      hill: "hills",
      mountains: "mountain",
      deserts: "desert",
      beaches: "beach",
      backwater: "backwaters",
    };
    return Object.entries(aliases).map(([from, to]) => ({
      source: `/explore/${from}`,
      destination: `/explore/${to}`,
      permanent: true,
    }));
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/admin/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
    ];
  },
};

export default nextConfig;
