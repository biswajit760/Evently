import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/**', // Allows all paths (replaces the old 'domains' behavior)
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com', // <--- Add this object
        port: '',
      }
    ],
  }
};

export default nextConfig;