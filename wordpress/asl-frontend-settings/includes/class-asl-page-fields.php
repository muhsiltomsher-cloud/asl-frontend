<?php
/**
 * ASL Page Fields — Custom metaboxes on native WordPress Pages
 *
 * Content for: about, contact, faq, privacy, terms-and-conditions, shipping, returns, shop, home
 * Each page gets a sidebar "ASL Page Type" selector + content metaboxes.
 *
 * REST API: GET /asl/v1/pages/{slug}
 * REST API: GET /asl/v1/home-sections
 *
 * @since 6.3.0
 */
if (!defined('ABSPATH')) exit;

/* ================================================================
   PAGE TYPE CONFIGS — defines fields for each page type
   ================================================================ */

function asl_pf_configs() {
    return [
        'about' => [
            'label' => 'About',
            'bi' => [
                'title' => ['label'=>'Title'],
                'hero_subtitle' => ['label'=>'Hero Subtitle'],
                'hero_description' => ['label'=>'Hero Description','type'=>'textarea','rows'=>3],
                'stats_since' => ['label'=>'Stats: Since'],
                'stats_location' => ['label'=>'Stats: Location'],
                'stats_handcrafted' => ['label'=>'Stats: Handcrafted'],
                'stats_sustainable' => ['label'=>'Stats: Sustainable'],
                'main_title' => ['label'=>'Main Content Title'],
                'main_p1' => ['label'=>'Main Paragraph 1','type'=>'textarea','rows'=>4],
                'main_p2' => ['label'=>'Main Paragraph 2','type'=>'textarea','rows'=>4],
                'main_p3' => ['label'=>'Main Paragraph 3','type'=>'textarea','rows'=>4],
                'uniqueness_title' => ['label'=>'Uniqueness Title'],
                'uniqueness_subtitle' => ['label'=>'Uniqueness Subtitle'],
                'uniqueness_content' => ['label'=>'Uniqueness Content','type'=>'textarea','rows'=>4],
                'journey_title' => ['label'=>'Journey Title'],
                'journey_content' => ['label'=>'Journey Content','type'=>'textarea','rows'=>4],
                'ingredients_title' => ['label'=>'Ingredients Title'],
                'ingredients_subtitle' => ['label'=>'Ingredients Subtitle'],
                'ingredients_desc' => ['label'=>'Ingredients Description','type'=>'textarea','rows'=>3],
            ],
            'repeaters' => [
                '_asl_about_sections' => ['label'=>'Bottom Sections','fields'=>[
                    'title_en'=>['label'=>'Title (EN)','class'=>'regular-text'],
                    'title_ar'=>['label'=>'Title (AR)','class'=>'regular-text','rtl'=>true],
                    'content_en'=>['label'=>'Content (EN)','type'=>'textarea','rows'=>3],
                    'content_ar'=>['label'=>'Content (AR)','type'=>'textarea','rows'=>3,'rtl'=>true],
                ]],
                '_asl_about_ingredients' => ['label'=>'Ingredient Items','fields'=>[
                    'name_en'=>['label'=>'Name (EN)','class'=>'regular-text'],
                    'name_ar'=>['label'=>'Name (AR)','class'=>'regular-text','rtl'=>true],
                    'desc_en'=>['label'=>'Desc (EN)','type'=>'textarea','rows'=>2],
                    'desc_ar'=>['label'=>'Desc (AR)','type'=>'textarea','rows'=>2,'rtl'=>true],
                    'image'=>['label'=>'Image URL','class'=>'large-text'],
                ]],
                '_asl_about_faq' => ['label'=>'About FAQ','fields'=>[
                    'q_en'=>['label'=>'Question (EN)'],
                    'q_ar'=>['label'=>'Question (AR)','rtl'=>true],
                    'a_en'=>['label'=>'Answer (EN)','type'=>'textarea','rows'=>3],
                    'a_ar'=>['label'=>'Answer (AR)','type'=>'textarea','rows'=>3,'rtl'=>true],
                ]],
            ],
        ],
        'contact' => [
            'label' => 'Contact',
            'bi' => [
                'hero_title' => ['label'=>'Hero Title'],
                'hero_subtitle' => ['label'=>'Hero Subtitle'],
                'hero_description' => ['label'=>'Hero Description','type'=>'textarea','rows'=>3],
                'quick_contact' => ['label'=>'Quick Contact Label','class'=>'regular-text'],
                'whatsapp' => ['label'=>'WhatsApp Label','class'=>'regular-text'],
                'call_us' => ['label'=>'Call Us Label','class'=>'regular-text'],
                'email_us' => ['label'=>'Email Us Label','class'=>'regular-text'],
                'send_message' => ['label'=>'Send Message Label','class'=>'regular-text'],
                'contact_info_label' => ['label'=>'Contact Info Label','class'=>'regular-text'],
                'cta_title' => ['label'=>'CTA Title'],
                'cta_subtitle' => ['label'=>'CTA Subtitle'],
                'cta_button' => ['label'=>'CTA Button','class'=>'regular-text'],
            ],
            'repeaters' => [
                '_asl_contact_info' => ['label'=>'Contact Info Items','fields'=>[
                    'key'=>['label'=>'Key (address/phone/email/hours)','class'=>'regular-text'],
                    'title_en'=>['label'=>'Title (EN)','class'=>'regular-text'],
                    'title_ar'=>['label'=>'Title (AR)','class'=>'regular-text','rtl'=>true],
                    'content_en'=>['label'=>'Content (EN)'],
                    'content_ar'=>['label'=>'Content (AR)','rtl'=>true],
                ]],
                '_asl_contact_social' => ['label'=>'Social Links','fields'=>[
                    'platform'=>['label'=>'Platform','class'=>'regular-text'],
                    'url'=>['label'=>'URL'],
                ]],
            ],
        ],
        'faq' => [
            'label' => 'FAQ',
            'bi' => [
                'title' => ['label'=>'Title'],
                'subtitle' => ['label'=>'Subtitle','type'=>'textarea','rows'=>2],
                'not_found' => ['label'=>'Not Found Title'],
                'not_found_text' => ['label'=>'Not Found Text','type'=>'textarea','rows'=>2],
            ],
            'repeaters' => [
                '_asl_faq_items' => ['label'=>'FAQ Items','fields'=>[
                    'q_en'=>['label'=>'Question (EN)'],
                    'q_ar'=>['label'=>'Question (AR)','rtl'=>true],
                    'a_en'=>['label'=>'Answer (EN)','type'=>'textarea','rows'=>3],
                    'a_ar'=>['label'=>'Answer (AR)','type'=>'textarea','rows'=>3,'rtl'=>true],
                ]],
            ],
        ],
        'privacy' => [
            'label' => 'Privacy Policy',
            'bi' => [
                'title' => ['label'=>'Title'],
                'subtitle' => ['label'=>'Subtitle','type'=>'textarea','rows'=>2],
                'last_updated' => ['label'=>'Last Updated','class'=>'regular-text'],
                'contact_cta' => ['label'=>'Contact CTA','type'=>'textarea','rows'=>2],
            ],
            'repeaters' => [
                '_asl_privacy_sections' => ['label'=>'Sections','fields'=>[
                    'title_en'=>['label'=>'Title (EN)'],
                    'title_ar'=>['label'=>'Title (AR)','rtl'=>true],
                    'content_en'=>['label'=>'Content (EN)','type'=>'textarea','rows'=>4],
                    'content_ar'=>['label'=>'Content (AR)','type'=>'textarea','rows'=>4,'rtl'=>true],
                ]],
            ],
        ],
        'terms' => [
            'label' => 'Terms & Conditions',
            'bi' => [
                'title' => ['label'=>'Title'],
                'subtitle' => ['label'=>'Subtitle','type'=>'textarea','rows'=>2],
                'last_updated' => ['label'=>'Last Updated','class'=>'regular-text'],
                'agreement' => ['label'=>'Agreement Text','type'=>'textarea','rows'=>2],
            ],
            'repeaters' => [
                '_asl_terms_sections' => ['label'=>'Sections','fields'=>[
                    'title_en'=>['label'=>'Title (EN)'],
                    'title_ar'=>['label'=>'Title (AR)','rtl'=>true],
                    'content_en'=>['label'=>'Content (EN)','type'=>'textarea','rows'=>4],
                    'content_ar'=>['label'=>'Content (AR)','type'=>'textarea','rows'=>4,'rtl'=>true],
                ]],
            ],
        ],
        'shipping' => [
            'label' => 'Shipping',
            'bi' => [
                'title' => ['label'=>'Title'],
                'have_questions' => ['label'=>'Have Questions Title'],
                'have_questions_text' => ['label'=>'Have Questions Text','type'=>'textarea','rows'=>2],
                'rates_title' => ['label'=>'Rates Table Title'],
                'rates_destination' => ['label'=>'Column: Destination','class'=>'regular-text'],
                'rates_cost_label' => ['label'=>'Column: Cost','class'=>'regular-text'],
                'rates_delivery_label' => ['label'=>'Column: Est. Delivery','class'=>'regular-text'],
                'rates_currency' => ['label'=>'Currency','class'=>'regular-text'],
                'rates_note' => ['label'=>'Rates Note','type'=>'textarea','rows'=>2],
            ],
            'repeaters' => [
                '_asl_shipping_sections' => ['label'=>'Sections','fields'=>[
                    'key'=>['label'=>'Key','class'=>'regular-text'],
                    'title_en'=>['label'=>'Title (EN)'],
                    'title_ar'=>['label'=>'Title (AR)','rtl'=>true],
                    'content_en'=>['label'=>'Content (EN)','type'=>'textarea','rows'=>3],
                    'content_ar'=>['label'=>'Content (AR)','type'=>'textarea','rows'=>3,'rtl'=>true],
                ]],
                '_asl_shipping_rates' => ['label'=>'Shipping Rates','fields'=>[
                    'location_en'=>['label'=>'Location (EN)','class'=>'regular-text'],
                    'location_ar'=>['label'=>'Location (AR)','class'=>'regular-text','rtl'=>true],
                    'cost_en'=>['label'=>'Cost (EN)','class'=>'regular-text'],
                    'cost_ar'=>['label'=>'Cost (AR)','class'=>'regular-text','rtl'=>true],
                    'delivery_en'=>['label'=>'Delivery (EN)','class'=>'regular-text'],
                    'delivery_ar'=>['label'=>'Delivery (AR)','class'=>'regular-text','rtl'=>true],
                ]],
            ],
        ],
        'returns' => [
            'label' => 'Returns',
            'bi' => [
                'title' => ['label'=>'Title'],
                'subtitle' => ['label'=>'Subtitle','type'=>'textarea','rows'=>2],
                'process_title' => ['label'=>'Process Title'],
                'eligible_title' => ['label'=>'Eligible Title'],
                'not_eligible_title' => ['label'=>'Not Eligible Title'],
                'need_help' => ['label'=>'Need Help Title'],
                'need_help_text' => ['label'=>'Need Help Text','type'=>'textarea','rows'=>2],
            ],
            'repeaters' => [
                '_asl_returns_features' => ['label'=>'Features','fields'=>[
                    'title_en'=>['label'=>'Title (EN)','class'=>'regular-text'],
                    'title_ar'=>['label'=>'Title (AR)','class'=>'regular-text','rtl'=>true],
                    'desc_en'=>['label'=>'Description (EN)','type'=>'textarea','rows'=>3],
                    'desc_ar'=>['label'=>'Description (AR)','type'=>'textarea','rows'=>3,'rtl'=>true],
                ]],
                '_asl_returns_steps' => ['label'=>'Return Steps','fields'=>[
                    'title_en'=>['label'=>'Title (EN)','class'=>'regular-text'],
                    'title_ar'=>['label'=>'Title (AR)','class'=>'regular-text','rtl'=>true],
                    'desc_en'=>['label'=>'Description (EN)','type'=>'textarea','rows'=>3],
                    'desc_ar'=>['label'=>'Description (AR)','type'=>'textarea','rows'=>3,'rtl'=>true],
                ]],
                '_asl_returns_eligible' => ['label'=>'Eligible Items','fields'=>[
                    'text_en'=>['label'=>'Text (EN)'],
                    'text_ar'=>['label'=>'Text (AR)','rtl'=>true],
                ]],
                '_asl_returns_not_eligible' => ['label'=>'Not Eligible Items','fields'=>[
                    'text_en'=>['label'=>'Text (EN)'],
                    'text_ar'=>['label'=>'Text (AR)','rtl'=>true],
                ]],
            ],
        ],
        'shop' => [
            'label' => 'Shop',
            'bi' => [
                'subtitle' => ['label'=>'Subtitle'],
            ],
        ],
    ];
}

/* ================================================================
   HOME SECTIONS CONFIG — Why Choose Us, Our Story, FAQ, SEO Content
   ================================================================ */

function asl_pf_home_sections() {
    return [
        'wcus' => [
            'label' => 'Why Choose Us',
            'bi' => [
                'eyebrow' => ['label'=>'Eyebrow','class'=>'regular-text'],
                'title' => ['label'=>'Title'],
                'subtitle' => ['label'=>'Subtitle'],
            ],
            'repeater' => ['key'=>'_asl_wcus_items','label'=>'Items','fields'=>[
                'title_en'=>['label'=>'Title (EN)','class'=>'regular-text'],
                'title_ar'=>['label'=>'Title (AR)','class'=>'regular-text','rtl'=>true],
                'desc_en'=>['label'=>'Desc (EN)','type'=>'textarea','rows'=>3],
                'desc_ar'=>['label'=>'Desc (AR)','type'=>'textarea','rows'=>3,'rtl'=>true],
            ]],
        ],
        'story' => [
            'label' => 'Our Story',
            'bi' => [
                'eyebrow' => ['label'=>'Eyebrow','class'=>'regular-text'],
                'title' => ['label'=>'Title'],
                'desc1' => ['label'=>'Description 1','type'=>'textarea'],
                'desc2' => ['label'=>'Description 2','type'=>'textarea'],
            ],
            'has_image' => '_asl_story_image',
            'repeater' => ['key'=>'_asl_story_stats','label'=>'Stats','fields'=>[
                'value'=>['label'=>'Value','class'=>'regular-text'],
                'label_en'=>['label'=>'Label (EN)','class'=>'regular-text'],
                'label_ar'=>['label'=>'Label (AR)','class'=>'regular-text','rtl'=>true],
            ]],
        ],
        'faq_home' => [
            'label' => 'FAQ',
            'prefix' => '_asl_hfaq',
            'bi' => [
                'eyebrow' => ['label'=>'Eyebrow','class'=>'regular-text'],
                'title' => ['label'=>'Title'],
                'subtitle' => ['label'=>'Subtitle'],
            ],
            'repeater' => ['key'=>'_asl_hfaq_items','label'=>'FAQ Items','fields'=>[
                'q_en'=>['label'=>'Q (EN)'],
                'q_ar'=>['label'=>'Q (AR)','rtl'=>true],
                'a_en'=>['label'=>'A (EN)','type'=>'textarea','rows'=>3],
                'a_ar'=>['label'=>'A (AR)','type'=>'textarea','rows'=>3,'rtl'=>true],
            ]],
        ],
        'seo' => [
            'label' => 'SEO Content',
            'bi' => [
                'title' => ['label'=>'Title'],
                'para1' => ['label'=>'Paragraph 1','type'=>'textarea','rows'=>5],
                'para2' => ['label'=>'Paragraph 2','type'=>'textarea','rows'=>5],
            ],
        ],
    ];
}

/* ================================================================
   DETECT PAGE TYPE
   ================================================================ */

/** Get the ASL page type for a given post */
function asl_pf_get_type($post_id) {
    return get_post_meta($post_id, '_asl_page_type', true);
}

/** Find the WP Page ID for a given ASL page type */
function asl_pf_find_page($type) {
    // Check cached option first
    $id = (int) get_option("asl_page_id_{$type}", 0);
    if ($id && get_post_status($id) !== false) return $id;

    // Search by meta
    $posts = get_posts([
        'post_type' => 'page', 'post_status' => 'any',
        'meta_key' => '_asl_page_type', 'meta_value' => $type,
        'posts_per_page' => 1, 'fields' => 'ids',
    ]);
    if (!empty($posts)) {
        update_option("asl_page_id_{$type}", $posts[0]);
        return $posts[0];
    }
    return 0;
}

/* ================================================================
   ADMIN: METABOXES ON WORDPRESS PAGES
   ================================================================ */

function asl_pf_add_metaboxes() {
    // Sidebar: page type selector (on all pages)
    add_meta_box('asl_page_type', 'ASL Page Type', 'asl_pf_type_metabox', 'page', 'side', 'high');

    // Content metaboxes: only show if page has an ASL type assigned
    global $post;
    if (!$post) return;
    $type = asl_pf_get_type($post->ID);
    if (!$type) return;

    $configs = asl_pf_configs();
    if (isset($configs[$type])) {
        add_meta_box('asl_page_content', $configs[$type]['label'] . ' — Content Fields', 'asl_pf_content_metabox', 'page', 'normal', 'high');
        if (!empty($configs[$type]['repeaters'])) {
            add_meta_box('asl_page_repeaters', $configs[$type]['label'] . ' — Repeaters', 'asl_pf_repeaters_metabox', 'page', 'normal', 'default');
        }
    }

    if ($type === 'home') {
        foreach (asl_pf_home_sections() as $key => $sec) {
            add_meta_box("asl_home_{$key}", $sec['label'], function($post) use ($key, $sec) {
                asl_pf_home_section_metabox($post, $key, $sec);
            }, 'page', 'normal', 'default');
        }
    }
}

/** Sidebar: ASL Page Type selector */
function asl_pf_type_metabox($post) {
    wp_nonce_field('asl_pf_save', 'asl_pf_nonce');
    $current = asl_pf_get_type($post->ID);
    $types = [''=>'— None —'] + array_map(fn($c) => $c['label'], asl_pf_configs()) + ['home'=>'Home Page'];
    echo '<select name="_asl_page_type" style="width:100%">';
    foreach ($types as $val => $label) {
        echo '<option value="'.esc_attr($val).'"'.selected($current, $val, false).'>'.esc_html($label).'</option>';
    }
    echo '</select>';
    echo '<p class="description">Select the ASL page type. Save to see content fields.</p>';
}

/** Content metabox: bilingual fields */
function asl_pf_content_metabox($post) {
    $type = asl_pf_get_type($post->ID);
    $cfg = asl_pf_configs()[$type] ?? null;
    if (!$cfg) return;

    echo '<table class="form-table">';
    foreach ($cfg['bi'] ?? [] as $key => $fc) {
        asl_f_bi($post->ID, '_asl', $key, $fc['label'], $fc['type'] ?? 'text', $fc);
    }
    echo '</table>';
}

/** Repeaters metabox */
function asl_pf_repeaters_metabox($post) {
    $type = asl_pf_get_type($post->ID);
    $cfg = asl_pf_configs()[$type] ?? null;
    if (!$cfg || empty($cfg['repeaters'])) return;

    foreach ($cfg['repeaters'] as $meta_key => $rep) {
        asl_f_repeater($post->ID, $meta_key, $rep['label'], $rep['fields']);
    }
}

/** Home section metabox */
function asl_pf_home_section_metabox($post, $key, $sec) {
    $prefix = $sec['prefix'] ?? "_asl_{$key}";

    echo '<table class="form-table">';
    asl_f_enable($post->ID, $prefix);
    foreach ($sec['bi'] ?? [] as $fk => $fc) {
        asl_f_bi($post->ID, $prefix, $fk, $fc['label'], $fc['type'] ?? 'text', $fc);
    }
    // Image field
    if (!empty($sec['has_image']) && function_exists('asl_image_field')) {
        $img = get_post_meta($post->ID, $sec['has_image'], true);
        echo '<tr><th>Image</th><td>';
        asl_image_field($sec['has_image'], $img);
        echo '</td></tr>';
    }
    echo '</table>';

    // Repeater
    if (!empty($sec['repeater'])) {
        $r = $sec['repeater'];
        asl_f_repeater($post->ID, $r['key'], $r['label'], $r['fields']);
    }
}

/* ================================================================
   SAVE
   ================================================================ */

function asl_pf_save($post_id) {
    if (!isset($_POST['asl_pf_nonce']) || !wp_verify_nonce($_POST['asl_pf_nonce'], 'asl_pf_save')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    // Save page type
    $type = sanitize_text_field($_POST['_asl_page_type'] ?? '');
    update_post_meta($post_id, '_asl_page_type', $type);
    if ($type) update_option("asl_page_id_{$type}", $post_id);
    if (!$type) return;

    // Save page content fields
    $configs = asl_pf_configs();
    if (isset($configs[$type])) {
        foreach ($configs[$type]['bi'] ?? [] as $key => $fc) {
            asl_f_save_bi($post_id, '_asl', $key, $fc['type'] ?? 'text');
        }
        foreach ($configs[$type]['repeaters'] ?? [] as $meta_key => $rep) {
            asl_f_save_repeater($post_id, $meta_key, $rep['fields']);
        }
    }

    // Save home sections
    if ($type === 'home') {
        foreach (asl_pf_home_sections() as $key => $sec) {
            $prefix = $sec['prefix'] ?? "_asl_{$key}";
            asl_f_save_check($post_id, "{$prefix}_enabled");
            foreach ($sec['bi'] ?? [] as $fk => $fc) {
                asl_f_save_bi($post_id, $prefix, $fk, $fc['type'] ?? 'text');
            }
            if (!empty($sec['has_image'])) {
                update_post_meta($post_id, $sec['has_image'], esc_url_raw($_POST[$sec['has_image']] ?? ''));
            }
            if (!empty($sec['repeater'])) {
                asl_f_save_repeater($post_id, $sec['repeater']['key'], $sec['repeater']['fields']);
            }
        }
    }
}

/* ================================================================
   REST API
   ================================================================ */

function asl_pf_rest_init() {
    register_rest_route('asl/v1', '/pages/(?P<slug>[a-z0-9-]+)', [
        'methods' => 'GET', 'callback' => 'asl_pf_rest_page', 'permission_callback' => '__return_true',
        'args' => ['slug' => ['required' => true, 'sanitize_callback' => 'sanitize_text_field']],
    ]);
    register_rest_route('asl/v1', '/home-sections', [
        'methods' => 'GET', 'callback' => 'asl_pf_rest_home_sections', 'permission_callback' => '__return_true',
    ]);
}

/** REST: GET /asl/v1/pages/{slug} */
function asl_pf_rest_page($request) {
    $slug = $request['slug'];

    // Map URL slugs to page types
    $slug_map = [
        'about' => 'about', 'contact' => 'contact', 'faq' => 'faq',
        'privacy' => 'privacy', 'terms' => 'terms', 'terms-and-conditions' => 'terms',
        'shipping' => 'shipping', 'returns' => 'returns', 'shop' => 'shop',
    ];
    $type = $slug_map[$slug] ?? $slug;
    $configs = asl_pf_configs();
    if (!isset($configs[$type])) {
        return new WP_REST_Response(['error' => 'Page not found'], 404);
    }

    $page_id = asl_pf_find_page($type);
    if (!$page_id) {
        return new WP_REST_Response(['error' => 'Page not configured'], 404);
    }

    $cfg = $configs[$type];
    $data = [];

    // Bilingual fields
    foreach ($cfg['bi'] ?? [] as $key => $fc) {
        $data[$key] = asl_f_api_bi($page_id, '_asl', $key);
    }

    // Repeaters
    foreach ($cfg['repeaters'] ?? [] as $meta_key => $rep) {
        // Build mapping: auto-detect _en/_ar pairs
        $mapping = [];
        $processed = [];
        foreach ($rep['fields'] as $fk => $fc) {
            if (in_array($fk, $processed)) continue;
            $base = preg_replace('/_en$/', '', $fk);
            if (isset($rep['fields'][$base.'_en']) && isset($rep['fields'][$base.'_ar'])) {
                $mapping[$base] = [$base.'_en', $base.'_ar'];
                $processed[] = $base.'_en';
                $processed[] = $base.'_ar';
            } else {
                $mapping[$fk] = $fk;
                $processed[] = $fk;
            }
        }
        // Use repeater key without _asl_ prefix for API
        $api_key = preg_replace('/^_asl_/', '', $meta_key);
        $data[$api_key] = asl_f_api_rep($page_id, $meta_key, $mapping);
    }

    return new WP_REST_Response($data, 200);
}

/** REST: GET /asl/v1/home-sections */
function asl_pf_rest_home_sections() {
    $page_id = asl_pf_find_page('home');
    if (!$page_id) {
        // Fallback: return empty structure
        return new WP_REST_Response([
            'whyChooseUs' => ['enabled'=>true,'eyebrow'=>['en'=>'','ar'=>''],'title'=>['en'=>'','ar'=>''],'subtitle'=>['en'=>'','ar'=>''],'items'=>[]],
            'ourStory' => ['enabled'=>true,'eyebrow'=>['en'=>'','ar'=>''],'title'=>['en'=>'','ar'=>''],'description1'=>['en'=>'','ar'=>''],'description2'=>['en'=>'','ar'=>''],'image'=>'','stats'=>[]],
            'faq' => ['enabled'=>true,'eyebrow'=>['en'=>'','ar'=>''],'title'=>['en'=>'','ar'=>''],'subtitle'=>['en'=>'','ar'=>''],'items'=>[]],
            'seoContent' => ['enabled'=>true,'title'=>['en'=>'','ar'=>''],'paragraphs'=>[['en'=>'','ar'=>''],['en'=>'','ar'=>'']]],
        ], 200);
    }

    $bi = fn($prefix, $key, $d_en='', $d_ar='') => asl_f_api_bi($page_id, $prefix, $key, $d_en, $d_ar);
    $enabled = fn($prefix) => (bool)(get_post_meta($page_id, "{$prefix}_enabled", true) ?: true);

    return new WP_REST_Response([
        'whyChooseUs' => [
            'enabled' => $enabled('_asl_wcus'),
            'eyebrow' => $bi('_asl_wcus','eyebrow','Our Promise','تميزنا'),
            'title' => $bi('_asl_wcus','title'),
            'subtitle' => $bi('_asl_wcus','subtitle'),
            'items' => asl_f_api_rep($page_id, '_asl_wcus_items', [
                'title'=>['title_en','title_ar'], 'description'=>['desc_en','desc_ar'],
            ]),
        ],
        'ourStory' => [
            'enabled' => $enabled('_asl_story'),
            'eyebrow' => $bi('_asl_story','eyebrow','Discover Our Journey','اكتشف قصتنا'),
            'title' => $bi('_asl_story','title'),
            'description1' => $bi('_asl_story','desc1'),
            'description2' => $bi('_asl_story','desc2'),
            'image' => get_post_meta($page_id, '_asl_story_image', true) ?: '',
            'stats' => asl_f_api_rep($page_id, '_asl_story_stats', [
                'value'=>'value', 'label'=>['label_en','label_ar'],
            ]),
        ],
        'faq' => [
            'enabled' => $enabled('_asl_hfaq'),
            'eyebrow' => $bi('_asl_hfaq','eyebrow','Help','مساعدة'),
            'title' => $bi('_asl_hfaq','title'),
            'subtitle' => $bi('_asl_hfaq','subtitle'),
            'items' => asl_f_api_rep($page_id, '_asl_hfaq_items', [
                'question'=>['q_en','q_ar'], 'answer'=>['a_en','a_ar'],
            ]),
        ],
        'seoContent' => [
            'enabled' => $enabled('_asl_seo'),
            'title' => $bi('_asl_seo','title','Shop Premium Perfumes Online in the UAE','تسوق العطور الفاخرة اون لاين في الإمارات'),
            'paragraphs' => [$bi('_asl_seo','para1'), $bi('_asl_seo','para2')],
        ],
    ], 200);
}

/* ================================================================
   INIT
   ================================================================ */

function asl_pf_init() {
    add_action('add_meta_boxes', 'asl_pf_add_metaboxes');
    add_action('save_post_page', 'asl_pf_save', 10, 2);
    add_action('rest_api_init', 'asl_pf_rest_init');
}
asl_pf_init();
