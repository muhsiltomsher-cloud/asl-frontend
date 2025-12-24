import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/common/Button";
import type { WCCategory } from "@/types/woocommerce";
import type { Locale } from "@/config/site";
import type { CategorySectionSettings } from "@/types/wordpress";

interface CategorySectionProps {
  settings: CategorySectionSettings;
  categories: WCCategory[];
  locale: Locale;
  isRTL?: boolean;
  viewAllText?: string;
  productsText?: string;
  className?: string;
}

export function CategorySection({
  settings,
  categories,
  locale,
  isRTL = false,
  viewAllText = "View All",
  productsText = "products",
  className = "",
}: CategorySectionProps) {
  if (!settings.enabled || categories.length === 0) {
    return null;
  }

  const displayCategories = categories
    .filter((cat) => cat.parent === 0 && cat.slug !== "uncategorized")
    .slice(0, settings.categories_count);

  if (displayCategories.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 md:py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between md:mb-10">
          <div className="text-center w-full md:text-left md:w-auto">
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
              href={`/${locale}/shop`}
              className="hidden items-center text-sm font-medium text-gray-900 hover:underline dark:text-white md:flex"
            >
              {viewAllText}
              <ArrowRight className={`ml-1 h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-3">
          {displayCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/${locale}/category/${category.slug}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg"
            >
              {category.image?.src ? (
                <Image
                  src={category.image.src}
                  alt={category.image.alt || category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="text-lg font-semibold text-white md:text-xl">
                  {category.name}
                </h3>
                <p className="text-sm text-white/80">
                  {category.count} {productsText}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {settings.show_view_all && (
          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" asChild>
              <Link href={`/${locale}/shop`}>{viewAllText}</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
