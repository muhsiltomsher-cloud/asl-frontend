"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Heart, Check } from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { FormattedPrice } from "@/components/common/FormattedPrice";
import { cn, decodeHtmlEntities, BLUR_DATA_URL } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { triggerHaptic } from "@/lib/utils/haptics";
import { BESTSELLER_PRODUCT_SLUGS } from "@/lib/api/woocommerce";
import type { WCProduct } from "@/types/woocommerce";
import type { Locale } from "@/config/site";

interface GuideProductCardProps {
  product: WCProduct;
  rank: number;
  pickReason: string;
  description: string;
  locale: Locale;
  productSlug: string;
}

export function GuideProductCard({
  product,
  rank,
  pickReason,
  description,
  locale,
  productSlug,
}: GuideProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, getWishlistItemId } =
    useWishlist();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const isRTL = locale === "ar";

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerHaptic();
    setIsAddingToCart(true);
    try {
      await addToCart(product.id, 1);
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 1500);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const isWishlisted = isInWishlist(product.id);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerHaptic();

    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
      return;
    }

    setIsAddingToWishlist(true);
    try {
      if (isWishlisted) {
        const itemId = getWishlistItemId(product.id);
        await removeFromWishlist(product.id, itemId);
      } else {
        await addToWishlist(product.id);
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const mainImage = product.images[0];
  const isOutOfStock = !product.is_in_stock;
  const isBestseller =
    BESTSELLER_PRODUCT_SLUGS.includes(productSlug) ||
    BESTSELLER_PRODUCT_SLUGS.includes(product.slug) ||
    product.tags?.some((tag) => tag.slug === "bestseller");

  return (
    <article className="group overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col md:flex-row">
        {/* Rank Badge + Image */}
        <div className="relative w-full md:w-80 lg:w-96 shrink-0">
          {/* Rank Number */}
          <div
            className={cn(
              "absolute top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-lg font-bold text-white shadow-lg",
              isRTL ? "right-4" : "left-4"
            )}
          >
            {rank}
          </div>

          {/* Badges */}
          <div
            className={cn(
              "absolute top-16 z-10 flex flex-col gap-1.5",
              isRTL ? "right-4 items-end" : "left-4 items-start"
            )}
          >
            {isBestseller && (
              <Badge variant="bestseller" className="shadow-sm">
                {isRTL ? "الأكثر مبيعاً" : "Bestseller"}
              </Badge>
            )}
            {product.on_sale && (
              <Badge variant="error" className="shadow-sm">
                {isRTL ? "تخفيض" : "Sale"}
              </Badge>
            )}
          </div>

          <Link
            href={`/${locale}/product/${productSlug}`}
            className="block"
          >
            <div className="relative aspect-square overflow-hidden md:aspect-[4/5]">
              {mainImage && !imageError ? (
                <Image
                  src={mainImage.src}
                  alt={mainImage.alt || product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 384px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-100">
                  <Image
                    src="/images/asl-placeholder.png"
                    alt="Aromatic Scents Lab"
                    width={120}
                    height={120}
                    className="object-contain opacity-30"
                  />
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
          <div>
            {/* Pick Reason / Award */}
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              {pickReason}
            </div>

            {/* Product Name */}
            <Link href={`/${locale}/product/${productSlug}`}>
              <h3 className="mb-2 text-xl font-bold text-amber-900 transition-colors hover:text-amber-700 md:text-2xl">
                {product.name}
              </h3>
            </Link>

            {/* Category */}
            {product.categories?.[0] && (
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-amber-600">
                {decodeHtmlEntities(product.categories[0].name)}
              </p>
            )}

            {/* Editorial Description */}
            <p className="mb-4 leading-relaxed text-amber-800/80">
              {description}
            </p>
          </div>

          {/* Price + Actions */}
          <div className="flex flex-wrap items-center gap-4 border-t border-amber-100 pt-4">
            {/* Price */}
            <div className="flex items-center gap-2">
              {product.on_sale ? (
                <>
                  <FormattedPrice
                    price={
                      parseInt(product.prices.price) /
                      Math.pow(10, product.prices.currency_minor_unit)
                    }
                    className="text-lg font-bold text-amber-900"
                    iconSize="sm"
                  />
                  <FormattedPrice
                    price={
                      parseInt(product.prices.regular_price) /
                      Math.pow(10, product.prices.currency_minor_unit)
                    }
                    className="text-sm text-gray-400"
                    iconSize="xs"
                    strikethrough
                  />
                </>
              ) : (
                <FormattedPrice
                  price={
                    parseInt(product.prices.price) /
                    Math.pow(10, product.prices.currency_minor_unit)
                  }
                  className="text-lg font-bold text-amber-900"
                  iconSize="sm"
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {!isOutOfStock && product.is_purchasable && (
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium uppercase tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
                    isAddedToCart
                      ? "bg-green-500 text-white"
                      : "bg-[#C4885B] text-white hover:bg-[#D4A574]"
                  )}
                >
                  {isAddedToCart ? (
                    <>
                      <Check className="h-4 w-4" />
                      {isRTL ? "تمت الإضافة!" : "Added!"}
                    </>
                  ) : (
                    <>
                      <ShoppingBag
                        className={cn(
                          "h-4 w-4",
                          isAddingToCart && "animate-pulse"
                        )}
                      />
                      {isAddingToCart
                        ? isRTL
                          ? "جاري الإضافة..."
                          : "Adding..."
                        : isRTL
                          ? "أضف للسلة"
                          : "Add to Cart"}
                    </>
                  )}
                </button>
              )}

              {isOutOfStock && (
                <span className="text-sm font-medium text-gray-400">
                  {isRTL ? "غير متوفر" : "Out of Stock"}
                </span>
              )}

              <button
                onClick={handleWishlistToggle}
                disabled={isAddingToWishlist}
                className={cn(
                  "rounded-full p-2.5 transition-all duration-300",
                  isWishlisted
                    ? "bg-[#c67a46]/10 text-[#c67a46]"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200",
                  isAddingToWishlist && "opacity-50 cursor-not-allowed"
                )}
                aria-label={
                  isWishlisted
                    ? isRTL
                      ? "إزالة من المفضلة"
                      : "Remove from wishlist"
                    : isRTL
                      ? "أضف إلى المفضلة"
                      : "Add to wishlist"
                }
              >
                <Heart
                  className={cn(
                    "h-4 w-4",
                    isWishlisted && "fill-[#c67a46]"
                  )}
                />
              </button>
            </div>

            {/* View Product Link */}
            <Link
              href={`/${locale}/product/${productSlug}`}
              className="text-sm font-medium text-[#C4885B] underline-offset-4 transition-colors hover:text-amber-700 hover:underline"
            >
              {isRTL ? "عرض التفاصيل" : "View Details"}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
