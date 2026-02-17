import type { Metadata } from "next";
import { siteConfig, type Locale } from "@/config/site";

interface AlternateUrls {
  en?: string;
  ar?: string;
}

interface GenerateMetadataParams {
  title?: string;
  description?: string;
  image?: string;
  locale: Locale;
  pathname: string;
  noIndex?: boolean;
  alternatePathnames?: AlternateUrls;
  keywords?: string[];
}

export function generateMetadata({
  title,
  description,
  image,
  locale,
  pathname,
  noIndex = false,
  alternatePathnames,
  keywords,
}: GenerateMetadataParams): Metadata {
  // Don't append site name here - the layout template already does this
  // Layout uses: template: `%s | ${siteConfig.name}`
  const fullTitle = title || siteConfig.name;
  const fullDescription = description || siteConfig.description;
  const ogImage = image || siteConfig.ogImage;
  const url = `${siteConfig.url}/${locale}${pathname}`;

  const enPathname = alternatePathnames?.en || pathname;
  const arPathname = alternatePathnames?.ar || pathname;

  return {
    title: fullTitle,
    description: fullDescription,
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
      languages: {
        en: `${siteConfig.url}/en${enPathname}`,
        ar: `${siteConfig.url}/ar${arPathname}`,
        "x-default": `${siteConfig.url}/en${enPathname}`,
      },
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [ogImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

export function generateProductJsonLd(product: {
  name: string;
  description: string;
  image: string;
  price: string;
  currency: string;
  sku?: string;
  availability: "InStock" | "OutOfStock";
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability}`,
      url: product.url,
    },
  };
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: "Premium fragrances and aromatic products crafted in the UAE. Explore perfumes, body care, and home fragrances.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+971-50-607-1405",
      contactType: "customer service",
      availableLanguage: ["English", "Arabic"],
    },
    sameAs: [
      siteConfig.links.instagram,
      siteConfig.links.facebook,
      siteConfig.links.twitter,
    ],
  };
}

export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/en/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateCollectionPageJsonLd(params: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: params.name,
    description: params.description,
    url: params.url,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function generateStoreJsonLd(stores: {
  name: string;
  address: string;
  city: string;
  country: string;
  url: string;
}[]) {
  return stores.map((store) => ({
    "@context": "https://schema.org",
    "@type": "Store",
    name: `Aromatic Scents Lab - ${store.name}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: store.address,
      addressLocality: store.city,
      addressCountry: store.country,
    },
    url: store.url,
    parentOrganization: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "10:00",
      closes: "22:00",
    },
  }));
}

export function generateFAQJsonLd(
  items: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
