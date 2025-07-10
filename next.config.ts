import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'phinf.pstatic.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
