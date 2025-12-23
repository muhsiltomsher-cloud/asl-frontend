import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { getDictionary } from "@/i18n";
import { siteConfig, localeConfig, type Locale } from "@/config/site";
import { generateOrganizationJsonLd } from "@/lib/utils/seo";
import { JsonLd } from "@/components/seo/JsonLd";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    metadataBase: new URL(siteConfig.url),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!siteConfig.locales.includes(locale as Locale)) {
    notFound();
  }

  const validLocale = locale as Locale;
  const dictionary = await getDictionary(validLocale);
  const { dir } = localeConfig[validLocale];

  return (
    <ThemeProvider>
      <AuthProvider>
        <CurrencyProvider>
          <CartProvider>
            <WishlistProvider>
              <JsonLd data={generateOrganizationJsonLd()} />
              <div dir={dir} lang={validLocale} className="flex min-h-screen flex-col bg-white dark:bg-gray-950 dark:text-gray-100">
                <Header locale={validLocale} dictionary={dictionary} />
                <main className="flex-1">{children}</main>
                <Footer locale={validLocale} dictionary={dictionary} />
              </div>
              <ThemeToggle />
            </WishlistProvider>
          </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
