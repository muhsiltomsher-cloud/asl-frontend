import { notFound, redirect } from "next/navigation";
import { getProductBySlug, getRelatedProducts, getProducts, getEnglishSlugForProduct, getBundleConfig, getFreeGiftProductIds, getHiddenProductIds, getCategoryBySlug, getEnglishSlugForCategory, getProductUpsellIds, getProductsByIds } from "@/lib/api/woocommerce";
import { getProductAddons } from "@/lib/api/wcpa";
import { generateMetadata as generateSeoMetadata, generateProductJsonLd, generateBreadcrumbJsonLd } from "@/lib/utils/seo";
import { getTopbarSettings } from "@/lib/api/wordpress";
import { ProductDetail } from "./ProductDetail";
import { BuildYourOwnSetClient } from "../../build-your-own-set/BuildYourOwnSetClient";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig, type Locale } from "@/config/site";
import { decodeHtmlEntities } from "@/lib/utils";
import type { Metadata } from "next";
import type { WCProduct } from "@/types/woocommerce";

// Helper to check if a slug contains non-ASCII characters (e.g., Arabic)
function isNonAsciiSlug(slug: string): boolean {
  return /[^\x00-\x7F]/.test(slug);
}

// Helper to generate product JSON-LD data from WCProduct
function getProductJsonLdData(product: WCProduct, locale: string, slug: string) {
  const minorUnit = product.prices.currency_minor_unit || 2;
  const divisor = Math.pow(10, minorUnit);
  const price = (parseInt(product.prices.price, 10) / divisor).toFixed(2);
  const primaryCategory = product.categories?.[0]?.name || undefined;
  
  return generateProductJsonLd({
    name: decodeHtmlEntities(product.name),
    description: decodeHtmlEntities(product.short_description.replace(/<[^>]*>/g, "")).slice(0, 500),
    image: product.images[0]?.src || "",
    images: product.images.map((img) => img.src).filter(Boolean),
    price,
    currency: product.prices.currency_code,
    sku: product.sku || undefined,
    availability: product.is_in_stock ? "InStock" : "OutOfStock",
    url: `${siteConfig.url}/${locale}/product/${slug}`,
    brandName: siteConfig.name,
    category: primaryCategory ? decodeHtmlEntities(primaryCategory) : undefined,
    ratingValue: product.average_rating || undefined,
    reviewCount: product.review_count || undefined,
  });
}

// Increased revalidate time for better cache hit rates (5 minutes instead of 60 seconds)
export const revalidate = 300;

// Pre-render top products at build time for better performance
// Always use English slugs for URLs regardless of locale
export async function generateStaticParams() {
  try {
    // Fetch products with English locale to get English slugs
    const { products } = await getProducts({ per_page: 50, locale: "en" });
    const allParams: { locale: string; slug: string }[] = [];
    
    // Generate params for all locales but always use English slugs
    for (const locale of siteConfig.locales) {
      for (const product of products) {
        allParams.push({ locale, slug: product.slug });
      }
    }
    
    return allParams;
  } catch {
    // Return empty array if fetch fails - pages will be generated on-demand
    return [];
  }
}

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug, locale as Locale);

  if (!product) {
    return generateSeoMetadata({
      title: "Product Not Found",
      description: "The requested product could not be found.",
      locale: locale as Locale,
      pathname: `/product/${slug}`,
    });
  }

  const productName = decodeHtmlEntities(product.name);
  const categoryNames = product.categories?.map((c) => c.name) || [];
  const tagNames = product.tags?.map((t) => t.name) || [];

  // Build a richer product description for SEO
  // Truncate raw description at word boundary to avoid mid-word cuts
  const fullRawDescription = decodeHtmlEntities(product.short_description.replace(/<[^>]*>/g, ""));
  const rawDescription = fullRawDescription.length > 100
    ? fullRawDescription.slice(0, 100).replace(/\s+\S*$/, "")
    : fullRawDescription;
  const minorUnit = product.prices?.currency_minor_unit || 2;
  const divisor = Math.pow(10, minorUnit);
  const priceValue = product.prices?.price ? (parseInt(product.prices.price, 10) / divisor).toFixed(0) : null;
  const productDescription = locale === "ar"
    ? `${rawDescription ? rawDescription + ". " : ""}${productName} من Aromatic Scents Lab.${priceValue ? " السعر: " + priceValue + " درهم." : ""} توصيل مجاني للطلبات فوق 500 درهم.`
    : `${rawDescription ? rawDescription + ". " : ""}${productName} by Aromatic Scents Lab.${priceValue ? " Price: " + priceValue + " AED." : ""} Free delivery on orders over 500 AED.`;

  // Truncate final description at word boundary (max 160 chars for SEO)
  const trimmedDescription = productDescription.length > 160
    ? productDescription.slice(0, 160).replace(/\s+\S*$/, "") + "..."
    : productDescription;

  return generateSeoMetadata({
    title: locale === "ar"
      ? `${productName} | شراء أون لاين`
      : `${productName} | Buy Online`,
    description: trimmedDescription,
    locale: locale as Locale,
    pathname: `/product/${slug}`,
    image: product.images[0]?.src,
    keywords: [
      productName,
      ...categoryNames,
      ...tagNames,
      ...(locale === "ar"
        ? ["عطور", "شراء عطور", "عطور فاخرة", "عطور الإمارات", "عطور دبي", "عود عربي", "هدايا عطرية", "Aromatic Scents Lab", "عطور فخمة", "شراء عطر أون لاين", "عطور مسك", "عطور عنبر", "عطور فانيلا", "عطور عود", "أفضل عطور الإمارات"]
        : ["perfume", "buy fragrance", "luxury perfume UAE", "Dubai perfume", "Arabian oud", "fragrance gift", "premium scent", "Aromatic Scents Lab", "niche perfume", "buy perfume online", "musk perfume", "amber fragrance", "vanilla perfume", "oud fragrance", "best perfume UAE"]),
    ],
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  
  // If the URL contains a non-ASCII slug (e.g., Arabic), find the product and redirect to English slug
  if (isNonAsciiSlug(slug)) {
    // Try to find the product using the Arabic slug
    const product = await getProductBySlug(slug, locale as Locale);
    if (product) {
      // Get the English slug for this product
      const englishSlug = await getEnglishSlugForProduct(product.id);
      if (englishSlug && englishSlug !== slug) {
        // Redirect to the English slug URL
        redirect(`/${locale}/product/${englishSlug}`);
      }
      // If no English slug available, fall through to render the product with Arabic slug
      // This handles cases where WPML doesn't have an English translation
    } else {
      // Product not found with Arabic slug
      notFound();
    }
  }
  
  // For English slugs, fetch the product with the current locale for localized content
  // Also start fetching hidden IDs, bundle config, and topbar settings in parallel
  // This eliminates the waterfall of sequential API calls
  const [product, hiddenGiftProductIds, hiddenCatalogProductIds, bundleConfig, topbarSettings] = await Promise.all([
    getProductBySlug(slug, locale as Locale),
    getFreeGiftProductIds(),
    getHiddenProductIds(),
    getBundleConfig(slug, locale as Locale),
    getTopbarSettings(),
  ]);

  if (!product) {
    notFound();
  }

  // Check if this product is a hidden gift product or has hidden catalog visibility
  // If so, return 404 to prevent direct URL access
  if (hiddenGiftProductIds.includes(product.id) || hiddenCatalogProductIds.includes(product.id)) {
    notFound();
  }

  const freeShippingThreshold = topbarSettings.freeShippingThreshold;
  
  // If bundle is enabled for this product, show the bundle builder inline
  if (bundleConfig && bundleConfig.enabled) {
    const isRTL = locale === "ar";
    
    // Fetch all products for bundle selection
    const { products: bundleProducts } = await getProducts({
      per_page: 100,
      locale: locale as Locale,
    });
    
    const breadcrumbItems = [
      {
        name: isRTL ? "المتجر" : "Shop",
        href: `/${locale}/shop`,
      },
      {
        name: product.name,
        href: `/${locale}/product/${slug}`,
      },
    ];
    
    return (
      <>
        <JsonLd data={getProductJsonLdData(product, locale, slug)} />
        <div className="container mx-auto px-4 py-3">
          <Breadcrumbs items={breadcrumbItems} locale={locale as Locale} />
          <BuildYourOwnSetClient
            products={bundleProducts}
            locale={locale as Locale}
            bundleProduct={product}
            bundleConfig={bundleConfig}
            freeShippingThreshold={freeShippingThreshold}
          />
        </div>
      </>
    );
  }

  // Fetch ALL remaining data in a single parallel batch:
  // related products, addon forms, English product, upsell IDs, and category slug
  // This replaces 3 sequential stages with 1 parallel stage
  const primaryCategory = product.categories?.[0];
  const [relatedProductsRaw, productAddons, englishProduct, linkedIds, categorySlugFromId] = await Promise.all([
    getRelatedProducts(product, {
      per_page: 12,
      locale: locale as Locale,
    }),
    getProductAddons(product.id, { locale: locale as Locale }),
    getProductBySlug(slug, "en"),
    getProductUpsellIds(product.id, locale as Locale),
    // Pre-fetch the English category slug in parallel (saves a sequential call later)
    primaryCategory?.id
      ? getEnglishSlugForCategory(primaryCategory.id, locale as Locale)
      : Promise.resolve(null),
  ]);

  // Filter out hidden products from related products (free gifts and products with catalog_visibility=hidden)
  const hiddenProductIdsSet = new Set([...hiddenGiftProductIds, ...hiddenCatalogProductIds]);
  const relatedProducts = relatedProductsRaw.filter(
    (p) => !hiddenProductIdsSet.has(p.id)
  );

  // Fetch upsell products if any are configured in WooCommerce Linked Products
  // Get the English category slug from the English product or pre-fetched value
  const englishCategorySlugFromProduct = englishProduct?.categories?.[0]?.slug || null;
  const englishCategorySlug = englishCategorySlugFromProduct || categorySlugFromId;

  // Fetch upsell products and localized category in parallel
  const [upsellProductsRaw, localizedCategory] = await Promise.all([
    linkedIds.upsell_ids.length > 0
      ? getProductsByIds(linkedIds.upsell_ids, locale as Locale)
      : Promise.resolve([]),
    englishCategorySlug
      ? getCategoryBySlug(englishCategorySlug, locale as Locale)
      : Promise.resolve(null),
  ]);

  const upsellProducts = upsellProductsRaw.filter(
    (p) => !hiddenProductIdsSet.has(p.id)
  );

  const localizedCategoryName = localizedCategory?.name || primaryCategory?.name || null;

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: locale === "ar" ? "الرئيسية" : "Home", url: `${siteConfig.url}/${locale}` },
    { name: locale === "ar" ? "المتجر" : "Shop", url: `${siteConfig.url}/${locale}/shop` },
    ...(localizedCategoryName && englishCategorySlug ? [{ name: decodeHtmlEntities(localizedCategoryName), url: `${siteConfig.url}/${locale}/category/${englishCategorySlug}` }] : []),
    { name: decodeHtmlEntities(product.name), url: `${siteConfig.url}/${locale}/product/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={getProductJsonLdData(product, locale, slug)} />
      <JsonLd data={breadcrumbJsonLd} />
      <ProductDetail
        product={product}
        locale={locale as Locale}
        relatedProducts={relatedProducts}
        upsellProducts={upsellProducts}
        addonForms={productAddons?.forms}
        englishCategorySlug={englishCategorySlug}
        localizedCategoryName={localizedCategoryName}
        hiddenGiftProductIds={hiddenGiftProductIds}
        freeShippingThreshold={freeShippingThreshold}
      />
    </>
  );
}
