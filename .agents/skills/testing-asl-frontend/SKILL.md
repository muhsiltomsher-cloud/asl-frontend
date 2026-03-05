# Testing ASL Frontend

Next.js e-commerce frontend for Aromatic Scents Lab (aromaticscentslab.com).

## Local Dev Setup

```bash
npm install
npm run build
npx next start -p 3000
```

The app requires a production build (`npm run build`) before `next start`. The dev server (`npm run dev`) uses Turbopack which may have persistent caching issues — prefer production builds for accurate testing.

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
| Info pages | /en/shipping, /en/returns, /en/privacy, /en/terms-and-conditions |

Arabic locale: replace `/en/` with `/ar/`.

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

1. **Turbopack caching**: Dev server (`npm run dev`) may serve stale responses. Kill the process, rebuild with `npm run build`, and use `next start` instead.
2. **Product images**: Some products use placeholder images (`asl-placeholder.png`) when CMS images aren't loaded.
3. **No CI configured**: This repo has no automated CI checks. Verify changes via `npm run build` (should exit 0) and visual inspection.
4. **WC Store API empty tags**: The WooCommerce Store API returns empty `tags: []` on product listing endpoints. Product detail pages return full tags. This affects badge rendering and sorting — a hardcoded `BESTSELLER_PRODUCT_SLUGS` array is used as a fallback.
5. **Arabic locale slugs**: Product slugs may differ between English and Arabic locales. The `getProductSlugFromPermalink` utility extracts English slugs from permalinks for consistent matching.

## Devin Secrets Needed

- WordPress admin credentials (for CMS testing)
