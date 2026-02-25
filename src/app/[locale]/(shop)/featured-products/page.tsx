import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/common/Skeleton";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getDictionary } from "@/i18n";
import { generateMetadata as generateSeoMetadata } from "@/lib/utils/seo";
import { getFeaturedProducts, getFreeGiftProductIds, getBundleEnabledProductSlugs } from "@/lib/api/woocommerce";
import type { Locale } from "@/config/site";
import type { Metadata } from "next";
import { FeaturedProductsClient } from "./FeaturedProductsClient";

export const revalidate = 300;

interface FeaturedProductsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: FeaturedProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateSeoMetadata({
    title: locale === "ar" ? "الأكثر مبيعاً | أفضل العطور الفاخرة والمميزة" : "Best Sellers | Top Rated Luxury Perfumes & Oud Fragrances",
    description:
      locale === "ar"
        ? "تسوق أفضل العطور المميزة والأكثر مبيعاً من Aromatic Scents Lab. عطور فاخرة وعود عربي وزيوت عطرية مصنوعة يدوياً في الإمارات. توصيل مجاني للطلبات فوق 500 درهم."
        : "Shop our best-selling luxury perfumes, Arabian oud & aromatic oils from Aromatic Scents Lab. Handcrafted in the UAE. Free delivery on orders over 500 AED.",
    locale: locale as Locale,
    pathname: "/featured-products",
    keywords: locale === "ar"
      ? ["عطور مميزة", "الأكثر مبيعاً", "أفضل العطور", "عطور فاخرة", "عطور عربية", "هدايا عطرية", "عطور دبي المميزة", "أفضل عطور الإمارات", "عطور شعبية", "عود فاخر", "مجموعات هدايا", "عطور مسك مميزة", "عطور عنبر فاخرة", "أفضل عطور عربية", "عطور فاخرة أون لاين", "عطور رائجة", "عطور فخمة دبي"]
      : ["featured perfumes", "best sellers", "top fragrances", "luxury perfume", "Arabian perfume", "fragrance gifts", "popular Dubai perfume", "best UAE perfume", "top rated oud", "luxury gift sets", "bestselling cologne", "best musk perfume", "best amber perfume", "top Arabian fragrance", "luxury perfume online", "trending perfume", "premium Dubai fragrance"],
  });
}

export default async function FeaturedProductsPage({ params }: FeaturedProductsPageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as Locale);
  const isRTL = locale === "ar";

  const breadcrumbItems = [
    { name: dictionary.common.shop, href: `/${locale}/shop` },
    { name: dictionary.sections.featuredProducts.title, href: `/${locale}/featured-products` },
  ];

  const [productsResult, giftProductIds, bundleProductSlugs] = await Promise.all([
    getFeaturedProducts({ per_page: 24, locale: locale as Locale }),
    getFreeGiftProductIds(),
    getBundleEnabledProductSlugs(),
  ]);

  const filteredProducts = productsResult.products.filter(
    (product) => !giftProductIds.includes(product.id)
  );

  const filteredTotal = productsResult.total - (productsResult.products.length - filteredProducts.length);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} locale={locale as Locale} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {dictionary.sections.featuredProducts.title}
        </h1>
        <p className="mt-2 text-gray-600">
          {isRTL
            ? "اكتشف منتجاتنا المميزة"
            : "Discover our best sellers"}
        </p>
      </div>

      <Suspense fallback={<ProductGridSkeleton count={12} />}>
        <FeaturedProductsClient
          products={filteredProducts}
          locale={locale as Locale}
          initialTotal={filteredTotal}
          initialTotalPages={productsResult.totalPages}
          giftProductIds={giftProductIds}
          bundleProductSlugs={bundleProductSlugs}
        />
      </Suspense>
    </div>
  );
}
