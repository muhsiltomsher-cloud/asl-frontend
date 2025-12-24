// WordPress REST API Types for ACF and Site Options

export interface WPImage {
  id: number;
  url: string;
  alt: string;
  title: string;
  width: number;
  height: number;
  sizes: {
    thumbnail: string;
    medium: string;
    large: string;
    full: string;
  };
}

export interface WPLink {
  title: string;
  url: string;
  target: string;
}

// Hero Slider Types
export interface HeroSlide {
  image: WPImage;
  mobile_image?: WPImage;
  link?: WPLink;
}

export interface HeroSliderSettings {
  enabled: boolean;
  slides: HeroSlide[];
  autoplay: boolean;
  autoplay_delay: number;
  loop: boolean;
}

// Banner Types
export interface Banner {
  image: WPImage;
  mobile_image?: WPImage;
  link?: WPLink;
  title?: string;
  subtitle?: string;
}

export interface BannersSettings {
  enabled: boolean;
  banners: Banner[];
}

// Collection Types
export interface Collection {
  title: string;
  description?: string;
  image: WPImage;
  link: WPLink;
}

export interface CollectionsSettings {
  enabled: boolean;
  section_title: string;
  section_subtitle?: string;
  collections: Collection[];
}

// Product Section Types
export interface ProductSectionSettings {
  enabled: boolean;
  section_title: string;
  section_subtitle?: string;
  products_count: number;
  show_view_all: boolean;
  view_all_link?: string;
}

// Category Section Types
export interface CategorySectionSettings {
  enabled: boolean;
  section_title: string;
  section_subtitle?: string;
  categories_count: number;
  show_view_all: boolean;
}

// Featured Products Slider Types
export interface FeaturedProductsSettings {
  enabled: boolean;
  section_title: string;
  section_subtitle?: string;
  products_count: number;
  autoplay: boolean;
  autoplay_delay: number;
}

// Site Settings Types
export interface SiteSettings {
  logo: WPImage | null;
  logo_dark?: WPImage | null;
  favicon?: WPImage | null;
  site_name?: string;
  tagline?: string;
}

// Menu Types
export interface WPMenuItem {
  id: number;
  title: string;
  url: string;
  target: string;
  parent: number;
  order: number;
  children?: WPMenuItem[];
}

export interface WPMenu {
  id: number;
  name: string;
  slug: string;
  items: WPMenuItem[];
}

// Home Page ACF Fields
export interface HomePageACF {
  hero_slider: HeroSliderSettings;
  new_products: ProductSectionSettings;
  bestseller_products: ProductSectionSettings;
  shop_by_category: CategorySectionSettings;
  featured_products: FeaturedProductsSettings;
  collections: CollectionsSettings;
  banners: BannersSettings;
}

// API Response Types
export interface WPOptionsResponse {
  site_settings: SiteSettings;
  home_page: HomePageACF;
}

export interface WPMenuResponse {
  menus: WPMenu[];
}
