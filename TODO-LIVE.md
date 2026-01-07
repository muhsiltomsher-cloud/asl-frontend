# Production Checklist - Items to Enable Before Going Live

This document lists all development mode settings that are currently disabled and need to be enabled before deploying to production.

## 1. Wishlist API Caching

**File:** `src/app/api/wishlist/route.ts`

**What to do:** Uncomment the caching code (lines 11-24) and update the functions to use the cache.

**Lines 11-24 - Uncomment these:**
```typescript
const PRODUCT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
interface CachedProduct {
  data: WCProduct;
  timestamp: number;
}
const productCache = new Map<number, CachedProduct>();

const SHARE_KEY_CACHE_TTL = 60 * 1000; // 1 minute
interface CachedShareKey {
  shareKey: string;
  timestamp: number;
}
const shareKeyCache = new Map<number, CachedShareKey>();
```

**Lines 26-42 - Replace the stub functions with actual caching logic:**
```typescript
function getCachedProduct(productId: number): WCProduct | null {
  const cached = productCache.get(productId);
  if (cached && Date.now() - cached.timestamp < PRODUCT_CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCachedProduct(productId: number, product: WCProduct): void {
  productCache.set(productId, { data: product, timestamp: Date.now() });
}

function getCachedShareKey(userId: number): string | null {
  const cached = shareKeyCache.get(userId);
  if (cached && Date.now() - cached.timestamp < SHARE_KEY_CACHE_TTL) {
    return cached.shareKey;
  }
  return null;
}

function setCachedShareKey(userId: number, shareKey: string): void {
  shareKeyCache.set(userId, { shareKey, timestamp: Date.now() });
}
```

**Benefits:**
- Reduces WooCommerce API calls for product details
- Speeds up wishlist add/remove operations
- 5-minute TTL for products, 1-minute TTL for share keys

---

## 2. Categories Drawer Caching

**File:** `src/components/layout/CategoriesDrawer.tsx`

**What to do:** Uncomment the caching code (lines 17-19) and add cache check logic.

**Lines 17-19 - Uncomment these:**
```typescript
const categoriesCache: Record<string, { data: WCCategory[]; timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL
```

**Update `fetchCategoriesData` function to check cache first:**
```typescript
const fetchCategoriesData = useCallback(async () => {
  // Check cache first
  const cached = categoriesCache[locale];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    setCategories(cached.data);
    return;
  }
  
  // ... rest of existing fetch logic ...
  
  // After fetching, cache the results:
  categoriesCache[locale] = { data: cats, timestamp: Date.now() };
}, [locale]);
```

**Benefits:**
- Reduces API calls when opening categories drawer multiple times
- 5-minute cache TTL

---

## 3. Shop Page Products Caching

**File:** `src/app/[locale]/(shop)/shop/ShopClient.tsx`

**What to do:** Uncomment the caching code (lines 8-10) and update functions.

**Lines 8-10 - Uncomment these:**
```typescript
const PRODUCTS_CACHE_KEY = "asl_products_cache";
const CACHE_TTL_MS = 5 * 60 * 1000;
```

**Lines 22-34 - Replace stub functions with localStorage caching:**
```typescript
function getCachedProducts(locale: string): CachedProducts | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = localStorage.getItem(PRODUCTS_CACHE_KEY);
    if (cached) {
      const data: CachedProducts = JSON.parse(cached);
      if (data.locale === locale && Date.now() - data.timestamp < CACHE_TTL_MS) {
        return data;
      }
    }
  } catch {
    // Ignore localStorage errors
  }
  return null;
}

function setCachedProducts(
  products: WCProduct[],
  total: number,
  totalPages: number,
  locale: string
): void {
  if (typeof window === "undefined") return;
  try {
    const data: CachedProducts = {
      products,
      total,
      totalPages,
      timestamp: Date.now(),
      locale,
    };
    localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore localStorage errors
  }
}
```

**Update useEffect to check cache on mount:**
```typescript
useEffect(() => {
  const cached = getCachedProducts(locale);
  if (cached) {
    setProducts(cached.products);
    setTotal(cached.total);
    setHasMore(cached.products.length < cached.total);
  } else {
    setProducts(initialProducts);
    setTotal(initialTotal);
    setHasMore(initialProducts.length < initialTotal);
  }
  isInitialMount.current = false;
}, [initialProducts, initialTotal, locale]);
```

**Benefits:**
- Caches products in localStorage for faster page loads
- 5-minute cache TTL
- Persists across page refreshes

---

## Summary

| Item | File | Cache TTL | Status |
|------|------|-----------|--------|
| Wishlist Product Cache | `src/app/api/wishlist/route.ts` | 5 min | Disabled |
| Wishlist Share Key Cache | `src/app/api/wishlist/route.ts` | 1 min | Disabled |
| Categories Drawer Cache | `src/components/layout/CategoriesDrawer.tsx` | 5 min | Disabled |
| Shop Products Cache | `src/app/[locale]/(shop)/shop/ShopClient.tsx` | 5 min | Disabled |

---

## Notes

- All caching is currently disabled with comments like "DEV MODE: Cache disabled for faster development"
- These caches improve performance by reducing API calls and speeding up page loads
- The trade-off is that content updates may take up to 5 minutes to appear (or 1 minute for wishlist share keys)
- For real-time content requirements, consider reducing TTL values or implementing cache invalidation
