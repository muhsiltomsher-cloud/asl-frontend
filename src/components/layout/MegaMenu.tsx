"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Grid3X3 } from "lucide-react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/config/site";
import type { WCProduct } from "@/types/woocommerce";
import { getProducts } from "@/lib/api/woocommerce";
import { cn, getProductSlugFromPermalink } from "@/lib/utils";
import { FormattedPrice } from "@/components/common/FormattedPrice";
import { MiniProductGridSkeleton } from "@/components/common/Skeleton";
import { getMegaMenuCategories } from "@/config/menu";

const productsFetchPromise: Record<string, Promise<WCProduct[]> | null> = {};

/**
 * Static menu category type with children
 */
export interface StaticMenuCategory {
  id: number;
  name: string;
  slug: string;
  image: { src: string } | null;
  parent: number;
  count: number;
  children: Array<{
    id: number;
    name: string;
    slug: string;
    parent: number;
    count: number;
  }>;
}

/**
 * No-op function for backward compatibility
 * Categories are now static, no preloading needed
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function preloadCategoriesCache(_locale: Locale): Promise<void> {
  // Categories are now static - no preloading needed
  return;
}

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  dictionary: Dictionary;
}

export function MegaMenu({
  isOpen,
  onClose,
  locale,
  dictionary,
}: MegaMenuProps) {
  void dictionary; // Reserved for future use
  
  // Static categories from config
  const staticCategories = getMegaMenuCategories(locale);
  
  // Featured products state (still fetched dynamically)
  const [featuredProducts, setFeaturedProducts] = useState<WCProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const hasProductsFetchedRef = useRef(false);
  const isRTL = locale === "ar";
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchFeaturedProducts = useCallback(async () => {
    if (productsFetchPromise[locale]) {
      try {
        const prods = await productsFetchPromise[locale];
        if (prods) {
          setFeaturedProducts(prods);
        }
      } catch (error) {
        console.error(error);
      }
      return;
    }

    setProductsLoading(true);
    try {
      productsFetchPromise[locale] = getProducts({
        per_page: 4,
        orderby: "date",
        order: "desc",
        locale,
      }).then((response) => {
        const products = response.products;
        return products;
      });

      const prods = await productsFetchPromise[locale];
      if (prods) {
        setFeaturedProducts(prods);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setProductsLoading(false);
      productsFetchPromise[locale] = null;
    }
  }, [locale]);

  useEffect(() => {
    if (isOpen && !hasProductsFetchedRef.current) {
      hasProductsFetchedRef.current = true;
      fetchFeaturedProducts();
    }
  }, [isOpen, locale, fetchFeaturedProducts]);

  useEffect(() => {
    hasProductsFetchedRef.current = false;
  }, [locale]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
        onClick={onClose}
        style={{ top: "132px" }}
      />
      
      <div
        ref={menuRef}
        className={cn(
          "absolute left-0 right-0 z-50 bg-white shadow-2xl transition-all duration-300 ease-out",
          "border-t border-gray-100",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        )}
        style={{ top: "100%" }}
        dir={isRTL ? "rtl" : "ltr"}
        onMouseLeave={onClose}
      >
        <div className="container mx-auto px-6 py-8">
          {staticCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Grid3X3 className="mb-4 h-16 w-16 text-gray-200" />
              <p className="text-gray-400">No categories found</p>
            </div>
          ) : (
            <div className="flex gap-8">
              {/* Left Side - Categories with Images */}
              <div className={cn("flex-1", isRTL ? "order-2" : "order-1")}>
                <div className="grid grid-cols-4 gap-8">
                  {staticCategories.slice(0, 4).map((category) => (
                    <div key={category.id} className="flex flex-col">
                      {/* Category Header with Image */}
                      <Link
                        href={`/${locale}/shop?category=${category.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-2 mb-3 group"
                      >
                        {category.image?.src ? (
                          <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                            <Image
                              src={category.image.src}
                              alt={category.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-amber-50">
                            <Grid3X3 className="h-4 w-4 text-amber-400" />
                          </div>
                        )}
                        <span className="text-sm font-bold text-gray-900 uppercase tracking-wide group-hover:text-[#7a3205] transition-colors">
                          {category.name}
                        </span>
                      </Link>
                      
                      {/* Subcategories */}
                      <div className="space-y-2">
                        {category.children.slice(0, 8).map((child) => (
                          <Link
                            key={child.id}
                            href={`/${locale}/shop?category=${child.slug}`}
                            onClick={onClose}
                            className="block text-sm text-gray-600 hover:text-[#7a3205] transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                        {category.children.length > 8 && (
                          <Link
                            href={`/${locale}/shop?category=${category.slug}`}
                            onClick={onClose}
                            className="block text-sm font-medium text-[#7a3205] hover:text-[#5a2504] transition-colors"
                          >
                            {isRTL ? "عرض الكل..." : "View all..."}
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Featured Products */}
              <div className={cn("w-[340px] flex-shrink-0", isRTL ? "order-1" : "order-2")}>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                  {isRTL ? "وصل حديثاً" : "New Arrivals"}
                </h3>
                                {productsLoading ? (
                                  <MiniProductGridSkeleton count={4} />
                                ) : featuredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {featuredProducts.slice(0, 4).map((product) => {
                      const productSlug = getProductSlugFromPermalink(product.permalink, product.slug);
                      return (
                      <Link
                        key={product.id}
                        href={`/${locale}/product/${productSlug}`}
                        onClick={onClose}
                        className="group block"
                      >
                        <div className="relative aspect-square overflow-hidden rounded-lg bg-gradient-to-b from-[#e8e4dc] to-[#d4cfc5]">
                          {product.images?.[0]?.src ? (
                            <Image
                              src={product.images[0].src}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Grid3X3 className="h-12 w-12 text-[#8b7355]" />
                            </div>
                          )}
                        </div>
                        <div className="mt-2">
                          <h4 className="text-xs font-medium text-gray-900 group-hover:text-[#7a3205] transition-colors line-clamp-2 break-words min-w-0">
                            {product.name}
                          </h4>
                          <p className="text-xs text-[#7a3205] font-medium mt-1">
                            <FormattedPrice 
                              price={parseInt(product.prices.price) / Math.pow(10, product.prices.currency_minor_unit)} 
                              iconSize="xs" 
                            />
                          </p>
                        </div>
                      </Link>
                    );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Grid3X3 className="mb-2 h-8 w-8 text-gray-200" />
                    <p className="text-xs text-gray-400">{isRTL ? "لا توجد منتجات" : "No products"}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
