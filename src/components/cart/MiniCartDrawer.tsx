"use client";

import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

interface MiniCartDrawerProps {
  locale: string;
  dictionary: {
    cart: string;
    emptyCart: string;
    continueShopping: string;
    subtotal: string;
    viewCart: string;
    checkout: string;
    remove: string;
  };
}

export function MiniCartDrawer({ locale, dictionary }: MiniCartDrawerProps) {
  const {
    cartItems,
    cartItemsCount,
    cartSubtotal,
    isCartOpen,
    setIsCartOpen,
    isLoading,
    updateCartItem,
    removeCartItem,
  } = useCart();

  const isRTL = locale === "ar";

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

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price) / 100;
    return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-SA", {
      style: "currency",
      currency: "SAR",
    }).format(numPrice);
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 transition-opacity duration-300",
          isCartOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsCartOpen(false)}
      />

      <div
        className={cn(
          "fixed top-0 z-50 h-full w-full max-w-md bg-white shadow-xl transition-transform duration-300",
          isRTL ? "left-0" : "right-0",
          isCartOpen
            ? "translate-x-0"
            : isRTL
            ? "-translate-x-full"
            : "translate-x-full"
        )}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <h2 className="text-lg font-semibold">{dictionary.cart}</h2>
              {cartItemsCount > 0 && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs text-white">
                  {cartItemsCount}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="rounded-full p-2 hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                  <ShoppingBag className="h-10 w-10 text-gray-400" />
                </div>
                <p className="mb-6 text-gray-600">{dictionary.emptyCart}</p>
                <Link
                  href={`/${locale}/shop`}
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-lg bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800"
                >
                  {dictionary.continueShopping}
                </Link>
              </div>
            ) : (
              <ul className="divide-y">
                {cartItems.map((item) => (
                  <li key={item.item_key} className="p-4">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
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

                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => handleRemoveItem(item.item_key)}
                            className="text-gray-400 hover:text-red-500"
                            aria-label={dictionary.remove}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {formatPrice(item.totals.total)}
                        </p>

                        <div className="mt-2 flex items-center gap-2">
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
                          <span className="w-8 text-center text-sm">
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
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="border-t p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-gray-600">{dictionary.subtotal}</span>
                <span className="text-lg font-semibold">
                  {formatPrice(cartSubtotal)}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href={`/${locale}/cart`}
                  onClick={() => setIsCartOpen(false)}
                  className="w-full rounded-lg border border-gray-300 px-6 py-3 text-center font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  {dictionary.viewCart}
                </Link>
                <Link
                  href={`/${locale}/checkout`}
                  onClick={() => setIsCartOpen(false)}
                  className="w-full rounded-lg bg-black px-6 py-3 text-center font-medium text-white transition-colors hover:bg-gray-800"
                >
                  {dictionary.checkout}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
