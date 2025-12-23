import { siteConfig } from "@/config/site";
import { getAuthToken } from "./auth";

const API_BASE = siteConfig.apiUrl;

export interface CoCartItem {
  item_key: string;
  id: number;
  name: string;
  title: string;
  price: string;
  quantity: {
    value: number;
    min_purchase: number;
    max_purchase: number;
  };
  totals: {
    subtotal: string;
    subtotal_tax: string;
    total: string;
    tax: string;
  };
  slug: string;
  meta: {
    product_type: string;
    sku: string;
    dimensions: {
      length: string;
      width: string;
      height: string;
      unit: string;
    };
    weight: number;
    variation: Record<string, string>;
  };
  backorders: string;
  cart_item_data: Record<string, unknown>;
  featured_image: string;
}

export interface CoCartTotals {
  subtotal: string;
  subtotal_tax: string;
  fee_total: string;
  fee_tax: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  total: string;
  total_tax: string;
}

export interface CoCartResponse {
  cart_hash: string;
  cart_key: string;
  currency: {
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
    currency_decimal_separator: string;
    currency_thousand_separator: string;
    currency_prefix: string;
    currency_suffix: string;
  };
  customer: {
    billing_address: Record<string, string>;
    shipping_address: Record<string, string>;
  };
  items: CoCartItem[];
  item_count: number;
  items_weight: number;
  coupons: Array<{
    coupon: string;
    label: string;
    discount: string;
    discount_tax: string;
  }>;
  needs_payment: boolean;
  needs_shipping: boolean;
  shipping: {
    total_packages: number;
    show_package_details: boolean;
    has_calculated_shipping: boolean;
    packages: Record<string, unknown>;
  };
  fees: Array<{
    name: string;
    fee: string;
  }>;
  taxes: Array<{
    name: string;
    price: string;
  }>;
  totals: CoCartTotals;
  removed_items: CoCartItem[];
  cross_sells: unknown[];
  notices: Array<{
    type: string;
    message: string;
  }>;
}

export interface CartError {
  code: string;
  message: string;
  data?: {
    status: number;
  };
}

export interface CartOperationResponse {
  success: boolean;
  cart?: CoCartResponse;
  error?: CartError;
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
}

export async function getCart(): Promise<CartOperationResponse> {
  try {
    const response = await fetch(`${API_BASE}/wp-json/cocart/v2/cart`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: data.code || "cart_error",
          message: data.message || "Failed to get cart.",
          data: { status: response.status },
        },
      };
    }

    return {
      success: true,
      cart: data,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "network_error",
        message: error instanceof Error ? error.message : "Network error occurred",
      },
    };
  }
}

export async function addToCart(
  productId: number,
  quantity: number = 1,
  variationId?: number,
  variation?: Record<string, string>
): Promise<CartOperationResponse> {
  try {
    const body: Record<string, unknown> = {
      id: String(productId),
      quantity: String(quantity),
    };

    if (variationId) {
      body.variation_id = String(variationId);
    }

    if (variation) {
      body.variation = variation;
    }

    const response = await fetch(`${API_BASE}/wp-json/cocart/v2/cart/add-item`, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: data.code || "add_to_cart_error",
          message: data.message || "Failed to add item to cart.",
          data: { status: response.status },
        },
      };
    }

    return {
      success: true,
      cart: data,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "network_error",
        message: error instanceof Error ? error.message : "Network error occurred",
      },
    };
  }
}

export async function updateCartItem(
  itemKey: string,
  quantity: number
): Promise<CartOperationResponse> {
  try {
    const response = await fetch(`${API_BASE}/wp-json/cocart/v2/cart/item/${itemKey}`, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify({ quantity: String(quantity) }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: data.code || "update_cart_error",
          message: data.message || "Failed to update cart item.",
          data: { status: response.status },
        },
      };
    }

    return {
      success: true,
      cart: data,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "network_error",
        message: error instanceof Error ? error.message : "Network error occurred",
      },
    };
  }
}

export async function removeCartItem(itemKey: string): Promise<CartOperationResponse> {
  try {
    const response = await fetch(`${API_BASE}/wp-json/cocart/v2/cart/item/${itemKey}`, {
      method: "DELETE",
      headers: getHeaders(),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: data.code || "remove_cart_error",
          message: data.message || "Failed to remove cart item.",
          data: { status: response.status },
        },
      };
    }

    return {
      success: true,
      cart: data,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "network_error",
        message: error instanceof Error ? error.message : "Network error occurred",
      },
    };
  }
}

export async function clearCart(): Promise<CartOperationResponse> {
  try {
    const response = await fetch(`${API_BASE}/wp-json/cocart/v2/cart/clear`, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: data.code || "clear_cart_error",
          message: data.message || "Failed to clear cart.",
          data: { status: response.status },
        },
      };
    }

    return {
      success: true,
      cart: data,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "network_error",
        message: error instanceof Error ? error.message : "Network error occurred",
      },
    };
  }
}

export async function applyCoupon(couponCode: string): Promise<CartOperationResponse> {
  try {
    const response = await fetch(`${API_BASE}/wp-json/cocart/v2/cart/coupon`, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify({ coupon: couponCode }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: data.code || "coupon_error",
          message: data.message || "Failed to apply coupon.",
          data: { status: response.status },
        },
      };
    }

    return {
      success: true,
      cart: data,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "network_error",
        message: error instanceof Error ? error.message : "Network error occurred",
      },
    };
  }
}

export async function removeCoupon(couponCode: string): Promise<CartOperationResponse> {
  try {
    const response = await fetch(`${API_BASE}/wp-json/cocart/v2/cart/coupon/${couponCode}`, {
      method: "DELETE",
      headers: getHeaders(),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: data.code || "coupon_error",
          message: data.message || "Failed to remove coupon.",
          data: { status: response.status },
        },
      };
    }

    return {
      success: true,
      cart: data,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "network_error",
        message: error instanceof Error ? error.message : "Network error occurred",
      },
    };
  }
}
