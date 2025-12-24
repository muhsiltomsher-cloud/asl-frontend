"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { WCProductCard } from "@/components/shop/WCProductCard";
import { Button } from "@/components/common/Button";
import type { WCProduct } from "@/types/woocommerce";
import type { Locale } from "@/config/site";
import type { FeaturedProductsSettings } from "@/types/wordpress";

import "swiper/css";
import "swiper/css/navigation";

interface FeaturedProductsSliderProps {
  settings: FeaturedProductsSettings;
  products: WCProduct[];
  locale: Locale;
  isRTL?: boolean;
  viewAllText?: string;
  className?: string;
}

export function FeaturedProductsSlider({
  settings,
  products,
  locale,
  isRTL = false,
  viewAllText = "View All",
  className = "",
}: FeaturedProductsSliderProps) {
  if (!settings.enabled || products.length === 0) {
    return null;
  }

  const displayProducts = products.slice(0, settings.products_count);

  return (
    <section className={`bg-gray-50 py-12 dark:bg-gray-900 md:py-16 ${className}`}>
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
          <Link
            href={`/${locale}/shop`}
            className="hidden items-center text-sm font-medium text-gray-900 hover:underline dark:text-white md:flex"
          >
            {viewAllText}
            <ArrowRight className={`ml-1 h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
          </Link>
        </div>

        <div className="relative">
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={16}
            slidesPerView={2}
            loop={displayProducts.length > 4}
            autoplay={
              settings.autoplay
                ? {
                    delay: settings.autoplay_delay || 4000,
                    disableOnInteraction: false,
                  }
                : false
            }
            navigation={{
              prevEl: ".featured-slider-prev",
              nextEl: ".featured-slider-next",
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            className="featured-products-slider"
          >
            {displayProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <WCProductCard product={product} locale={locale} />
              </SwiperSlide>
            ))}
          </Swiper>

          {displayProducts.length > 4 && (
            <>
              <button
                type="button"
                className="featured-slider-prev absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 lg:block"
                aria-label="Previous products"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                className="featured-slider-next absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 lg:block"
                aria-label="Next products"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" asChild>
            <Link href={`/${locale}/shop`}>{viewAllText}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
