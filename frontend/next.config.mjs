/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false, 
  },
  typescript: {
    ignoreBuildErrors: false, 
  },
  images: {
    unoptimized: false, 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', 
      },
    ],
  },
};

export default nextConfig;
