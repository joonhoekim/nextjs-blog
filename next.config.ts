import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  // Enable static image imports
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**',
      },
    ],
  },
};

export default nextConfig;
