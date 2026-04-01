<?php
/**
 * Plugin Name: ASL Frontend Settings
 * Plugin URI: https://aromaticscentslab.com
 * Description: Admin dashboard and REST API endpoints for ASL Frontend with Media Library upload, dynamic slides, layout options, ASL Bundles Creator, and Free Gift functionality.
 * Version: 6.1.0
 * Author: Aromatic Scents Lab
 * License: GPL v2 or later
 */

if (!defined('ABSPATH')) exit;

// Prevent duplicate loading
if (defined('ASL_FRONTEND_SETTINGS_LOADED')) {
    add_action('admin_notices', function() {
        echo '<div class="notice notice-error"><p><strong>ASL Frontend Settings:</strong> Duplicate plugin detected!</p></div>';
    });
    return;
}
define('ASL_FRONTEND_SETTINGS_LOADED', true);
define('ASL_SETTINGS_VERSION', '6.3.0');
define('ASL_SETTINGS_PATH', plugin_dir_path(__FILE__));

/**
 * Sanitize link URL (allows relative paths starting with /)
 * Wrapped in function_exists check since class-asl-settings.php may define it too
 */
if (!function_exists('asl_sanitize_link')) {
    function asl_sanitize_link($url) {
        if (empty($url)) return '';
        if (strpos($url, '/') === 0) return sanitize_text_field($url);
        return esc_url_raw($url);
    }
}

/**
 * Enqueue admin scripts and media library
 */
add_action('admin_enqueue_scripts', function($hook) {
    $is_asl = strpos($hook, 'asl-settings') !== false;
    $is_cpt = in_array(get_post_type(), ['asl_guide','asl_product_page','asl_note','page']);
    if (!$is_asl && !$is_cpt) return;
    wp_enqueue_media();
    wp_enqueue_script('asl-admin', plugins_url('admin.js', __FILE__), array('jquery'), ASL_SETTINGS_VERSION, true);
    wp_localize_script('asl-admin', 'aslAdmin', [
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce'   => wp_create_nonce('asl_product_search'),
    ]);
});

/**
 * AJAX: Search WooCommerce products (for product selector)
 */
add_action('wp_ajax_asl_search_products', function() {
    check_ajax_referer('asl_product_search', 'nonce');
    $q = sanitize_text_field($_GET['q'] ?? '');
    if (strlen($q) < 2) { wp_send_json_success([]); }

    $args = [
        'post_type' => 'product', 'post_status' => 'publish',
        'posts_per_page' => 20, 's' => $q,
    ];
    $posts = get_posts($args);
    $results = [];
    foreach ($posts as $p) {
        $product = wc_get_product($p->ID);
        if (!$product) continue;
        $img = wp_get_attachment_image_url($product->get_image_id(), 'thumbnail') ?: '';
        // Get product categories
        $cats = wp_get_post_terms($p->ID, 'product_cat', ['fields' => 'names']);
        $category = is_array($cats) && !is_wp_error($cats) ? implode(', ', $cats) : '';
        $results[] = [
            'id'       => $p->ID,
            'slug'     => $product->get_slug(),
            'name'     => $product->get_name(),
            'price'    => strip_tags(wc_price($product->get_price())),
            'sku'      => $product->get_sku(),
            'image'    => $img,
            'stock'    => $product->get_stock_status(),
            'category' => $category,
        ];
    }
    wp_send_json_success($results);
});

/**
 * Include separate module files
 * 
 * The plugin is organized into modules:
 * 1. ASL Settings - Core settings for homepage hero/products, header, SEO, mobile
 * 2. Bundle Builder - Product bundle creation and management
 * 3. Free Gift - Automatic free gift rules based on cart value
 * 4. Forms - Contact form and newsletter REST API endpoints
 * 5. Product Pages - Dynamic product-type page creation with bilingual support
 * 6. Category SEO - Per-category SEO content fields (EN/AR)
 * 7. Guide Pages - Dynamic guide/article CPT with bilingual support
 * 8. Field Helpers - Shared reusable field components
 * 9. Page Fields - Metaboxes on native WP Pages (replaces static-pages + home-sections)
 * 10. Notes CPT - Fragrance notes as CPT (replaces notes-seo submenu)
 */

// Include ASL Settings module (homepage, header, SEO, mobile settings)
require_once ASL_SETTINGS_PATH . 'includes/class-asl-settings.php';

// Include Bundle Builder module (REST API, metabox, CoCart integration)
require_once ASL_SETTINGS_PATH . 'includes/class-asl-bundle-builder.php';

// Include Free Gift module (admin page, REST API, product hiding)
require_once ASL_SETTINGS_PATH . 'includes/class-asl-free-gift.php';

// Include Forms module (contact form and newsletter REST API)
require_once ASL_SETTINGS_PATH . 'includes/class-asl-forms.php';

// Include Frontend URLs module (rewrite admin URLs to headless frontend)
require_once ASL_SETTINGS_PATH . 'includes/class-asl-frontend-urls.php';

// Include Email Templates module (custom WooCommerce email templates)
require_once ASL_SETTINGS_PATH . 'includes/class-asl-email-templates.php';

// Security module skipped - standalone asl-security plugin provides same functionality

// Include Customer Tracking module (order tracking data display in admin)
require_once ASL_SETTINGS_PATH . 'includes/class-asl-customer-tracking.php';

// Include Product Pages module (dynamic product-type pages with EN/AR support)
require_once ASL_SETTINGS_PATH . 'includes/class-asl-product-pages.php';

// Include Category SEO module (per-category SEO content fields EN/AR)
require_once ASL_SETTINGS_PATH . 'includes/class-asl-category-seo.php';

// Include Guide Pages module (dynamic guide/article CPT with bilingual support)
require_once ASL_SETTINGS_PATH . 'includes/class-asl-guide-pages.php';

// Include Field Helpers (shared reusable field components)
require_once ASL_SETTINGS_PATH . 'includes/asl-field-helpers.php';

// Include Page Fields module (metaboxes on native WP Pages: About, Contact, FAQ, etc. + Home sections)
require_once ASL_SETTINGS_PATH . 'includes/class-asl-page-fields.php';

// Include Notes CPT module (fragrance notes as individual posts, like Guides)
require_once ASL_SETTINGS_PATH . 'includes/class-asl-notes-cpt.php';
