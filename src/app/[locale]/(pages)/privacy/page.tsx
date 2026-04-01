import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getDictionary } from "@/i18n";
import { generateMetadata as generateSeoMetadata } from "@/lib/utils/seo";
import { getPageSeo, getStaticPageContent, pickLocale, mapRepeater } from "@/lib/api/wordpress";
import type { Locale } from "@/config/site";
import type { Metadata } from "next";

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

// Default keywords (fallback when WordPress page doesn't exist)
const defaultKeywords = {
  en: ["privacy policy", "data protection", "customer privacy", "information security", "Aromatic Scents Lab", "customer data protection", "UAE data policy", "personal information security"],
  ar: ["سياسة الخصوصية", "حماية البيانات", "أمان المعلومات", "خصوصية العملاء", "Aromatic Scents Lab", "حماية بيانات العملاء", "سياسة البيانات الإمارات", "أمان المعلومات الشخصية"],
};

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as Locale;
  const isAr = lang === "ar";
  const dictionary = await getDictionary(lang);
  const pageContent = dictionary.pages.privacy;

  const wpSeo = await getPageSeo("privacy", lang);

  return generateSeoMetadata({
    title: wpSeo?.title || pageContent.seo.title,
    description: wpSeo?.description || pageContent.seo.description,
    image: wpSeo?.ogImage || undefined,
    locale: lang,
    pathname: "/privacy",
    keywords: isAr ? defaultKeywords.ar : defaultKeywords.en,
  });
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as Locale);
  const dict = dictionary.pages.privacy;
  const wp = await getStaticPageContent("privacy");

  const title = pickLocale(wp?.title, locale, dict.title);
  const subtitle = pickLocale(wp?.subtitle, locale, dict.subtitle);
  const lastUpdated = pickLocale(wp?.last_updated, locale, dict.lastUpdated);
  const contactCta = pickLocale(wp?.contact_cta, locale, dict.contactCta);

  // Sections from WP repeater or dictionary fallback
  const wpSections = mapRepeater(wp?.sections, locale, (item) => ({
    title: locale === 'ar' ? (item.title?.ar || item.title_ar || '') : (item.title?.en || item.title_en || ''),
    content: locale === 'ar' ? (item.content?.ar || item.content_ar || '') : (item.content?.en || item.content_en || ''),
  }));
  const sections = wpSections.length > 0 ? wpSections : dict.sections;

  const breadcrumbItems = [
    { name: dictionary.footer.privacyPolicy, href: `/${locale}/privacy` },
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
            {contactCta}
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
