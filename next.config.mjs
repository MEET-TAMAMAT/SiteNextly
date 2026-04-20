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
  compiler: {
    // Enable SWC minification for better backward compatibility
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Ensure proper transpilation for older browsers
  experimental: {
    esmExternals: false,
  },
  transpilePackages: ['@directus/sdk'],
};

export default nextConfig;
