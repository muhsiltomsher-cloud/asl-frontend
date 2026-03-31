<?php
/**
 * ASL Home Sections — Why Choose Us, Our Story, FAQ, SEO Content
 * Tabs render inside ASL Settings > Home Page (class-asl-settings.php)
 * REST API: GET /asl/v1/home-sections
 * @since 6.1.0
 */
if (!defined('ABSPATH')) exit;

function asl_home_sections_init() {
    add_action('rest_api_init', function() {
        register_rest_route('asl/v1', '/home-sections', array(
            'methods' => 'GET', 'callback' => 'asl_get_home_sections', 'permission_callback' => '__return_true',
        ));
    });
}

// --- Helpers ---
function asl_hs_opt($key, $def = '') { return get_option("asl_home_{$key}", $def); }

function asl_hs_field($name, $val, $type = 'text', $args = array()) {
    $dir = !empty($args['rtl']) ? ' dir="rtl"' : '';
    $class = $args['class'] ?? 'large-text';
    $rows = $args['rows'] ?? 4;
    if ($type === 'textarea') {
        echo "<textarea name=\"{$name}\" rows=\"{$rows}\" class=\"{$class}\"{$dir}>" . esc_textarea($val) . "</textarea>";
    } else {
        echo "<input type=\"text\" name=\"{$name}\" value=\"" . esc_attr($val) . "\" class=\"{$class}\"{$dir}>";
    }
}

function asl_hs_bilingual_rows($prefix, $fields) {
    foreach ($fields as $key => $cfg) {
        $type = $cfg['type'] ?? 'text';
        $label = $cfg['label'] ?? ucfirst($key);
        $en = asl_hs_opt("{$prefix}_{$key}_en", $cfg['default_en'] ?? '');
        $ar = asl_hs_opt("{$prefix}_{$key}_ar", $cfg['default_ar'] ?? '');
        echo "<tr><th>{$label} (EN)</th><td>"; asl_hs_field("asl_home_{$prefix}_{$key}_en", $en, $type, $cfg); echo "</td></tr>";
        echo "<tr><th>{$label} (AR)</th><td>"; asl_hs_field("asl_home_{$prefix}_{$key}_ar", $ar, $type, array_merge($cfg, array('rtl'=>true))); echo "</td></tr>";
    }
}

function asl_hs_enable_row($prefix) {
    echo '<tr><th>Enable</th><td><label><input type="checkbox" name="asl_home_' . $prefix . '_enabled" value="1" ';
    checked(asl_hs_opt("{$prefix}_enabled", true));
    echo '> Show</label></td></tr>';
}

// --- Tab Renderers ---
function asl_render_why_choose_us_tab() {
    $items = asl_hs_opt('wcus_items', array()) ?: array(array('title_en'=>'','title_ar'=>'','desc_en'=>'','desc_ar'=>''));
    echo '<h2>Why Choose Us</h2><table class="form-table">';
    asl_hs_enable_row('wcus');
    asl_hs_bilingual_rows('wcus', array(
        'eyebrow' => array('label'=>'Eyebrow','default_en'=>'Our Promise','default_ar'=>'تميزنا','class'=>'regular-text'),
        'title' => array('label'=>'Title'), 'subtitle' => array('label'=>'Subtitle'),
    ));
    echo '</table>';
    echo '<h3>Items <button type="button" class="button" id="asl-add-wcus-item">+ Add</button></h3><div id="asl-wcus-items">';
    foreach ($items as $i => $item) {
        echo '<div class="asl-repeater-item" style="background:#f9f9f9;padding:15px;margin-bottom:15px;border:1px solid #ddd;">';
        echo '<h4>Item '.($i+1).' <button type="button" class="button asl-remove-repeater-item" style="float:right;color:red;">Remove</button></h4>';
        echo '<table class="form-table">';
        echo '<tr><th>Title (EN)</th><td>'; asl_hs_field("asl_home_wcus_items[{$i}][title_en]", $item['title_en']??'', 'text', array('class'=>'regular-text')); echo '</td></tr>';
        echo '<tr><th>Title (AR)</th><td>'; asl_hs_field("asl_home_wcus_items[{$i}][title_ar]", $item['title_ar']??'', 'text', array('class'=>'regular-text','rtl'=>true)); echo '</td></tr>';
        echo '<tr><th>Desc (EN)</th><td>'; asl_hs_field("asl_home_wcus_items[{$i}][desc_en]", $item['desc_en']??'', 'textarea', array('rows'=>3)); echo '</td></tr>';
        echo '<tr><th>Desc (AR)</th><td>'; asl_hs_field("asl_home_wcus_items[{$i}][desc_ar]", $item['desc_ar']??'', 'textarea', array('rows'=>3,'rtl'=>true)); echo '</td></tr>';
        echo '</table></div>';
    }
    echo '</div>';
}

function asl_render_our_story_tab() {
    $image = asl_hs_opt('story_image', '');
    $stats = asl_hs_opt('story_stats', array()) ?: array(array('value'=>'100%','label_en'=>'Natural Ingredients','label_ar'=>'مكونات طبيعية'));
    echo '<h2>Our Story</h2><table class="form-table">';
    asl_hs_enable_row('story');
    asl_hs_bilingual_rows('story', array(
        'eyebrow' => array('label'=>'Eyebrow','default_en'=>'Discover Our Journey','default_ar'=>'اكتشف قصتنا','class'=>'regular-text'),
        'title' => array('label'=>'Title'),
        'desc1' => array('label'=>'Description 1','type'=>'textarea'),
        'desc2' => array('label'=>'Description 2','type'=>'textarea'),
    ));
    echo '<tr><th>Image</th><td>'; asl_image_field('asl_home_story_image', $image); echo '</td></tr>';
    echo '</table>';
    echo '<h3>Stats <button type="button" class="button" id="asl-add-story-stat">+ Add</button></h3><div id="asl-story-stats">';
    foreach ($stats as $i => $s) {
        echo '<div class="asl-repeater-item" style="background:#f9f9f9;padding:15px;margin-bottom:15px;border:1px solid #ddd;">';
        echo '<h4>Stat '.($i+1).' <button type="button" class="button asl-remove-repeater-item" style="float:right;color:red;">Remove</button></h4>';
        echo '<table class="form-table">';
        echo '<tr><th>Value</th><td>'; asl_hs_field("asl_home_story_stats[{$i}][value]", $s['value']??'', 'text', array('class'=>'regular-text')); echo '</td></tr>';
        echo '<tr><th>Label (EN)</th><td>'; asl_hs_field("asl_home_story_stats[{$i}][label_en]", $s['label_en']??'', 'text', array('class'=>'regular-text')); echo '</td></tr>';
        echo '<tr><th>Label (AR)</th><td>'; asl_hs_field("asl_home_story_stats[{$i}][label_ar]", $s['label_ar']??'', 'text', array('class'=>'regular-text','rtl'=>true)); echo '</td></tr>';
        echo '</table></div>';
    }
    echo '</div>';
}

function asl_render_faq_tab() {
    $items = asl_hs_opt('faq_items', array()) ?: array(array('q_en'=>'','q_ar'=>'','a_en'=>'','a_ar'=>''));
    echo '<h2>FAQ</h2><table class="form-table">';
    asl_hs_enable_row('faq');
    asl_hs_bilingual_rows('faq', array(
        'eyebrow' => array('label'=>'Eyebrow','default_en'=>'Help','default_ar'=>'مساعدة','class'=>'regular-text'),
        'title' => array('label'=>'Title'), 'subtitle' => array('label'=>'Subtitle'),
    ));
    echo '</table>';
    echo '<h3>Items <button type="button" class="button" id="asl-add-faq-item">+ Add</button></h3><div id="asl-faq-items">';
    foreach ($items as $i => $item) {
        echo '<div class="asl-repeater-item" style="background:#f9f9f9;padding:15px;margin-bottom:15px;border:1px solid #ddd;">';
        echo '<h4>FAQ '.($i+1).' <button type="button" class="button asl-remove-repeater-item" style="float:right;color:red;">Remove</button></h4>';
        echo '<table class="form-table">';
        echo '<tr><th>Q (EN)</th><td>'; asl_hs_field("asl_home_faq_items[{$i}][q_en]", $item['q_en']??''); echo '</td></tr>';
        echo '<tr><th>Q (AR)</th><td>'; asl_hs_field("asl_home_faq_items[{$i}][q_ar]", $item['q_ar']??'', 'text', array('rtl'=>true)); echo '</td></tr>';
        echo '<tr><th>A (EN)</th><td>'; asl_hs_field("asl_home_faq_items[{$i}][a_en]", $item['a_en']??'', 'textarea', array('rows'=>3)); echo '</td></tr>';
        echo '<tr><th>A (AR)</th><td>'; asl_hs_field("asl_home_faq_items[{$i}][a_ar]", $item['a_ar']??'', 'textarea', array('rows'=>3,'rtl'=>true)); echo '</td></tr>';
        echo '</table></div>';
    }
    echo '</div>';
}

function asl_render_seo_content_tab() {
    echo '<h2>SEO Content</h2><p class="description">Bottom-of-page content for search engines.</p><table class="form-table">';
    asl_hs_enable_row('seo');
    asl_hs_bilingual_rows('seo', array(
        'title' => array('label'=>'Title','default_en'=>'Shop Premium Perfumes Online in the UAE','default_ar'=>'تسوق العطور الفاخرة اون لاين في الإمارات'),
        'para1' => array('label'=>'Paragraph 1','type'=>'textarea','rows'=>5),
        'para2' => array('label'=>'Paragraph 2','type'=>'textarea','rows'=>5),
    ));
    echo '</table>';
}

// --- Save (called from class-asl-settings.php via asl_save_home_settings) ---
function asl_save_home_sections_tab($tab) {
    $save_bilingual = function($prefix, $keys) {
        foreach ($keys as $key => $type) {
            $fn = $type === 'textarea' ? 'sanitize_textarea_field' : 'sanitize_text_field';
            update_option("asl_home_{$prefix}_{$key}_en", $fn($_POST["asl_home_{$prefix}_{$key}_en"] ?? ''));
            update_option("asl_home_{$prefix}_{$key}_ar", $fn($_POST["asl_home_{$prefix}_{$key}_ar"] ?? ''));
        }
    };
    $save_repeater = function($post_key, $option_key, $fields) {
        $items = array();
        foreach ((array)($_POST[$post_key] ?? array()) as $item) {
            $row = array();
            foreach ($fields as $f => $type) {
                $row[$f] = ($type === 'textarea' ? 'sanitize_textarea_field' : 'sanitize_text_field')($item[$f] ?? '');
            }
            $items[] = $row;
        }
        update_option($option_key, $items);
    };

    switch ($tab) {
        case 'why-choose-us':
            update_option('asl_home_wcus_enabled', isset($_POST['asl_home_wcus_enabled']));
            $save_bilingual('wcus', array('eyebrow'=>'text','title'=>'text','subtitle'=>'text'));
            $save_repeater('asl_home_wcus_items', 'asl_home_wcus_items', array('title_en'=>'text','title_ar'=>'text','desc_en'=>'textarea','desc_ar'=>'textarea'));
            break;
        case 'our-story':
            update_option('asl_home_story_enabled', isset($_POST['asl_home_story_enabled']));
            $save_bilingual('story', array('eyebrow'=>'text','title'=>'text','desc1'=>'textarea','desc2'=>'textarea'));
            update_option('asl_home_story_image', esc_url_raw($_POST['asl_home_story_image'] ?? ''));
            $save_repeater('asl_home_story_stats', 'asl_home_story_stats', array('value'=>'text','label_en'=>'text','label_ar'=>'text'));
            break;
        case 'faq':
            update_option('asl_home_faq_enabled', isset($_POST['asl_home_faq_enabled']));
            $save_bilingual('faq', array('eyebrow'=>'text','title'=>'text','subtitle'=>'text'));
            $save_repeater('asl_home_faq_items', 'asl_home_faq_items', array('q_en'=>'text','q_ar'=>'text','a_en'=>'textarea','a_ar'=>'textarea'));
            break;
        case 'seo-content':
            update_option('asl_home_seo_enabled', isset($_POST['asl_home_seo_enabled']));
            $save_bilingual('seo', array('title'=>'text','para1'=>'textarea','para2'=>'textarea'));
            break;
    }
}

// --- REST API ---
function asl_get_home_sections() {
    $bi = function($prefix, $key, $def_en = '', $def_ar = '') {
        return array('en' => asl_hs_opt("{$prefix}_{$key}_en", $def_en), 'ar' => asl_hs_opt("{$prefix}_{$key}_ar", $def_ar));
    };
    $map_items = function($option, $fields) {
        $out = array();
        foreach ((array) asl_hs_opt($option, array()) as $item) {
            $row = array();
            foreach ($fields as $api_key => $src) {
                $row[$api_key] = is_array($src) ? array('en' => $item[$src[0]]??'', 'ar' => $item[$src[1]]??'') : ($item[$src] ?? '');
            }
            if (array_filter($row)) $out[] = $row;
        }
        return $out;
    };

    return new WP_REST_Response(array(
        'whyChooseUs' => array(
            'enabled' => (bool) asl_hs_opt('wcus_enabled', true),
            'eyebrow' => $bi('wcus','eyebrow','Our Promise','تميزنا'),
            'title' => $bi('wcus','title'), 'subtitle' => $bi('wcus','subtitle'),
            'items' => $map_items('wcus_items', array('title'=>array('title_en','title_ar'),'description'=>array('desc_en','desc_ar'))),
        ),
        'ourStory' => array(
            'enabled' => (bool) asl_hs_opt('story_enabled', true),
            'eyebrow' => $bi('story','eyebrow','Discover Our Journey','اكتشف قصتنا'),
            'title' => $bi('story','title'),
            'description1' => $bi('story','desc1'), 'description2' => $bi('story','desc2'),
            'image' => asl_hs_opt('story_image', ''),
            'stats' => $map_items('story_stats', array('value'=>'value','label'=>array('label_en','label_ar'))),
        ),
        'faq' => array(
            'enabled' => (bool) asl_hs_opt('faq_enabled', true),
            'eyebrow' => $bi('faq','eyebrow','Help','مساعدة'),
            'title' => $bi('faq','title'), 'subtitle' => $bi('faq','subtitle'),
            'items' => $map_items('faq_items', array('question'=>array('q_en','q_ar'),'answer'=>array('a_en','a_ar'))),
        ),
        'seoContent' => array(
            'enabled' => (bool) asl_hs_opt('seo_enabled', true),
            'title' => $bi('seo','title','Shop Premium Perfumes Online in the UAE','تسوق العطور الفاخرة اون لاين في الإمارات'),
            'paragraphs' => array($bi('seo','para1'), $bi('seo','para2')),
        ),
    ), 200);
}

asl_home_sections_init();
