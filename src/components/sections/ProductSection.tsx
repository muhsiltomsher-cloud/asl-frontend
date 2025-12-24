import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WCProductGrid } from "@/components/shop/WCProductGrid";
import { Button } from "@/components/common/Button";
import type { WCProduct } from "@/types/woocommerce";
import type { Locale } from "@/config/site";
import type { ProductSectionSettings } from "@/types/wordpress";

interface ProductSectionProps {
  settings: ProductSectionSettings;
  products: WCProduct[];
  locale: Locale;
  isRTL?: boolean;
  viewAllText?: string;
  className?: string;
}

export function ProductSection({
  settings,
  products,
  locale,
  isRTL = false,
  viewAllText = "View All",
  className = "",
}: ProductSectionProps) {
  if (!settings.enabled || products.length === 0) {
    return null;
  }

  const viewAllLink = settings.view_all_link || `/${locale}/shop`;

  return (
    <section className={`py-12 md:py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between md:mb-10">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
              {settings.section_title}
            </h2>
            {settings.section_subtitle && (
              <p className="text-gray-600 dark:text-gray-400">
                {settings.section_subtitle}
              </p>
            )}
          </div>
          {settings.show_view_all && (
            <Link
              href={viewAllLink}
              className="hidden items-center text-sm font-medium text-gray-900 hover:underline dark:text-white md:flex"
            >
              {viewAllText}
              <ArrowRight className={`ml-1 h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
            </Link>
          )}
        </div>

        <WCProductGrid
          products={products.slice(0, settings.products_count)}
          locale={locale}
          columns={4}
        />

        {settings.show_view_all && (
          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" asChild>
              <Link href={viewAllLink}>{viewAllText}</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
