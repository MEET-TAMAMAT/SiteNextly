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
            value: "frame-ancestors 'self' https://admin.tamamat.com https://directus-production-d4f6.up.railway.app; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://api.zadarma.com; frame-src 'self' https://challenges.cloudflare.com; connect-src 'self' https://challenges.cloudflare.com https://admin.tamamat.com https://directus-production-d4f6.up.railway.app https://api.zadarma.com; style-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; img-src 'self' data: https:",
          },
        ],
      },
    ];
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  transpilePackages: ['@directus/sdk'],
};

export default nextConfig;