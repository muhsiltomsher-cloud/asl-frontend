<?php
/**
 * ASL Footer Settings
 * 
 * Admin page and REST API endpoint for dynamic footer content.
 * Supports bilingual (EN/AR) fields for all text content,
 * repeatable link sections, and social media URLs.
 * 
 * @package ASL_Frontend_Settings
 * @since 6.4.0
 */

if (!defined('ABSPATH')) exit;

/**
 * Initialize Footer Settings
 */
function asl_footer_settings_init() {
    add_action('admin_menu', 'asl_footer_register_menu');
    add_action('rest_api_init', 'asl_footer_register_rest_routes');
}

/**
 * Register admin submenu page under ASL Settings
 */
function asl_footer_register_menu() {
    add_submenu_page(
        'asl-settings',
        'Footer Settings',
        'Footer Settings',
        'manage_options',
        'asl-settings-footer',
        'asl_render_footer_page'
    );
}

/**
 * Register REST API route
 */
function asl_footer_register_rest_routes() {
    register_rest_route('asl/v1', '/footer-settings', array(
        'methods'             => 'GET',
        'callback'            => 'asl_get_footer_settings',
        'permission_callback' => '__return_true',
    ));
}

/**
 * Render Footer Settings admin page
 */
function asl_render_footer_page() {
    if (!current_user_can('manage_options')) return;

    // Save settings
    if (isset($_POST['asl_save_footer_settings']) && check_admin_referer('asl_footer_settings_nonce')) {
        asl_save_footer_settings();
        echo '<div class="notice notice-success is-dismissible"><p>Footer settings saved!</p></div>';
    }

    $tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'general';
    ?>
    <div class="wrap">
        <h1>Footer Settings</h1>
        <nav class="nav-tab-wrapper">
            <?php foreach (['general' => 'General', 'links' => 'Footer Links', 'social' => 'Social Media'] as $k => $l): ?>
                <a href="?page=asl-settings-footer&tab=<?php echo $k; ?>" class="nav-tab <?php echo $tab === $k ? 'nav-tab-active' : ''; ?>"><?php echo $l; ?></a>
            <?php endforeach; ?>
        </nav>
        <form method="post">
            <?php wp_nonce_field('asl_footer_settings_nonce'); ?>
            <input type="hidden" name="asl_footer_current_tab" value="<?php echo esc_attr($tab); ?>">
            <div class="tab-content" style="background:#fff;padding:20px;border:1px solid #ccd0d4;border-top:none;">
                <?php
                switch ($tab) {
                    case 'general': asl_render_footer_general_tab(); break;
                    case 'links':   asl_render_footer_links_tab(); break;
                    case 'social':  asl_render_footer_social_tab(); break;
                }
                ?>
            </div>
            <?php submit_button('Save Settings', 'primary', 'asl_save_footer_settings'); ?>
        </form>
    </div>
    <?php
}

/**
 * Render General tab - brand description, copyright, newsletter, powered by
 */
function asl_render_footer_general_tab() {
    ?>
    <h2>Brand Description</h2>
    <table class="form-table">
        <tr>
            <th>Description (EN)</th>
            <td><textarea name="asl_footer_description_en" rows="3" class="large-text"><?php echo esc_textarea(get_theme_mod('asl_footer_description_en', 'Discover premium fragrances, perfumes, and aromatic products at Aromatic Scents Lab. Shop our exclusive collection of luxury scents with delivery across the UAE and GCC.')); ?></textarea></td>
        </tr>
        <tr>
            <th>Description (AR)</th>
            <td><textarea name="asl_footer_description_ar" rows="3" class="large-text" dir="rtl"><?php echo esc_textarea(get_theme_mod('asl_footer_description_ar', 'اكتشف العطور الفاخرة ومنتجات العناية العطرية المصنوعة بعناية في أروماتيك سينتس لاب.')); ?></textarea></td>
        </tr>
    </table>

    <h2>Copyright</h2>
    <table class="form-table">
        <tr>
            <th>Copyright Text (EN)</th>
            <td><input type="text" name="asl_footer_copyright_en" value="<?php echo esc_attr(get_theme_mod('asl_footer_copyright_en', 'All rights reserved.')); ?>" class="regular-text">
            <p class="description">The year and site name are added automatically. This text appears after them.</p></td>
        </tr>
        <tr>
            <th>Copyright Text (AR)</th>
            <td><input type="text" name="asl_footer_copyright_ar" value="<?php echo esc_attr(get_theme_mod('asl_footer_copyright_ar', 'جميع الحقوق محفوظة.')); ?>" class="regular-text" dir="rtl"></td>
        </tr>
    </table>

    <h2>Newsletter Section</h2>
    <table class="form-table">
        <tr>
            <th>Title (EN)</th>
            <td><input type="text" name="asl_footer_newsletter_title_en" value="<?php echo esc_attr(get_theme_mod('asl_footer_newsletter_title_en', 'Newsletter')); ?>" class="regular-text"></td>
        </tr>
        <tr>
            <th>Title (AR)</th>
            <td><input type="text" name="asl_footer_newsletter_title_ar" value="<?php echo esc_attr(get_theme_mod('asl_footer_newsletter_title_ar', 'النشرة الإخبارية')); ?>" class="regular-text" dir="rtl"></td>
        </tr>
        <tr>
            <th>Subtitle (EN)</th>
            <td><input type="text" name="asl_footer_newsletter_subtitle_en" value="<?php echo esc_attr(get_theme_mod('asl_footer_newsletter_subtitle_en', 'Subscribe to our newsletter for updates and exclusive offers.')); ?>" class="large-text"></td>
        </tr>
        <tr>
            <th>Subtitle (AR)</th>
            <td><input type="text" name="asl_footer_newsletter_subtitle_ar" value="<?php echo esc_attr(get_theme_mod('asl_footer_newsletter_subtitle_ar', 'اشترك في نشرتنا الإخبارية للحصول على التحديثات والعروض الحصرية.')); ?>" class="large-text" dir="rtl"></td>
        </tr>
        <tr>
            <th>Button Text (EN)</th>
            <td><input type="text" name="asl_footer_newsletter_button_en" value="<?php echo esc_attr(get_theme_mod('asl_footer_newsletter_button_en', 'Subscribe')); ?>" class="regular-text"></td>
        </tr>
        <tr>
            <th>Button Text (AR)</th>
            <td><input type="text" name="asl_footer_newsletter_button_ar" value="<?php echo esc_attr(get_theme_mod('asl_footer_newsletter_button_ar', 'اشترك')); ?>" class="regular-text" dir="rtl"></td>
        </tr>
        <tr>
            <th>Placeholder (EN)</th>
            <td><input type="text" name="asl_footer_newsletter_placeholder_en" value="<?php echo esc_attr(get_theme_mod('asl_footer_newsletter_placeholder_en', 'Enter your email')); ?>" class="regular-text"></td>
        </tr>
        <tr>
            <th>Placeholder (AR)</th>
            <td><input type="text" name="asl_footer_newsletter_placeholder_ar" value="<?php echo esc_attr(get_theme_mod('asl_footer_newsletter_placeholder_ar', 'أدخل بريدك الإلكتروني')); ?>" class="regular-text" dir="rtl"></td>
        </tr>
    </table>

    <h2>Powered By</h2>
    <table class="form-table">
        <tr>
            <th>Text (EN)</th>
            <td><input type="text" name="asl_footer_powered_text_en" value="<?php echo esc_attr(get_theme_mod('asl_footer_powered_text_en', 'Powered by')); ?>" class="regular-text"></td>
        </tr>
        <tr>
            <th>Text (AR)</th>
            <td><input type="text" name="asl_footer_powered_text_ar" value="<?php echo esc_attr(get_theme_mod('asl_footer_powered_text_ar', 'مدعوم من')); ?>" class="regular-text" dir="rtl"></td>
        </tr>
        <tr>
            <th>Name (EN)</th>
            <td><input type="text" name="asl_footer_powered_name_en" value="<?php echo esc_attr(get_theme_mod('asl_footer_powered_name_en', 'Cadvil Solutions')); ?>" class="regular-text"></td>
        </tr>
        <tr>
            <th>Name (AR)</th>
            <td><input type="text" name="asl_footer_powered_name_ar" value="<?php echo esc_attr(get_theme_mod('asl_footer_powered_name_ar', 'Cadvil Solutions')); ?>" class="regular-text" dir="rtl"></td>
        </tr>
        <tr>
            <th>URL</th>
            <td><input type="url" name="asl_footer_powered_url" value="<?php echo esc_attr(get_theme_mod('asl_footer_powered_url', 'https://cadvil.com/')); ?>" class="regular-text"></td>
        </tr>
    </table>
    <?php
}

/**
 * Render Footer Links tab - Quick Links and Customer Service repeaters
 */
function asl_render_footer_links_tab() {
    // Quick Links - use 'asl_footer_quick_links_saved' flag to distinguish
    // "never configured" (show defaults) from "intentionally empty" (show nothing)
    $quick_links_saved = get_theme_mod('asl_footer_quick_links_saved', false);
    $quick_links = get_theme_mod('asl_footer_quick_links', array());
    if (!$quick_links_saved && empty($quick_links)) {
        $quick_links = array(
            array('label_en' => 'Home', 'label_ar' => 'الرئيسية', 'url' => '/'),
            array('label_en' => 'Shop', 'label_ar' => 'المتجر', 'url' => '/shop'),
            array('label_en' => 'About Us', 'label_ar' => 'من نحن', 'url' => '/about'),
            array('label_en' => 'Contact', 'label_ar' => 'اتصل بنا', 'url' => '/contact'),
            array('label_en' => 'Store Locator', 'label_ar' => 'مواقع المتاجر', 'url' => '/store-locator'),
        );
    }

    // Customer Service
    $cs_links_saved = get_theme_mod('asl_footer_cs_links_saved', false);
    $cs_links = get_theme_mod('asl_footer_cs_links', array());
    if (!$cs_links_saved && empty($cs_links)) {
        $cs_links = array(
            array('label_en' => 'FAQ', 'label_ar' => 'الأسئلة الشائعة', 'url' => '/faq'),
            array('label_en' => 'Shipping Information', 'label_ar' => 'معلومات الشحن', 'url' => '/shipping'),
            array('label_en' => 'Return Policy', 'label_ar' => 'سياسة الإرجاع', 'url' => '/returns'),
            array('label_en' => 'Privacy Policy', 'label_ar' => 'سياسة الخصوصية', 'url' => '/privacy'),
            array('label_en' => 'Terms & Conditions', 'label_ar' => 'الشروط والأحكام', 'url' => '/terms-and-conditions'),
        );
    }
    ?>
    <h2>Section Headings</h2>
    <table class="form-table">
        <tr>
            <th>Quick Links Heading (EN)</th>
            <td><input type="text" name="asl_footer_quick_heading_en" value="<?php echo esc_attr(get_theme_mod('asl_footer_quick_heading_en', 'Quick Links')); ?>" class="regular-text"></td>
        </tr>
        <tr>
            <th>Quick Links Heading (AR)</th>
            <td><input type="text" name="asl_footer_quick_heading_ar" value="<?php echo esc_attr(get_theme_mod('asl_footer_quick_heading_ar', 'روابط سريعة')); ?>" class="regular-text" dir="rtl"></td>
        </tr>
        <tr>
            <th>Customer Service Heading (EN)</th>
            <td><input type="text" name="asl_footer_cs_heading_en" value="<?php echo esc_attr(get_theme_mod('asl_footer_cs_heading_en', 'Customer Service')); ?>" class="regular-text"></td>
        </tr>
        <tr>
            <th>Customer Service Heading (AR)</th>
            <td><input type="text" name="asl_footer_cs_heading_ar" value="<?php echo esc_attr(get_theme_mod('asl_footer_cs_heading_ar', 'خدمة العملاء')); ?>" class="regular-text" dir="rtl"></td>
        </tr>
    </table>

    <h2>Quick Links <button type="button" class="button" id="asl-add-quick-link">+ Add Link</button></h2>
    <div id="asl-footer-quick-links">
        <?php foreach ($quick_links as $i => $link): ?>
        <div class="asl-footer-link-item" style="background:#f9f9f9;padding:15px;margin-bottom:10px;border:1px solid #ddd;">
            <h4>Link <?php echo $i + 1; ?> <button type="button" class="button asl-remove-footer-link" style="float:right;color:red;">Remove</button></h4>
            <table class="form-table">
                <tr><th>Label (EN)</th><td><input type="text" name="asl_footer_quick_links[<?php echo $i; ?>][label_en]" value="<?php echo esc_attr($link['label_en'] ?? ''); ?>" class="regular-text"></td></tr>
                <tr><th>Label (AR)</th><td><input type="text" name="asl_footer_quick_links[<?php echo $i; ?>][label_ar]" value="<?php echo esc_attr($link['label_ar'] ?? ''); ?>" class="regular-text" dir="rtl"></td></tr>
                <tr><th>URL</th><td><input type="text" name="asl_footer_quick_links[<?php echo $i; ?>][url]" value="<?php echo esc_attr($link['url'] ?? ''); ?>" class="large-text" placeholder="/shop or https://example.com"></td></tr>
            </table>
        </div>
        <?php endforeach; ?>
    </div>

    <h2 style="margin-top:30px;">Customer Service Links <button type="button" class="button" id="asl-add-cs-link">+ Add Link</button></h2>
    <div id="asl-footer-cs-links">
        <?php foreach ($cs_links as $i => $link): ?>
        <div class="asl-footer-link-item" style="background:#f9f9f9;padding:15px;margin-bottom:10px;border:1px solid #ddd;">
            <h4>Link <?php echo $i + 1; ?> <button type="button" class="button asl-remove-footer-link" style="float:right;color:red;">Remove</button></h4>
            <table class="form-table">
                <tr><th>Label (EN)</th><td><input type="text" name="asl_footer_cs_links[<?php echo $i; ?>][label_en]" value="<?php echo esc_attr($link['label_en'] ?? ''); ?>" class="regular-text"></td></tr>
                <tr><th>Label (AR)</th><td><input type="text" name="asl_footer_cs_links[<?php echo $i; ?>][label_ar]" value="<?php echo esc_attr($link['label_ar'] ?? ''); ?>" class="regular-text" dir="rtl"></td></tr>
                <tr><th>URL</th><td><input type="text" name="asl_footer_cs_links[<?php echo $i; ?>][url]" value="<?php echo esc_attr($link['url'] ?? ''); ?>" class="large-text" placeholder="/faq or https://example.com"></td></tr>
            </table>
        </div>
        <?php endforeach; ?>
    </div>

    <script type="text/javascript">
    jQuery(function($) {
        function footerLinkHtml(prefix, i) {
            return '<div class="asl-footer-link-item" style="background:#f9f9f9;padding:15px;margin-bottom:10px;border:1px solid #ddd;">' +
                '<h4>Link ' + (i+1) + ' <button type="button" class="button asl-remove-footer-link" style="float:right;color:red;">Remove</button></h4>' +
                '<table class="form-table">' +
                '<tr><th>Label (EN)</th><td><input type="text" name="' + prefix + '[' + i + '][label_en]" value="" class="regular-text"></td></tr>' +
                '<tr><th>Label (AR)</th><td><input type="text" name="' + prefix + '[' + i + '][label_ar]" value="" class="regular-text" dir="rtl"></td></tr>' +
                '<tr><th>URL</th><td><input type="text" name="' + prefix + '[' + i + '][url]" value="" class="large-text" placeholder="/shop or https://example.com"></td></tr>' +
                '</table></div>';
        }
        function reindexLinks(container) {
            var prefix = container.attr('id') === 'asl-footer-quick-links' ? 'asl_footer_quick_links' : 'asl_footer_cs_links';
            container.find('.asl-footer-link-item').each(function(i) {
                $(this).find('h4').contents().first().replaceWith('Link ' + (i + 1) + ' ');
                $(this).find('input').each(function() {
                    var n = $(this).attr('name');
                    if (n) $(this).attr('name', n.replace(/\[\d+\]/, '[' + i + ']'));
                });
            });
        }
        $('#asl-add-quick-link').on('click', function() {
            var c = $('#asl-footer-quick-links');
            c.append(footerLinkHtml('asl_footer_quick_links', c.find('.asl-footer-link-item').length));
        });
        $('#asl-add-cs-link').on('click', function() {
            var c = $('#asl-footer-cs-links');
            c.append(footerLinkHtml('asl_footer_cs_links', c.find('.asl-footer-link-item').length));
        });
        $(document).on('click', '.asl-remove-footer-link', function() {
            var item = $(this).closest('.asl-footer-link-item');
            var container = item.parent();
            item.remove();
            reindexLinks(container);
        });
    });
    </script>
    <?php
}

/**
 * Render Social Media tab
 */
function asl_render_footer_social_tab() {
    ?>
    <h2>Social Media Links</h2>
    <table class="form-table">
        <tr>
            <th>Facebook URL</th>
            <td><input type="url" name="asl_footer_social_facebook" value="<?php echo esc_attr(get_theme_mod('asl_footer_social_facebook', 'https://facebook.com/aromaticscentslab')); ?>" class="large-text" placeholder="https://facebook.com/yourpage"></td>
        </tr>
        <tr>
            <th>Instagram URL</th>
            <td><input type="url" name="asl_footer_social_instagram" value="<?php echo esc_attr(get_theme_mod('asl_footer_social_instagram', 'https://instagram.com/aromaticscentslab')); ?>" class="large-text" placeholder="https://instagram.com/yourpage"></td>
        </tr>
        <tr>
            <th>X (Twitter) URL</th>
            <td><input type="url" name="asl_footer_social_twitter" value="<?php echo esc_attr(get_theme_mod('asl_footer_social_twitter', 'https://x.com/araboriginaloud')); ?>" class="large-text" placeholder="https://x.com/yourhandle"></td>
        </tr>
        <tr>
            <th>TikTok URL</th>
            <td><input type="url" name="asl_footer_social_tiktok" value="<?php echo esc_attr(get_theme_mod('asl_footer_social_tiktok', '')); ?>" class="large-text" placeholder="https://tiktok.com/@yourhandle">
            <p class="description">Leave empty to hide the TikTok icon.</p></td>
        </tr>
        <tr>
            <th>Snapchat URL</th>
            <td><input type="url" name="asl_footer_social_snapchat" value="<?php echo esc_attr(get_theme_mod('asl_footer_social_snapchat', '')); ?>" class="large-text" placeholder="https://snapchat.com/add/yourhandle">
            <p class="description">Leave empty to hide the Snapchat icon.</p></td>
        </tr>
        <tr>
            <th>WhatsApp URL</th>
            <td><input type="url" name="asl_footer_social_whatsapp" value="<?php echo esc_attr(get_theme_mod('asl_footer_social_whatsapp', '')); ?>" class="large-text" placeholder="https://wa.me/971XXXXXXXXX">
            <p class="description">Leave empty to hide the WhatsApp icon. Use format: https://wa.me/971XXXXXXXXX</p></td>
        </tr>
    </table>
    <?php
}

/**
 * Save Footer Settings
 */
function asl_save_footer_settings() {
    $tab = sanitize_text_field($_POST['asl_footer_current_tab'] ?? 'general');

    switch ($tab) {
        case 'general':
            // Brand description
            set_theme_mod('asl_footer_description_en', sanitize_textarea_field($_POST['asl_footer_description_en'] ?? ''));
            set_theme_mod('asl_footer_description_ar', sanitize_textarea_field($_POST['asl_footer_description_ar'] ?? ''));

            // Copyright
            set_theme_mod('asl_footer_copyright_en', sanitize_text_field($_POST['asl_footer_copyright_en'] ?? ''));
            set_theme_mod('asl_footer_copyright_ar', sanitize_text_field($_POST['asl_footer_copyright_ar'] ?? ''));

            // Newsletter
            set_theme_mod('asl_footer_newsletter_title_en', sanitize_text_field($_POST['asl_footer_newsletter_title_en'] ?? ''));
            set_theme_mod('asl_footer_newsletter_title_ar', sanitize_text_field($_POST['asl_footer_newsletter_title_ar'] ?? ''));
            set_theme_mod('asl_footer_newsletter_subtitle_en', sanitize_text_field($_POST['asl_footer_newsletter_subtitle_en'] ?? ''));
            set_theme_mod('asl_footer_newsletter_subtitle_ar', sanitize_text_field($_POST['asl_footer_newsletter_subtitle_ar'] ?? ''));
            set_theme_mod('asl_footer_newsletter_button_en', sanitize_text_field($_POST['asl_footer_newsletter_button_en'] ?? ''));
            set_theme_mod('asl_footer_newsletter_button_ar', sanitize_text_field($_POST['asl_footer_newsletter_button_ar'] ?? ''));
            set_theme_mod('asl_footer_newsletter_placeholder_en', sanitize_text_field($_POST['asl_footer_newsletter_placeholder_en'] ?? ''));
            set_theme_mod('asl_footer_newsletter_placeholder_ar', sanitize_text_field($_POST['asl_footer_newsletter_placeholder_ar'] ?? ''));

            // Powered by
            set_theme_mod('asl_footer_powered_text_en', sanitize_text_field($_POST['asl_footer_powered_text_en'] ?? ''));
            set_theme_mod('asl_footer_powered_text_ar', sanitize_text_field($_POST['asl_footer_powered_text_ar'] ?? ''));
            set_theme_mod('asl_footer_powered_name_en', sanitize_text_field($_POST['asl_footer_powered_name_en'] ?? ''));
            set_theme_mod('asl_footer_powered_name_ar', sanitize_text_field($_POST['asl_footer_powered_name_ar'] ?? ''));
            set_theme_mod('asl_footer_powered_url', esc_url_raw($_POST['asl_footer_powered_url'] ?? ''));
            break;

        case 'links':
            // Section headings
            set_theme_mod('asl_footer_quick_heading_en', sanitize_text_field($_POST['asl_footer_quick_heading_en'] ?? ''));
            set_theme_mod('asl_footer_quick_heading_ar', sanitize_text_field($_POST['asl_footer_quick_heading_ar'] ?? ''));
            set_theme_mod('asl_footer_cs_heading_en', sanitize_text_field($_POST['asl_footer_cs_heading_en'] ?? ''));
            set_theme_mod('asl_footer_cs_heading_ar', sanitize_text_field($_POST['asl_footer_cs_heading_ar'] ?? ''));

            // Quick Links
            $quick_links = array();
            foreach ((array)($_POST['asl_footer_quick_links'] ?? array()) as $item) {
                $row = array(
                    'label_en' => sanitize_text_field($item['label_en'] ?? ''),
                    'label_ar' => sanitize_text_field($item['label_ar'] ?? ''),
                    'url'      => asl_sanitize_link($item['url'] ?? ''),
                );
                if (!empty($row['label_en']) || !empty($row['label_ar'])) {
                    $quick_links[] = $row;
                }
            }
            set_theme_mod('asl_footer_quick_links', $quick_links);
            set_theme_mod('asl_footer_quick_links_saved', true);

            // Customer Service Links
            $cs_links = array();
            foreach ((array)($_POST['asl_footer_cs_links'] ?? array()) as $item) {
                $row = array(
                    'label_en' => sanitize_text_field($item['label_en'] ?? ''),
                    'label_ar' => sanitize_text_field($item['label_ar'] ?? ''),
                    'url'      => asl_sanitize_link($item['url'] ?? ''),
                );
                if (!empty($row['label_en']) || !empty($row['label_ar'])) {
                    $cs_links[] = $row;
                }
            }
            set_theme_mod('asl_footer_cs_links', $cs_links);
            set_theme_mod('asl_footer_cs_links_saved', true);
            break;

        case 'social':
            set_theme_mod('asl_footer_social_facebook', esc_url_raw($_POST['asl_footer_social_facebook'] ?? ''));
            set_theme_mod('asl_footer_social_instagram', esc_url_raw($_POST['asl_footer_social_instagram'] ?? ''));
            set_theme_mod('asl_footer_social_twitter', esc_url_raw($_POST['asl_footer_social_twitter'] ?? ''));
            set_theme_mod('asl_footer_social_tiktok', esc_url_raw($_POST['asl_footer_social_tiktok'] ?? ''));
            set_theme_mod('asl_footer_social_snapchat', esc_url_raw($_POST['asl_footer_social_snapchat'] ?? ''));
            set_theme_mod('asl_footer_social_whatsapp', esc_url_raw($_POST['asl_footer_social_whatsapp'] ?? ''));
            break;
    }
}

/**
 * REST API: Get footer settings
 */
function asl_get_footer_settings() {
    // Quick Links
    $quick_links_raw = get_theme_mod('asl_footer_quick_links', array());
    $quick_links = array();
    if (!empty($quick_links_raw) && is_array($quick_links_raw)) {
        foreach ($quick_links_raw as $link) {
            $quick_links[] = array(
                'label' => array(
                    'en' => $link['label_en'] ?? '',
                    'ar' => $link['label_ar'] ?? '',
                ),
                'url' => $link['url'] ?? '',
            );
        }
    }

    // Customer Service Links
    $cs_links_raw = get_theme_mod('asl_footer_cs_links', array());
    $cs_links = array();
    if (!empty($cs_links_raw) && is_array($cs_links_raw)) {
        foreach ($cs_links_raw as $link) {
            $cs_links[] = array(
                'label' => array(
                    'en' => $link['label_en'] ?? '',
                    'ar' => $link['label_ar'] ?? '',
                ),
                'url' => $link['url'] ?? '',
            );
        }
    }

    return array(
        'description' => array(
            'en' => get_theme_mod('asl_footer_description_en', 'Discover premium fragrances, perfumes, and aromatic products at Aromatic Scents Lab. Shop our exclusive collection of luxury scents with delivery across the UAE and GCC.'),
            'ar' => get_theme_mod('asl_footer_description_ar', 'اكتشف العطور الفاخرة ومنتجات العناية العطرية المصنوعة بعناية في أروماتيك سينتس لاب.'),
        ),
        'copyright' => array(
            'en' => get_theme_mod('asl_footer_copyright_en', 'All rights reserved.'),
            'ar' => get_theme_mod('asl_footer_copyright_ar', 'جميع الحقوق محفوظة.'),
        ),
        'newsletter' => array(
            'title' => array(
                'en' => get_theme_mod('asl_footer_newsletter_title_en', 'Newsletter'),
                'ar' => get_theme_mod('asl_footer_newsletter_title_ar', 'النشرة الإخبارية'),
            ),
            'subtitle' => array(
                'en' => get_theme_mod('asl_footer_newsletter_subtitle_en', 'Subscribe to our newsletter for updates and exclusive offers.'),
                'ar' => get_theme_mod('asl_footer_newsletter_subtitle_ar', 'اشترك في نشرتنا الإخبارية للحصول على التحديثات والعروض الحصرية.'),
            ),
            'buttonText' => array(
                'en' => get_theme_mod('asl_footer_newsletter_button_en', 'Subscribe'),
                'ar' => get_theme_mod('asl_footer_newsletter_button_ar', 'اشترك'),
            ),
            'placeholder' => array(
                'en' => get_theme_mod('asl_footer_newsletter_placeholder_en', 'Enter your email'),
                'ar' => get_theme_mod('asl_footer_newsletter_placeholder_ar', 'أدخل بريدك الإلكتروني'),
            ),
        ),
        'quickLinks' => array(
            'heading' => array(
                'en' => get_theme_mod('asl_footer_quick_heading_en', 'Quick Links'),
                'ar' => get_theme_mod('asl_footer_quick_heading_ar', 'روابط سريعة'),
            ),
            'items' => $quick_links,
        ),
        'customerService' => array(
            'heading' => array(
                'en' => get_theme_mod('asl_footer_cs_heading_en', 'Customer Service'),
                'ar' => get_theme_mod('asl_footer_cs_heading_ar', 'خدمة العملاء'),
            ),
            'items' => $cs_links,
        ),
        'social' => array(
            'facebook'  => get_theme_mod('asl_footer_social_facebook', 'https://facebook.com/aromaticscentslab'),
            'instagram' => get_theme_mod('asl_footer_social_instagram', 'https://instagram.com/aromaticscentslab'),
            'twitter'   => get_theme_mod('asl_footer_social_twitter', 'https://x.com/araboriginaloud'),
            'tiktok'    => get_theme_mod('asl_footer_social_tiktok', ''),
            'snapchat'  => get_theme_mod('asl_footer_social_snapchat', ''),
            'whatsapp'  => get_theme_mod('asl_footer_social_whatsapp', ''),
        ),
        'poweredBy' => array(
            'text' => array(
                'en' => get_theme_mod('asl_footer_powered_text_en', 'Powered by'),
                'ar' => get_theme_mod('asl_footer_powered_text_ar', 'مدعوم من'),
            ),
            'name' => array(
                'en' => get_theme_mod('asl_footer_powered_name_en', 'Cadvil Solutions'),
                'ar' => get_theme_mod('asl_footer_powered_name_ar', 'Cadvil Solutions'),
            ),
            'url' => get_theme_mod('asl_footer_powered_url', 'https://cadvil.com/'),
        ),
    );
}

// Initialize
asl_footer_settings_init();
