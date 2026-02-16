import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.aromaticscentslab.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "aromaticscentslab.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
    ],
  },
  // Increase static page generation timeout to handle slow API responses during build
  staticPageGenerationTimeout: 120,
  // Enable experimental features for better caching
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_WC_API_URL || "https://cms.aromaticscentslab.com";
    return [
      {
        source: '/cms-media/:path*',
        destination: `${apiUrl}/wp-content/uploads/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        // Cache product images aggressively
        source: "/wp-content/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache API responses with stale-while-revalidate
        source: "/api/products",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=300, stale-while-revalidate=600",
          },
        ],
      },
      {
        // Cache category data longer
        source: "/api/categories",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=600, stale-while-revalidate=1200",
          },
        ],
      },
      {
        // Cache static assets (JS, CSS) with immutable headers
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache optimized images
        source: "/_next/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};


export default nextConfig;
