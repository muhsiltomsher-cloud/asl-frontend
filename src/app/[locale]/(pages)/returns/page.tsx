import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getDictionary } from "@/i18n";
import { generateMetadata as generateSeoMetadata } from "@/lib/utils/seo";
import { getPageSeo, getStaticPageContent, pickLocale, mapRepeater } from "@/lib/api/wordpress";
import type { Locale } from "@/config/site";
import type { Metadata } from "next";

interface ReturnsPageProps {
  params: Promise<{ locale: string }>;
}

// Default keywords (fallback when WordPress page doesn't exist)
const defaultKeywords = {
  en: ["return policy", "perfume exchange", "product returns", "returns and exchanges", "order help", "quality guarantee", "Aromatic Scents Lab", "UAE perfume returns", "refund policy", "return conditions", "Dubai perfume exchange"],
  ar: ["سياسة الإرجاع", "استبدال عطور", "إرجاع منتجات", "ضمان الجودة", "إرجاع عطور", "استبدال منتجات", "مساعدة الطلبات", "Aromatic Scents Lab", "إرجاع عطور الإمارات", "استرجاع الأموال", "شروط الإرجاع", "استبدال عطور دبي"],
};

export async function generateMetadata({
  params,
}: ReturnsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as Locale;
  const isAr = lang === "ar";
  const dictionary = await getDictionary(lang);
  const pageContent = dictionary.pages.returns;

  const wpSeo = await getPageSeo("returns", lang);

  return generateSeoMetadata({
    title: wpSeo?.title || pageContent.seo.title,
    description: wpSeo?.description || pageContent.seo.description,
    image: wpSeo?.ogImage || undefined,
    locale: lang,
    pathname: "/returns",
    keywords: isAr ? defaultKeywords.ar : defaultKeywords.en,
  });
}

export default async function ReturnsPage({ params }: ReturnsPageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as Locale);
  const dict = dictionary.pages.returns;
  const wp = await getStaticPageContent("returns");

  const title = pickLocale(wp?.title, locale, dict.title);
  const subtitle = pickLocale(wp?.subtitle, locale, dict.subtitle);
  const processTitle = pickLocale(wp?.process_title, locale, dict.processTitle);
  const eligibleTitle = pickLocale(wp?.eligible_title, locale, dict.eligibleTitle);
  const notEligibleTitle = pickLocale(wp?.not_eligible_title, locale, dict.notEligibleTitle);
  const needHelp = pickLocale(wp?.need_help, locale, dict.needHelp);
  const needHelpText = pickLocale(wp?.need_help_text, locale, dict.needHelpText);

  // Features from WP repeater or dictionary fallback
  const wpFeatures = mapRepeater(wp?.features, locale, (item) => ({
    title: locale === 'ar' ? (item.title?.ar || item.title_ar || '') : (item.title?.en || item.title_en || ''),
    description: locale === 'ar' ? (item.desc?.ar || item.desc_ar || '') : (item.desc?.en || item.desc_en || ''),
  }));
  const features = wpFeatures.length > 0 ? wpFeatures : dict.features;

  // Steps from WP repeater or dictionary fallback
  const wpSteps = mapRepeater(wp?.steps, locale, (item, _locale) => ({
    step: item.step || '',
    title: _locale === 'ar' ? (item.title?.ar || item.title_ar || '') : (item.title?.en || item.title_en || ''),
    description: _locale === 'ar' ? (item.desc?.ar || item.desc_ar || '') : (item.desc?.en || item.desc_en || ''),
  }));
  const steps = wpSteps.length > 0 ? wpSteps : dict.steps;

  // Eligible/not-eligible items from WP repeater or dictionary fallback
  const wpEligible = mapRepeater(wp?.eligible_items, locale, (item) => (
    locale === 'ar' ? (item.item?.ar || item.item_ar || '') : (item.item?.en || item.item_en || '')
  ));
  const eligibleItems = wpEligible.length > 0 ? wpEligible : dict.eligibleItems;

  const wpNotEligible = mapRepeater(wp?.not_eligible_items, locale, (item) => (
    locale === 'ar' ? (item.item?.ar || item.item_ar || '') : (item.item?.en || item.item_en || '')
  ));
  const notEligibleItems = wpNotEligible.length > 0 ? wpNotEligible : dict.notEligibleItems;

  const breadcrumbItems = [
    { name: dictionary.footer.returnPolicy, href: `/${locale}/returns` },
  ];

  return (
    <div className="container mx-auto px-4 py-3 md:py-4">
      <Breadcrumbs items={breadcrumbItems} locale={locale as Locale} />

      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
          {title}
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          {subtitle}
        </p>

        <div className="space-y-8">
          {features.map((feature, index) => (
            <div key={index}>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                {feature.title}
              </h2>
              <p className="leading-relaxed text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">
            {processTitle}
          </h2>
          <div className="space-y-6">
            {steps.map((item) => (
              <div key={item.step}>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {item.step}. {item.title}
                </h3>
                <p className="leading-relaxed text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            {eligibleTitle}
          </h2>
          <ul className="mb-8 list-disc space-y-2 pl-5 text-gray-600">
            {eligibleItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            {notEligibleTitle}
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-gray-600">
            {notEligibleItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            {needHelp}
          </h2>
          <p className="mb-4 text-gray-600">
            {needHelpText}
          </p>
          <a
            href={`/${locale}/contact`}
            className="inline-flex items-center text-gray-900 underline hover:text-gray-700"
          >
            {dictionary.common.contact}
          </a>
        </div>
      </div>
    </div>
  );
}
