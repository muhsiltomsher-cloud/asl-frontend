import { siteConfig } from "@/config/site";
import type {
  WCProduct,
  WCCategory,
  WCProductsResponse,
} from "@/types/woocommerce";

const API_BASE = `${siteConfig.apiUrl}/wp-json/wc/store/v1`;

interface FetchOptions {
  revalidate?: number;
  tags?: string[];
}

async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { revalidate = 60, tags } = options;

  const response = await fetch(`${API_BASE}${endpoint}`, {
    next: {
      revalidate,
      tags,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Products API
export async function getProducts(params?: {
  page?: number;
  per_page?: number;
  category?: string;
  search?: string;
  orderby?: string;
  order?: "asc" | "desc";
}): Promise<WCProductsResponse> {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.per_page) searchParams.set("per_page", params.per_page.toString());
  if (params?.category) searchParams.set("category", params.category);
  if (params?.search) searchParams.set("search", params.search);
  if (params?.orderby) searchParams.set("orderby", params.orderby);
  if (params?.order) searchParams.set("order", params.order);

  const queryString = searchParams.toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ""}`;

  const products = await fetchAPI<WCProduct[]>(endpoint, {
    tags: ["products"],
  });

  return {
    products,
    total: products.length,
    totalPages: 1,
  };
}

export async function getProductBySlug(
  slug: string
): Promise<WCProduct | null> {
  try {
    const products = await fetchAPI<WCProduct[]>(`/products?slug=${slug}`, {
      tags: ["products", `product-${slug}`],
    });

    return products.length > 0 ? products[0] : null;
  } catch {
    return null;
  }
}

export async function getProductById(id: number): Promise<WCProduct | null> {
  try {
    const product = await fetchAPI<WCProduct>(`/products/${id}`, {
      tags: ["products", `product-${id}`],
    });

    return product;
  } catch {
    return null;
  }
}

// Categories API
export async function getCategories(): Promise<WCCategory[]> {
  const categories = await fetchAPI<WCCategory[]>("/products/categories", {
    tags: ["categories"],
  });

  return categories;
}

export async function getCategoryBySlug(
  slug: string
): Promise<WCCategory | null> {
  try {
    const categories = await getCategories();
    return categories.find((cat) => cat.slug === slug) || null;
  } catch {
    return null;
  }
}

export async function getProductsByCategory(
  categorySlug: string,
  params?: {
    page?: number;
    per_page?: number;
  }
): Promise<WCProductsResponse> {
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    return { products: [], total: 0, totalPages: 0 };
  }

  return getProducts({
    category: category.id.toString(),
    ...params,
  });
}

// Helper function to format price from WooCommerce
export function formatWCPrice(prices: WCProduct["prices"]): string {
  const price = parseInt(prices.price) / Math.pow(10, prices.currency_minor_unit);
  const formatted = price.toLocaleString("en-US", {
    minimumFractionDigits: prices.currency_minor_unit,
    maximumFractionDigits: prices.currency_minor_unit,
  });

  if (prices.currency_prefix) {
    return `${prices.currency_prefix}${formatted}`;
  }

  if (prices.currency_suffix) {
    return `${formatted}${prices.currency_suffix}`;
  }

  return `${prices.currency_symbol}${formatted}`;
}
