import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getDictionary } from "@/i18n";
import { generateMetadata as generateSeoMetadata } from "@/lib/utils/seo";
import { getPageSeo, getStaticPageContent, pickLocale, mapRepeater } from "@/lib/api/wordpress";
import type { Locale } from "@/config/site";
import type { Metadata } from "next";

interface ShippingPageProps {
  params: Promise<{ locale: string }>;
}

// Default keywords (fallback when WordPress page doesn't exist)
const defaultKeywords = {
  en: ["perfume shipping", "fragrance delivery", "UAE shipping", "Dubai delivery", "GCC shipping", "free delivery", "express delivery", "shipping policy", "Aromatic Scents Lab", "free shipping 500 AED", "delivery time", "Saudi Arabia perfume shipping", "Oman perfume delivery", "order tracking"],
  ar: ["شحن عطور", "توصيل عطور", "شحن الإمارات", "توصيل مجاني", "سياسة الشحن", "شحن دبي", "شحن دول الخليج", "توصيل سريع", "Aromatic Scents Lab", "شحن مجاني 500 درهم", "مدة التوصيل", "شحن عطور السعودية", "شحن عطور عمان", "تتبع الشحن"],
};

export async function generateMetadata({
  params,
}: ShippingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as Locale;
  const isAr = lang === "ar";
  const dictionary = await getDictionary(lang);
  const pageContent = dictionary.pages.shipping;

  const wpSeo = await getPageSeo("shipping", lang);

  return generateSeoMetadata({
    title: wpSeo?.title || pageContent.seo.title,
    description: wpSeo?.description || pageContent.seo.description,
    image: wpSeo?.ogImage || undefined,
    locale: lang,
    pathname: "/shipping",
    keywords: isAr ? defaultKeywords.ar : defaultKeywords.en,
  });
}

export default async function ShippingPage({ params }: ShippingPageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as Locale);
  const dict = dictionary.pages.shipping;
  const wp = await getStaticPageContent("shipping");

  const title = pickLocale(wp?.title, locale, dict.title);
  const haveQuestions = pickLocale(wp?.have_questions, locale, dict.haveQuestions);
  const haveQuestionsText = pickLocale(wp?.have_questions_text, locale, dict.haveQuestionsText);

  // Sections from WP repeater or dictionary fallback
  const wpSections = mapRepeater(wp?.sections, locale, (item) => ({
    title: locale === 'ar' ? (item.title?.ar || item.title_ar || '') : (item.title?.en || item.title_en || ''),
    content: locale === 'ar' ? (item.content?.ar || item.content_ar || '') : (item.content?.en || item.content_en || ''),
    key: item.key || '',
  }));
  const sections = wpSections.length > 0 ? wpSections : dict.sections;

  // Shipping rates from WP or dictionary fallback
  const ratesTitle = pickLocale(wp?.rates_title, locale, dict.shippingRates?.title || '');
  const ratesDestination = pickLocale(wp?.rates_destination, locale, dict.shippingRates?.destination || '');
  const ratesCost = pickLocale(wp?.rates_cost, locale, dict.shippingRates?.shippingCost || '');
  const ratesDelivery = pickLocale(wp?.rates_delivery, locale, dict.shippingRates?.estimatedDelivery || '');
  const ratesCurrency = pickLocale(wp?.rates_currency, locale, dict.shippingRates?.currency || '');
  const ratesNote = pickLocale(wp?.rates_note, locale, dict.shippingRates?.note || '');

  const wpRates = mapRepeater(wp?.rates, locale, (item) => ({
    location: locale === 'ar' ? (item.location?.ar || item.location_ar || '') : (item.location?.en || item.location_en || ''),
    cost: locale === 'ar' ? (item.cost?.ar || item.cost_ar || '') : (item.cost?.en || item.cost_en || ''),
    delivery: locale === 'ar' ? (item.delivery?.ar || item.delivery_ar || '') : (item.delivery?.en || item.delivery_en || ''),
  }));
  const rates = wpRates.length > 0 ? wpRates : (dict.shippingRates?.rates || []);

  const breadcrumbItems = [
    { name: dictionary.footer.shippingInfo, href: `/${locale}/shipping` },
  ];

  return (
    <div className="container mx-auto px-4 py-3 md:py-4">
      <Breadcrumbs items={breadcrumbItems} locale={locale as Locale} />

      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 md:text-4xl">
          {title}
        </h1>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={index}>
              <h2 className="mb-3 text-xl font-semibold text-gray-900">
                {section.title}
              </h2>
              <p className="leading-relaxed text-gray-600">
                {section.content}
              </p>
              {section.key === "shipping_costs" && rates.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    {ratesTitle}
                  </h3>
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 font-semibold text-gray-900">
                            {ratesDestination}
                          </th>
                          <th className="px-4 py-3 font-semibold text-gray-900">
                            {ratesCost}
                          </th>
                          <th className="px-4 py-3 font-semibold text-gray-900">
                            {ratesDelivery}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {rates.map((rate, rateIndex) => (
                          <tr key={rateIndex} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-700">
                              {rate.location}
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-900">
                              {rate.cost} {ratesCurrency}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {rate.delivery}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-sm text-gray-500">
                    {ratesNote}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            {haveQuestions}
          </h2>
          <p className="mb-4 text-gray-600">
            {haveQuestionsText}
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
