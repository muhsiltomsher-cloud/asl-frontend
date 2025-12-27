"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { FormattedPrice } from "@/components/common/FormattedPrice";
import { useCart } from "@/contexts/CartContext";
import { useNotification } from "@/contexts/NotificationContext";
import type { WCProduct } from "@/types/woocommerce";
import type { Locale } from "@/config/site";

interface ProductOption {
  id: number;
  name: string;
  price: number;
  slug: string;
}

interface BuildYourOwnSetClientProps {
  products: WCProduct[];
  locale: Locale;
  bundleProduct?: WCProduct | null;
}

export function BuildYourOwnSetClient({
  products,
  locale,
  bundleProduct,
}: BuildYourOwnSetClientProps) {
  const isRTL = locale === "ar";
  const { addToCart } = useCart();
  const { notify } = useNotification();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // 3 required selections + 2 optional selections
  const [selections, setSelections] = useState<(ProductOption | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);

  // Convert products to options with prices
  const productOptions: ProductOption[] = useMemo(() => {
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      price:
        parseInt(product.prices.price) /
        Math.pow(10, product.prices.currency_minor_unit),
      slug: product.slug,
    }));
  }, [products]);

  // Set default selections for required fields (first 3)
  useState(() => {
    if (productOptions.length > 0) {
      setSelections([
        productOptions[0] || null,
        productOptions[0] || null,
        productOptions[0] || null,
        null,
        null,
      ]);
    }
  });

  // Calculate total based on selections
  const total = useMemo(() => {
    return selections.reduce((sum, selection) => {
      return sum + (selection?.price || 0);
    }, 0);
  }, [selections]);

  // Handle selection change
  const handleSelectionChange = (index: number, productId: string) => {
    const newSelections = [...selections];
    if (productId === "") {
      newSelections[index] = null;
    } else {
      const selectedProduct = productOptions.find(
        (p) => p.id === parseInt(productId)
      );
      newSelections[index] = selectedProduct || null;
    }
    setSelections(newSelections);
  };

  // Check if required selections are made
  const isValid = selections[0] && selections[1] && selections[2];

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!isValid) {
      notify("error", isRTL ? "يرجى اختيار 3 منتجات على الأقل" : "Please select at least 3 products");
      return;
    }

    setIsAddingToCart(true);
    try {
      // Add each selected product to cart
      const selectedProducts = selections.filter((s) => s !== null);
      for (const product of selectedProducts) {
        if (product) {
          await addToCart(product.id, quantity);
        }
      }
      notify("success", isRTL ? "تمت إضافة المنتجات إلى السلة" : "Products added to cart");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      notify("error", isRTL ? "فشل في إضافة المنتجات" : "Failed to add products");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Get bundle image
  const bundleImage = bundleProduct?.images?.[0]?.src || "/images/bundle-box.jpg";

  const translations = {
    en: {
      title: "Build Your Own Set",
      description:
        "Whether you're treating yourself or surprising someone special, our ASL Bundle Boxes bring together the finest in fragrance and body care.",
      instructions:
        "Create a set that's as unique as your fragrance personality. Pick 3 or more products of your choice: from perfumes, oils, lotions, or home fragrances.",
      selectChoices: "Select your choices",
      required: "*",
      optional: "Optional",
      total: "Total",
      addToCart: "Add to cart",
      buyNow: "Buy now",
      adding: "Adding...",
      tamaraText: "Or split in 4 payments of",
      tamaraNote: "- No late fees, Sharia compliant!",
      moreOptions: "More options",
    },
    ar: {
      title: "اصنع مجموعتك الخاصة",
      description:
        "سواء كنت تدلل نفسك أو تفاجئ شخصًا مميزًا، فإن صناديق ASL تجمع أفضل العطور ومنتجات العناية بالجسم.",
      instructions:
        "أنشئ مجموعة فريدة مثل شخصيتك العطرية. اختر 3 منتجات أو أكثر من اختيارك: من العطور والزيوت واللوشن أو معطرات المنزل.",
      selectChoices: "اختر منتجاتك",
      required: "*",
      optional: "اختياري",
      total: "المجموع",
      addToCart: "أضف إلى السلة",
      buyNow: "اشتري الآن",
      adding: "جاري الإضافة...",
      tamaraText: "أو قسّم على 4 دفعات بقيمة",
      tamaraNote: "- بدون رسوم تأخير، متوافق مع الشريعة!",
      moreOptions: "المزيد من الخيارات",
    },
  };

  const t = translations[isRTL ? "ar" : "en"];

  // Calculate Tamara payment amount (total / 4)
  const tamaraPayment = (total / 4).toFixed(2);

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={bundleImage}
          alt={t.title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        {/* Title */}
        <h1 className="font-serif text-3xl font-medium uppercase tracking-wide text-amber-800 md:text-4xl">
          {t.title}
        </h1>

        {/* Price */}
        <div className="text-xl font-bold text-gray-900">
          <FormattedPrice price={total} iconSize="md" />
        </div>

        {/* Description */}
        <div className="space-y-2 text-sm text-gray-600">
          <p>{t.description}</p>
          <p>{t.instructions}</p>
        </div>

        {/* Tamara Widget */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{t.tamaraText}</span>
            <span className="font-semibold text-gray-900">
              <FormattedPrice price={parseFloat(tamaraPayment)} iconSize="sm" />
            </span>
            <span>{t.tamaraNote}</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <a
              href="#"
              className="text-sm text-blue-600 hover:underline"
            >
              {t.moreOptions}
            </a>
            <Image
              src="https://cdn.tamara.co/widget-v2/assets/lavendar-badge-en.svg"
              alt="Tamara"
              width={60}
              height={20}
              className="h-5 w-auto"
            />
          </div>
        </div>

        {/* Selection Dropdowns */}
        <div className="space-y-4">
          {/* Required Selections (3) */}
          {[0, 1, 2].map((index) => (
            <div key={`required-${index}`}>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t.selectChoices}
                <span className="text-red-500">{t.required}</span>
              </label>
              <div className="relative">
                <select
                  value={selections[index]?.id || ""}
                  onChange={(e) => handleSelectionChange(index, e.target.value)}
                  className="w-full appearance-none rounded-md border border-gray-300 bg-white px-4 py-3 pr-10 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {productOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name} ({option.price.toFixed(2)} AED)
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          ))}

          {/* Optional Selections (2) */}
          {[3, 4].map((index) => (
            <div key={`optional-${index}`}>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t.selectChoices}
              </label>
              <div className="relative">
                <select
                  value={selections[index]?.id || ""}
                  onChange={(e) => handleSelectionChange(index, e.target.value)}
                  className="w-full appearance-none rounded-md border border-gray-300 bg-white px-4 py-3 pr-10 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">{t.optional}</option>
                  {productOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name} ({option.price.toFixed(2)} AED)
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <span className="text-lg font-bold text-gray-900">{t.total}</span>
          <span className="text-xl font-bold text-gray-900">
            <FormattedPrice price={total} iconSize="md" />
          </span>
        </div>

        {/* Quantity and Add to Cart */}
        <div className="flex items-center gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center overflow-hidden rounded-full bg-[#E8E0D5]">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="flex h-10 w-10 cursor-pointer items-center justify-center text-[#5C4A3D] transition-all duration-300 hover:bg-[#d9d0c3] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={isRTL ? "تقليل الكمية" : "Decrease quantity"}
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                setQuantity(Math.min(Math.max(1, val), 99));
              }}
              className="h-10 w-10 bg-transparent text-center text-sm font-bold text-[#5C4A3D] focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              min={1}
              max={99}
            />
            <button
              type="button"
              onClick={() => setQuantity(Math.min(quantity + 1, 99))}
              disabled={quantity >= 99}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#C4885B] text-white transition-all duration-300 hover:bg-[#b07a4f] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={isRTL ? "زيادة الكمية" : "Increase quantity"}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isValid || isAddingToCart}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-[#C4885B] bg-[#C4885B] px-8 py-3 text-sm font-medium uppercase tracking-wide text-white transition-all duration-300 hover:bg-transparent hover:text-[#C4885B] disabled:cursor-not-allowed disabled:border-gray-400 disabled:bg-gray-400"
          >
            {isAddingToCart ? t.adding : t.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
}
