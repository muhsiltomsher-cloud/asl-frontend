import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateMetadata as generateSeoMetadata, generateItemListJsonLd, generateFAQJsonLd } from "@/lib/utils/seo";
import { getProductBySlug } from "@/lib/api/woocommerce";
import { getGuidePages, getGuidePageBySlug } from "@/lib/api/wordpress";
import { siteConfig, type Locale } from "@/config/site";
import type { Metadata } from "next";
import type { WCProduct } from "@/types/woocommerce";
import type { GuidePage as WPGuidePage } from "@/types/wordpress";
import type { GuideProduct } from "@/types/wordpress";
import { GuideProductCard } from "./GuideProductCard";
import {
  Sparkles,
  ChevronRight,
  Clock,
  MapPin,
  Star,
  BookOpen,
} from "lucide-react";

// Unified shape used by the page component
interface GuideData {
  slug: string;
  title: { en: string; ar: string };
  metaDescription: { en: string; ar: string };
  keywords: { en: string[]; ar: string[] };
  eyebrow: { en: string; ar: string };
  intro: { en: string; ar: string };
  products: GuideProduct[];
  contentBlocks: Array<{ heading: { en: string; ar: string }; body: { en: string; ar: string } }>;
  faqs: Array<{ question: { en: string; ar: string }; answer: { en: string; ar: string } }>;
  relatedGuideSlugs: string[];
  ogImage?: string;
  publishedAt: string;
  updatedAt: string;
}

function wpToGuideData(wp: WPGuidePage): GuideData {
  return {
    slug: wp.slug,
    title: wp.title,
    metaDescription: wp.metaDescription,
    keywords: wp.keywords,
    eyebrow: wp.eyebrow,
    intro: wp.intro,
    products: wp.products.map(p => ({
      slug: p.slug,
      rank: p.rank,
      pickReason: p.pickReason,
      description: p.description,
    })),
    contentBlocks: wp.contentBlocks,
    faqs: wp.faqs,
    relatedGuideSlugs: wp.relatedGuideSlugs,
    ogImage: wp.ogImage,
    publishedAt: wp.publishedAt,
    updatedAt: wp.updatedAt,
  };
}

async function resolveGuide(slug: string): Promise<GuideData | null> {
  const wp = await getGuidePageBySlug(slug);
  if (wp) return wpToGuideData(wp);
  return null;
}

async function resolveAllSlugs(): Promise<string[]> {
  const wpGuides = await getGuidePages();
  return wpGuides.map(g => g.slug);
}

export const revalidate = 3600; // Revalidate every hour

interface GuidePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await resolveAllSlugs();
  const allParams: { locale: string; slug: string }[] = [];
  for (const locale of siteConfig.locales) {
    for (const slug of slugs) {
      allParams.push({ locale, slug });
    }
  }
  return allParams;
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = await resolveGuide(slug);

  if (!guide) {
    return {};
  }

  const validLocale = locale as Locale;
  const ogImageUrl = guide.ogImage || siteConfig.ogImage;
  const absoluteOgImage = ogImageUrl.startsWith("http") ? ogImageUrl : `${siteConfig.url}${ogImageUrl.startsWith("/") ? "" : "/"}${ogImageUrl}`;

  const baseMeta = generateSeoMetadata({
    title: guide.title[validLocale],
    description: guide.metaDescription[validLocale],
    locale: validLocale,
    pathname: `/guides/${slug}`,
    keywords: guide.keywords[validLocale],
    image: guide.ogImage,
  });

  return {
    ...baseMeta,
    openGraph: {
      ...baseMeta.openGraph,
      type: "article",
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
      authors: ["Aromatic Scents Lab"],
      tags: guide.keywords[validLocale],
      images: [
        {
          url: absoluteOgImage,
          width: 1200,
          height: 630,
          alt: `${guide.title[validLocale]} – Aromatic Scents Lab`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title[validLocale],
      description: guide.metaDescription[validLocale],
      images: [
        {
          url: absoluteOgImage,
          alt: `${guide.title[validLocale]} – Aromatic Scents Lab`,
        },
      ],
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { locale, slug } = await params;
  const guide = await resolveGuide(slug);

  if (!guide) {
    notFound();
  }

  const validLocale = locale as Locale;
  const isRTL = locale === "ar";

  // Fetch all products in parallel
  const productPromises = guide.products.map((gp) =>
    getProductBySlug(gp.slug, validLocale)
  );
  const fetchedProducts = await Promise.all(productPromises);

  // Pair guide product data with WooCommerce product data
  const productPairs: { guideProduct: GuideProduct; wcProduct: WCProduct }[] =
    [];
  for (let i = 0; i < guide.products.length; i++) {
    const wc = fetchedProducts[i];
    if (wc) {
      productPairs.push({ guideProduct: guide.products[i], wcProduct: wc });
    }
  }

  // Generate JSON-LD structured data
  const itemListItems = productPairs.map((pair) => ({
    name: pair.wcProduct.name,
    url: `${siteConfig.url}/${locale}/product/${pair.guideProduct.slug}`,
    image: pair.wcProduct.images[0]?.src || "",
    position: pair.guideProduct.rank,
  }));

  const faqItems = guide.faqs.map((faq) => ({
    question: faq.question[validLocale],
    answer: faq.answer[validLocale],
  }));

  // Article schema for enhanced search appearance
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title[validLocale],
    description: guide.metaDescription[validLocale],
    url: `${siteConfig.url}/${locale}/guides/${slug}`,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    author: {
      "@type": "Organization",
      name: "Aromatic Scents Lab",
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: "Aromatic Scents Lab",
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/${locale}/guides/${slug}`,
    },
    keywords: guide.keywords[validLocale].join(", "),
    inLanguage: locale === "ar" ? "ar" : "en",
  };

  // Get related guides from WordPress
  const relatedGuideData: GuideData[] = [];
  for (const relSlug of guide.relatedGuideSlugs) {
    const rel = await resolveGuide(relSlug);
    if (rel) relatedGuideData.push(rel);
  }
  const relatedGuides = relatedGuideData;

  const breadcrumbItems = [
    {
      name: isRTL ? "الأدلة" : "Guides",
      href: `/${locale}/guides`,
    },
    {
      name: guide.title[validLocale],
      href: `/${locale}/guides/${slug}`,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* JSON-LD Structured Data — ItemList, FAQ, Article (Breadcrumb handled by Breadcrumbs component) */}
      <JsonLd data={generateItemListJsonLd({
        name: guide.title[validLocale],
        description: guide.metaDescription[validLocale],
        url: `${siteConfig.url}/${locale}/guides/${slug}`,
        items: itemListItems,
      })} />
      <JsonLd data={generateFAQJsonLd(faqItems)} />
      <JsonLd data={articleJsonLd} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-950 via-amber-900 to-stone-900">
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-96 w-96 animate-pulse rounded-full bg-amber-600/10 blur-3xl" />
          <div
            className="absolute -bottom-32 -right-32 h-[500px] w-[500px] animate-pulse rounded-full bg-amber-400/10 blur-3xl"
            style={{ animationDelay: "1s" }}
          />
        </div>
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container relative mx-auto px-4 py-10 sm:py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            {/* Decorative Line */}
            <div className="mb-8 flex items-center justify-center gap-4">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-amber-400" />
              <Sparkles className="h-6 w-6 text-amber-400" />
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-amber-400" />
            </div>

            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.3em] text-amber-300">
              {guide.eyebrow[validLocale]}
            </span>

            <h1 className="mb-4 text-2xl font-bold leading-tight text-white sm:mb-6 sm:text-3xl md:mb-8 md:text-4xl lg:text-5xl">
              {guide.title[validLocale]}
            </h1>

            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-amber-100/90 sm:text-base md:text-lg">
              {guide.intro[validLocale]}
            </p>

            {/* Meta Info */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-amber-300/80 sm:mt-8 sm:gap-6 sm:text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  {isRTL ? "آخر تحديث: " : "Updated: "}
                  {new Date(guide.updatedAt).toLocaleDateString(
                    isRTL ? "ar-SA" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{isRTL ? "الإمارات العربية المتحدة" : "UAE"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>
                  {productPairs.length}{" "}
                  {isRTL ? "منتجات مختارة" : "Expert Picks"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs items={breadcrumbItems} locale={validLocale} />
      </div>

      {/* Product List Section */}
      <section className="relative bg-[#f7f6f2] py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="mx-auto max-w-5xl">
            {/* Section Header */}
            <div className="mb-10 text-center">
              <div className="mb-4 flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />
                <span className="text-sm font-medium uppercase tracking-widest text-amber-600">
                  {isRTL ? "اختياراتنا" : "Our Picks"}
                </span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-amber-900 md:text-3xl">
                {isRTL ? "المنتجات المختارة" : "Top Picks"}
              </h2>
            </div>

            {/* Product Cards */}
            <div className="space-y-5 sm:space-y-8">
              {productPairs.map((pair) => (
                <GuideProductCard
                  key={pair.guideProduct.slug}
                  product={pair.wcProduct}
                  rank={pair.guideProduct.rank}
                  pickReason={pair.guideProduct.pickReason[validLocale]}
                  description={pair.guideProduct.description[validLocale]}
                  locale={validLocale}
                  productSlug={pair.guideProduct.slug}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Blocks Section */}
      {guide.contentBlocks.length > 0 && (
        <section className="bg-white py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="mx-auto max-w-4xl">
              <div className="mb-6 text-center sm:mb-10">
                <div className="mb-4 flex items-center justify-center gap-4">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />
                  <BookOpen className="h-5 w-5 text-amber-600" />
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400" />
                </div>
                <h2 className="text-2xl font-bold text-amber-900 md:text-3xl">
                  {isRTL ? "دليل الشراء" : "Buying Guide"}
                </h2>
              </div>

              <div className="space-y-5 sm:space-y-10">
                {guide.contentBlocks.map((block, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-amber-100 bg-gradient-to-b from-amber-50/50 to-white p-4 shadow-sm sm:rounded-2xl sm:p-6 md:p-8"
                  >
                    <h3 className="mb-3 text-lg font-bold text-amber-900 sm:mb-4 sm:text-xl md:text-2xl">
                      {block.heading[validLocale]}
                    </h3>
                    <p className="text-sm leading-relaxed text-amber-800/80 sm:text-base">
                      {block.body[validLocale]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {guide.faqs.length > 0 && (
        <section className="bg-[#f7f6f2] py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="mx-auto max-w-4xl">
              <div className="mb-6 text-center sm:mb-10">
                <h2 className="text-2xl font-bold text-amber-900 md:text-3xl">
                  {isRTL
                    ? "الأسئلة الشائعة"
                    : "Frequently Asked Questions"}
                </h2>
                <p className="mt-2 text-amber-700/70">
                  {isRTL
                    ? "إجابات على أسئلتك الأكثر شيوعاً"
                    : "Answers to your most common questions"}
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {guide.faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="group rounded-lg border border-amber-100 bg-white shadow-sm sm:rounded-xl"
                  >
                    <summary className="flex cursor-pointer items-center justify-between px-4 py-4 text-left text-sm font-semibold text-amber-900 transition-colors hover:text-amber-700 sm:px-6 sm:py-5 sm:text-base [&::-webkit-details-marker]:hidden">
                      <span>{faq.question[validLocale]}</span>
                      <ChevronRight className="h-5 w-5 shrink-0 text-amber-400 transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="px-4 pb-4 text-sm leading-relaxed text-amber-800/80 sm:px-6 sm:pb-5 sm:text-base">
                      {faq.answer[validLocale]}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Guides */}
      {relatedGuides.length > 0 && (
        <section className="bg-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-8 text-center text-2xl font-bold text-amber-900 md:text-3xl">
                {isRTL ? "أدلة ذات صلة" : "Related Guides"}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {relatedGuides.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/${locale}/guides/${related.slug}`}
                    className="group rounded-xl border border-amber-100 bg-gradient-to-b from-amber-50/50 to-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <h3 className="font-bold text-amber-900 transition-colors group-hover:text-amber-700">
                      {related.title[validLocale]}
                    </h3>
                    <p className="mt-2 text-sm text-amber-700/70 line-clamp-2">
                      {related.metaDescription[validLocale]}
                    </p>
                                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#C4885B]">
                                    {isRTL ? "اقرأ المزيد" : "Read More"}
                                    <ChevronRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                                  </span>
                                </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-3 text-xl font-bold text-white sm:mb-4 sm:text-2xl md:text-3xl">
            {isRTL
              ? "مستعد لاكتشاف عطرك المثالي؟"
              : "Ready to Find Your Perfect Scent?"}
          </h2>
          <p className="mx-auto mb-6 max-w-xl text-sm text-amber-100/80 sm:mb-8 sm:text-base">
            {isRTL
              ? "تصفح مجموعتنا الكاملة من العطور الفاخرة المصنوعة يدوياً في الإمارات. توصيل مجاني للطلبات فوق 500 درهم."
              : "Browse our full collection of premium, handcrafted fragrances made in the UAE. Free delivery on orders over 500 AED."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/${locale}/shop`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C4885B] px-8 py-3 text-sm font-medium uppercase tracking-wide text-white transition-all hover:bg-[#D4A574] hover:shadow-lg"
            >
              {isRTL ? "تسوق الآن" : "Shop Now"}
            </Link>
            <Link
              href={`/${locale}/category/perfumes`}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-amber-400/50 px-8 py-3 text-sm font-medium uppercase tracking-wide text-amber-200 transition-all hover:border-amber-300 hover:text-white"
            >
              {isRTL ? "تصفح العطور" : "Browse Perfumes"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
