import { getDictionary } from "@/i18n";
import type { Locale } from "@/config/site";
import StoreLocatorClient from "./StoreLocatorClient";

interface StoreLocatorPageProps {
  params: Promise<{ locale: string }>;
}

export default async function StoreLocatorPage({ params }: StoreLocatorPageProps) {
  const { locale } = await params;
  const validLocale = (locale === "ar" ? "ar" : "en") as Locale;
  const dictionary = await getDictionary(validLocale);
  const dict = dictionary.pages.storeLocator;

  return <StoreLocatorClient dict={dict} locale={validLocale} />;
}
