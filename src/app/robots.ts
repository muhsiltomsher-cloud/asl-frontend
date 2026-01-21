import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/*/cart",
          "/*/checkout",
          "/*/order-confirmation",
          "/*/account",
          "/*/login",
          "/*/register",
          "/*/forgot-password",
          "/*/reset-password",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
