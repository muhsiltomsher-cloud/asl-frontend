import Link from "next/link";
import Image from "next/image";
import type { BannersSettings } from "@/types/wordpress";

interface BannersSectionProps {
  settings: BannersSettings;
  className?: string;
}

export function BannersSection({
  settings,
  className = "",
}: BannersSectionProps) {
  if (!settings.enabled || settings.banners.length === 0) {
    return null;
  }

  const bannerCount = settings.banners.length;

  const getGridClass = () => {
    if (bannerCount === 1) return "grid-cols-1";
    if (bannerCount === 2) return "grid-cols-1 md:grid-cols-2";
    if (bannerCount === 3) return "grid-cols-1 md:grid-cols-3";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
  };

  return (
    <section className={`py-8 md:py-12 ${className}`}>
      <div className="container mx-auto px-4">
        <div className={`grid gap-4 md:gap-6 ${getGridClass()}`}>
          {settings.banners.map((banner, index) => {
            const BannerContent = (
              <div className="group relative aspect-[2/1] overflow-hidden rounded-lg md:aspect-[3/1]">
                {banner.image?.url ? (
                  <>
                    <Image
                      src={banner.image.url}
                      alt={banner.image.alt || banner.title || `Banner ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="hidden object-cover transition-transform duration-300 group-hover:scale-105 md:block"
                    />
                    <Image
                      src={banner.mobile_image?.url || banner.image.url}
                      alt={banner.mobile_image?.alt || banner.image.alt || banner.title || `Banner ${index + 1}`}
                      fill
                      sizes="100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105 md:hidden"
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700" />
                )}
                {(banner.title || banner.subtitle) && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                      {banner.title && (
                        <h3 className="text-lg font-semibold text-white md:text-xl">
                          {banner.title}
                        </h3>
                      )}
                      {banner.subtitle && (
                        <p className="mt-1 text-sm text-white/80">
                          {banner.subtitle}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            );

            if (banner.link?.url) {
              return (
                <Link
                  key={index}
                  href={banner.link.url}
                  target={banner.link.target || "_self"}
                  className="block"
                >
                  {BannerContent}
                </Link>
              );
            }

            return <div key={index}>{BannerContent}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
