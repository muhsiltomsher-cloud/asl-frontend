/**
 * Omnisend tracking utility for headless WooCommerce frontend.
 *
 * Omnisend's "Added product to cart" automation trigger relies on
 * the browser snippet receiving contact-identify + cart events.
 * Because the site is headless Next.js, the WooCommerce plugin
 * cannot inject these automatically — we fire them from the client.
 *
 * @see https://developers.omnisend.com/web-tracking
 */

// ---------------------------------------------------------------------------
// Type helpers
// ---------------------------------------------------------------------------

interface OmnisendProductItem {
  productID: string;
  productTitle: string;
  productPrice: number; // price in cents / minor-unit
  productQuantity: number;
  productUrl?: string;
  productImageUrl?: string;
}

// Extend Window to include omnisend global
declare global {
  interface Window {
    omnisend?: Array<unknown[]>;
  }
}

// ---------------------------------------------------------------------------
// Low-level push helper
// ---------------------------------------------------------------------------

function push(...args: unknown[]): void {
  if (typeof window === "undefined") return;
  window.omnisend = window.omnisend || [];
  window.omnisend.push(args);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Identify the current visitor so Omnisend can associate events with
 * an email address. Call this after login or when the user's email
 * becomes known (e.g. at checkout).
 */
export function omnisendIdentify(email: string): void {
  if (!email) return;
  push("track", "$identify", { email });
}

/**
 * Track an "added to cart" event.
 * This is the event that triggers the Omnisend "Abandoned Cart" workflow.
 */
export function omnisendTrackAddToCart(item: OmnisendProductItem): void {
  push("track", "$addedToCart", {
    productID: item.productID,
    productTitle: item.productTitle,
    productPrice: item.productPrice,
    productQuantity: item.productQuantity,
    productUrl: item.productUrl || "",
    productImageUrl: item.productImageUrl || "",
  });
}

/**
 * Track a "started checkout" event.
 */
export function omnisendTrackStartedCheckout(
  cartTotal: number,
  items: OmnisendProductItem[],
  currency?: string
): void {
  push("track", "$startedCheckout", {
    currency: currency || "AED",
    cartTotal,
    lineItems: items.map((i) => ({
      productID: i.productID,
      productTitle: i.productTitle,
      productPrice: i.productPrice,
      productQuantity: i.productQuantity,
      productUrl: i.productUrl || "",
      productImageUrl: i.productImageUrl || "",
    })),
  });
}

/**
 * Track a page view.
 */
export function omnisendTrackPageView(): void {
  push("track", "$pageViewed");
}

/**
 * Track a product view.
 */
export function omnisendTrackProductViewed(
  productID: string,
  productTitle: string,
  productPrice: number,
  productUrl?: string,
  productImageUrl?: string
): void {
  push("track", "$productViewed", {
    productID,
    productTitle,
    productPrice,
    productUrl: productUrl || "",
    productImageUrl: productImageUrl || "",
  });
}
