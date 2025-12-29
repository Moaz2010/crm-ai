import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable cache components for compatibility with dynamic dashboard pages
  cacheComponents: false,
};

export default nextConfig;
