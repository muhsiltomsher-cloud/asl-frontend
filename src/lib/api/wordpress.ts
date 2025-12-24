import { siteConfig, type Locale } from "@/config/site";
import type {
  HomePageACF,
  SiteSettings,
  WPMenu,
  HeroSliderSettings,
  ProductSectionSettings,
  CategorySectionSettings,
  FeaturedProductsSettings,
  CollectionsSettings,
  BannersSettings,
} from "@/types/wordpress";

const WP_API_BASE = `${siteConfig.apiUrl}/wp-json`;

interface FetchOptions {
  revalidate?: number;
  tags?: string[];
  locale?: Locale;
}

async function fetchWPAPI<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T | null> {
  const { revalidate = 60, tags, locale } = options;

  let url = `${WP_API_BASE}${endpoint}`;

  if (locale) {
    const separator = endpoint.includes("?") ? "&" : "?";
    url = `${url}${separator}lang=${locale}`;
  }

  try {
    const response = await fetch(url, {
      next: {
        revalidate,
        tags,
      },
    });

    if (!response.ok) {
      console.error(`WordPress API Error: ${response.status} ${response.statusText}`);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("WordPress API fetch error:", error);
    return null;
  }
}

// Default values for when API is not available
const defaultHeroSlider: HeroSliderSettings = {
  enabled: true,
  slides: [],
  autoplay: true,
  autoplay_delay: 5000,
  loop: true,
};

const defaultProductSection: ProductSectionSettings = {
  enabled: true,
  section_title: "Products",
  section_subtitle: "",
  products_count: 8,
  show_view_all: true,
  view_all_link: "/shop",
};

const defaultCategorySection: CategorySectionSettings = {
  enabled: true,
  section_title: "Shop by Category",
  section_subtitle: "Explore our diverse collections",
  categories_count: 6,
  show_view_all: true,
};

const defaultFeaturedProducts: FeaturedProductsSettings = {
  enabled: true,
  section_title: "Featured Products",
  section_subtitle: "Discover our best sellers",
  products_count: 8,
  autoplay: true,
  autoplay_delay: 4000,
};

const defaultCollections: CollectionsSettings = {
  enabled: true,
  section_title: "Our Collections",
  section_subtitle: "Explore our curated collections",
  collections: [],
};

const defaultBanners: BannersSettings = {
  enabled: true,
  banners: [],
};

const defaultSiteSettings: SiteSettings = {
  logo: null,
  logo_dark: null,
  favicon: null,
  site_name: siteConfig.name,
  tagline: siteConfig.description,
};

// Fetch site settings (logo, favicon, etc.)
export async function getSiteSettings(locale?: Locale): Promise<SiteSettings> {
  const data = await fetchWPAPI<{ acf: SiteSettings }>(
    "/acf/v3/options/site-settings",
    {
      tags: ["site-settings"],
      locale,
      revalidate: 300, // Cache for 5 minutes
    }
  );

  return data?.acf || defaultSiteSettings;
}

// Fetch home page ACF fields
export async function getHomePageSettings(locale?: Locale): Promise<HomePageACF> {
  const data = await fetchWPAPI<{ acf: Partial<HomePageACF> }>(
    "/acf/v3/options/home-page",
    {
      tags: ["home-page-settings"],
      locale,
      revalidate: 60,
    }
  );

  // Merge with defaults to ensure all fields exist
  return {
    hero_slider: data?.acf?.hero_slider || defaultHeroSlider,
    new_products: {
      ...defaultProductSection,
      section_title: "New Products",
      section_subtitle: "Discover our latest arrivals",
      ...data?.acf?.new_products,
    },
    bestseller_products: {
      ...defaultProductSection,
      section_title: "Bestsellers",
      section_subtitle: "Our most popular products",
      ...data?.acf?.bestseller_products,
    },
    shop_by_category: data?.acf?.shop_by_category || defaultCategorySection,
    featured_products: data?.acf?.featured_products || defaultFeaturedProducts,
    collections: data?.acf?.collections || defaultCollections,
    banners: data?.acf?.banners || defaultBanners,
  };
}

// Fetch hero slider settings
export async function getHeroSlider(locale?: Locale): Promise<HeroSliderSettings> {
  const settings = await getHomePageSettings(locale);
  return settings.hero_slider;
}

// Fetch new products section settings
export async function getNewProductsSettings(locale?: Locale): Promise<ProductSectionSettings> {
  const settings = await getHomePageSettings(locale);
  return settings.new_products;
}

// Fetch bestseller products section settings
export async function getBestsellerProductsSettings(locale?: Locale): Promise<ProductSectionSettings> {
  const settings = await getHomePageSettings(locale);
  return settings.bestseller_products;
}

// Fetch category section settings
export async function getCategorySectionSettings(locale?: Locale): Promise<CategorySectionSettings> {
  const settings = await getHomePageSettings(locale);
  return settings.shop_by_category;
}

// Fetch featured products settings
export async function getFeaturedProductsSettings(locale?: Locale): Promise<FeaturedProductsSettings> {
  const settings = await getHomePageSettings(locale);
  return settings.featured_products;
}

// Fetch collections settings
export async function getCollectionsSettings(locale?: Locale): Promise<CollectionsSettings> {
  const settings = await getHomePageSettings(locale);
  return settings.collections;
}

// Fetch banners settings
export async function getBannersSettings(locale?: Locale): Promise<BannersSettings> {
  const settings = await getHomePageSettings(locale);
  return settings.banners;
}

// Fetch WordPress menu by location
export async function getMenu(location: string, locale?: Locale): Promise<WPMenu | null> {
  const data = await fetchWPAPI<WPMenu>(
    `/menus/v1/locations/${location}`,
    {
      tags: ["menus", `menu-${location}`],
      locale,
      revalidate: 300,
    }
  );

  return data;
}

// Fetch primary navigation menu
export async function getPrimaryMenu(locale?: Locale): Promise<WPMenu | null> {
  return getMenu("primary", locale);
}

// Fetch footer menu
export async function getFooterMenu(locale?: Locale): Promise<WPMenu | null> {
  return getMenu("footer", locale);
}
