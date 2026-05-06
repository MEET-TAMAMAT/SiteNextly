/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "directus-production-d4f6.up.railway.app",
      },
      {
        protocol: "https",
        hostname: "admin.tamamat.com",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://admin.tamamat.com https://directus-production-d4f6.up.railway.app",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/directus/:path*',
        destination: 'https://admin.tamamat.com/:path*',
      },
    ];
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  transpilePackages: ['@directus/sdk'],
};

export default nextConfig;