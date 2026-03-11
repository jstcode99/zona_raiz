import type { NextConfig } from "next";
import { ROUTE_TRANSLATIONS } from "./infrastructure/config/routes.i18n";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "54321",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // puedes poner 5mb, 10mb, etc.
    },
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async rewrites() {
    return Object.entries(ROUTE_TRANSLATIONS).map(([es, en]) => ({
      source: es,
      destination: en,
    }))
  },
};

export default nextConfig;
