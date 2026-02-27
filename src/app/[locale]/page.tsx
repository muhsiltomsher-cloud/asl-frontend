import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/common/Button";
import { getDictionary } from "@/i18n";
import { generateMetadata as generateSeoMetadata, generateFAQJsonLd } from "@/lib/utils/seo";
import { getNewProducts, getFeaturedProducts, getBestsellerProducts, getCategories, getFreeGiftProductInfo, getBundleEnabledProductSlugs, getEnglishSlugFromLocalizedSlug } from "@/lib/api/woocommerce";
import { getHomePageSettings, getSeoSettings } from "@/lib/api/wordpress";
import {
  HeroSlider,
  ProductSection,
  CategorySection,
  FeaturedProductsSlider,
  CollectionsSection,
  BannersSection,
} from "@/components/sections";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Locale } from "@/config/site";
import type { Metadata } from "next";

export const revalidate = 60;

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locale as Locale;
  const isArabic = validLocale === "ar";

  const seoSettings = await getSeoSettings(validLocale);

  const seoTitle = (isArabic ? seoSettings.titleAr : seoSettings.title) || "Aromatic Scents Lab";
  const seoDescription = (isArabic ? seoSettings.descriptionAr : seoSettings.description) || "";

  const baseMetadata = generateSeoMetadata({
    title: seoTitle,
    description: seoDescription,
    locale: validLocale,
    pathname: "",
    keywords: isArabic
      ? ["عطور فاخرة", "عطور عربية", "زيوت عطرية", "عناية بالجسم", "معطرات منزل", "Aromatic Scents Lab", "عطور الإمارات", "شراء عطور اون لاين", "عود عربي", "هدايا عطرية", "عطور دبي", "بخور", "عطور طبيعية", "عطور نسائية", "عطور رجالية", "عطور أصلية", "عطور مسك", "عطور عنبر", "متجر عطور أون لاين الإمارات", "عطور فخمة دبي", "أفضل عطور عربية", "عطور هدايا فخمة", "بخور عود", "عطر شرقي", "توصيل عطور الإمارات"]
      : ["premium perfumes", "Arabian fragrances", "aromatic oils", "body care", "home fragrances", "Aromatic Scents Lab", "UAE perfume", "buy perfume online", "Arabian oud", "luxury perfume Dubai", "natural fragrance", "perfume gift sets", "oud perfume", "women perfume UAE", "men cologne Dubai", "bakhoor incense", "best perfume UAE", "handcrafted perfume", "niche perfume Dubai", "oriental fragrance", "musk perfume", "amber perfume", "online perfume store UAE", "luxury scent collection", "perfume delivery UAE"],
  });

  return {
    ...baseMetadata,
    title: { absolute: seoTitle },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as Locale);
  const isRTL = locale === "ar";

  // Fetch all data in parallel
  // Fetch separate product lists for each section + English versions for URL slugs
  const [
    { products: newProductsRaw },
    { products: newProductsEn },
    { products: featuredProductsRaw },
    { products: featuredProductsEn },
    { products: bestsellerProductsRaw },
    { products: bestsellerProductsEn },
    categories,
    englishCategories,
    homeSettings,
    giftProductInfo,
    bundleProductSlugs,
  ] = await Promise.all([
    getNewProducts({ per_page: 20, locale: locale as Locale }),
    getNewProducts({ per_page: 20, locale: "en" }),
    getFeaturedProducts({ per_page: 20, locale: locale as Locale }),
    getFeaturedProducts({ per_page: 20, locale: "en" }),
    getBestsellerProducts({ per_page: 20, locale: locale as Locale }),
    getBestsellerProducts({ per_page: 20, locale: "en" }),
    getCategories(locale as Locale),
    getCategories("en"),
    getHomePageSettings(locale as Locale),
    getFreeGiftProductInfo(),
    getBundleEnabledProductSlugs(),
  ]);

  // Create English slug mappings for each section's products
  const newProductEnglishSlugs: Record<number, string> = {};
  newProductsEn.forEach((product) => {
    newProductEnglishSlugs[product.id] = product.slug;
  });

  const featuredProductEnglishSlugs: Record<number, string> = {};
  featuredProductsEn.forEach((product) => {
    featuredProductEnglishSlugs[product.id] = product.slug;
  });

  const bestsellerProductEnglishSlugs: Record<number, string> = {};
  bestsellerProductsEn.forEach((product) => {
    bestsellerProductEnglishSlugs[product.id] = product.slug;
  });

  // Create a mapping of localized category ID to English slug for URL generation
  // Uses slug-based matching via WPML slug mappings for reliability,
  // since the API may return categories in different orders across locales
  const englishCategorySlugs: Record<number, string> = {};
  
  // Filter to root categories only (parent === 0) and exclude uncategorized
  const localizedRootCategories = categories.filter((cat) => cat.parent === 0 && cat.slug !== "uncategorized");
  const englishRootCategories = englishCategories.filter((cat) => cat.parent === 0 && cat.slug !== "uncategorized");
  
  // Build a lookup from English slug to English category for image fallback
  const englishCategoryBySlug: Record<string, typeof englishRootCategories[number]> = {};
  englishRootCategories.forEach((cat) => {
    englishCategoryBySlug[cat.slug] = cat;
  });
  
  // Map localized category IDs to English slugs using the slug mapping
  // Also create a fallback image map for categories without images (common in Arabic locale)
  const englishCategoryImages: Record<number, { src: string; alt: string } | undefined> = {};
  
  localizedRootCategories.forEach((localizedCat) => {
    // Use the slug mapping to find the English slug (handles both EN and AR slugs)
    const englishSlug = getEnglishSlugFromLocalizedSlug(localizedCat.slug);
    if (englishSlug) {
      englishCategorySlugs[localizedCat.id] = englishSlug;
      // If the localized category doesn't have an image but the English one does, use English image as fallback
      const englishCat = englishCategoryBySlug[englishSlug];
      if (!localizedCat.image?.src && englishCat?.image?.src) {
        englishCategoryImages[localizedCat.id] = {
          src: englishCat.image.src,
          alt: englishCat.image.alt || englishCat.name,
        };
      }
    } else {
      // Fallback: use the localized slug directly (works for EN categories)
      englishCategorySlugs[localizedCat.id] = localizedCat.slug;
    }
  });

  // Filter out gift products from each section
  const filterGiftProducts = (productList: typeof newProductsRaw) =>
    productList.filter(
      (product) =>
        !giftProductInfo.ids.includes(product.id) &&
        !giftProductInfo.slugs.includes(product.slug)
    );

  const newProducts = filterGiftProducts(newProductsRaw);
  const featuredProducts = filterGiftProducts(featuredProductsRaw);
  const bestsellerProducts = filterGiftProducts(bestsellerProductsRaw);

  // Translations for sections - using dictionary for dynamic content
  const sectionTexts = {
    viewAll: dictionary.common.viewAll,
    products: dictionary.sections.products,
    newProducts: {
      title: dictionary.sections.newProducts.title,
      subtitle: dictionary.sections.newProducts.subtitle,
    },
    bestsellers: {
      title: dictionary.sections.bestsellers.title,
      subtitle: dictionary.sections.bestsellers.subtitle,
    },
    shopByCategory: {
      title: dictionary.sections.shopByCategory.title,
      subtitle: dictionary.sections.shopByCategory.subtitle,
    },
    featuredProducts: {
      title: dictionary.sections.featuredProducts.title,
      subtitle: dictionary.sections.featuredProducts.subtitle,
    },
    collections: {
      title: dictionary.sections.collections.title,
      subtitle: dictionary.sections.collections.subtitle,
    },
  };

  // Apply translations to settings if not set from WordPress
  const newProductsSettings = {
    ...homeSettings.new_products,
    section_title: homeSettings.new_products.section_title || sectionTexts.newProducts.title,
    section_subtitle: homeSettings.new_products.section_subtitle || sectionTexts.newProducts.subtitle,
  };

  const bestsellerSettings = {
    ...homeSettings.bestseller_products,
    section_title: homeSettings.bestseller_products.section_title || sectionTexts.bestsellers.title,
    section_subtitle: homeSettings.bestseller_products.section_subtitle || sectionTexts.bestsellers.subtitle,
  };

  const categorySettings = {
    ...homeSettings.shop_by_category,
    section_title: homeSettings.shop_by_category.section_title || sectionTexts.shopByCategory.title,
    section_subtitle: homeSettings.shop_by_category.section_subtitle || sectionTexts.shopByCategory.subtitle,
  };

  const featuredSettings = {
    ...homeSettings.featured_products,
    section_title: homeSettings.featured_products.section_title || sectionTexts.featuredProducts.title,
    section_subtitle: homeSettings.featured_products.section_subtitle || sectionTexts.featuredProducts.subtitle,
  };

  const collectionsSettings = {
    ...homeSettings.collections,
    section_title: homeSettings.collections.section_title || sectionTexts.collections.title,
    section_subtitle: homeSettings.collections.section_subtitle || sectionTexts.collections.subtitle,
  };

    const categoryExtraItems: Array<{
      id: string;
      name: { en: string; ar: string };
      slug: string;
      href: string;
      image: string;
    }> = [];

  // H1 heading text for SEO - hidden visually but read by search engines
  const h1Text = isRTL
    ? "أروماتيك سينتس لاب | عطور فاخرة وعود عربي في الإمارات"
    : "Aromatic Scents Lab | Premium Perfumes & Fragrances in UAE";

  return (
    <div className="flex flex-col">
      {/* H1 tag for SEO - visually hidden but accessible to search engines */}
      <h1 className="sr-only">{h1Text}</h1>

      {/* Hero Slider */}
      <HeroSlider settings={homeSettings.hero_slider} />

      {/* Banners - Top Position */}
      <BannersSection settings={homeSettings.banners} />

            {/* New Products Section */}
            <ProductSection
              settings={newProductsSettings}
              products={newProducts}
              locale={locale as Locale}
              isRTL={isRTL}
              viewAllText={sectionTexts.viewAll}
              className="bg-[#f7f6f2]"
              bundleProductSlugs={bundleProductSlugs}
              englishProductSlugs={newProductEnglishSlugs}
            />

      {/* Shop by Category */}
      <CategorySection
        settings={categorySettings}
        categories={categories}
        locale={locale as Locale}
        isRTL={isRTL}
        viewAllText={sectionTexts.viewAll}
        productsText={sectionTexts.products}
        englishCategorySlugs={englishCategorySlugs}
        extraItems={categoryExtraItems}
        fallbackImages={englishCategoryImages}
      />

      {/* Featured Products Slider */}
      <FeaturedProductsSlider
        settings={featuredSettings}
        products={featuredProducts}
        locale={locale as Locale}
        isRTL={isRTL}
        viewAllText={sectionTexts.viewAll}
        bundleProductSlugs={bundleProductSlugs}
        englishProductSlugs={featuredProductEnglishSlugs}
      />

      {/* Bestseller Products Section */}
      <ProductSection
        settings={bestsellerSettings}
        products={bestsellerProducts}
        locale={locale as Locale}
        isRTL={isRTL}
        viewAllText={sectionTexts.viewAll}
        className="bg-[#f7f6f2]"
        bundleProductSlugs={bundleProductSlugs}
        englishProductSlugs={bestsellerProductEnglishSlugs}
      />

      {/* Our Collections */}
      <CollectionsSection settings={collectionsSettings} />

      {/* Why Choose Us Section */}
      <section className="relative overflow-hidden bg-white py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center md:mb-14">
            <div className="mb-4 flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />
              <span className="text-sm font-medium uppercase tracking-widest text-amber-600">
                {isRTL ? "تميزنا" : "Our Promise"}
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400" />
            </div>
            <h2 className="text-3xl font-bold text-amber-900 md:text-4xl">
              {dictionary.sections.whyChooseUs.title}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-amber-700/70">
              {dictionary.sections.whyChooseUs.subtitle}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dictionary.sections.whyChooseUs.items.map((item: { title: string; description: string }, idx: number) => (
              <div key={idx} className="group rounded-2xl border border-amber-100 bg-gradient-to-b from-amber-50/50 to-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md">
                  <span className="text-xl font-bold">{idx + 1}</span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-amber-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-amber-700/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Creative Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-[#f7f6f2] to-stone-50 py-16 md:py-24">
        {/* Decorative background elements */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-amber-100/40 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-stone-100/60 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-50/30 blur-3xl" />
        
        <div className="container relative mx-auto px-4">
          {/* Section header with decorative line */}
          <div className="mb-12 text-center md:mb-16">
            <div className="mb-4 flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />
              <span className="text-sm font-medium uppercase tracking-widest text-amber-600">
                {isRTL ? "اكتشف قصتنا" : "Discover Our Journey"}
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400" />
            </div>
            <h2 className="text-3xl font-bold text-amber-900 md:text-4xl lg:text-5xl">
              {dictionary.sections.ourStory.title}
            </h2>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Image side with decorative frame */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-amber-200/20 to-stone-200/20 blur-sm" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-xl lg:aspect-square">
                <Image
                  src="https://cms.aromaticscentslab.com/wp-content/uploads/2025/12/ASL-Website-Images-Patchouli-Glow-06.webp"
                  alt={isRTL ? "قصتنا" : "Our Story"}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {/* Floating accent */}
              <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full border-4 border-amber-200/50 bg-white/80 shadow-lg backdrop-blur-sm" />
            </div>

            {/* Content side */}
            <div className="relative">
              <div className="space-y-6">
                <p className="text-lg leading-relaxed text-amber-800/80 md:text-xl">
                  {dictionary.sections.ourStory.description1}
                </p>
                <p className="leading-relaxed text-amber-700/70">
                  {dictionary.sections.ourStory.description2}
                </p>
                
                {/* Feature highlights */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="rounded-xl bg-white/60 p-4 shadow-sm backdrop-blur-sm">
                    <div className="mb-2 text-2xl font-bold text-amber-900">100%</div>
                    <div className="text-sm text-amber-700/70">{isRTL ? "مكونات طبيعية" : "Natural Ingredients"}</div>
                  </div>
                  <div className="rounded-xl bg-white/60 p-4 shadow-sm backdrop-blur-sm">
                    <div className="mb-2 text-2xl font-bold text-amber-900">10+</div>
                    <div className="text-sm text-amber-700/70">{isRTL ? "سنوات من الخبرة" : "Years of Excellence"}</div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    className="group border-2 border-amber-900 px-8 py-3 text-amber-900 transition-all duration-300 hover:bg-amber-900 hover:text-white hover:shadow-lg" 
                    asChild
                  >
                    <Link href={`/${locale}/about`}>
                      {dictionary.common.learnMore}
                      <svg className="ml-2 inline-block h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section with JSON-LD */}
      <section className="relative overflow-hidden bg-white py-14 md:py-20">
        <JsonLd data={generateFAQJsonLd(dictionary.sections.faq.items)} />
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center md:mb-14">
            <div className="mb-4 flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />
              <span className="text-sm font-medium uppercase tracking-widest text-amber-600">
                {isRTL ? "مساعدة" : "Help"}
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400" />
            </div>
            <h2 className="text-3xl font-bold text-amber-900 md:text-4xl">
              {dictionary.sections.faq.title}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-amber-700/70">
              {dictionary.sections.faq.subtitle}
            </p>
          </div>
          <div className="mx-auto max-w-3xl space-y-4">
            {dictionary.sections.faq.items.map((item: { question: string; answer: string }, idx: number) => (
              <details key={idx} className="group rounded-xl border border-amber-100 bg-gradient-to-b from-amber-50/30 to-white shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 text-left font-semibold text-amber-900 transition-colors hover:text-amber-700">
                  <span>{item.question}</span>
                  <svg className="h-5 w-5 shrink-0 text-amber-400 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-amber-700/80 leading-relaxed">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="bg-gradient-to-b from-[#f7f6f2] to-amber-50/30 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-center text-2xl font-bold text-amber-900 md:text-3xl">
              {isRTL ? "تسوق العطور الفاخرة اون لاين في الإمارات" : "Shop Premium Perfumes Online in the UAE"}
            </h2>
            <div className="space-y-4 text-center leading-relaxed text-amber-800/70">
              <p>
                {isRTL
                  ? "أروماتيك سينتس لاب هو وجهتك المثالية لشراء العطور الفاخرة والعود العربي الأصيل ومنتجات العناية بالجسم ومعطرات المنزل والزيوت العطرية في الإمارات العربية المتحدة. نقدم مجموعة واسعة من العطور النسائية والرجالية المصنوعة يدوياً بأجود المكونات الطبيعية."
                  : "Aromatic Scents Lab is your premier destination for buying luxury perfumes, authentic Arabian oud, body care products, home fragrances, and aromatic oils in the United Arab Emirates. We offer an extensive collection of handcrafted women's and men's fragrances made with the finest natural ingredients."}
              </p>
              <p>
                {isRTL
                  ? "اكتشف مجموعتنا المتنوعة من عطور الإمارات الفاخرة، بما في ذلك البخور والمسك والعنبر وخشب الصندل والورد. سواء كنت تبحث عن عطر يومي أنيق أو هدية فاخرة لشخص مميز، ستجد في متجرنا ما يناسب كل الأذواق والمناسبات مع توصيل مجاني للطلبات فوق 500 درهم."
                  : "Explore our diverse collection of luxury UAE fragrances, including bakhoor, musk, amber, sandalwood, and rose. Whether you're looking for an elegant everyday scent or a luxurious gift for someone special, our store has something for every taste and occasion, with free delivery on orders over 500 AED."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
