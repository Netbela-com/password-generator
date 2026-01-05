import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    images : {
      domains: ['images.unsplash.com']
    }
  /* config options here */
};

export default nextConfig;
