# Testing the Application

## Prerequisites

- Dev server running: `npm run dev` (runs on http://localhost:3000)
- No additional backend setup needed — the app fetches from the live WooCommerce API

## Test Product URLs

Useful products covering different scenarios:

| Scenario | EN URL | What to verify |
|----------|--------|----------------|
| Perfume with full attributes | `/en/product/leather-intense-perfume` | Title has olfactory family + category |
| Product with `&` in category | `/en/product/secret-leather-hair-body-mist` | `&` renders correctly, not `&amp;` |
| Gift set (no olfactory family) | `/en/product/asl-ramadan-box` | Fallback title without olfactory family |
| Smart quotes in description | `/en/product/the-ultimate-fragrance-collection` | Apostrophes render as `'` not `&#8217;` |
| Arabic locale | `/ar/product/leather-intense-perfume` | Arabic product name, correct RTL layout |

## Verifying SEO Metadata

Browser console method:
```js
console.log('TITLE:', document.title)
console.log('DESC:', document.querySelector('meta[name="description"]')?.content)
```

## Common Issues

- **HTML entities in titles/descriptions**: WooCommerce stores `&amp;` for `&`, `&#8217;` for smart quotes. The `decodeHtmlEntities` utility in `src/lib/utils/index.ts` handles these.
- **Title too long**: Product page titles are capped at ~60 chars. If too long, the olfactory family is dropped first, then category.
- **Layout template appending**: Product pages use `{ absolute: seoTitle }` to prevent the layout from appending the brand name suffix.
