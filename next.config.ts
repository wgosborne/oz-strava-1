import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/lmstudio',
        destination: 'http://localhost:1234/v1/chat/completions',
      },
    ];
  },
};

export default nextConfig;
