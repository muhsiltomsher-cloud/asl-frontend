<?php
/**
 * ASL Static Pages — Dynamic content for About, Contact, FAQ, Privacy, Terms, Shipping, Returns
 * Admin: ASL Settings → Pages (submenu)
 * REST API: GET /asl/v1/pages/{slug}
 * @since 6.2.0
 */
if (!defined('ABSPATH')) exit;

// --- Helpers (reuse home-sections pattern) ---
function asl_sp_opt($key, $def = '') { return get_option("asl_page_{$key}", $def); }

function asl_sp_field($name, $val, $type = 'text', $args = []) {
    $dir = !empty($args['rtl']) ? ' dir="rtl"' : '';
    $cls = $args['class'] ?? 'large-text';
    $rows = $args['rows'] ?? 4;
    if ($type === 'textarea') {
        echo "<textarea name=\"{$name}\" rows=\"{$rows}\" class=\"{$cls}\"{$dir}>" . esc_textarea($val) . "</textarea>";
    } else {
        echo "<input type=\"text\" name=\"{$name}\" value=\"" . esc_attr($val) . "\" class=\"{$cls}\"{$dir}>";
    }
}

function asl_sp_bilingual($prefix, $fields) {
    foreach ($fields as $key => $cfg) {
        $type = $cfg['type'] ?? 'text';
        $label = $cfg['label'] ?? ucfirst(str_replace('_', ' ', $key));
        $en = asl_sp_opt("{$prefix}_{$key}_en", $cfg['default_en'] ?? '');
        $ar = asl_sp_opt("{$prefix}_{$key}_ar", $cfg['default_ar'] ?? '');
        echo "<tr><th>{$label} (EN)</th><td>"; asl_sp_field("asl_page_{$prefix}_{$key}_en", $en, $type, $cfg); echo "</td></tr>";
        echo "<tr><th>{$label} (AR)</th><td>"; asl_sp_field("asl_page_{$prefix}_{$key}_ar", $ar, $type, array_merge($cfg, ['rtl'=>true])); echo "</td></tr>";
    }
}

function asl_sp_repeater($id, $label, $items, $field_defs) {
    echo "<h3>{$label} <button type=\"button\" class=\"button asl-sp-add\" data-target=\"{$id}\">+ Add</button></h3>";
    echo "<div id=\"{$id}\">";
    foreach ($items as $i => $item) {
        echo '<div class="asl-repeater-item" style="background:#f9f9f9;padding:15px;margin-bottom:15px;border:1px solid #ddd;">';
        echo '<h4>' . $label . ' ' . ($i+1) . ' <button type="button" class="button asl-remove-repeater-item" style="float:right;color:red;">Remove</button></h4>';
        echo '<table class="form-table">';
        foreach ($field_defs as $fk => $fc) {
            $type = $fc['type'] ?? 'text';
            $fl = $fc['label'] ?? ucfirst(str_replace('_', ' ', $fk));
            $val = $item[$fk] ?? '';
            echo "<tr><th>{$fl}</th><td>";
            asl_sp_field("{$id}[{$i}][{$fk}]", $val, $type, $fc);
            echo "</td></tr>";
        }
        echo '</table></div>';
    }
    echo '</div>';
}

// --- Page definitions (config-driven) ---
function asl_sp_page_configs() {
    return [
        'about' => [
            'label' => 'About',
            'fields' => [
                'title' => ['label'=>'Title'],
                'hero_subtitle' => ['label'=>'Hero Subtitle'],
                'hero_description' => ['label'=>'Hero Description','type'=>'textarea','rows'=>3],
            ],
            'extra_fields' => [
                'stats_since' => ['label'=>'Stats: Since'],
                'stats_location' => ['label'=>'Stats: Location'],
                'stats_handcrafted' => ['label'=>'Stats: Handcrafted'],
                'stats_sustainable' => ['label'=>'Stats: Sustainable'],
            ],
            'section_fields' => [
                'main_title' => ['label'=>'Main Content Title'],
                'main_p1' => ['label'=>'Main Content Paragraph 1','type'=>'textarea','rows'=>4],
                'main_p2' => ['label'=>'Main Content Paragraph 2','type'=>'textarea','rows'=>4],
                'main_p3' => ['label'=>'Main Content Paragraph 3','type'=>'textarea','rows'=>4],
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
                'about_sections' => ['label'=>'Bottom Sections','fields'=>[
                    'title_en'=>['label'=>'Title (EN)','class'=>'regular-text'],
                    'title_ar'=>['label'=>'Title (AR)','class'=>'regular-text','rtl'=>true],
                    'content_en'=>['label'=>'Content (EN)','type'=>'textarea','rows'=>3],
                    'content_ar'=>['label'=>'Content (AR)','type'=>'textarea','rows'=>3,'rtl'=>true],
                ]],
                'about_ingredients' => ['label'=>'Ingredient Items','fields'=>[
                    'name_en'=>['label'=>'Name (EN)','class'=>'regular-text'],
                    'name_ar'=>['label'=>'Name (AR)','class'=>'regular-text','rtl'=>true],
                    'desc_en'=>['label'=>'Desc (EN)','type'=>'textarea','rows'=>2],
                    'desc_ar'=>['label'=>'Desc (AR)','type'=>'textarea','rows'=>2,'rtl'=>true],
                    'image'=>['label'=>'Image URL','class'=>'large-text'],
                ]],
                'about_faq' => ['label'=>'About FAQ','fields'=>[
                    'q_en'=>['label'=>'Question (EN)'],
                    'q_ar'=>['label'=>'Question (AR)','rtl'=>true],
                    'a_en'=>['label'=>'Answer (EN)','type'=>'textarea','rows'=>3],
                    'a_ar'=>['label'=>'Answer (AR)','type'=>'textarea','rows'=>3,'rtl'=>true],
                ]],
            ],
            'has_image' => 'about_hero_image',
        ],
        'contact' => [
            'label' => 'Contact',
            'fields' => [
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
                'contact_info' => ['label'=>'Contact Info Items','fields'=>[
                    'key'=>['label'=>'Key (address/phone/email/hours)','class'=>'regular-text'],
                    'title_en'=>['label'=>'Title (EN)','class'=>'regular-text'],
                    'title_ar'=>['label'=>'Title (AR)','class'=>'regular-text','rtl'=>true],
                    'content_en'=>['label'=>'Content (EN)'],
                    'content_ar'=>['label'=>'Content (AR)','rtl'=>true],
                ]],
                'contact_social' => ['label'=>'Social Links','fields'=>[
                    'platform'=>['label'=>'Platform','class'=>'regular-text'],
                    'url'=>['label'=>'URL'],
                ]],
            ],
        ],
        'faq' => [
            'label' => 'FAQ',
            'fields' => [
                'title' => ['label'=>'Title'],
                'subtitle' => ['label'=>'Subtitle','type'=>'textarea','rows'=>2],
                'not_found' => ['label'=>'Not Found Title'],
                'not_found_text' => ['label'=>'Not Found Text','type'=>'textarea','rows'=>2],
            ],
            'repeaters' => [
                'faq_items' => ['label'=>'FAQ Items','fields'=>[
                    'q_en'=>['label'=>'Question (EN)'],
                    'q_ar'=>['label'=>'Question (AR)','rtl'=>true],
                    'a_en'=>['label'=>'Answer (EN)','type'=>'textarea','rows'=>3],
                    'a_ar'=>['label'=>'Answer (AR)','type'=>'textarea','rows'=>3,'rtl'=>true],
                ]],
            ],
        ],
        'privacy' => [
            'label' => 'Privacy Policy',
            'fields' => [
                'title' => ['label'=>'Title'],
                'subtitle' => ['label'=>'Subtitle','type'=>'textarea','rows'=>2],
                'last_updated' => ['label'=>'Last Updated','class'=>'regular-text'],
                'contact_cta' => ['label'=>'Contact CTA','type'=>'textarea','rows'=>2],
            ],
            'repeaters' => [
                'privacy_sections' => ['label'=>'Sections','fields'=>[
                    'title_en'=>['label'=>'Title (EN)'],
                    'title_ar'=>['label'=>'Title (AR)','rtl'=>true],
                    'content_en'=>['label'=>'Content (EN)','type'=>'textarea','rows'=>4],
                    'content_ar'=>['label'=>'Content (AR)','type'=>'textarea','rows'=>4,'rtl'=>true],
                ]],
            ],
        ],
        'terms' => [
            'label' => 'Terms & Conditions',
            'fields' => [
                'title' => ['label'=>'Title'],
                'subtitle' => ['label'=>'Subtitle','type'=>'textarea','rows'=>2],
                'last_updated' => ['label'=>'Last Updated','class'=>'regular-text'],
                'agreement' => ['label'=>'Agreement Text','type'=>'textarea','rows'=>2],
            ],
            'repeaters' => [
                'terms_sections' => ['label'=>'Sections','fields'=>[
                    'title_en'=>['label'=>'Title (EN)'],
                    'title_ar'=>['label'=>'Title (AR)','rtl'=>true],
                    'content_en'=>['label'=>'Content (EN)','type'=>'textarea','rows'=>4],
                    'content_ar'=>['label'=>'Content (AR)','type'=>'textarea','rows'=>4,'rtl'=>true],
                ]],
            ],
        ],
        'shipping' => [
            'label' => 'Shipping',
            'fields' => [
                'title' => ['label'=>'Title'],
                'have_questions' => ['label'=>'Have Questions Title'],
                'have_questions_text' => ['label'=>'Have Questions Text','type'=>'textarea','rows'=>2],
            ],
            'extra_fields' => [
                'rates_title' => ['label'=>'Rates Table Title'],
                'rates_destination' => ['label'=>'Column: Destination','class'=>'regular-text'],
                'rates_cost_label' => ['label'=>'Column: Cost','class'=>'regular-text'],
                'rates_delivery_label' => ['label'=>'Column: Est. Delivery','class'=>'regular-text'],
                'rates_currency' => ['label'=>'Currency','class'=>'regular-text'],
                'rates_note' => ['label'=>'Rates Note','type'=>'textarea','rows'=>2],
            ],
            'repeaters' => [
                'shipping_sections' => ['label'=>'Sections','fields'=>[
                    'key'=>['label'=>'Key','class'=>'regular-text'],
                    'title_en'=>['label'=>'Title (EN)'],
                    'title_ar'=>['label'=>'Title (AR)','rtl'=>true],
                    'content_en'=>['label'=>'Content (EN)','type'=>'textarea','rows'=>3],
                    'content_ar'=>['label'=>'Content (AR)','type'=>'textarea','rows'=>3,'rtl'=>true],
                ]],
                'shipping_rates' => ['label'=>'Shipping Rates','fields'=>[
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
            'fields' => [
                'title' => ['label'=>'Title'],
                'subtitle' => ['label'=>'Subtitle','type'=>'textarea','rows'=>2],
                'process_title' => ['label'=>'Process Title'],
                'eligible_title' => ['label'=>'Eligible Title'],
                'not_eligible_title' => ['label'=>'Not Eligible Title'],
                'need_help' => ['label'=>'Need Help Title'],
                'need_help_text' => ['label'=>'Need Help Text','type'=>'textarea','rows'=>2],
            ],
            'repeaters' => [
                'returns_features' => ['label'=>'Features','fields'=>[
                    'title_en'=>['label'=>'Title (EN)','class'=>'regular-text'],
                    'title_ar'=>['label'=>'Title (AR)','class'=>'regular-text','rtl'=>true],
                    'desc_en'=>['label'=>'Description (EN)','type'=>'textarea','rows'=>3],
                    'desc_ar'=>['label'=>'Description (AR)','type'=>'textarea','rows'=>3,'rtl'=>true],
                ]],
                'returns_steps' => ['label'=>'Return Steps','fields'=>[
                    'title_en'=>['label'=>'Title (EN)','class'=>'regular-text'],
                    'title_ar'=>['label'=>'Title (AR)','class'=>'regular-text','rtl'=>true],
                    'desc_en'=>['label'=>'Description (EN)','type'=>'textarea','rows'=>3],
                    'desc_ar'=>['label'=>'Description (AR)','type'=>'textarea','rows'=>3,'rtl'=>true],
                ]],
                'returns_eligible' => ['label'=>'Eligible Items','fields'=>[
                    'text_en'=>['label'=>'Text (EN)'],
                    'text_ar'=>['label'=>'Text (AR)','rtl'=>true],
                ]],
                'returns_not_eligible' => ['label'=>'Not Eligible Items','fields'=>[
                    'text_en'=>['label'=>'Text (EN)'],
                    'text_ar'=>['label'=>'Text (AR)','rtl'=>true],
                ]],
            ],
        ],
    ];
}

// --- Admin Menu ---
function asl_sp_admin_menu() {
    add_submenu_page('asl-settings', 'Pages', 'Pages', 'manage_options', 'asl-pages', 'asl_sp_render_admin');
}

function asl_sp_render_admin() {
    if (!current_user_can('manage_options')) return;

    $configs = asl_sp_page_configs();
    $current_tab = sanitize_text_field($_GET['sp_tab'] ?? 'about');
    if (!isset($configs[$current_tab])) $current_tab = 'about';

    // Save
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && check_admin_referer('asl_sp_save')) {
        asl_sp_save($current_tab, $configs[$current_tab]);
        echo '<div class="notice notice-success"><p>Saved!</p></div>';
    }

    // Tabs
    echo '<div class="wrap"><h1>Page Content</h1><h2 class="nav-tab-wrapper">';
    foreach ($configs as $slug => $cfg) {
        $active = $slug === $current_tab ? ' nav-tab-active' : '';
        $url = admin_url("admin.php?page=asl-pages&sp_tab={$slug}");
        echo "<a href=\"{$url}\" class=\"nav-tab{$active}\">{$cfg['label']}</a>";
    }
    echo '</h2>';

    // Form
    $cfg = $configs[$current_tab];
    echo '<form method="post">';
    wp_nonce_field('asl_sp_save');

    // Bilingual fields
    if (!empty($cfg['fields'])) {
        echo '<table class="form-table">';
        asl_sp_bilingual($current_tab, $cfg['fields']);
        echo '</table>';
    }

    // Extra fields (bilingual)
    if (!empty($cfg['extra_fields'])) {
        echo '<table class="form-table">';
        asl_sp_bilingual($current_tab, $cfg['extra_fields']);
        echo '</table>';
    }

    // Section fields (bilingual) — about page specific
    if (!empty($cfg['section_fields'])) {
        echo '<hr><h2>Page Sections</h2><table class="form-table">';
        asl_sp_bilingual($current_tab, $cfg['section_fields']);
        echo '</table>';
    }

    // Image field
    if (!empty($cfg['has_image'])) {
        $img = asl_sp_opt($cfg['has_image'], '');
        echo '<table class="form-table"><tr><th>Hero Image</th><td>';
        if (function_exists('asl_image_field')) {
            asl_image_field("asl_page_{$cfg['has_image']}", $img);
        } else {
            asl_sp_field("asl_page_{$cfg['has_image']}", $img);
        }
        echo '</td></tr></table>';
    }

    // Repeaters
    if (!empty($cfg['repeaters'])) {
        foreach ($cfg['repeaters'] as $rep_id => $rep_cfg) {
            $items = asl_sp_opt($rep_id, []) ?: [[]];
            asl_sp_repeater("asl_page_{$rep_id}", $rep_cfg['label'], $items, $rep_cfg['fields']);
        }
    }

    echo '<p class="submit"><input type="submit" class="button-primary" value="Save Changes"></p>';
    echo '</form></div>';
}

// --- Save ---
function asl_sp_save($page_slug, $cfg) {
    // Save bilingual fields
    $all_fields = array_merge($cfg['fields'] ?? [], $cfg['extra_fields'] ?? [], $cfg['section_fields'] ?? []);
    foreach ($all_fields as $key => $fc) {
        $type = $fc['type'] ?? 'text';
        $fn = $type === 'textarea' ? 'sanitize_textarea_field' : 'sanitize_text_field';
        update_option("asl_page_{$page_slug}_{$key}_en", $fn($_POST["asl_page_{$page_slug}_{$key}_en"] ?? ''));
        update_option("asl_page_{$page_slug}_{$key}_ar", $fn($_POST["asl_page_{$page_slug}_{$key}_ar"] ?? ''));
    }

    // Save image
    if (!empty($cfg['has_image'])) {
        update_option("asl_page_{$cfg['has_image']}", esc_url_raw($_POST["asl_page_{$cfg['has_image']}"] ?? ''));
    }

    // Save repeaters
    if (!empty($cfg['repeaters'])) {
        foreach ($cfg['repeaters'] as $rep_id => $rep_cfg) {
            $items = [];
            foreach ((array)($_POST["asl_page_{$rep_id}"] ?? []) as $item) {
                $row = [];
                foreach ($rep_cfg['fields'] as $fk => $fc) {
                    $fn = ($fc['type'] ?? 'text') === 'textarea' ? 'sanitize_textarea_field' : 'sanitize_text_field';
                    $row[$fk] = $fn($item[$fk] ?? '');
                }
                if (array_filter($row)) $items[] = $row;
            }
            update_option("asl_page_{$rep_id}", $items);
        }
    }
}

// --- REST API ---
function asl_sp_rest_init() {
    register_rest_route('asl/v1', '/pages/(?P<slug>[a-z-]+)', [
        'methods' => 'GET', 'callback' => 'asl_sp_get_page', 'permission_callback' => '__return_true',
        'args' => ['slug' => ['required' => true, 'sanitize_callback' => 'sanitize_text_field']],
    ]);
    register_rest_route('asl/v1', '/notes-seo/(?P<slug>[a-zA-Z0-9_-]+)', [
        'methods' => 'GET', 'callback' => 'asl_sp_get_note_seo', 'permission_callback' => '__return_true',
        'args' => ['slug' => ['required' => true, 'sanitize_callback' => 'sanitize_text_field']],
    ]);
    register_rest_route('asl/v1', '/notes-seo', [
        'methods' => 'GET', 'callback' => 'asl_sp_get_all_notes_seo', 'permission_callback' => '__return_true',
    ]);
}

function asl_sp_get_page($request) {
    $slug = $request['slug'];
    $bi = function($key) use ($slug) {
        return ['en' => asl_sp_opt("{$slug}_{$key}_en", ''), 'ar' => asl_sp_opt("{$slug}_{$key}_ar", '')];
    };
    $map_rep = function($rep_id, $mapping) {
        $out = [];
        foreach ((array) asl_sp_opt($rep_id, []) as $item) {
            $row = [];
            foreach ($mapping as $api_key => $src) {
                if (is_array($src)) {
                    $row[$api_key] = ['en' => $item[$src[0]] ?? '', 'ar' => $item[$src[1]] ?? ''];
                } else {
                    $row[$api_key] = $item[$src] ?? '';
                }
            }
            if (array_filter($row, function($v) { return is_string($v) ? $v !== '' : !empty(array_filter($v)); })) {
                $out[] = $row;
            }
        }
        return $out;
    };

    $configs = asl_sp_page_configs();
    if (!isset($configs[$slug])) {
        return new WP_REST_Response(['error' => 'Page not found'], 404);
    }

    $data = [];

    // Bilingual fields
    $all_fields = array_merge(
        $configs[$slug]['fields'] ?? [],
        $configs[$slug]['extra_fields'] ?? [],
        $configs[$slug]['section_fields'] ?? []
    );
    foreach ($all_fields as $key => $fc) {
        $data[$key] = $bi($key);
    }

    // Image
    if (!empty($configs[$slug]['has_image'])) {
        $data['heroImage'] = asl_sp_opt($configs[$slug]['has_image'], '');
    }

    // Repeaters
    if (!empty($configs[$slug]['repeaters'])) {
        foreach ($configs[$slug]['repeaters'] as $rep_id => $rep_cfg) {
            $mapping = [];
            $fields = $rep_cfg['fields'];
            // Auto-detect bilingual pairs (ending in _en/_ar)
            $processed = [];
            foreach ($fields as $fk => $fc) {
                if (in_array($fk, $processed)) continue;
                $base = preg_replace('/_en$/', '', $fk);
                if (isset($fields[$base . '_en']) && isset($fields[$base . '_ar'])) {
                    $mapping[$base] = [$base . '_en', $base . '_ar'];
                    $processed[] = $base . '_en';
                    $processed[] = $base . '_ar';
                } else {
                    $mapping[$fk] = $fk;
                    $processed[] = $fk;
                }
            }
            $data[$rep_id] = $map_rep($rep_id, $mapping);
        }
    }

    return new WP_REST_Response($data, 200);
}

// --- Notes SEO ---
function asl_sp_get_note_seo($request) {
    $slug = $request['slug'];
    return new WP_REST_Response([
        'name' => ['en' => get_option("asl_note_{$slug}_name_en", ''), 'ar' => get_option("asl_note_{$slug}_name_ar", '')],
        'title' => ['en' => get_option("asl_note_{$slug}_title_en", ''), 'ar' => get_option("asl_note_{$slug}_title_ar", '')],
        'description' => ['en' => get_option("asl_note_{$slug}_desc_en", ''), 'ar' => get_option("asl_note_{$slug}_desc_ar", '')],
    ], 200);
}

function asl_sp_get_all_notes_seo() {
    global $wpdb;
    $rows = $wpdb->get_results(
        "SELECT option_name, option_value FROM {$wpdb->options} WHERE option_name LIKE 'asl_note_%'"
    );
    $notes = [];
    foreach ($rows as $row) {
        if (preg_match('/^asl_note_(.+)_(name|title|desc)_(en|ar)$/', $row->option_name, $m)) {
            $slug = $m[1]; $field = $m[2]; $lang = $m[3];
            if (!isset($notes[$slug])) $notes[$slug] = ['name'=>['en'=>'','ar'=>''],'title'=>['en'=>'','ar'=>''],'description'=>['en'=>'','ar'=>'']];
            $api_field = $field === 'desc' ? 'description' : $field;
            $notes[$slug][$api_field][$lang] = $row->option_value;
        }
    }
    // Only return notes with content
    return new WP_REST_Response(array_filter($notes, function($n) {
        return !empty($n['name']['en']) || !empty($n['title']['en']);
    }), 200);
}

// --- Notes SEO Admin ---
function asl_sp_notes_admin_menu() {
    add_submenu_page('asl-settings', 'Notes SEO', 'Notes SEO', 'manage_options', 'asl-notes-seo', 'asl_sp_notes_render');
}

function asl_sp_notes_render() {
    if (!current_user_can('manage_options')) return;

    // Save
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && check_admin_referer('asl_notes_seo_save')) {
        $notes = (array)($_POST['asl_notes'] ?? []);
        foreach ($notes as $slug => $data) {
            $slug = sanitize_key($slug);
            foreach (['name_en','name_ar','title_en','title_ar','desc_en','desc_ar'] as $f) {
                $fn = strpos($f, 'desc') !== false ? 'sanitize_textarea_field' : 'sanitize_text_field';
                update_option("asl_note_{$slug}_{$f}", $fn($data[$f] ?? ''));
            }
        }
        // Handle new notes
        $new = (array)($_POST['asl_new_notes'] ?? []);
        foreach ($new as $entry) {
            $slug = sanitize_key($entry['slug'] ?? '');
            if (empty($slug)) continue;
            foreach (['name_en','name_ar','title_en','title_ar','desc_en','desc_ar'] as $f) {
                $fn = strpos($f, 'desc') !== false ? 'sanitize_textarea_field' : 'sanitize_text_field';
                update_option("asl_note_{$slug}_{$f}", $fn($entry[$f] ?? ''));
            }
        }
        echo '<div class="notice notice-success"><p>Notes SEO saved!</p></div>';
    }

    // Load all notes
    global $wpdb;
    $rows = $wpdb->get_results(
        "SELECT option_name, option_value FROM {$wpdb->options} WHERE option_name LIKE 'asl_note_%'"
    );
    $notes = [];
    foreach ($rows as $row) {
        if (preg_match('/^asl_note_(.+)_(name|title|desc)_(en|ar)$/', $row->option_name, $m)) {
            $slug = $m[1]; $field = $m[2] . '_' . $m[3];
            if (!isset($notes[$slug])) $notes[$slug] = [];
            $notes[$slug][$field] = $row->option_value;
        }
    }
    ksort($notes);

    echo '<div class="wrap"><h1>Notes SEO Content</h1>';
    echo '<p class="description">SEO content for fragrance note pages (/notes/slug). Each note has name, title, and description in EN/AR.</p>';
    echo '<form method="post">';
    wp_nonce_field('asl_notes_seo_save');

    if (!empty($notes)) {
        foreach ($notes as $slug => $data) {
            echo '<div style="background:#f9f9f9;padding:15px;margin:15px 0;border:1px solid #ddd;border-radius:4px;">';
            echo '<h3 style="margin-top:0;">' . esc_html($slug) . '</h3>';
            echo '<table class="form-table" style="margin:0;">';
            echo '<tr><th>Name (EN)</th><td><input type="text" name="asl_notes[' . esc_attr($slug) . '][name_en]" value="' . esc_attr($data['name_en'] ?? '') . '" class="regular-text"></td>';
            echo '<th>Name (AR)</th><td><input type="text" name="asl_notes[' . esc_attr($slug) . '][name_ar]" value="' . esc_attr($data['name_ar'] ?? '') . '" class="regular-text" dir="rtl"></td></tr>';
            echo '<tr><th>Title (EN)</th><td><input type="text" name="asl_notes[' . esc_attr($slug) . '][title_en]" value="' . esc_attr($data['title_en'] ?? '') . '" class="large-text"></td>';
            echo '<th>Title (AR)</th><td><input type="text" name="asl_notes[' . esc_attr($slug) . '][title_ar]" value="' . esc_attr($data['title_ar'] ?? '') . '" class="large-text" dir="rtl"></td></tr>';
            echo '<tr><th>Desc (EN)</th><td><textarea name="asl_notes[' . esc_attr($slug) . '][desc_en]" rows="2" class="large-text">' . esc_textarea($data['desc_en'] ?? '') . '</textarea></td>';
            echo '<th>Desc (AR)</th><td><textarea name="asl_notes[' . esc_attr($slug) . '][desc_ar]" rows="2" class="large-text" dir="rtl">' . esc_textarea($data['desc_ar'] ?? '') . '</textarea></td></tr>';
            echo '</table></div>';
        }
    } else {
        echo '<p>No notes yet. Use the "Add New Note" section below or run the populate script.</p>';
    }

    // Add new note form
    echo '<hr><h2>Add New Note</h2>';
    echo '<div style="background:#fff3cd;padding:15px;margin:15px 0;border:1px solid #ffc107;border-radius:4px;">';
    echo '<table class="form-table" style="margin:0;">';
    echo '<tr><th>Slug</th><td><input type="text" name="asl_new_notes[0][slug]" class="regular-text" placeholder="e.g. amber, rose, oud"></td></tr>';
    echo '<tr><th>Name (EN)</th><td><input type="text" name="asl_new_notes[0][name_en]" class="regular-text"></td>';
    echo '<th>Name (AR)</th><td><input type="text" name="asl_new_notes[0][name_ar]" class="regular-text" dir="rtl"></td></tr>';
    echo '<tr><th>Title (EN)</th><td><input type="text" name="asl_new_notes[0][title_en]" class="large-text"></td>';
    echo '<th>Title (AR)</th><td><input type="text" name="asl_new_notes[0][title_ar]" class="large-text" dir="rtl"></td></tr>';
    echo '<tr><th>Desc (EN)</th><td><textarea name="asl_new_notes[0][desc_en]" rows="2" class="large-text"></textarea></td>';
    echo '<th>Desc (AR)</th><td><textarea name="asl_new_notes[0][desc_ar]" rows="2" class="large-text" dir="rtl"></textarea></td></tr>';
    echo '</table></div>';

    echo '<p class="submit"><input type="submit" class="button-primary" value="Save All Notes"></p>';
    echo '</form></div>';
}

// --- Init ---
add_action('admin_menu', 'asl_sp_admin_menu', 25);
add_action('admin_menu', 'asl_sp_notes_admin_menu', 26);
add_action('rest_api_init', 'asl_sp_rest_init');
