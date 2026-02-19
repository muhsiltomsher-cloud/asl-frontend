import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getDictionary } from "@/i18n";
import { generateMetadata as generateSeoMetadata } from "@/lib/utils/seo";
import type { Locale } from "@/config/site";
import type { Metadata } from "next";

interface ShippingPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ShippingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as Locale);
  const pageContent = dictionary.pages.shipping;

  return generateSeoMetadata({
    title: pageContent.seo.title,
    description: pageContent.seo.description,
    locale: locale as Locale,
    pathname: "/shipping",
    keywords: locale === "ar"
      ? ["شحن عطور", "توصيل عطور", "شحن الإمارات", "توصيل مجاني", "سياسة الشحن", "شحن دبي", "شحن دول الخليج", "توصيل سريع", "Aromatic Scents Lab"]
      : ["perfume shipping", "fragrance delivery", "UAE shipping", "Dubai delivery", "GCC shipping", "free delivery", "express delivery", "shipping policy", "Aromatic Scents Lab"],
  });
}

export default async function ShippingPage({ params }: ShippingPageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as Locale);
  const pageContent = dictionary.pages.shipping;

  const breadcrumbItems = [
    { name: dictionary.footer.shippingInfo, href: `/${locale}/shipping` },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Breadcrumbs items={breadcrumbItems} locale={locale as Locale} />

      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 md:text-4xl">
          {pageContent.title}
        </h1>

        <div className="space-y-8">
          {pageContent.sections.map((section, index) => (
            <div key={index}>
              <h2 className="mb-3 text-xl font-semibold text-gray-900">
                {section.title}
              </h2>
              <p className="leading-relaxed text-gray-600">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            {pageContent.haveQuestions}
          </h2>
          <p className="mb-4 text-gray-600">
            {pageContent.haveQuestionsText}
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
