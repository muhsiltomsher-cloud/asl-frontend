# Testing Omnisend Tracking Events

The ASL frontend fires Omnisend events for abandoned cart and checkout tracking via `src/lib/utils/omnisend.ts`. Since this is a headless Next.js site, events are pushed manually to `window.omnisend` rather than auto-injected by the WooCommerce plugin.

## Prerequisites

- `NEXT_PUBLIC_OMNISEND_BRAND_ID` must be set (env var or .env.local)
- Omnisend tracking script loads via `OmnisendTracking.tsx` component in the layout
- Live site: https://aromaticscentslab.com
- Local dev: http://localhost:3000 (run `npm run dev`)

## How to Verify Events

Omnisend's script processes and clears the `window.omnisend` array immediately, so you can't just read `window.omnisend` after events fire. Instead, **install an interceptor first**, then trigger the action:

```js
// Run this in browser console BEFORE adding to cart
window._omnisendLog = [];
const origPush = window.omnisend.push.bind(window.omnisend);
window.omnisend.push = function(args) {
  window._omnisendLog.push(JSON.parse(JSON.stringify(args)));
  return origPush(args);
};
```

After triggering an action (add to cart, enter email at checkout), read the log:
```js
console.log(JSON.stringify(window._omnisendLog, null, 2));
```

**Important:** The interceptor is lost on page navigation (SPA transitions within Next.js may preserve it, but full navigations will not). Re-install it after navigating to a new page.

## Test Flows

### 1. Add to Cart Event

1. Navigate to a product page (e.g., `/en/product/dark-wood`)
2. Install the interceptor (see above)
3. Click "Add to Cart"
4. Wait for cart drawer to open (confirms add succeeded)
5. Check `window._omnisendLog` for `["track", "added product to cart", {...}]`

**Expected event structure:**
```json
["track", "added product to cart", {
  "origin": "api",
  "eventID": "<uuid>",
  "eventVersion": "",
  "properties": {
    "abandonedCheckoutURL": "https://aromaticscentslab.com/en/cart",
    "cartID": "<cart_key>",
    "value": 800,
    "currency": "AED",
    "addedItem": {
      "productID": "8038",
      "productTitle": "Dark Wood",
      "productPrice": 385,
      "productImageURL": "...",
      "productURL": "https://aromaticscentslab.com/en/product/dark-wood"
    },
    "lineItems": [{ ... }]
  }
}]
```

### 2. Guest Email Identification at Checkout

1. Navigate to `/en/checkout` (must have items in cart)
2. Install the interceptor on the checkout page
3. Type a valid email in the "Email" field under Contact Information
4. Wait ~1 second for the 500ms debounce
5. Check `window._omnisendLog` for two events:
   - `["track", "$identify", { "email": "..." }]`
   - `["track", "started checkout", { origin: "api", ..., contact: { email: "..." } }]`

## Key Files

| File | Purpose |
|------|--------|
| `src/lib/utils/omnisend.ts` | All Omnisend tracking functions and event format |
| `src/contexts/CartContext.tsx` | Fires `omnisendTrackAddToCart()` after successful add |
| `src/app/[locale]/(shop)/checkout/CheckoutClient.tsx` | Fires `omnisendIdentify()` + `omnisendTrackStartedCheckout()` on email input |
| `src/components/tracking/OmnisendTracking.tsx` | Loads the Omnisend snippet script |

## Common Issues

- **Events not captured:** The Omnisend snippet processes events immediately. Always install the interceptor BEFORE triggering the action.
- **`window.omnisend` returns null/undefined:** The Omnisend snippet may not have loaded yet. Wait for the page to fully load, or check that `NEXT_PUBLIC_OMNISEND_BRAND_ID` is set.
- **Price values:** Prices are in major currency units (e.g., 385 for AED 385.00). CoCart returns minor units, and the code divides by `10^currency_minor_unit`.
- **`value` field:** This is the cart total from CoCart's `totals.total`, which may include shipping. It's the backend-reported total.
- **Free gift items:** When cart total exceeds a threshold, a free gift item may be auto-added. This appears in `lineItems` with `productPrice: 0`.

## Omnisend API Reference

- Cart events: https://api-docs.omnisend.com/docs/how-to-track-cart-events-snippet
- Cart abandonment: https://api-docs.omnisend.com/docs/how-to-enable-cart-abandonment

## Devin Secrets Needed

- `OMNISEND_BRAND_ID` (value: set in .env.local as NEXT_PUBLIC_OMNISEND_BRAND_ID)
- WordPress admin credentials (for CMS/plugin testing)
- Omnisend login credentials (for verifying events in Omnisend dashboard Live View)
