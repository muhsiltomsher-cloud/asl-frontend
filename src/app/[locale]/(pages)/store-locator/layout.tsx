import type { Metadata } from "next";
import { generateMetadata as generateSeoMetadata } from "@/lib/utils/seo";
import { type Locale } from "@/config/site";

interface StoreLocatorLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isRTL = locale === "ar";

  return generateSeoMetadata({
    title: isRTL ? "مواقع متاجرنا في الإمارات وعمان" : "Store Locations - UAE & Oman",
    description: isRTL
      ? "اعثر على أقرب فرع لـ Aromatic Scents Lab. متاجرنا في أبوظبي والعين والفجيرة ومسقط. زورونا واستمتعوا بتجربة عطرية فريدة"
      : "Find the nearest Aromatic Scents Lab store. Located in Abu Dhabi, Al Ain, Fujairah, and Muscat. Visit us for a unique aromatic experience",
    locale: locale as Locale,
    pathname: "/store-locator",
    keywords: isRTL
      ? ["مواقع المتاجر", "فروع العطور", "متجر عطور أبوظبي", "متجر عطور العين", "متجر عطور الفجيرة", "عطور مسقط"]
      : ["store locations", "perfume shop Abu Dhabi", "perfume store Al Ain", "fragrance shop Fujairah", "perfume Muscat", "Aromatic Scents Lab stores"],
  });
}

export default function StoreLocatorLayout({ children }: StoreLocatorLayoutProps) {
  return <>{children}</>;
}
