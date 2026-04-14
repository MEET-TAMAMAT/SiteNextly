/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "directus-production-d4f6.up.railway.app",
      },
    ],
  },
};

export default nextConfig;
