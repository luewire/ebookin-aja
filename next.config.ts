import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable Turbopack to avoid Prisma client issues
  experimental: {
    turbo: false,
  },
}

export default nextConfig;
