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
define('ASL_SETTINGS_VERSION', '6.1.0');
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
    $is_asl = strpos($hook, 'asl-settings') !== false || strpos($hook, 'asl-home-sections') !== false;
    $is_guide = (get_post_type() === 'asl_guide' || get_post_type() === 'asl_product_page');
    if (!$is_asl && !$is_guide) return;
    wp_enqueue_media();
    wp_enqueue_script('asl-admin', plugins_url('admin.js', __FILE__), array('jquery'), ASL_SETTINGS_VERSION, true);
});

/**
 * Include separate module files
 * 
 * The plugin is organized into modules:
 * 1. ASL Settings - Core settings for homepage, header, SEO, mobile
 * 2. Bundle Builder - Product bundle creation and management
 * 3. Free Gift - Automatic free gift rules based on cart value
 * 4. Forms - Contact form and newsletter REST API endpoints
 * 5. Product Pages - Dynamic product-type page creation with bilingual support
 * 6. Category SEO - Per-category SEO content fields (EN/AR)
 * 7. Home Sections - Editable homepage content sections (Why Choose Us, Our Story, FAQ, SEO)
 * 8. Guide Pages - Dynamic guide/article pages CPT with bilingual support
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

// Include Home Sections module (editable homepage content: Why Choose Us, Our Story, FAQ, SEO)
require_once ASL_SETTINGS_PATH . 'includes/class-asl-home-sections.php';

// Include Guide Pages module (dynamic guide/article CPT with bilingual support)
require_once ASL_SETTINGS_PATH . 'includes/class-asl-guide-pages.php';
