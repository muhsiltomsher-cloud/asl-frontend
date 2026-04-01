import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getDictionary } from "@/i18n";
import { generateMetadata as generateSeoMetadata } from "@/lib/utils/seo";
import { getPageSeo, getStaticPageContent, pickLocale, mapRepeater } from "@/lib/api/wordpress";
import type { Locale } from "@/config/site";
import type { Metadata } from "next";

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

// Default keywords (fallback when WordPress page doesn't exist)
const defaultKeywords = {
  en: ["terms and conditions", "terms of use", "user agreement", "store policies", "Aromatic Scents Lab", "purchase terms", "online store policy", "shopping terms"],
  ar: ["الشروط والأحكام", "شروط الاستخدام", "اتفاقية المستخدم", "سياسات المتجر", "Aromatic Scents Lab", "شروط الشراء", "سياسة المتجر الإلكتروني", "أحكام التسوق"],
};

export async function generateMetadata({
  params,
}: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as Locale;
  const isAr = lang === "ar";
  const dictionary = await getDictionary(lang);
  const pageContent = dictionary.pages.terms;

  const wpSeo = await getPageSeo("terms-and-conditions", lang);

  return generateSeoMetadata({
    title: wpSeo?.title || pageContent.seo.title,
    description: wpSeo?.description || pageContent.seo.description,
    image: wpSeo?.ogImage || undefined,
    locale: lang,
    pathname: "/terms-and-conditions",
    keywords: isAr ? defaultKeywords.ar : defaultKeywords.en,
  });
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as Locale);
  const dict = dictionary.pages.terms;
  const wp = await getStaticPageContent("terms");

  const title = pickLocale(wp?.title, locale, dict.title);
  const subtitle = pickLocale(wp?.subtitle, locale, dict.subtitle);
  const lastUpdated = pickLocale(wp?.last_updated, locale, dict.lastUpdated);
  const agreement = pickLocale(wp?.agreement, locale, dict.agreement);

  const wpSections = mapRepeater(wp?.sections, locale, (item) => ({
    title: locale === 'ar' ? (item.title?.ar || item.title_ar || '') : (item.title?.en || item.title_en || ''),
    content: locale === 'ar' ? (item.content?.ar || item.content_ar || '') : (item.content?.en || item.content_en || ''),
  }));
  const sections = wpSections.length > 0 ? wpSections : dict.sections;

  const breadcrumbItems = [
    { name: dictionary.footer.termsConditions, href: `/${locale}/terms-and-conditions` },
  ];

  return (
    <div className="container mx-auto px-4 py-3 md:py-4">
      <Breadcrumbs items={breadcrumbItems} locale={locale as Locale} />

      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
          {title}
        </h1>
        <p className="mb-2 text-lg text-gray-600">
          {subtitle}
        </p>
        <p className="mb-8 text-sm text-gray-500">
          {lastUpdated}
        </p>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={index}>
              <h2 className="mb-3 text-xl font-semibold text-gray-900">
                {index + 1}. {section.title}
              </h2>
              <p className="leading-relaxed text-gray-600">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="mb-4 text-gray-600">
            {agreement}
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
