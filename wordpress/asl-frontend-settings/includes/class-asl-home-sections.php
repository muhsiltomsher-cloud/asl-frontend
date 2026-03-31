<?php
/**
 * ASL Home Sections
 * 
 * Adds admin settings for homepage content sections that were previously hardcoded:
 * - Why Choose Us (title, subtitle, items with title+description EN/AR)
 * - Our Story (title, descriptions, image, stats EN/AR)
 * - FAQ (title, subtitle, items with question+answer EN/AR)
 * - SEO Content (title, paragraphs EN/AR)
 * 
 * Admin: ASL Settings → Home Sections
 * REST API: Extends GET /asl/v1/home-settings with additional sections
 * 
 * @package ASL_Frontend_Settings
 * @since 6.1.0
 */

if (!defined('ABSPATH')) exit;

/**
 * Initialize Home Sections module
 */
function asl_home_sections_init() {
    // Add submenu page
    add_action('admin_menu', 'asl_home_sections_register_menu');

    // REST API — register a dedicated endpoint
    add_action('rest_api_init', 'asl_home_sections_register_routes');
}

/**
 * Register admin submenu
 */
function asl_home_sections_register_menu() {
    add_submenu_page(
        'asl-settings',
        'Home Sections',
        'Home Sections',
        'manage_options',
        'asl-home-sections',
        'asl_render_home_sections_page'
    );
}

/**
 * Render the Home Sections admin page
 */
function asl_render_home_sections_page() {
    if (!current_user_can('manage_options')) return;

    if (isset($_POST['asl_save_home_sections']) && check_admin_referer('asl_home_sections_nonce')) {
        asl_save_home_sections();
        echo '<div class="notice notice-success is-dismissible"><p>Settings saved!</p></div>';
    }

    $tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'why-choose-us';
    ?>
    <div class="wrap">
        <h1>Home Page Sections</h1>
        <p class="description">Manage the content sections on the homepage that appear below the product listings.</p>
        <nav class="nav-tab-wrapper">
            <?php foreach (array('why-choose-us'=>'Why Choose Us','our-story'=>'Our Story','faq'=>'FAQ','seo-content'=>'SEO Content') as $k=>$l): ?>
                <a href="?page=asl-home-sections&tab=<?php echo $k; ?>" class="nav-tab <?php echo $tab===$k?'nav-tab-active':''; ?>"><?php echo $l; ?></a>
            <?php endforeach; ?>
        </nav>
        <form method="post">
            <?php wp_nonce_field('asl_home_sections_nonce'); ?>
            <input type="hidden" name="asl_home_sections_tab" value="<?php echo esc_attr($tab); ?>">
            <div class="tab-content" style="background:#fff;padding:20px;border:1px solid #ccd0d4;border-top:none;">
                <?php
                switch($tab) {
                    case 'why-choose-us': asl_render_why_choose_us_tab(); break;
                    case 'our-story': asl_render_our_story_tab(); break;
                    case 'faq': asl_render_faq_tab(); break;
                    case 'seo-content': asl_render_seo_content_tab(); break;
                }
                ?>
            </div>
            <?php submit_button('Save Settings', 'primary', 'asl_save_home_sections'); ?>
        </form>
    </div>
    <?php
}

/**
 * Render Why Choose Us tab
 */
function asl_render_why_choose_us_tab() {
    $enabled = get_option('asl_home_wcus_enabled', true);
    $eyebrow_en = get_option('asl_home_wcus_eyebrow_en', 'Our Promise');
    $eyebrow_ar = get_option('asl_home_wcus_eyebrow_ar', 'تميزنا');
    $title_en = get_option('asl_home_wcus_title_en', '');
    $title_ar = get_option('asl_home_wcus_title_ar', '');
    $subtitle_en = get_option('asl_home_wcus_subtitle_en', '');
    $subtitle_ar = get_option('asl_home_wcus_subtitle_ar', '');
    $items = get_option('asl_home_wcus_items', array());
    if (empty($items)) {
        $items = array(array('title_en'=>'','title_ar'=>'','desc_en'=>'','desc_ar'=>''));
    }
    ?>
    <h2>Why Choose Us Section</h2>
    <table class="form-table">
        <tr><th>Enable</th><td><label><input type="checkbox" name="asl_home_wcus_enabled" value="1" <?php checked($enabled); ?>> Show section</label></td></tr>
        <tr><th>Eyebrow (EN)</th><td><input type="text" name="asl_home_wcus_eyebrow_en" value="<?php echo esc_attr($eyebrow_en); ?>" class="regular-text"></td></tr>
        <tr><th>Eyebrow (AR)</th><td><input type="text" name="asl_home_wcus_eyebrow_ar" value="<?php echo esc_attr($eyebrow_ar); ?>" class="regular-text" dir="rtl"></td></tr>
        <tr><th>Title (EN)</th><td><input type="text" name="asl_home_wcus_title_en" value="<?php echo esc_attr($title_en); ?>" class="large-text"></td></tr>
        <tr><th>Title (AR)</th><td><input type="text" name="asl_home_wcus_title_ar" value="<?php echo esc_attr($title_ar); ?>" class="large-text" dir="rtl"></td></tr>
        <tr><th>Subtitle (EN)</th><td><input type="text" name="asl_home_wcus_subtitle_en" value="<?php echo esc_attr($subtitle_en); ?>" class="large-text"></td></tr>
        <tr><th>Subtitle (AR)</th><td><input type="text" name="asl_home_wcus_subtitle_ar" value="<?php echo esc_attr($subtitle_ar); ?>" class="large-text" dir="rtl"></td></tr>
    </table>
    <h3>Items <button type="button" class="button" id="asl-add-wcus-item">+ Add Item</button></h3>
    <div id="asl-wcus-items">
        <?php foreach ($items as $i => $item): ?>
        <div class="asl-repeater-item" style="background:#f9f9f9;padding:15px;margin-bottom:15px;border:1px solid #ddd;">
            <h4>Item <?php echo $i+1; ?> <button type="button" class="button asl-remove-repeater-item" style="float:right;color:red;">Remove</button></h4>
            <table class="form-table">
                <tr><th>Title (EN)</th><td><input type="text" name="asl_home_wcus_items[<?php echo $i; ?>][title_en]" value="<?php echo esc_attr($item['title_en']??''); ?>" class="regular-text"></td></tr>
                <tr><th>Title (AR)</th><td><input type="text" name="asl_home_wcus_items[<?php echo $i; ?>][title_ar]" value="<?php echo esc_attr($item['title_ar']??''); ?>" class="regular-text" dir="rtl"></td></tr>
                <tr><th>Description (EN)</th><td><textarea name="asl_home_wcus_items[<?php echo $i; ?>][desc_en]" rows="3" class="large-text"><?php echo esc_textarea($item['desc_en']??''); ?></textarea></td></tr>
                <tr><th>Description (AR)</th><td><textarea name="asl_home_wcus_items[<?php echo $i; ?>][desc_ar]" rows="3" class="large-text" dir="rtl"><?php echo esc_textarea($item['desc_ar']??''); ?></textarea></td></tr>
            </table>
        </div>
        <?php endforeach; ?>
    </div>
    <?php
}

/**
 * Render Our Story tab
 */
function asl_render_our_story_tab() {
    $enabled = get_option('asl_home_story_enabled', true);
    $eyebrow_en = get_option('asl_home_story_eyebrow_en', 'Discover Our Journey');
    $eyebrow_ar = get_option('asl_home_story_eyebrow_ar', 'اكتشف قصتنا');
    $title_en = get_option('asl_home_story_title_en', '');
    $title_ar = get_option('asl_home_story_title_ar', '');
    $desc1_en = get_option('asl_home_story_desc1_en', '');
    $desc1_ar = get_option('asl_home_story_desc1_ar', '');
    $desc2_en = get_option('asl_home_story_desc2_en', '');
    $desc2_ar = get_option('asl_home_story_desc2_ar', '');
    $image = get_option('asl_home_story_image', '');
    $stats = get_option('asl_home_story_stats', array());
    if (empty($stats)) {
        $stats = array(
            array('value'=>'100%','label_en'=>'Natural Ingredients','label_ar'=>'مكونات طبيعية'),
            array('value'=>'10+','label_en'=>'Years of Excellence','label_ar'=>'سنوات من الخبرة'),
        );
    }
    ?>
    <h2>Our Story Section</h2>
    <table class="form-table">
        <tr><th>Enable</th><td><label><input type="checkbox" name="asl_home_story_enabled" value="1" <?php checked($enabled); ?>> Show section</label></td></tr>
        <tr><th>Eyebrow (EN)</th><td><input type="text" name="asl_home_story_eyebrow_en" value="<?php echo esc_attr($eyebrow_en); ?>" class="regular-text"></td></tr>
        <tr><th>Eyebrow (AR)</th><td><input type="text" name="asl_home_story_eyebrow_ar" value="<?php echo esc_attr($eyebrow_ar); ?>" class="regular-text" dir="rtl"></td></tr>
        <tr><th>Title (EN)</th><td><input type="text" name="asl_home_story_title_en" value="<?php echo esc_attr($title_en); ?>" class="large-text"></td></tr>
        <tr><th>Title (AR)</th><td><input type="text" name="asl_home_story_title_ar" value="<?php echo esc_attr($title_ar); ?>" class="large-text" dir="rtl"></td></tr>
        <tr><th>Description 1 (EN)</th><td><textarea name="asl_home_story_desc1_en" rows="4" class="large-text"><?php echo esc_textarea($desc1_en); ?></textarea></td></tr>
        <tr><th>Description 1 (AR)</th><td><textarea name="asl_home_story_desc1_ar" rows="4" class="large-text" dir="rtl"><?php echo esc_textarea($desc1_ar); ?></textarea></td></tr>
        <tr><th>Description 2 (EN)</th><td><textarea name="asl_home_story_desc2_en" rows="4" class="large-text"><?php echo esc_textarea($desc2_en); ?></textarea></td></tr>
        <tr><th>Description 2 (AR)</th><td><textarea name="asl_home_story_desc2_ar" rows="4" class="large-text" dir="rtl"><?php echo esc_textarea($desc2_ar); ?></textarea></td></tr>
        <tr><th>Image</th><td><?php asl_image_field('asl_home_story_image', $image); ?></td></tr>
    </table>
    <h3>Stats <button type="button" class="button" id="asl-add-story-stat">+ Add Stat</button></h3>
    <div id="asl-story-stats">
        <?php foreach ($stats as $i => $stat): ?>
        <div class="asl-repeater-item" style="background:#f9f9f9;padding:15px;margin-bottom:15px;border:1px solid #ddd;">
            <h4>Stat <?php echo $i+1; ?> <button type="button" class="button asl-remove-repeater-item" style="float:right;color:red;">Remove</button></h4>
            <table class="form-table">
                <tr><th>Value</th><td><input type="text" name="asl_home_story_stats[<?php echo $i; ?>][value]" value="<?php echo esc_attr($stat['value']??''); ?>" class="regular-text" placeholder="e.g. 100% or 10+"></td></tr>
                <tr><th>Label (EN)</th><td><input type="text" name="asl_home_story_stats[<?php echo $i; ?>][label_en]" value="<?php echo esc_attr($stat['label_en']??''); ?>" class="regular-text"></td></tr>
                <tr><th>Label (AR)</th><td><input type="text" name="asl_home_story_stats[<?php echo $i; ?>][label_ar]" value="<?php echo esc_attr($stat['label_ar']??''); ?>" class="regular-text" dir="rtl"></td></tr>
            </table>
        </div>
        <?php endforeach; ?>
    </div>
    <?php
}

/**
 * Render FAQ tab
 */
function asl_render_faq_tab() {
    $enabled = get_option('asl_home_faq_enabled', true);
    $eyebrow_en = get_option('asl_home_faq_eyebrow_en', 'Help');
    $eyebrow_ar = get_option('asl_home_faq_eyebrow_ar', 'مساعدة');
    $title_en = get_option('asl_home_faq_title_en', '');
    $title_ar = get_option('asl_home_faq_title_ar', '');
    $subtitle_en = get_option('asl_home_faq_subtitle_en', '');
    $subtitle_ar = get_option('asl_home_faq_subtitle_ar', '');
    $items = get_option('asl_home_faq_items', array());
    if (empty($items)) {
        $items = array(array('q_en'=>'','q_ar'=>'','a_en'=>'','a_ar'=>''));
    }
    ?>
    <h2>FAQ Section</h2>
    <table class="form-table">
        <tr><th>Enable</th><td><label><input type="checkbox" name="asl_home_faq_enabled" value="1" <?php checked($enabled); ?>> Show section</label></td></tr>
        <tr><th>Eyebrow (EN)</th><td><input type="text" name="asl_home_faq_eyebrow_en" value="<?php echo esc_attr($eyebrow_en); ?>" class="regular-text"></td></tr>
        <tr><th>Eyebrow (AR)</th><td><input type="text" name="asl_home_faq_eyebrow_ar" value="<?php echo esc_attr($eyebrow_ar); ?>" class="regular-text" dir="rtl"></td></tr>
        <tr><th>Title (EN)</th><td><input type="text" name="asl_home_faq_title_en" value="<?php echo esc_attr($title_en); ?>" class="large-text"></td></tr>
        <tr><th>Title (AR)</th><td><input type="text" name="asl_home_faq_title_ar" value="<?php echo esc_attr($title_ar); ?>" class="large-text" dir="rtl"></td></tr>
        <tr><th>Subtitle (EN)</th><td><input type="text" name="asl_home_faq_subtitle_en" value="<?php echo esc_attr($subtitle_en); ?>" class="large-text"></td></tr>
        <tr><th>Subtitle (AR)</th><td><input type="text" name="asl_home_faq_subtitle_ar" value="<?php echo esc_attr($subtitle_ar); ?>" class="large-text" dir="rtl"></td></tr>
    </table>
    <h3>FAQ Items <button type="button" class="button" id="asl-add-faq-item">+ Add FAQ</button></h3>
    <div id="asl-faq-items">
        <?php foreach ($items as $i => $item): ?>
        <div class="asl-repeater-item" style="background:#f9f9f9;padding:15px;margin-bottom:15px;border:1px solid #ddd;">
            <h4>FAQ <?php echo $i+1; ?> <button type="button" class="button asl-remove-repeater-item" style="float:right;color:red;">Remove</button></h4>
            <table class="form-table">
                <tr><th>Question (EN)</th><td><input type="text" name="asl_home_faq_items[<?php echo $i; ?>][q_en]" value="<?php echo esc_attr($item['q_en']??''); ?>" class="large-text"></td></tr>
                <tr><th>Question (AR)</th><td><input type="text" name="asl_home_faq_items[<?php echo $i; ?>][q_ar]" value="<?php echo esc_attr($item['q_ar']??''); ?>" class="large-text" dir="rtl"></td></tr>
                <tr><th>Answer (EN)</th><td><textarea name="asl_home_faq_items[<?php echo $i; ?>][a_en]" rows="3" class="large-text"><?php echo esc_textarea($item['a_en']??''); ?></textarea></td></tr>
                <tr><th>Answer (AR)</th><td><textarea name="asl_home_faq_items[<?php echo $i; ?>][a_ar]" rows="3" class="large-text" dir="rtl"><?php echo esc_textarea($item['a_ar']??''); ?></textarea></td></tr>
            </table>
        </div>
        <?php endforeach; ?>
    </div>
    <?php
}

/**
 * Render SEO Content tab
 */
function asl_render_seo_content_tab() {
    $enabled = get_option('asl_home_seo_enabled', true);
    $title_en = get_option('asl_home_seo_title_en', 'Shop Premium Perfumes Online in the UAE');
    $title_ar = get_option('asl_home_seo_title_ar', 'تسوق العطور الفاخرة اون لاين في الإمارات');
    $para1_en = get_option('asl_home_seo_para1_en', '');
    $para1_ar = get_option('asl_home_seo_para1_ar', '');
    $para2_en = get_option('asl_home_seo_para2_en', '');
    $para2_ar = get_option('asl_home_seo_para2_ar', '');
    ?>
    <h2>SEO Content Section</h2>
    <p class="description">Bottom-of-page SEO content. Provides keyword-rich text for search engines.</p>
    <table class="form-table">
        <tr><th>Enable</th><td><label><input type="checkbox" name="asl_home_seo_enabled" value="1" <?php checked($enabled); ?>> Show section</label></td></tr>
        <tr><th>Title (EN)</th><td><input type="text" name="asl_home_seo_title_en" value="<?php echo esc_attr($title_en); ?>" class="large-text"></td></tr>
        <tr><th>Title (AR)</th><td><input type="text" name="asl_home_seo_title_ar" value="<?php echo esc_attr($title_ar); ?>" class="large-text" dir="rtl"></td></tr>
        <tr><th>Paragraph 1 (EN)</th><td><textarea name="asl_home_seo_para1_en" rows="5" class="large-text"><?php echo esc_textarea($para1_en); ?></textarea></td></tr>
        <tr><th>Paragraph 1 (AR)</th><td><textarea name="asl_home_seo_para1_ar" rows="5" class="large-text" dir="rtl"><?php echo esc_textarea($para1_ar); ?></textarea></td></tr>
        <tr><th>Paragraph 2 (EN)</th><td><textarea name="asl_home_seo_para2_en" rows="5" class="large-text"><?php echo esc_textarea($para2_en); ?></textarea></td></tr>
        <tr><th>Paragraph 2 (AR)</th><td><textarea name="asl_home_seo_para2_ar" rows="5" class="large-text" dir="rtl"><?php echo esc_textarea($para2_ar); ?></textarea></td></tr>
    </table>
    <?php
}

/**
 * Save Home Sections settings
 */
function asl_save_home_sections() {
    $tab = sanitize_text_field($_POST['asl_home_sections_tab'] ?? '');

    switch ($tab) {
        case 'why-choose-us':
            update_option('asl_home_wcus_enabled', isset($_POST['asl_home_wcus_enabled']));
            update_option('asl_home_wcus_eyebrow_en', sanitize_text_field($_POST['asl_home_wcus_eyebrow_en']??''));
            update_option('asl_home_wcus_eyebrow_ar', sanitize_text_field($_POST['asl_home_wcus_eyebrow_ar']??''));
            update_option('asl_home_wcus_title_en', sanitize_text_field($_POST['asl_home_wcus_title_en']??''));
            update_option('asl_home_wcus_title_ar', sanitize_text_field($_POST['asl_home_wcus_title_ar']??''));
            update_option('asl_home_wcus_subtitle_en', sanitize_text_field($_POST['asl_home_wcus_subtitle_en']??''));
            update_option('asl_home_wcus_subtitle_ar', sanitize_text_field($_POST['asl_home_wcus_subtitle_ar']??''));
            $items = array();
            if (isset($_POST['asl_home_wcus_items']) && is_array($_POST['asl_home_wcus_items'])) {
                foreach ($_POST['asl_home_wcus_items'] as $item) {
                    $items[] = array(
                        'title_en' => sanitize_text_field($item['title_en']??''),
                        'title_ar' => sanitize_text_field($item['title_ar']??''),
                        'desc_en'  => sanitize_textarea_field($item['desc_en']??''),
                        'desc_ar'  => sanitize_textarea_field($item['desc_ar']??''),
                    );
                }
            }
            update_option('asl_home_wcus_items', $items);
            break;

        case 'our-story':
            update_option('asl_home_story_enabled', isset($_POST['asl_home_story_enabled']));
            update_option('asl_home_story_eyebrow_en', sanitize_text_field($_POST['asl_home_story_eyebrow_en']??''));
            update_option('asl_home_story_eyebrow_ar', sanitize_text_field($_POST['asl_home_story_eyebrow_ar']??''));
            update_option('asl_home_story_title_en', sanitize_text_field($_POST['asl_home_story_title_en']??''));
            update_option('asl_home_story_title_ar', sanitize_text_field($_POST['asl_home_story_title_ar']??''));
            update_option('asl_home_story_desc1_en', sanitize_textarea_field($_POST['asl_home_story_desc1_en']??''));
            update_option('asl_home_story_desc1_ar', sanitize_textarea_field($_POST['asl_home_story_desc1_ar']??''));
            update_option('asl_home_story_desc2_en', sanitize_textarea_field($_POST['asl_home_story_desc2_en']??''));
            update_option('asl_home_story_desc2_ar', sanitize_textarea_field($_POST['asl_home_story_desc2_ar']??''));
            update_option('asl_home_story_image', esc_url_raw($_POST['asl_home_story_image']??''));
            $stats = array();
            if (isset($_POST['asl_home_story_stats']) && is_array($_POST['asl_home_story_stats'])) {
                foreach ($_POST['asl_home_story_stats'] as $stat) {
                    $stats[] = array(
                        'value'    => sanitize_text_field($stat['value']??''),
                        'label_en' => sanitize_text_field($stat['label_en']??''),
                        'label_ar' => sanitize_text_field($stat['label_ar']??''),
                    );
                }
            }
            update_option('asl_home_story_stats', $stats);
            break;

        case 'faq':
            update_option('asl_home_faq_enabled', isset($_POST['asl_home_faq_enabled']));
            update_option('asl_home_faq_eyebrow_en', sanitize_text_field($_POST['asl_home_faq_eyebrow_en']??''));
            update_option('asl_home_faq_eyebrow_ar', sanitize_text_field($_POST['asl_home_faq_eyebrow_ar']??''));
            update_option('asl_home_faq_title_en', sanitize_text_field($_POST['asl_home_faq_title_en']??''));
            update_option('asl_home_faq_title_ar', sanitize_text_field($_POST['asl_home_faq_title_ar']??''));
            update_option('asl_home_faq_subtitle_en', sanitize_text_field($_POST['asl_home_faq_subtitle_en']??''));
            update_option('asl_home_faq_subtitle_ar', sanitize_text_field($_POST['asl_home_faq_subtitle_ar']??''));
            $items = array();
            if (isset($_POST['asl_home_faq_items']) && is_array($_POST['asl_home_faq_items'])) {
                foreach ($_POST['asl_home_faq_items'] as $item) {
                    $items[] = array(
                        'q_en' => sanitize_text_field($item['q_en']??''),
                        'q_ar' => sanitize_text_field($item['q_ar']??''),
                        'a_en' => sanitize_textarea_field($item['a_en']??''),
                        'a_ar' => sanitize_textarea_field($item['a_ar']??''),
                    );
                }
            }
            update_option('asl_home_faq_items', $items);
            break;

        case 'seo-content':
            update_option('asl_home_seo_enabled', isset($_POST['asl_home_seo_enabled']));
            update_option('asl_home_seo_title_en', sanitize_text_field($_POST['asl_home_seo_title_en']??''));
            update_option('asl_home_seo_title_ar', sanitize_text_field($_POST['asl_home_seo_title_ar']??''));
            update_option('asl_home_seo_para1_en', sanitize_textarea_field($_POST['asl_home_seo_para1_en']??''));
            update_option('asl_home_seo_para1_ar', sanitize_textarea_field($_POST['asl_home_seo_para1_ar']??''));
            update_option('asl_home_seo_para2_en', sanitize_textarea_field($_POST['asl_home_seo_para2_en']??''));
            update_option('asl_home_seo_para2_ar', sanitize_textarea_field($_POST['asl_home_seo_para2_ar']??''));
            break;
    }
}

/**
 * Register REST API routes
 */
function asl_home_sections_register_routes() {
    register_rest_route('asl/v1', '/home-sections', array(
        'methods'  => 'GET',
        'callback' => 'asl_get_home_sections',
        'permission_callback' => '__return_true',
    ));
}

/**
 * REST callback: Get all home sections data
 */
function asl_get_home_sections() {
    // Why Choose Us
    $wcus_items = get_option('asl_home_wcus_items', array());
    $wcus_formatted = array();
    foreach ($wcus_items as $item) {
        if (!empty($item['title_en']) || !empty($item['title_ar'])) {
            $wcus_formatted[] = array(
                'title'       => array('en' => $item['title_en']??'', 'ar' => $item['title_ar']??''),
                'description' => array('en' => $item['desc_en']??'',  'ar' => $item['desc_ar']??''),
            );
        }
    }

    // Our Story stats
    $story_stats = get_option('asl_home_story_stats', array());
    $stats_formatted = array();
    foreach ($story_stats as $stat) {
        if (!empty($stat['value'])) {
            $stats_formatted[] = array(
                'value' => $stat['value']??'',
                'label' => array('en' => $stat['label_en']??'', 'ar' => $stat['label_ar']??''),
            );
        }
    }

    // FAQ items
    $faq_items = get_option('asl_home_faq_items', array());
    $faq_formatted = array();
    foreach ($faq_items as $item) {
        if (!empty($item['q_en']) || !empty($item['q_ar'])) {
            $faq_formatted[] = array(
                'question' => array('en' => $item['q_en']??'', 'ar' => $item['q_ar']??''),
                'answer'   => array('en' => $item['a_en']??'', 'ar' => $item['a_ar']??''),
            );
        }
    }

    return new WP_REST_Response(array(
        'whyChooseUs' => array(
            'enabled'  => (bool) get_option('asl_home_wcus_enabled', true),
            'eyebrow'  => array('en' => get_option('asl_home_wcus_eyebrow_en', 'Our Promise'), 'ar' => get_option('asl_home_wcus_eyebrow_ar', 'تميزنا')),
            'title'    => array('en' => get_option('asl_home_wcus_title_en', ''),  'ar' => get_option('asl_home_wcus_title_ar', '')),
            'subtitle' => array('en' => get_option('asl_home_wcus_subtitle_en', ''), 'ar' => get_option('asl_home_wcus_subtitle_ar', '')),
            'items'    => $wcus_formatted,
        ),
        'ourStory' => array(
            'enabled'      => (bool) get_option('asl_home_story_enabled', true),
            'eyebrow'      => array('en' => get_option('asl_home_story_eyebrow_en', 'Discover Our Journey'), 'ar' => get_option('asl_home_story_eyebrow_ar', 'اكتشف قصتنا')),
            'title'        => array('en' => get_option('asl_home_story_title_en', ''),  'ar' => get_option('asl_home_story_title_ar', '')),
            'description1' => array('en' => get_option('asl_home_story_desc1_en', ''), 'ar' => get_option('asl_home_story_desc1_ar', '')),
            'description2' => array('en' => get_option('asl_home_story_desc2_en', ''), 'ar' => get_option('asl_home_story_desc2_ar', '')),
            'image'        => get_option('asl_home_story_image', ''),
            'stats'        => $stats_formatted,
        ),
        'faq' => array(
            'enabled'  => (bool) get_option('asl_home_faq_enabled', true),
            'eyebrow'  => array('en' => get_option('asl_home_faq_eyebrow_en', 'Help'), 'ar' => get_option('asl_home_faq_eyebrow_ar', 'مساعدة')),
            'title'    => array('en' => get_option('asl_home_faq_title_en', ''),  'ar' => get_option('asl_home_faq_title_ar', '')),
            'subtitle' => array('en' => get_option('asl_home_faq_subtitle_en', ''), 'ar' => get_option('asl_home_faq_subtitle_ar', '')),
            'items'    => $faq_formatted,
        ),
        'seoContent' => array(
            'enabled' => (bool) get_option('asl_home_seo_enabled', true),
            'title'   => array('en' => get_option('asl_home_seo_title_en', 'Shop Premium Perfumes Online in the UAE'), 'ar' => get_option('asl_home_seo_title_ar', 'تسوق العطور الفاخرة اون لاين في الإمارات')),
            'paragraphs' => array(
                array('en' => get_option('asl_home_seo_para1_en', ''), 'ar' => get_option('asl_home_seo_para1_ar', '')),
                array('en' => get_option('asl_home_seo_para2_en', ''), 'ar' => get_option('asl_home_seo_para2_ar', '')),
            ),
        ),
    ), 200);
}

// Initialize
asl_home_sections_init();
