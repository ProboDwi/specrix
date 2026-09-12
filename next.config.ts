import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "*.samsung.com" },
      { protocol: "https", hostname: "*.xiaomi.com" },
      { protocol: "https", hostname: "*.asus.com" },
    ],
  },
};

export default nextConfig;
