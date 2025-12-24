# WordPress Admin Guide for ASL Frontend

This guide explains how to configure the home page sections, logo, and menu from the WordPress admin panel.

## Prerequisites

1. WordPress with WooCommerce installed
2. Advanced Custom Fields (ACF) Pro plugin installed
3. ACF to REST API plugin installed (to expose ACF fields via REST API)

## Setting Up ACF Fields

### 1. Create Home Page Options Page

Go to **ACF > Options Pages** and create a new options page:

- Page Title: `Home Page Settings`
- Menu Title: `Home Page`
- Menu Slug: `home-page-settings`
- Parent Page: `Settings`

### 2. Create Site Settings Options Page

Create another options page for site-wide settings:

- Page Title: `Site Settings`
- Menu Title: `Site Settings`
- Menu Slug: `site-settings`
- Parent Page: `Settings`

## ACF Field Groups

### Site Settings Field Group

Create a field group for site settings with the following fields:

#### Logo Settings
| Field Label | Field Name | Field Type | Instructions |
|-------------|------------|------------|--------------|
| Site Logo | `site_logo` | Image | Upload your site logo (recommended: PNG with transparent background, max width 200px) |
| Logo Alt Text | `logo_alt` | Text | Alternative text for the logo |

Location Rule: Options Page is equal to Site Settings

### Home Page Field Group

Create a field group for home page settings with the following fields:

#### Hero Slider Section

| Field Label | Field Name | Field Type | Instructions |
|-------------|------------|------------|--------------|
| Enable Hero Slider | `hero_enabled` | True/False | Enable or disable the hero slider |
| Hero Slides | `hero_slides` | Repeater | Add slides to the hero slider |

**Hero Slides Repeater Sub-fields:**
| Field Label | Field Name | Field Type | Instructions |
|-------------|------------|------------|--------------|
| Desktop Image | `image` | Image | Upload hero image for desktop (recommended: 1920x800px) |
| Mobile Image | `mobile_image` | Image | Upload hero image for mobile (recommended: 768x600px) |
| Link URL | `link_url` | URL | Optional link when clicking the slide |
| Link Target | `link_target` | Select | Choose `_self` (same tab) or `_blank` (new tab) |

**Hero Slider Settings:**
| Field Label | Field Name | Field Type | Instructions |
|-------------|------------|------------|--------------|
| Autoplay | `hero_autoplay` | True/False | Enable automatic slide transition |
| Autoplay Delay | `hero_autoplay_delay` | Number | Delay between slides in milliseconds (default: 5000) |
| Loop | `hero_loop` | True/False | Enable infinite loop |

#### New Products Section

| Field Label | Field Name | Field Type | Instructions |
|-------------|------------|------------|--------------|
| Enable New Products | `new_products_enabled` | True/False | Show/hide the new products section |
| Section Title | `new_products_title` | Text | Title for the section (leave empty for default) |
| Section Subtitle | `new_products_subtitle` | Text | Subtitle for the section |
| Number of Products | `new_products_count` | Number | Number of products to display (default: 8) |
| Show View All Link | `new_products_show_view_all` | True/False | Show "View All" link |
| View All URL | `new_products_view_all_url` | URL | Custom URL for View All link |

#### Bestseller Products Section

| Field Label | Field Name | Field Type | Instructions |
|-------------|------------|------------|--------------|
| Enable Bestsellers | `bestseller_enabled` | True/False | Show/hide the bestseller section |
| Section Title | `bestseller_title` | Text | Title for the section |
| Section Subtitle | `bestseller_subtitle` | Text | Subtitle for the section |
| Number of Products | `bestseller_count` | Number | Number of products to display (default: 8) |
| Show View All Link | `bestseller_show_view_all` | True/False | Show "View All" link |
| View All URL | `bestseller_view_all_url` | URL | Custom URL for View All link |

#### Shop by Category Section

| Field Label | Field Name | Field Type | Instructions |
|-------------|------------|------------|--------------|
| Enable Categories | `categories_enabled` | True/False | Show/hide the categories section |
| Section Title | `categories_title` | Text | Title for the section |
| Section Subtitle | `categories_subtitle` | Text | Subtitle for the section |
| Number of Categories | `categories_count` | Number | Number of categories to display (default: 6) |
| Show View All Link | `categories_show_view_all` | True/False | Show "View All" link |

#### Featured Products Slider Section

| Field Label | Field Name | Field Type | Instructions |
|-------------|------------|------------|--------------|
| Enable Featured Slider | `featured_enabled` | True/False | Show/hide the featured products slider |
| Section Title | `featured_title` | Text | Title for the section |
| Section Subtitle | `featured_subtitle` | Text | Subtitle for the section |
| Number of Products | `featured_count` | Number | Number of products in slider (default: 12) |
| Autoplay | `featured_autoplay` | True/False | Enable automatic slide transition |
| Show View All Link | `featured_show_view_all` | True/False | Show "View All" link |

#### Collections Section

| Field Label | Field Name | Field Type | Instructions |
|-------------|------------|------------|--------------|
| Enable Collections | `collections_enabled` | True/False | Show/hide the collections section |
| Section Title | `collections_title` | Text | Title for the section |
| Section Subtitle | `collections_subtitle` | Text | Subtitle for the section |
| Collections | `collections_items` | Repeater | Add collection items |

**Collections Repeater Sub-fields:**
| Field Label | Field Name | Field Type | Instructions |
|-------------|------------|------------|--------------|
| Collection Image | `image` | Image | Upload collection image (recommended: 600x400px) |
| Collection Title | `title` | Text | Title of the collection |
| Collection Description | `description` | Textarea | Short description |
| Link URL | `link_url` | URL | Link to the collection page |

#### Banners Section

| Field Label | Field Name | Field Type | Instructions |
|-------------|------------|------------|--------------|
| Enable Banners | `banners_enabled` | True/False | Show/hide the banners section |
| Banners | `banners_items` | Repeater | Add promotional banners |

**Banners Repeater Sub-fields:**
| Field Label | Field Name | Field Type | Instructions |
|-------------|------------|------------|--------------|
| Desktop Image | `image` | Image | Upload banner image for desktop (recommended: 1200x400px) |
| Mobile Image | `mobile_image` | Image | Upload banner image for mobile (recommended: 768x400px) |
| Banner Title | `title` | Text | Optional title overlay |
| Banner Subtitle | `subtitle` | Text | Optional subtitle overlay |
| Link URL | `link_url` | URL | Link when clicking the banner |
| Link Target | `link_target` | Select | Choose `_self` or `_blank` |

Location Rule: Options Page is equal to Home Page Settings

## Menu Configuration

### Creating Navigation Menus

1. Go to **Appearance > Menus** in WordPress admin
2. Create a new menu called `Primary Menu`
3. Add your desired pages, categories, or custom links
4. Under **Menu Settings**, check the location `Primary` or `Header`
5. Save the menu

### Menu Locations

The frontend supports these menu locations:

- **Primary Menu**: Main navigation in the header
- **Footer Menu**: Links in the footer area

### Exposing Menus via REST API

Install and activate the **WP REST API Menus** plugin to expose menus via the REST API. The frontend will fetch menus from:

```
/wp-json/menus/v1/menus/primary
/wp-json/menus/v1/menus/footer
```

## API Endpoints

The frontend fetches data from these WordPress REST API endpoints:

| Endpoint | Description |
|----------|-------------|
| `/wp-json/acf/v3/options/site-settings` | Site logo and global settings |
| `/wp-json/acf/v3/options/home-page-settings` | Home page section settings |
| `/wp-json/menus/v1/menus/{slug}` | Navigation menus |

## Multilingual Support (WPML/Polylang)

If using WPML or Polylang for multilingual support:

1. Translate all ACF option fields for each language
2. The frontend automatically passes the `lang` parameter to API requests
3. Ensure menu items are translated for each language

## Image Recommendations

| Section | Desktop Size | Mobile Size | Format |
|---------|-------------|-------------|--------|
| Hero Slider | 1920x800px | 768x600px | JPG/WebP |
| Category Images | 600x400px | - | JPG/WebP |
| Collection Images | 600x400px | - | JPG/WebP |
| Banners | 1200x400px | 768x400px | JPG/WebP |
| Logo | Max 200px width | - | PNG (transparent) |

## Troubleshooting

### Sections Not Appearing

1. Verify the section is enabled in ACF options
2. Check that ACF to REST API plugin is active
3. Verify the API endpoint returns data: `https://your-domain.com/wp-json/acf/v3/options/home-page-settings`

### Images Not Loading

1. Ensure images are uploaded to the WordPress media library
2. Check that image URLs are accessible (no CORS issues)
3. Verify image field returns full URL in REST API response

### Menu Not Updating

1. Clear any caching plugins
2. Verify WP REST API Menus plugin is active
3. Check menu is assigned to the correct location

## Cache Invalidation

The frontend caches WordPress API responses for 60 seconds. To see immediate changes:

1. Wait 60 seconds after making changes
2. Or trigger a revalidation by visiting the site with `?revalidate=true` (if implemented)

## Support

For technical support or custom development, contact the development team.
