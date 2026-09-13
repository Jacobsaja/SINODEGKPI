import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    // unoptimized: true digunakan untuk memastikan penggunaan Vercel Free Tier tetap 0 transform
    unoptimized: true,
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