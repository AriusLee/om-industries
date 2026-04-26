import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Public reader site for OM Industries. Backed by the main Orionmano API.
  images: {
    remotePatterns: [
      // Unsplash hero images. We accept any path under their image CDN.
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
};

export default nextConfig;
