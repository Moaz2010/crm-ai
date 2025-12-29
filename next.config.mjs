/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during builds for faster builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript checks during builds for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore specific files in build
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};

export default nextConfig;
