import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    unoptimized: true,
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 1080, 1920],
    imageSizes: [64, 128, 256],
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cpzplvifayzyihjzecdp.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "gkpisinode.org",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;