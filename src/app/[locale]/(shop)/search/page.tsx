import { Suspense } from "react";
import { generateMetadata as generateSeoMetadata } from "@/lib/utils/seo";
import type { Locale } from "@/config/site";
import type { Metadata } from "next";
import { SearchResultsClient } from "./SearchResultsClient";
import { ProductGridSkeleton } from "@/components/common/Skeleton";
import { getFreeGiftProductIds, getBundleEnabledProductSlugs } from "@/lib/api/woocommerce";

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  
  return generateSeoMetadata({
    title: locale === "ar" 
      ? query ? `نتائج البحث عن: ${query}` : "البحث في العطور"
      : query ? `Search results for: ${query}` : "Search Fragrances & Perfumes",
    description:
      locale === "ar"
        ? "ابحث في مجموعتنا الواسعة من العطور الفاخرة والزيوت العطرية ومنتجات العناية بالجسم ومعطرات المنزل"
        : "Search our extensive collection of premium fragrances, aromatic oils, body care products, and home fragrances",
    locale: locale as Locale,
    pathname: "/search",
    noIndex: true,
    keywords: locale === "ar"
      ? ["بحث عطور", "عطور فاخرة", "زيوت عطرية", "منتجات عطرية"]
      : ["search perfumes", "find fragrances", "aromatic products", "perfume search"],
  });
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = await params;
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";

  // Fetch hidden gift product IDs and bundle product slugs in parallel
  const [hiddenGiftProductIds, bundleProductSlugs] = await Promise.all([
    getFreeGiftProductIds(),
    getBundleEnabledProductSlugs(),
  ]);

  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchResultsClient 
        locale={locale as Locale} 
        initialQuery={query}
        hiddenGiftProductIds={hiddenGiftProductIds}
        bundleProductSlugs={bundleProductSlugs}
      />
    </Suspense>
  );
}

function SearchPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-10 w-64 skeleton-shimmer rounded-lg" />
          <div className="mt-2 h-5 w-48 skeleton-shimmer rounded" />
        </div>
        <ProductGridSkeleton count={12} />
      </div>
    </div>
  );
}
