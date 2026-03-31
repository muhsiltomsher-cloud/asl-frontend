<?php
/**
 * ASL Guide Pages
 * 
 * Custom Post Type for SEO guide pages, replacing the hardcoded guides.ts file.
 * Each guide has: hero (eyebrow, title, intro), products (repeater), content blocks,
 * FAQs, SEO fields, and related guides — all with EN/AR bilingual support.
 * 
 * Admin: ASL Settings → Guides (CPT submenu)
 * REST API: GET /asl/v1/guides and GET /asl/v1/guides/{slug}
 * 
 * @package ASL_Frontend_Settings
 * @since 6.1.0
 */

if (!defined('ABSPATH')) exit;

/**
 * Initialize Guide Pages module
 */
function asl_guide_pages_init() {
    add_action('init', 'asl_register_guide_cpt');
    add_action('add_meta_boxes', 'asl_guide_add_meta_boxes');
    add_action('save_post_asl_guide', 'asl_guide_save_meta', 10, 2);
    add_action('rest_api_init', 'asl_guide_register_routes');
}

/**
 * Register Custom Post Type
 */
function asl_register_guide_cpt() {
    register_post_type('asl_guide', array(
        'labels' => array(
            'name'               => 'Guides',
            'singular_name'      => 'Guide',
            'add_new'            => 'Add New Guide',
            'add_new_item'       => 'Add New Guide',
            'edit_item'          => 'Edit Guide',
            'new_item'           => 'New Guide',
            'view_item'          => 'View Guide',
            'search_items'       => 'Search Guides',
            'not_found'          => 'No guides found',
            'not_found_in_trash' => 'No guides found in trash',
            'all_items'          => 'Guides',
            'menu_name'          => 'Guides',
        ),
        'public'             => false,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'supports'           => array('title'),
        'has_archive'        => false,
        'rewrite'            => false,
        'capability_type'    => 'post',
        'menu_icon'          => 'dashicons-book-alt',
        'menu_position'      => 25,
    ));
}

/**
 * Add meta boxes
 */
function asl_guide_add_meta_boxes() {
    add_meta_box('asl_guide_hero', 'Hero Section', 'asl_guide_hero_metabox', 'asl_guide', 'normal', 'high');
    add_meta_box('asl_guide_products', 'Products', 'asl_guide_products_metabox', 'asl_guide', 'normal', 'high');
    add_meta_box('asl_guide_content', 'Content Blocks', 'asl_guide_content_metabox', 'asl_guide', 'normal', 'default');
    add_meta_box('asl_guide_faqs', 'FAQs', 'asl_guide_faqs_metabox', 'asl_guide', 'normal', 'default');
    add_meta_box('asl_guide_seo', 'SEO Settings', 'asl_guide_seo_metabox', 'asl_guide', 'normal', 'default');
    add_meta_box('asl_guide_settings', 'Guide Settings', 'asl_guide_settings_metabox', 'asl_guide', 'side', 'default');
}

/**
 * Hero Section metabox
 */
function asl_guide_hero_metabox($post) {
    wp_nonce_field('asl_guide_meta', 'asl_guide_nonce');
    $slug = get_post_meta($post->ID, '_asl_guide_slug', true);
    $eyebrow_en = get_post_meta($post->ID, '_asl_guide_eyebrow_en', true);
    $eyebrow_ar = get_post_meta($post->ID, '_asl_guide_eyebrow_ar', true);
    $title_en = get_post_meta($post->ID, '_asl_guide_title_en', true);
    $title_ar = get_post_meta($post->ID, '_asl_guide_title_ar', true);
    $intro_en = get_post_meta($post->ID, '_asl_guide_intro_en', true);
    $intro_ar = get_post_meta($post->ID, '_asl_guide_intro_ar', true);
    $og_image = get_post_meta($post->ID, '_asl_guide_og_image', true);
    ?>
    <table class="form-table">
        <tr><th>URL Slug</th><td><input type="text" name="asl_guide_slug" value="<?php echo esc_attr($slug); ?>" class="large-text" placeholder="e.g. best-perfumes-uae"><p class="description">URL-safe slug. Used in /guides/{slug}. Leave empty to auto-generate from title.</p></td></tr>
        <tr><th>Eyebrow (EN)</th><td><input type="text" name="asl_guide_eyebrow_en" value="<?php echo esc_attr($eyebrow_en); ?>" class="regular-text" placeholder="e.g. Expert Picks 2025"></td></tr>
        <tr><th>Eyebrow (AR)</th><td><input type="text" name="asl_guide_eyebrow_ar" value="<?php echo esc_attr($eyebrow_ar); ?>" class="regular-text" dir="rtl"></td></tr>
        <tr><th>Title (EN)</th><td><input type="text" name="asl_guide_title_en" value="<?php echo esc_attr($title_en); ?>" class="large-text"></td></tr>
        <tr><th>Title (AR)</th><td><input type="text" name="asl_guide_title_ar" value="<?php echo esc_attr($title_ar); ?>" class="large-text" dir="rtl"></td></tr>
        <tr><th>Intro (EN)</th><td><textarea name="asl_guide_intro_en" rows="4" class="large-text"><?php echo esc_textarea($intro_en); ?></textarea></td></tr>
        <tr><th>Intro (AR)</th><td><textarea name="asl_guide_intro_ar" rows="4" class="large-text" dir="rtl"><?php echo esc_textarea($intro_ar); ?></textarea></td></tr>
        <tr><th>OG Image</th><td><?php asl_image_field('asl_guide_og_image', $og_image); ?><p class="description">Open Graph image (1200x630px recommended). Falls back to site default.</p></td></tr>
    </table>
    <?php
}

/**
 * Products metabox
 */
function asl_guide_products_metabox($post) {
    $products = get_post_meta($post->ID, '_asl_guide_products', true);
    if (!is_array($products) || empty($products)) {
        $products = array(array('slug'=>'','rank'=>1,'pick_reason_en'=>'','pick_reason_ar'=>'','desc_en'=>'','desc_ar'=>''));
    }
    ?>
    <p class="description">Featured products with editorial content. Product slug must match a WooCommerce product.</p>
    <div id="asl-guide-products">
        <?php foreach ($products as $i => $p): ?>
        <div class="asl-repeater-item" style="background:#f9f9f9;padding:15px;margin-bottom:15px;border:1px solid #ddd;">
            <h4>Product <?php echo $i+1; ?> <button type="button" class="button asl-remove-repeater-item" style="float:right;color:red;">Remove</button></h4>
            <table class="form-table">
                <tr><th>Product Slug</th><td><input type="text" name="asl_guide_products[<?php echo $i; ?>][slug]" value="<?php echo esc_attr($p['slug']??''); ?>" class="regular-text" placeholder="e.g. dark-musk-perfume"></td></tr>
                <tr><th>Rank</th><td><input type="number" name="asl_guide_products[<?php echo $i; ?>][rank]" value="<?php echo esc_attr($p['rank']??($i+1)); ?>" class="small-text" min="1"></td></tr>
                <tr><th>Pick Reason (EN)</th><td><input type="text" name="asl_guide_products[<?php echo $i; ?>][pick_reason_en]" value="<?php echo esc_attr($p['pick_reason_en']??''); ?>" class="large-text" placeholder="e.g. Best Overall — Signature Dark Musk"></td></tr>
                <tr><th>Pick Reason (AR)</th><td><input type="text" name="asl_guide_products[<?php echo $i; ?>][pick_reason_ar]" value="<?php echo esc_attr($p['pick_reason_ar']??''); ?>" class="large-text" dir="rtl"></td></tr>
                <tr><th>Description (EN)</th><td><textarea name="asl_guide_products[<?php echo $i; ?>][desc_en]" rows="3" class="large-text"><?php echo esc_textarea($p['desc_en']??''); ?></textarea></td></tr>
                <tr><th>Description (AR)</th><td><textarea name="asl_guide_products[<?php echo $i; ?>][desc_ar]" rows="3" class="large-text" dir="rtl"><?php echo esc_textarea($p['desc_ar']??''); ?></textarea></td></tr>
            </table>
        </div>
        <?php endforeach; ?>
    </div>
    <button type="button" class="button" id="asl-add-guide-product">+ Add Product</button>
    <?php
}

/**
 * Content Blocks metabox
 */
function asl_guide_content_metabox($post) {
    $blocks = get_post_meta($post->ID, '_asl_guide_content_blocks', true);
    if (!is_array($blocks) || empty($blocks)) {
        $blocks = array(array('heading_en'=>'','heading_ar'=>'','body_en'=>'','body_ar'=>''));
    }
    ?>
    <p class="description">Rich content blocks displayed below the product list (Buying Guide section).</p>
    <div id="asl-guide-content-blocks">
        <?php foreach ($blocks as $i => $b): ?>
        <div class="asl-repeater-item" style="background:#f9f9f9;padding:15px;margin-bottom:15px;border:1px solid #ddd;">
            <h4>Block <?php echo $i+1; ?> <button type="button" class="button asl-remove-repeater-item" style="float:right;color:red;">Remove</button></h4>
            <table class="form-table">
                <tr><th>Heading (EN)</th><td><input type="text" name="asl_guide_content_blocks[<?php echo $i; ?>][heading_en]" value="<?php echo esc_attr($b['heading_en']??''); ?>" class="large-text"></td></tr>
                <tr><th>Heading (AR)</th><td><input type="text" name="asl_guide_content_blocks[<?php echo $i; ?>][heading_ar]" value="<?php echo esc_attr($b['heading_ar']??''); ?>" class="large-text" dir="rtl"></td></tr>
                <tr><th>Body (EN)</th><td><textarea name="asl_guide_content_blocks[<?php echo $i; ?>][body_en]" rows="4" class="large-text"><?php echo esc_textarea($b['body_en']??''); ?></textarea></td></tr>
                <tr><th>Body (AR)</th><td><textarea name="asl_guide_content_blocks[<?php echo $i; ?>][body_ar]" rows="4" class="large-text" dir="rtl"><?php echo esc_textarea($b['body_ar']??''); ?></textarea></td></tr>
            </table>
        </div>
        <?php endforeach; ?>
    </div>
    <button type="button" class="button" id="asl-add-guide-content-block">+ Add Content Block</button>
    <?php
}

/**
 * FAQs metabox
 */
function asl_guide_faqs_metabox($post) {
    $faqs = get_post_meta($post->ID, '_asl_guide_faqs', true);
    if (!is_array($faqs) || empty($faqs)) {
        $faqs = array(array('q_en'=>'','q_ar'=>'','a_en'=>'','a_ar'=>''));
    }
    ?>
    <p class="description">Frequently asked questions with JSON-LD structured data for SEO.</p>
    <div id="asl-guide-faqs">
        <?php foreach ($faqs as $i => $f): ?>
        <div class="asl-repeater-item" style="background:#f9f9f9;padding:15px;margin-bottom:15px;border:1px solid #ddd;">
            <h4>FAQ <?php echo $i+1; ?> <button type="button" class="button asl-remove-repeater-item" style="float:right;color:red;">Remove</button></h4>
            <table class="form-table">
                <tr><th>Question (EN)</th><td><input type="text" name="asl_guide_faqs[<?php echo $i; ?>][q_en]" value="<?php echo esc_attr($f['q_en']??''); ?>" class="large-text"></td></tr>
                <tr><th>Question (AR)</th><td><input type="text" name="asl_guide_faqs[<?php echo $i; ?>][q_ar]" value="<?php echo esc_attr($f['q_ar']??''); ?>" class="large-text" dir="rtl"></td></tr>
                <tr><th>Answer (EN)</th><td><textarea name="asl_guide_faqs[<?php echo $i; ?>][a_en]" rows="3" class="large-text"><?php echo esc_textarea($f['a_en']??''); ?></textarea></td></tr>
                <tr><th>Answer (AR)</th><td><textarea name="asl_guide_faqs[<?php echo $i; ?>][a_ar]" rows="3" class="large-text" dir="rtl"><?php echo esc_textarea($f['a_ar']??''); ?></textarea></td></tr>
            </table>
        </div>
        <?php endforeach; ?>
    </div>
    <button type="button" class="button" id="asl-add-guide-faq">+ Add FAQ</button>
    <?php
}

/**
 * SEO Settings metabox
 */
function asl_guide_seo_metabox($post) {
    $meta_desc_en = get_post_meta($post->ID, '_asl_guide_meta_desc_en', true);
    $meta_desc_ar = get_post_meta($post->ID, '_asl_guide_meta_desc_ar', true);
    $keywords_en = get_post_meta($post->ID, '_asl_guide_keywords_en', true);
    $keywords_ar = get_post_meta($post->ID, '_asl_guide_keywords_ar', true);
    ?>
    <table class="form-table">
        <tr><th>Meta Description (EN)</th><td><textarea name="asl_guide_meta_desc_en" rows="3" class="large-text"><?php echo esc_textarea($meta_desc_en); ?></textarea><p class="description">Max 160 characters for SEO.</p></td></tr>
        <tr><th>Meta Description (AR)</th><td><textarea name="asl_guide_meta_desc_ar" rows="3" class="large-text" dir="rtl"><?php echo esc_textarea($meta_desc_ar); ?></textarea></td></tr>
        <tr><th>Keywords (EN)</th><td><textarea name="asl_guide_keywords_en" rows="2" class="large-text"><?php echo esc_textarea($keywords_en); ?></textarea><p class="description">Comma-separated keywords.</p></td></tr>
        <tr><th>Keywords (AR)</th><td><textarea name="asl_guide_keywords_ar" rows="2" class="large-text" dir="rtl"><?php echo esc_textarea($keywords_ar); ?></textarea></td></tr>
    </table>
    <?php
}

/**
 * Guide Settings sidebar metabox
 */
function asl_guide_settings_metabox($post) {
    $published_at = get_post_meta($post->ID, '_asl_guide_published_at', true);
    $updated_at = get_post_meta($post->ID, '_asl_guide_updated_at', true);
    $related_slugs = get_post_meta($post->ID, '_asl_guide_related_slugs', true);
    ?>
    <p><label><strong>Published Date</strong></label><br>
    <input type="date" name="asl_guide_published_at" value="<?php echo esc_attr($published_at); ?>" class="widefat"></p>
    <p><label><strong>Updated Date</strong></label><br>
    <input type="date" name="asl_guide_updated_at" value="<?php echo esc_attr($updated_at); ?>" class="widefat"></p>
    <p><label><strong>Related Guide Slugs</strong></label><br>
    <textarea name="asl_guide_related_slugs" rows="3" class="widefat" placeholder="One slug per line"><?php echo esc_textarea($related_slugs); ?></textarea>
    <span class="description">One slug per line.</span></p>
    <?php
}

/**
 * Save meta
 */
function asl_guide_save_meta($post_id, $post) {
    if (!isset($_POST['asl_guide_nonce']) || !wp_verify_nonce($_POST['asl_guide_nonce'], 'asl_guide_meta')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    // Slug — auto-generate from title if empty
    $slug = sanitize_title($_POST['asl_guide_slug'] ?? '');
    if (empty($slug)) {
        $slug = sanitize_title($post->post_title);
    }
    update_post_meta($post_id, '_asl_guide_slug', $slug);

    // Hero fields
    update_post_meta($post_id, '_asl_guide_eyebrow_en', sanitize_text_field($_POST['asl_guide_eyebrow_en']??''));
    update_post_meta($post_id, '_asl_guide_eyebrow_ar', sanitize_text_field($_POST['asl_guide_eyebrow_ar']??''));
    update_post_meta($post_id, '_asl_guide_title_en', sanitize_text_field($_POST['asl_guide_title_en']??''));
    update_post_meta($post_id, '_asl_guide_title_ar', sanitize_text_field($_POST['asl_guide_title_ar']??''));
    update_post_meta($post_id, '_asl_guide_intro_en', sanitize_textarea_field($_POST['asl_guide_intro_en']??''));
    update_post_meta($post_id, '_asl_guide_intro_ar', sanitize_textarea_field($_POST['asl_guide_intro_ar']??''));
    update_post_meta($post_id, '_asl_guide_og_image', esc_url_raw($_POST['asl_guide_og_image']??''));

    // Products
    $products = array();
    if (isset($_POST['asl_guide_products']) && is_array($_POST['asl_guide_products'])) {
        foreach ($_POST['asl_guide_products'] as $p) {
            if (!empty($p['slug'])) {
                $products[] = array(
                    'slug'           => sanitize_title($p['slug']),
                    'rank'           => absint($p['rank']??1),
                    'pick_reason_en' => sanitize_text_field($p['pick_reason_en']??''),
                    'pick_reason_ar' => sanitize_text_field($p['pick_reason_ar']??''),
                    'desc_en'        => sanitize_textarea_field($p['desc_en']??''),
                    'desc_ar'        => sanitize_textarea_field($p['desc_ar']??''),
                );
            }
        }
    }
    update_post_meta($post_id, '_asl_guide_products', $products);

    // Content Blocks
    $blocks = array();
    if (isset($_POST['asl_guide_content_blocks']) && is_array($_POST['asl_guide_content_blocks'])) {
        foreach ($_POST['asl_guide_content_blocks'] as $b) {
            if (!empty($b['heading_en']) || !empty($b['heading_ar'])) {
                $blocks[] = array(
                    'heading_en' => sanitize_text_field($b['heading_en']??''),
                    'heading_ar' => sanitize_text_field($b['heading_ar']??''),
                    'body_en'    => sanitize_textarea_field($b['body_en']??''),
                    'body_ar'    => sanitize_textarea_field($b['body_ar']??''),
                );
            }
        }
    }
    update_post_meta($post_id, '_asl_guide_content_blocks', $blocks);

    // FAQs
    $faqs = array();
    if (isset($_POST['asl_guide_faqs']) && is_array($_POST['asl_guide_faqs'])) {
        foreach ($_POST['asl_guide_faqs'] as $f) {
            if (!empty($f['q_en']) || !empty($f['q_ar'])) {
                $faqs[] = array(
                    'q_en' => sanitize_text_field($f['q_en']??''),
                    'q_ar' => sanitize_text_field($f['q_ar']??''),
                    'a_en' => sanitize_textarea_field($f['a_en']??''),
                    'a_ar' => sanitize_textarea_field($f['a_ar']??''),
                );
            }
        }
    }
    update_post_meta($post_id, '_asl_guide_faqs', $faqs);

    // SEO
    update_post_meta($post_id, '_asl_guide_meta_desc_en', sanitize_textarea_field($_POST['asl_guide_meta_desc_en']??''));
    update_post_meta($post_id, '_asl_guide_meta_desc_ar', sanitize_textarea_field($_POST['asl_guide_meta_desc_ar']??''));
    update_post_meta($post_id, '_asl_guide_keywords_en', sanitize_textarea_field($_POST['asl_guide_keywords_en']??''));
    update_post_meta($post_id, '_asl_guide_keywords_ar', sanitize_textarea_field($_POST['asl_guide_keywords_ar']??''));

    // Settings
    update_post_meta($post_id, '_asl_guide_published_at', sanitize_text_field($_POST['asl_guide_published_at']??''));
    update_post_meta($post_id, '_asl_guide_updated_at', sanitize_text_field($_POST['asl_guide_updated_at']??''));
    update_post_meta($post_id, '_asl_guide_related_slugs', sanitize_textarea_field($_POST['asl_guide_related_slugs']??''));
}

/**
 * Register REST API routes
 */
function asl_guide_register_routes() {
    register_rest_route('asl/v1', '/guides', array(
        'methods'  => 'GET',
        'callback' => 'asl_get_guides',
        'permission_callback' => '__return_true',
    ));

    register_rest_route('asl/v1', '/guides/(?P<slug>[a-zA-Z0-9_-]+)', array(
        'methods'  => 'GET',
        'callback' => 'asl_get_guide_by_slug',
        'permission_callback' => '__return_true',
        'args' => array(
            'slug' => array(
                'required' => true,
                'sanitize_callback' => 'sanitize_text_field',
            ),
        ),
    ));
}

/**
 * Format a guide post into API response
 */
function asl_format_guide($post) {
    $id = $post->ID;
    $slug = get_post_meta($id, '_asl_guide_slug', true) ?: sanitize_title($post->post_title);

    // Products
    $products_raw = get_post_meta($id, '_asl_guide_products', true);
    $products = array();
    if (is_array($products_raw)) {
        foreach ($products_raw as $p) {
            $products[] = array(
                'slug' => $p['slug']??'',
                'rank' => (int)($p['rank']??1),
                'pickReason' => array('en' => $p['pick_reason_en']??'', 'ar' => $p['pick_reason_ar']??''),
                'description' => array('en' => $p['desc_en']??'', 'ar' => $p['desc_ar']??''),
            );
        }
    }

    // Content Blocks
    $blocks_raw = get_post_meta($id, '_asl_guide_content_blocks', true);
    $blocks = array();
    if (is_array($blocks_raw)) {
        foreach ($blocks_raw as $b) {
            $blocks[] = array(
                'heading' => array('en' => $b['heading_en']??'', 'ar' => $b['heading_ar']??''),
                'body'    => array('en' => $b['body_en']??'',    'ar' => $b['body_ar']??''),
            );
        }
    }

    // FAQs
    $faqs_raw = get_post_meta($id, '_asl_guide_faqs', true);
    $faqs = array();
    if (is_array($faqs_raw)) {
        foreach ($faqs_raw as $f) {
            $faqs[] = array(
                'question' => array('en' => $f['q_en']??'', 'ar' => $f['q_ar']??''),
                'answer'   => array('en' => $f['a_en']??'', 'ar' => $f['a_ar']??''),
            );
        }
    }

    // Keywords
    $keywords_en_raw = get_post_meta($id, '_asl_guide_keywords_en', true);
    $keywords_ar_raw = get_post_meta($id, '_asl_guide_keywords_ar', true);
    $keywords_en = $keywords_en_raw ? array_map('trim', explode(',', $keywords_en_raw)) : array();
    $keywords_ar = $keywords_ar_raw ? array_map('trim', explode(',', $keywords_ar_raw)) : array();

    // Related slugs
    $related_raw = get_post_meta($id, '_asl_guide_related_slugs', true);
    $related_slugs = $related_raw ? array_filter(array_map('trim', explode("\n", $related_raw))) : array();

    // Dates
    $published_at = get_post_meta($id, '_asl_guide_published_at', true);
    $updated_at = get_post_meta($id, '_asl_guide_updated_at', true);
    if (empty($published_at)) $published_at = get_the_date('Y-m-d', $post);
    if (empty($updated_at)) $updated_at = get_the_modified_date('Y-m-d', $post);

    return array(
        'id'              => $id,
        'slug'            => $slug,
        'title'           => array('en' => get_post_meta($id, '_asl_guide_title_en', true) ?: $post->post_title, 'ar' => get_post_meta($id, '_asl_guide_title_ar', true) ?: ''),
        'metaDescription' => array('en' => get_post_meta($id, '_asl_guide_meta_desc_en', true) ?: '', 'ar' => get_post_meta($id, '_asl_guide_meta_desc_ar', true) ?: ''),
        'keywords'        => array('en' => $keywords_en, 'ar' => $keywords_ar),
        'eyebrow'         => array('en' => get_post_meta($id, '_asl_guide_eyebrow_en', true) ?: '', 'ar' => get_post_meta($id, '_asl_guide_eyebrow_ar', true) ?: ''),
        'intro'           => array('en' => get_post_meta($id, '_asl_guide_intro_en', true) ?: '', 'ar' => get_post_meta($id, '_asl_guide_intro_ar', true) ?: ''),
        'products'        => $products,
        'contentBlocks'   => $blocks,
        'faqs'            => $faqs,
        'relatedGuideSlugs' => $related_slugs,
        'ogImage'         => get_post_meta($id, '_asl_guide_og_image', true) ?: '',
        'publishedAt'     => $published_at . 'T00:00:00Z',
        'updatedAt'       => $updated_at . 'T00:00:00Z',
    );
}

/**
 * REST callback: Get all guides
 */
function asl_get_guides() {
    $posts = get_posts(array(
        'post_type'      => 'asl_guide',
        'post_status'    => 'publish',
        'posts_per_page' => -1,
        'orderby'        => 'date',
        'order'          => 'DESC',
    ));

    $guides = array();
    foreach ($posts as $post) {
        $guides[] = asl_format_guide($post);
    }

    return new WP_REST_Response($guides, 200);
}

/**
 * REST callback: Get a single guide by slug
 */
function asl_get_guide_by_slug($request) {
    $slug = $request['slug'];

    // Search by custom slug meta field
    $posts = get_posts(array(
        'post_type'      => 'asl_guide',
        'post_status'    => 'publish',
        'posts_per_page' => 1,
        'meta_key'       => '_asl_guide_slug',
        'meta_value'     => $slug,
    ));

    if (empty($posts)) {
        // Fallback: try searching by post_name (WordPress slug)
        $posts = get_posts(array(
            'post_type'      => 'asl_guide',
            'post_status'    => 'publish',
            'posts_per_page' => 1,
            'name'           => $slug,
        ));
    }

    if (empty($posts)) {
        return new WP_Error('not_found', 'Guide not found', array('status' => 404));
    }

    return new WP_REST_Response(asl_format_guide($posts[0]), 200);
}

// Initialize
asl_guide_pages_init();
