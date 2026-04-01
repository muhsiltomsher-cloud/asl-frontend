<?php
/**
 * ASL Notes CPT — Fragrance Notes as Custom Post Type
 *
 * Each note is an individual post with bilingual fields (EN/AR).
 * Pattern follows class-asl-guide-pages.php.
 *
 * REST API: GET /asl/v1/notes-seo/{slug}
 * REST API: GET /asl/v1/notes-seo
 *
 * @since 6.3.0
 */
if (!defined('ABSPATH')) exit;

/* ================================================================
   REGISTER CPT
   ================================================================ */

function asl_note_cpt_init() {
    add_action('init', 'asl_register_note_cpt');
    add_action('add_meta_boxes', 'asl_note_add_meta_boxes');
    add_action('save_post_asl_note', 'asl_note_save_meta', 10, 2);
    add_action('rest_api_init', 'asl_note_register_routes');
    add_filter('post_row_actions', 'asl_note_row_actions', 10, 2);
    add_action('edit_form_after_title', 'asl_note_view_links');
}

function asl_register_note_cpt() {
    register_post_type('asl_note', [
        'labels' => [
            'name' => 'Notes', 'singular_name' => 'Note',
            'add_new' => 'Add New Note', 'add_new_item' => 'Add New Note',
            'edit_item' => 'Edit Note', 'all_items' => 'All Notes',
            'search_items' => 'Search Notes', 'not_found' => 'No notes found',
        ],
        'public' => false, 'show_ui' => true, 'show_in_menu' => true,
        'menu_position' => 27, 'menu_icon' => 'dashicons-tag',
        'supports' => ['title'], 'has_archive' => false,
        'rewrite' => false, 'show_in_rest' => false,
    ]);
}

/* ================================================================
   METABOX
   ================================================================ */

function asl_note_add_meta_boxes() {
    add_meta_box('asl_note_fields', 'Note SEO Content', 'asl_note_render_metabox', 'asl_note', 'normal', 'high');
}

function asl_note_render_metabox($post) {
    wp_nonce_field('asl_note_save', 'asl_note_nonce');
    $id = $post->ID;
    $prefix = '_asl_note';

    echo '<table class="form-table">';
    // Slug
    $slug = get_post_meta($id, '_asl_note_slug', true) ?: sanitize_title($post->post_title);
    echo '<tr><th>Slug</th><td>';
    asl_f_text('_asl_note_slug', $slug, ['class'=>'regular-text','placeholder'=>'e.g. amber, rose, oud']);
    echo '<p class="description">URL slug used in /notes/{slug}. Usually auto-generated from title.</p>';
    echo '</td></tr>';

    // Bilingual fields
    asl_f_bi($id, $prefix, 'name', 'Display Name', 'text', ['class'=>'regular-text']);
    asl_f_bi($id, $prefix, 'title', 'SEO Title');
    asl_f_bi($id, $prefix, 'desc', 'SEO Description', 'textarea', ['rows'=>4]);
    echo '</table>';
}

/* ================================================================
   SAVE
   ================================================================ */

function asl_note_save_meta($post_id, $post) {
    if (!isset($_POST['asl_note_nonce']) || !wp_verify_nonce($_POST['asl_note_nonce'], 'asl_note_save')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    update_post_meta($post_id, '_asl_note_slug', sanitize_title($_POST['_asl_note_slug'] ?? ''));
    asl_f_save_bi($post_id, '_asl_note', 'name');
    asl_f_save_bi($post_id, '_asl_note', 'title');
    asl_f_save_bi($post_id, '_asl_note', 'desc', 'textarea');
}

/* ================================================================
   REST API
   ================================================================ */

function asl_note_register_routes() {
    register_rest_route('asl/v1', '/notes-seo/(?P<slug>[a-zA-Z0-9_-]+)', [
        'methods' => 'GET', 'callback' => 'asl_note_rest_single', 'permission_callback' => '__return_true',
        'args' => ['slug' => ['required' => true, 'sanitize_callback' => 'sanitize_text_field']],
    ]);
    register_rest_route('asl/v1', '/notes-seo', [
        'methods' => 'GET', 'callback' => 'asl_note_rest_all', 'permission_callback' => '__return_true',
    ]);
}

/** Format a note post for API */
function asl_note_format($post) {
    $id = $post->ID;
    return [
        'name' => asl_f_api_bi($id, '_asl_note', 'name'),
        'title' => asl_f_api_bi($id, '_asl_note', 'title'),
        'description' => asl_f_api_bi($id, '_asl_note', 'desc'),
    ];
}

/** REST: GET /asl/v1/notes-seo/{slug} */
function asl_note_rest_single($request) {
    $slug = $request['slug'];
    $posts = get_posts([
        'post_type' => 'asl_note', 'post_status' => 'publish',
        'meta_key' => '_asl_note_slug', 'meta_value' => $slug,
        'posts_per_page' => 1,
    ]);
    if (empty($posts)) {
        // Fallback: try by post_name
        $posts = get_posts([
            'post_type' => 'asl_note', 'post_status' => 'publish',
            'name' => $slug, 'posts_per_page' => 1,
        ]);
    }
    if (empty($posts)) {
        return new WP_REST_Response(['name'=>['en'=>'','ar'=>''],'title'=>['en'=>'','ar'=>''],'description'=>['en'=>'','ar'=>'']], 200);
    }
    return new WP_REST_Response(asl_note_format($posts[0]), 200);
}

/** REST: GET /asl/v1/notes-seo */
function asl_note_rest_all() {
    $posts = get_posts([
        'post_type' => 'asl_note', 'post_status' => 'publish',
        'posts_per_page' => -1, 'orderby' => 'title', 'order' => 'ASC',
    ]);
    $notes = [];
    foreach ($posts as $p) {
        $slug = get_post_meta($p->ID, '_asl_note_slug', true) ?: sanitize_title($p->post_title);
        $formatted = asl_note_format($p);
        // Only include if has content
        if (!empty($formatted['name']['en']) || !empty($formatted['title']['en'])) {
            $notes[$slug] = $formatted;
        }
    }
    return new WP_REST_Response($notes, 200);
}

/* ================================================================
   VIEW LINKS
   ================================================================ */

/** Add View EN/AR links to Notes list row actions */
function asl_note_row_actions($actions, $post) {
    if ($post->post_type !== 'asl_note') return $actions;
    $slug = get_post_meta($post->ID, '_asl_note_slug', true) ?: sanitize_title($post->post_title);
    $base = defined('ASL_FRONTEND_URL') ? ASL_FRONTEND_URL : 'https://aromaticscentslab.com';
    $actions['view_en'] = '<a href="' . esc_url($base . '/en/notes/' . $slug) . '" target="_blank">View EN</a>';
    $actions['view_ar'] = '<a href="' . esc_url($base . '/ar/notes/' . $slug) . '" target="_blank">View AR</a>';
    return $actions;
}

/** Show view links banner on Note edit page */
function asl_note_view_links($post) {
    if ($post->post_type !== 'asl_note') return;
    $slug = get_post_meta($post->ID, '_asl_note_slug', true) ?: sanitize_title($post->post_title);
    $base = defined('ASL_FRONTEND_URL') ? ASL_FRONTEND_URL : 'https://aromaticscentslab.com';
    echo '<div class="notice notice-info inline" style="margin:10px 0;padding:10px 15px;">';
    echo '<strong>View on site:</strong> ';
    echo '<a href="' . esc_url($base . '/en/notes/' . $slug) . '" target="_blank" class="button button-small" style="margin-left:8px;">View EN</a> ';
    echo '<a href="' . esc_url($base . '/ar/notes/' . $slug) . '" target="_blank" class="button button-small" style="margin-left:4px;">View AR</a>';
    echo '</div>';
}

/* ================================================================
   INIT
   ================================================================ */
asl_note_cpt_init();
