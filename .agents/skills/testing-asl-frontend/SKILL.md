# Testing ASL Frontend

Next.js e-commerce frontend for Aromatic Scents Lab (aromaticscentslab.com).

## Local Dev Setup

```bash
npm install
npm run dev
```

The dev server (`npm run dev`) uses Turbopack. For production-accurate testing, use `npm run build && npx next start -p 3000`.

## Key Test Routes

| Page | Route |
|------|-------|
| Homepage | /en |
| Shop | /en/shop |
| Category | /en/category/perfumes |
| Product Detail | /en/product/dark-musk-perfume |
| FAQ | /en/faq |
| Cart | /en/cart |
| Search | /en/search?q=musk |
| SEO Guides | /en/guides/best-perfumes-uae |
| Image Sitemap | /image-sitemap.xml |
| Sitemap | /sitemap.xml |
| Info pages | /en/shipping, /en/returns, /en/privacy, /en/terms-and-conditions |

Arabic locale: replace `/en/` with `/ar/`.

## SEO Schema Testing

### Extracting JSON-LD blocks from any page

Use browser console to extract and inspect structured data:

```javascript
// Get all JSON-LD blocks
Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => JSON.parse(s.textContent))

// Filter by type (e.g., LocalBusiness, Product, Store)
Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => JSON.parse(s.textContent)).filter(s => s['@type'] === 'LocalBusiness' || s['@type'] === 'Store')

// Get Product schema specifically
Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => JSON.parse(s.textContent)).find(s => s['@type'] === 'Product')
```

### Homepage schemas (expected on /en)
- Organization schema
- WebSite schema (with SearchAction)
- 1 Store (parent org) + 6 LocalBusiness entries (physical stores)
- Each LocalBusiness should have: address, geo coordinates, hasMap, openingHoursSpecification, parentOrganization

### Product page schemas (expected on /en/product/[slug])
- Product schema with: `image` (array of URLs), `category`, `itemCondition`, `offers.seller`, `offers.shippingDetails`, `offers.hasMerchantReturnPolicy`
- BreadcrumbList schema

### Guide page schemas (expected on /en/guides/[slug])
- ItemList, FAQPage, Article, BreadcrumbList (4 guide-specific schemas)

### XML Image Sitemap Testing
- Navigate to `/image-sitemap.xml` in browser or use `curl`
- Verify `xmlns:image` namespace is present
- Verify both `/en/product/` and `/ar/product/` URLs are included
- For HTML entity verification, use `curl` to check raw XML (browser XML viewer double-renders entities)
- `&amp;` in raw XML source is correct (decodes to `&`)
- `&amp;amp;` in raw XML source is wrong (double-encoded)

## Mobile Testing

Use browser `set_mobile` to toggle mobile viewport (390px). Key mobile-specific elements:
- Bottom navigation bar (Home, Menu, Search, Wishlist, Account)
- Account drawer with footer links
- Cookie/location banner positioning above bottom bar

## WordPress Backend

- URL: https://cms.aromaticscentslab.com/wp-admin
- Credentials: Use saved WordPress admin credentials
- Hero slider settings: Custom Settings > Homepage Settings > Hero Slider
- Product tags: Products > Tags (e.g., `bestseller`, `ramadan-special`)

## Known Caveats

1. **Turbopack caching**: Dev server (`npm run dev`) may serve stale responses for server routes. If testing server-side routes (like image-sitemap.xml), restart the dev server or use production build.
2. **Image sitemap caching**: The image sitemap route has `revalidate = 3600` (1 hour cache). After code changes, restart the server to see updates.
3. **Product images**: Some products use placeholder images when CMS images aren't loaded.
4. **No CI configured**: This repo has no automated CI checks. Verify changes via `npm run lint` and `npm run build`.
5. **WC Store API empty tags**: The WooCommerce Store API returns empty `tags: []` on product listing endpoints. A hardcoded `BESTSELLER_PRODUCT_SLUGS` array is used as a fallback.
6. **Arabic locale slugs**: Product slugs may differ between English and Arabic locales.

## Devin Secrets Needed

- WordPress admin credentials (for CMS testing)
