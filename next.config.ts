import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {},
  serverExternalPackages: ['pdf-parse', '@napi-rs/canvas'],
};

export default nextConfig;
