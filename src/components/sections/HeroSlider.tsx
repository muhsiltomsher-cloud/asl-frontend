"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import type { HeroSliderSettings } from "@/types/wordpress";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface HeroSliderProps {
  settings: HeroSliderSettings;
  parallax?: boolean;
}

export function HeroSlider({ settings, parallax = false }: HeroSliderProps) {
  const { locale } = useParams<{ locale: string }>();
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroHeight, setHeroHeight] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const rafRef = useRef<number>(0);

  // Parallax speed factor: 0 = fixed, 1 = normal scroll, 0.4 = moves at 40% of scroll speed
  const PARALLAX_SPEED = 0.4;

  useEffect(() => {
    if (!parallax) return;

    // Measure header height to offset hero below it
    const header = document.querySelector('header');
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, [parallax]);

  useEffect(() => {
    if (!parallax || !heroRef.current) return;

    const updateHeight = () => {
      if (heroRef.current) {
        setHeroHeight(heroRef.current.offsetHeight);
      }
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(heroRef.current);

    return () => observer.disconnect();
  }, [parallax]);

  useEffect(() => {
    if (!parallax) return;

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [parallax]);

  if (!settings.enabled || settings.slides.length === 0) {
    return null;
  }

  // Handle visibility based on hide_on_mobile and hide_on_desktop settings
  const getVisibilityClass = () => {
    if (settings.hide_on_mobile && settings.hide_on_desktop) {
      return "hidden"; // Hide on both
    }
    if (settings.hide_on_mobile) {
      return "hidden md:block"; // Hide on mobile only
    }
    if (settings.hide_on_desktop) {
      return "md:hidden"; // Hide on desktop only
    }
    return ""; // Show on both
  };

  const SlideContent = ({ slide, index }: { slide: HeroSliderSettings["slides"][0]; index: number }) => {
    const imageContent = (
      <div className="relative w-full">
        {slide.image?.url ? (
          <>
            {/* Desktop image */}
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
            {/* Mobile image */}
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
          <div className="flex h-[50vh] w-full items-center justify-center bg-gray-200 md:h-[70vh] md:min-h-[500px]">
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
      // Prefix locale to relative links that don't already have a locale prefix
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
  };

  if (parallax) {
    return (
      <div style={{ height: heroHeight > 0 ? heroHeight : "100svh" }} className={`overflow-hidden ${getVisibilityClass()}`}>
        <div
          ref={heroRef}
          className="fixed left-0 right-0 z-0 w-full overflow-hidden"
          style={{ top: headerHeight, height: `calc(100svh - ${headerHeight}px)` }}
        >
          <section className="relative w-full will-change-transform" style={{ transform: `translate3d(0, ${-scrollY * PARALLAX_SPEED}px, 0)` }}>
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              effect="slide"
              spaceBetween={0}
              slidesPerView={1}
              loop={true}
              autoHeight={true}
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
                  <SlideContent slide={slide} index={index} />
                </SwiperSlide>
              ))}
            </Swiper>

            {settings.slides.length > 1 && (
              <>
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
              </>
            )}

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
        </div>
      </div>
    );
  }

  return (
    <section className={`relative w-full ${getVisibilityClass()}`}>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        effect="slide"
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoHeight={true}
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
            <SlideContent slide={slide} index={index} />
          </SwiperSlide>
        ))}
      </Swiper>

      {settings.slides.length > 1 && (
        <>
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
        </>
      )}

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
