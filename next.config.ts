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
    optimizePackageImports: ["lucide-react", "swiper", "@mui/material", "@apollo/client", "@emotion/react", "@emotion/styled", "class-variance-authority", "clsx", "swr", "cookies-next"],
  },
  async redirects() {
    return [
      {
        source: '/:slug([\\w-]+)-perfume',
        destination: '/en/product/:slug-perfume',
        permanent: true,
      },
      {
        source: '/product/:slug',
        destination: '/en/product/:slug',
        permanent: true,
      },
      {
        source: '/product-category/:slug',
        destination: '/en/category/:slug',
        permanent: true,
      },
      {
        source: '/shop',
        destination: '/en/shop',
        permanent: true,
      },
    ];
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
    const securityHeaders = [
      {
        key: "X-Frame-Options",
        value: "DENY",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "X-XSS-Protection",
        value: "1; mode=block",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Cross-Origin-Opener-Policy",
        value: "same-origin-allow-popups",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      {
        key: "X-DNS-Prefetch-Control",
        value: "on",
      },
    ];

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/wp-content/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/api/products",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=300, stale-while-revalidate=600",
          },
        ],
      },
      {
        source: "/api/categories",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=600, stale-while-revalidate=1200",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/cms-media/:path*",
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
