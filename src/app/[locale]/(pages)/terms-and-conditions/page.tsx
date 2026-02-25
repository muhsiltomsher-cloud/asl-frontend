import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getDictionary } from "@/i18n";
import { generateMetadata as generateSeoMetadata } from "@/lib/utils/seo";
import type { Locale } from "@/config/site";
import type { Metadata } from "next";

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as Locale);
  const pageContent = dictionary.pages.terms;

  return generateSeoMetadata({
    title: pageContent.seo.title,
    description: pageContent.seo.description,
    locale: locale as Locale,
    pathname: "/terms-and-conditions",
    keywords: locale === "ar"
      ? ["الشروط والأحكام", "شروط الاستخدام", "اتفاقية المستخدم", "سياسات المتجر", "Aromatic Scents Lab", "شروط الشراء", "سياسة المتجر الإلكتروني", "أحكام التسوق"]
      : ["terms and conditions", "terms of use", "user agreement", "store policies", "Aromatic Scents Lab", "purchase terms", "online store policy", "shopping terms"],
  });
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as Locale);
  const pageContent = dictionary.pages.terms;

  const breadcrumbItems = [
    { name: dictionary.footer.termsConditions, href: `/${locale}/terms-and-conditions` },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Breadcrumbs items={breadcrumbItems} locale={locale as Locale} />

      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
          {pageContent.title}
        </h1>
        <p className="mb-2 text-lg text-gray-600">
          {pageContent.subtitle}
        </p>
        <p className="mb-8 text-sm text-gray-500">
          {pageContent.lastUpdated}
        </p>

        <div className="space-y-8">
          {pageContent.sections.map((section, index) => (
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
            {pageContent.agreement}
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
