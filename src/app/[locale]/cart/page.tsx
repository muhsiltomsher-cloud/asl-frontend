"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";

interface CartPageProps {
  params: Promise<{ locale: string }>;
}

export default function CartPage({ params }: CartPageProps) {
  const [locale, setLocale] = useState<string>("en");
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const {
    cart,
    cartItems,
    cartItemsCount,
    cartSubtotal,
    cartTotal,
    isLoading,
    updateCartItem,
    removeCartItem,
    applyCoupon,
    removeCoupon,
  } = useCart();

  useState(() => {
    params.then((p) => setLocale(p.locale));
  });

  const isRTL = locale === "ar";

  const t = {
    en: {
      cart: "Shopping Cart",
      emptyCart: "Your cart is empty",
      continueShopping: "Continue Shopping",
      product: "Product",
      price: "Price",
      quantity: "Quantity",
      total: "Total",
      remove: "Remove",
      subtotal: "Subtotal",
      shipping: "Shipping",
      discount: "Discount",
      orderTotal: "Order Total",
      checkout: "Proceed to Checkout",
      couponCode: "Coupon Code",
      applyCoupon: "Apply",
      couponApplied: "Coupon applied successfully",
      couponError: "Invalid coupon code",
      removeCoupon: "Remove",
      freeShipping: "Free",
      calculatedAtCheckout: "Calculated at checkout",
      backToShop: "Back to Shop",
    },
    ar: {
      cart: "سلة التسوق",
      emptyCart: "سلة التسوق فارغة",
      continueShopping: "متابعة التسوق",
      product: "المنتج",
      price: "السعر",
      quantity: "الكمية",
      total: "المجموع",
      remove: "إزالة",
      subtotal: "المجموع الفرعي",
      shipping: "الشحن",
      discount: "الخصم",
      orderTotal: "إجمالي الطلب",
      checkout: "إتمام الشراء",
      couponCode: "كود الخصم",
      applyCoupon: "تطبيق",
      couponApplied: "تم تطبيق الكود بنجاح",
      couponError: "كود الخصم غير صالح",
      removeCoupon: "إزالة",
      freeShipping: "مجاني",
      calculatedAtCheckout: "يحسب عند الدفع",
      backToShop: "العودة للمتجر",
    },
  };

  const texts = t[locale as keyof typeof t] || t.en;

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price) / 100;
    return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-SA", {
      style: "currency",
      currency: "SAR",
    }).format(numPrice);
  };

  const handleQuantityChange = async (itemKey: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemKey, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleRemoveItem = async (itemKey: string) => {
    try {
      await removeCartItem(itemKey);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const success = await applyCoupon(couponCode);
      if (!success) {
        setCouponError(texts.couponError);
      } else {
        setCouponCode("");
      }
    } catch {
      setCouponError(texts.couponError);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async (code: string) => {
    try {
      await removeCoupon(code);
    } catch (error) {
      console.error("Failed to remove coupon:", error);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div
        className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-4 py-12"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
          <ShoppingBag className="h-12 w-12 text-gray-400" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">{texts.emptyCart}</h1>
        <Link
          href={`/${locale}/shop`}
          className="mt-6 rounded-lg bg-black px-8 py-3 font-medium text-white transition-colors hover:bg-gray-800"
        >
          {texts.continueShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            {texts.cart} ({cartItemsCount})
          </h1>
          <Link
            href={`/${locale}/shop`}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
            {texts.backToShop}
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white shadow-sm">
              <div className="hidden border-b p-4 md:grid md:grid-cols-12 md:gap-4">
                <div className="col-span-6 text-sm font-medium text-gray-500">
                  {texts.product}
                </div>
                <div className="col-span-2 text-center text-sm font-medium text-gray-500">
                  {texts.price}
                </div>
                <div className="col-span-2 text-center text-sm font-medium text-gray-500">
                  {texts.quantity}
                </div>
                <div className="col-span-2 text-center text-sm font-medium text-gray-500">
                  {texts.total}
                </div>
              </div>

              <ul className="divide-y">
                {cartItems.map((item) => (
                  <li key={item.item_key} className="p-4">
                    <div className="grid items-center gap-4 md:grid-cols-12">
                      <div className="flex gap-4 md:col-span-6">
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          {item.featured_image ? (
                            <Image
                              src={item.featured_image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ShoppingBag className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center">
                          <h3 className="font-medium text-gray-900 line-clamp-2">
                            {item.name}
                          </h3>
                          {item.meta.sku && (
                            <p className="mt-1 text-sm text-gray-500">
                              SKU: {item.meta.sku}
                            </p>
                          )}
                          <button
                            onClick={() => handleRemoveItem(item.item_key)}
                            className="mt-2 flex items-center gap-1 text-sm text-red-600 hover:text-red-700 md:hidden"
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                            {texts.remove}
                          </button>
                        </div>
                      </div>

                      <div className="hidden text-center md:col-span-2 md:block">
                        <span className="font-medium">
                          {formatPrice(item.price)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between md:col-span-2 md:justify-center">
                        <span className="text-sm text-gray-500 md:hidden">
                          {texts.quantity}:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.item_key,
                                item.quantity.value - 1
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-gray-100 disabled:opacity-50"
                            disabled={isLoading || item.quantity.value <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center">
                            {item.quantity.value}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.item_key,
                                item.quantity.value + 1
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-gray-100 disabled:opacity-50"
                            disabled={isLoading}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:col-span-2 md:justify-center">
                        <span className="text-sm text-gray-500 md:hidden">
                          {texts.total}:
                        </span>
                        <span className="font-semibold">
                          {formatPrice(item.totals.total)}
                        </span>
                      </div>

                      <div className="hidden md:col-span-12 md:flex md:justify-end">
                        <button
                          onClick={() => handleRemoveItem(item.item_key)}
                          className="text-gray-400 hover:text-red-500"
                          aria-label={texts.remove}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {texts.couponCode}
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder={texts.couponCode}
                    className="flex-1"
                    error={couponError}
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    isLoading={couponLoading}
                    disabled={couponLoading || !couponCode.trim()}
                  >
                    {texts.applyCoupon}
                  </Button>
                </div>
              </div>

              {cart?.coupons && cart.coupons.length > 0 && (
                <div className="mb-6 space-y-2">
                  {cart.coupons.map((coupon) => (
                    <div
                      key={coupon.coupon}
                      className="flex items-center justify-between rounded-lg bg-green-50 px-3 py-2"
                    >
                      <span className="text-sm font-medium text-green-700">
                        {coupon.coupon}
                      </span>
                      <button
                        onClick={() => handleRemoveCoupon(coupon.coupon)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        {texts.removeCoupon}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">{texts.subtotal}</span>
                  <span className="font-medium">{formatPrice(cartSubtotal)}</span>
                </div>

                {cart?.totals?.discount_total && parseFloat(cart.totals.discount_total) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{texts.discount}</span>
                    <span>-{formatPrice(cart.totals.discount_total)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">{texts.shipping}</span>
                  <span className="text-gray-500">{texts.calculatedAtCheckout}</span>
                </div>

                <div className="flex justify-between border-t pt-4">
                  <span className="text-lg font-semibold">{texts.orderTotal}</span>
                  <span className="text-lg font-semibold">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>

              <Link
                href={`/${locale}/checkout`}
                className="mt-6 block w-full rounded-lg bg-black py-3 text-center font-medium text-white transition-colors hover:bg-gray-800"
              >
                {texts.checkout}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
