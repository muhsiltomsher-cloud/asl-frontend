import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FAQAccordion, type FAQItem } from "@/components/common/FAQAccordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { getDictionary } from "@/i18n";
import { generateMetadata as generateSeoMetadata, generateFAQJsonLd } from "@/lib/utils/seo";
import { getPageSeo, getStaticPageContent, pickLocale, mapRepeater } from "@/lib/api/wordpress";
import type { Locale } from "@/config/site";
import type { Metadata } from "next";

interface FAQPageProps {
  params: Promise<{ locale: string }>;
}

// Default keywords (fallback when WordPress page doesn't exist)
const defaultKeywords = {
  en: ["FAQ", "frequently asked questions", "perfume FAQ", "fragrance help", "shipping UAE", "returns", "payment methods", "Arabian oud", "luxury perfumes", "Aromatic Scents Lab", "how to order perfume", "delivery time UAE", "exchange policy", "order tracking", "aromatic perfume FAQ", "aromatic scents help", "aromatic scents lab questions", "how to order from aromatic"],
  ar: ["أسئلة شائعة", "مساعدة", "عطور", "شحن", "إرجاع", "طرق الدفع", "توصيل الإمارات", "عود عربي", "عطور فاخرة", "Aromatic Scents Lab", "كيف اطلب عطور", "مدة التوصيل", "طريقة الاستبدال", "تتبع الطلب", "أسئلة عطور أروماتيك", "مساعدة أروماتيك سنتس لاب", "أسئلة شائعة أروماتيك", "كيف اطلب من أروماتيك"],
};

export async function generateMetadata({
  params,
}: FAQPageProps): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as Locale;
  const isAr = lang === "ar";
  const dictionary = await getDictionary(lang);
  const pageContent = dictionary.pages.faq;

  const wpSeo = await getPageSeo("faq", lang);

  return generateSeoMetadata({
    title: wpSeo?.title || pageContent.seo.title,
    description: wpSeo?.description || pageContent.seo.description,
    image: wpSeo?.ogImage || undefined,
    locale: lang,
    pathname: "/faq",
    keywords: isAr ? defaultKeywords.ar : defaultKeywords.en,
  });
}

export default async function FAQPage({ params }: FAQPageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as Locale);
  const dict = dictionary.pages.faq;
  const wp = await getStaticPageContent("faq");

  // Pick locale-aware values with dictionary fallback
  const title = pickLocale(wp?.title, locale, dict.title);
  const subtitle = pickLocale(wp?.subtitle, locale, dict.subtitle);
  const notFound = pickLocale(wp?.not_found, locale, dict.notFound);
  const notFoundText = pickLocale(wp?.not_found_text, locale, dict.notFoundText);

  // FAQ items from WP repeater or dictionary fallback
  const wpItems = mapRepeater(wp?.faq_items, locale, (item) => ({
    question: locale === 'ar' ? (item.q?.ar || item.q_ar || '') : (item.q?.en || item.q_en || ''),
    answer: locale === 'ar' ? (item.a?.ar || item.a_ar || '') : (item.a?.en || item.a_en || ''),
  }));
  const faqItems: FAQItem[] = wpItems.length > 0 ? wpItems : dict.items.map((item) => ({
    question: item.question,
    answer: item.answer,
  }));

  const breadcrumbItems = [
    { name: title, href: `/${locale}/faq` },
  ];

  const faqJsonLd = generateFAQJsonLd(faqItems);

  return (
    <div className="container mx-auto px-4 py-3">
      <JsonLd data={faqJsonLd} />
      <Breadcrumbs items={breadcrumbItems} locale={locale as Locale} />

      <div className="mb-4 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          {title}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          {subtitle}
        </p>
      </div>

      <div className="mx-auto max-w-3xl">
        <FAQAccordion items={faqItems} />

        <div className="mt-12 rounded-lg bg-gray-50 p-6 text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            {notFound}
          </h2>
          <p className="mb-4 text-gray-600">
            {notFoundText}
          </p>
          <a
            href={`/${locale}/contact`}
            className="inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            {dictionary.common.contact}
          </a>
        </div>
      </div>
    </div>
  );
}
