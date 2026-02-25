import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { ProductGridSkeleton } from "@/components/common/Skeleton";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getDictionary } from "@/i18n";
import { generateMetadata as generateSeoMetadata } from "@/lib/utils/seo";
import { getCategoryBySlug, getProductsByCategory, getCategories, getFreeGiftProductInfo, getBundleEnabledProductSlugs, getEnglishSlugFromLocalizedSlug } from "@/lib/api/woocommerce";
import { siteConfig, type Locale } from "@/config/site";
import type { Metadata } from "next";
import { CategoryClient } from "./CategoryClient";
import { decodeHtmlEntities } from "@/lib/utils";

// Helper to check if a slug contains non-ASCII characters (e.g., Arabic)
function isNonAsciiSlug(slug: string): boolean {
  return /[^\x00-\x7F]/.test(slug);
}

// Increased revalidate time for better cache hit rates (5 minutes instead of 60 seconds)
export const revalidate = 300;

// Pre-render all categories at build time for better performance
// Always use English slugs for URLs regardless of locale to prevent duplicate content
export async function generateStaticParams() {
  try {
    // Fetch English categories only - use English slugs for all locales
    // This prevents generating Arabic-slug pages that would cause duplicate content
    const categories = await getCategories("en" as Locale);
    const allParams: { locale: string; slug: string }[] = [];
    
    for (const locale of siteConfig.locales) {
      for (const category of categories) {
        allParams.push({ locale, slug: category.slug });
      }
    }
    
    return allParams;
  } catch {
    // Return empty array if fetch fails - pages will be generated on-demand
    return [];
  }
}

interface CategoryPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = await getCategoryBySlug(slug, locale as Locale);
  const categoryName = decodeHtmlEntities(category?.name || slug.charAt(0).toUpperCase() + slug.slice(1));

  // Use English slug for canonical URL to prevent duplicate content
  const canonicalSlug = getEnglishSlugFromLocalizedSlug(slug) || slug;

  // Generate unique, category-specific descriptions that differentiate each category in search results
  const categoryCount = category?.count || 0;
  const description =
    locale === "ar"
      ? `تسوق ${categoryName} من Aromatic Scents Lab. ${categoryCount > 0 ? `اكتشف ${categoryCount}+ منتج` : "اكتشف مجموعتنا"} من العطور الفاخرة المصنوعة يدوياً في الإمارات. توصيل مجاني للطلبات فوق 500 درهم.`
      : `Shop ${categoryName} at Aromatic Scents Lab. ${categoryCount > 0 ? `Explore ${categoryCount}+ handcrafted` : "Explore our handcrafted"} luxury products made in the UAE. Free delivery on orders over 500 AED.`;

  return generateSeoMetadata({
    title: locale === "ar"
      ? `${categoryName} | تسوق أون لاين`
      : `${categoryName} | Shop Online`,
    description,
    locale: locale as Locale,
    pathname: `/category/${canonicalSlug}`,
    keywords: locale === "ar"
      ? [categoryName, "عطور", "عطور فاخرة", "منتجات عطرية", "Aromatic Scents Lab", "عطور الإمارات", "شراء عطور اون لاين", "عود عربي", "هدايا عطرية", "عطور مسك", "عطور عنبر", "عطور دبي", "أفضل عطور", "عطور نسائية", "عطور رجالية"]
      : [categoryName, "perfume", "premium fragrance", "aromatic products", "Aromatic Scents Lab", "UAE perfume shop", "buy perfume online", "Arabian oud", "fragrance gifts", "musk perfume", "amber fragrance", "Dubai perfume", "best perfume", "women perfume", "men cologne"],
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, slug } = await params;
  const dictionary = await getDictionary(locale as Locale);

  // If the URL contains a non-ASCII slug (e.g., Arabic), redirect to the English slug
  // This prevents duplicate content issues where both Arabic-slug and English-slug URLs get indexed
  if (isNonAsciiSlug(slug)) {
    const englishSlug = getEnglishSlugFromLocalizedSlug(slug);
    if (englishSlug && englishSlug !== slug) {
      redirect(`/${locale}/category/${englishSlug}`);
    }
    // If no English slug mapping found, try to find via URL-encoded version
    const encodedSlug = encodeURIComponent(slug);
    const englishSlugFromEncoded = getEnglishSlugFromLocalizedSlug(encodedSlug);
    if (englishSlugFromEncoded && englishSlugFromEncoded !== slug) {
      redirect(`/${locale}/category/${englishSlugFromEncoded}`);
    }
  }

  // Also check if the slug is a URL-encoded Arabic slug (e.g., %d8%a7%d9%84%d8%b9%d8%b7%d9%88%d8%b1)
  const englishSlugFromMapping = getEnglishSlugFromLocalizedSlug(slug);
  if (englishSlugFromMapping && englishSlugFromMapping !== slug) {
    redirect(`/${locale}/category/${englishSlugFromMapping}`);
  }

  // Fetch category and products from WooCommerce API
  const category = await getCategoryBySlug(slug, locale as Locale);
  
  if (!category) {
    notFound();
  }

  // Fetch products, gift product info (IDs and slugs), and bundle product slugs in parallel
  const [{ products: allProducts }, giftProductInfo, bundleProductSlugs] = await Promise.all([
    getProductsByCategory(slug, { per_page: 24, locale: locale as Locale }),
    getFreeGiftProductInfo(),
    getBundleEnabledProductSlugs(),
  ]);

  // Filter out gift products from the category listing
  // Use both ID and slug matching to handle WPML translations (different IDs per locale)
  const giftProductSlugsSet = new Set(giftProductInfo.slugs);
  const giftProductIdsSet = new Set(giftProductInfo.ids);
  const products = allProducts.filter(
    (product) => !giftProductIdsSet.has(product.id) && !giftProductSlugsSet.has(product.slug)
  );

    const breadcrumbItems = [
      { name: dictionary.common.shop, href: `/${locale}/shop` },
      { name: decodeHtmlEntities(category.name), href: `/${locale}/category/${slug}` },
    ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} locale={locale as Locale} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{decodeHtmlEntities(category.name)}</h1>
      </div>

      <Suspense fallback={<ProductGridSkeleton count={12} />}>
        <CategoryClient products={products} locale={locale as Locale} bundleProductSlugs={bundleProductSlugs} />
      </Suspense>

      {/* Category description at bottom for SEO - content is indexed but products are shown first */}
      {category.description && (
        <div className="mt-12 bg-gradient-to-r from-[#f8f5f0] to-[#faf8f5] rounded-xl p-6 border border-[#e8e4df] shadow-sm">
          <div 
            className="text-gray-700 leading-relaxed category-description [&_strong]:block [&_strong]:text-lg [&_strong]:text-gray-900 [&_strong]:font-semibold [&_strong]:mb-2 [&_a]:text-primary [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-primary/50 [&_a]:hover:decoration-primary [&_a]:transition-colors"
            dangerouslySetInnerHTML={{ __html: category.description }}
          />
        </div>
      )}
    </div>
  );
}
