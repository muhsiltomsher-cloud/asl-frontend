import { Suspense } from "react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { generateMetadata as generateSeoMetadata } from "@/lib/utils/seo";
import { getProducts, getCategories } from "@/lib/api/woocommerce";
import { getPageSeo } from "@/lib/api/wordpress";
import type { Locale } from "@/config/site";
import type { Metadata } from "next";
import { BundleManagerClient } from "./BundleManagerClient";

export const revalidate = 300;

interface BundleManagerPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ productId?: string }>;
}

// Default SEO values (fallback when WordPress page doesn't exist)
const defaultSeo = {
  title: { en: "Fragrance Bundle Creator", ar: "منشئ حزم العطور" },
  description: {
    en: "Create custom fragrance bundles and save more. Choose from a wide range of premium perfumes and aromatic oils",
    ar: "أنشئ حزم عطور مخصصة واستمتع بتوفير أكبر. اختر من مجموعة واسعة من العطور الفاخرة والزيوت العطرية",
  },
  keywords: {
    en: ["perfume bundles", "fragrance deals", "perfume offers", "fragrance collection", "bulk perfume"],
    ar: ["حزم عطور", "عروض عطور", "توفير عطور", "مجموعة عطور", "عطور بالجملة"],
  },
};

export async function generateMetadata({
  params,
}: BundleManagerPageProps): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as Locale;
  const isAr = lang === "ar";

  const wpSeo = await getPageSeo("bundle-manager", lang);

  return generateSeoMetadata({
    title: wpSeo?.title || (isAr ? defaultSeo.title.ar : defaultSeo.title.en),
    description: wpSeo?.description || (isAr ? defaultSeo.description.ar : defaultSeo.description.en),
    image: wpSeo?.ogImage || undefined,
    locale: lang,
    pathname: "/bundle-manager",
    keywords: isAr ? defaultSeo.keywords.ar : defaultSeo.keywords.en,
  });
}

export default async function BundleManagerPage({
  params,
  searchParams,
}: BundleManagerPageProps) {
  const { locale } = await params;
  const { productId } = await searchParams;
  const isRTL = locale === "ar";

  const breadcrumbItems = [
    {
      name: isRTL ? "المتجر" : "Shop",
      href: `/${locale}/shop`,
    },
    {
      name: isRTL ? "منشئ الحزم" : "Bundles Creator",
      href: `/${locale}/bundle-manager`,
    },
  ];

  const [{ products }, categories] = await Promise.all([
    getProducts({
      per_page: 100,
      locale: locale as Locale,
    }),
    getCategories(locale as Locale),
  ]);

  const tags = products.flatMap((p) => p.tags || []);
  const uniqueTags = Array.from(
    new Map(tags.map((t) => [t.id, t])).values()
  );

  return (
    <div className="container mx-auto px-4 py-3">
      <Breadcrumbs items={breadcrumbItems} locale={locale as Locale} />

      <div className="mb-3">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {isRTL ? "منشئ الحزم" : "Bundles Creator"}
        </h1>
        <p className="mt-2 text-gray-600">
          {isRTL
            ? "إنشاء وتكوين حزم المنتجات مع ميزات متقدمة مثل BOPO"
            : "Create and configure product bundles with advanced BOPO-style features"}
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-600 border-t-transparent" />
          </div>
        }
      >
        <BundleManagerClient
          locale={locale as Locale}
          categories={categories}
          products={products}
          tags={uniqueTags}
          productId={productId ? Number(productId) : undefined}
        />
      </Suspense>
    </div>
  );
}
