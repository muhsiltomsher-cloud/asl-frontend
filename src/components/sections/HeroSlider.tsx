"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { HeroSliderSettings } from "@/types/wordpress";

// Lazy-load Swiper only when needed (multiple slides)
let SwiperModule: typeof import("swiper/react") | null = null;
let SwiperModulesLib: typeof import("swiper/modules") | null = null;

interface HeroSliderProps {
  settings: HeroSliderSettings;
}

// Shared slide content renderer — used for both static first slide and Swiper slides
function SlideContent({ slide, index, locale }: { slide: HeroSliderSettings["slides"][0]; index: number; locale: string }) {
  const imageContent = (
    <div className="relative w-full">
      {slide.image?.url ? (
        <>
          {/* Desktop image — fixed aspect ratio to prevent CLS */}
          <Image
            src={slide.image.url}
            alt={slide.image.alt || `Slide ${index + 1}`}
            width={2560}
            height={1024}
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "low"}
            sizes="100vw"
            className="hidden h-auto w-full md:block"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAIAAABPmPnhAAAAEUlEQVR4nGN4+vAWHsQwXKUBwlPSAflguX8AAAAASUVORK5CYII="
          />
          {/* Mobile image — fixed aspect ratio to prevent CLS */}
          <Image
            src={slide.mobile_image?.url || slide.image.url}
            alt={slide.mobile_image?.alt || slide.image.alt || `Slide ${index + 1}`}
            width={1080}
            height={1475}
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "low"}
            sizes="100vw"
            className="h-auto w-full md:hidden"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAIAAABPmPnhAAAAEUlEQVR4nGN4+vAWHsQwXKUBwlPSAflguX8AAAAASUVORK5CYII="
          />
        </>
      ) : (
        <div className="flex w-full items-center justify-center bg-gray-200" style={{ aspectRatio: "2560/1024" }}>
          <Image
            src="/images/asl-placeholder.png"
            alt="Aromatic Scents Lab"
            width={200}
            height={200}
            className="object-contain opacity-20"
          />
        </div>
      )}
    </div>
  );

  if (slide.link?.url) {
    const linkUrl = slide.link.url.startsWith("/") && !slide.link.url.startsWith(`/${locale}/`)
      ? `/${locale}${slide.link.url}`
      : slide.link.url;
    return (
      <Link href={linkUrl} target={slide.link.target || "_self"} className="block">
        {imageContent}
      </Link>
    );
  }

  return imageContent;
}

export function HeroSlider({ settings }: HeroSliderProps) {
  const { locale } = useParams<{ locale: string }>();
  const [swiperReady, setSwiperReady] = useState(false);
  const [SwiperComponents, setSwiperComponents] = useState<{
    Swiper: typeof import("swiper/react").Swiper;
    SwiperSlide: typeof import("swiper/react").SwiperSlide;
    modules: (typeof import("swiper/modules"))["Autoplay" | "Pagination" | "Navigation"][];
  } | null>(null);

  const hasMultipleSlides = settings.slides.length > 1;

  // Only load Swiper JS when there are multiple slides
  useEffect(() => {
    if (!hasMultipleSlides) return;

    const loadSwiper = async () => {
      if (!SwiperModule) {
        const [swiperReact, swiperModules] = await Promise.all([
          import("swiper/react"),
          import("swiper/modules"),
          import("swiper/css"),
          import("swiper/css/pagination"),
          import("swiper/css/navigation"),
        ]);
        SwiperModule = swiperReact;
        SwiperModulesLib = swiperModules;
      }
      setSwiperComponents({
        Swiper: SwiperModule!.Swiper,
        SwiperSlide: SwiperModule!.SwiperSlide,
        modules: [
          SwiperModulesLib!.Autoplay,
          SwiperModulesLib!.Pagination,
          SwiperModulesLib!.Navigation,
        ],
      });
      setSwiperReady(true);
    };

    loadSwiper();
  }, [hasMultipleSlides]);

  if (!settings.enabled || settings.slides.length === 0) {
    return null;
  }

  // Handle visibility based on hide_on_mobile and hide_on_desktop settings
  const getVisibilityClass = () => {
    if (settings.hide_on_mobile && settings.hide_on_desktop) {
      return "hidden";
    }
    if (settings.hide_on_mobile) {
      return "hidden md:block";
    }
    if (settings.hide_on_desktop) {
      return "md:hidden";
    }
    return "";
  };

  // Single slide or Swiper not loaded yet — render first slide statically (instant LCP, zero CLS)
  if (!hasMultipleSlides || !swiperReady || !SwiperComponents) {
    return (
      <section className={`relative w-full ${getVisibilityClass()}`}>
        <SlideContent slide={settings.slides[0]} index={0} locale={locale} />
      </section>
    );
  }

  // Multiple slides with Swiper loaded
  const { Swiper, SwiperSlide, modules } = SwiperComponents;

  return (
    <section className={`relative w-full ${getVisibilityClass()}`}>
      <Swiper
        modules={modules}
        effect="slide"
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={
          settings.autoplay
            ? {
                delay: settings.autoplay_delay || 5000,
                disableOnInteraction: false,
              }
            : false
        }
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet !bg-white !opacity-50",
          bulletActiveClass: "swiper-pagination-bullet-active !opacity-100",
        }}
        navigation={{
          prevEl: ".hero-slider-prev",
          nextEl: ".hero-slider-next",
        }}
        className="hero-slider"
      >
        {settings.slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <SlideContent slide={slide} index={index} locale={locale} />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        type="button"
        className="hero-slider-prev absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg transition-all hover:bg-white"
        aria-label="Previous slide"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        className="hero-slider-next absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg transition-all hover:bg-white"
        aria-label="Next slide"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <style jsx global>{`
        .hero-slider .swiper-pagination {
          bottom: 20px !important;
        }
        .hero-slider .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          margin: 0 6px !important;
        }
      `}</style>
    </section>
  );
}
