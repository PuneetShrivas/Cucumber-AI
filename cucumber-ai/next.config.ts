import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
experimental: {
    ppr: true,
  },
  devIndicators: {
    position: "bottom-right",
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
};

export default nextConfig;
