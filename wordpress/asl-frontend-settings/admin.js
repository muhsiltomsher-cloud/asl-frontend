jQuery(document).ready(function($) {

    /* ================================================================
       SHARED HELPERS
       ================================================================ */

    /** Build product preview card HTML */
    function productCard(p) {
        var cat = p.category || '';
        return '<div style="display:flex;align-items:center;padding:10px;background:#f0f7ff;border:1px solid #c5d9ed;border-radius:4px;margin-top:8px;">' +
            (p.image ? '<img src="' + p.image + '" style="width:50px;height:50px;object-fit:cover;border-radius:4px;margin-right:12px;">' : '') +
            '<div><strong>' + p.name + '</strong>' +
            (cat ? '<br><small style="color:#0073aa;">Category: ' + cat + '</small>' : '') +
            '<br><small style="color:#666;">Slug: ' + p.slug + ' &middot; ' + p.price +
            (p.sku ? ' &middot; SKU: ' + p.sku : '') + '</small></div>' +
            '<button type="button" class="button asl-product-clear" style="margin-left:auto;color:red;">\u2715</button></div>';
    }

    /** Build product search-result row HTML */
    function productRow(p) {
        var safe = $('<span>').text(p.name).html();
        return '<div class="asl-product-result"' +
            ' data-slug="' + p.slug + '"' +
            ' data-name="' + safe + '"' +
            ' data-price="' + p.price + '"' +
            ' data-sku="' + (p.sku||'') + '"' +
            ' data-image="' + (p.image||'') + '"' +
            ' data-stock="' + p.stock + '"' +
            ' data-category="' + (p.category||'') + '"' +
            ' style="display:flex;align-items:center;padding:8px;cursor:pointer;border-bottom:1px solid #eee;">' +
            '<img src="' + (p.image||'') + '" style="width:40px;height:40px;object-fit:cover;border-radius:4px;margin-right:10px;' + (p.image ? '' : 'display:none;') + '">' +
            '<div style="flex:1;"><strong>' + p.name + '</strong>' +
            (p.category ? '<br><small style="color:#0073aa;">Category: ' + p.category + '</small>' : '') +
            '<br><small style="color:#666;">' + p.price + (p.sku ? ' &middot; SKU: ' + p.sku : '') + ' &middot; ' + p.stock + '</small></div></div>';
    }

    /** Reindex a repeater container (updates [n] indices in field names) */
    function reindexRepeater(container, itemClass, label) {
        container.find('.' + itemClass).each(function(i) {
            $(this).find('h4').contents().first().replaceWith(label + ' ' + (i + 1) + ' ');
            $(this).find('input, textarea, select').each(function() {
                var n = $(this).attr('name');
                if (n) $(this).attr('name', n.replace(/\[\d+\]/, '[' + i + ']'));
                var id = $(this).attr('id');
                if (id) $(this).attr('id', id.replace(/_\d+_/, '_' + i + '_'));
            });
            $(this).find('.asl-upload-btn, .asl-remove-btn').each(function() {
                var t = $(this).data('target'), p = $(this).data('preview');
                if (t) $(this).attr('data-target', String(t).replace(/_\d+_/, '_' + i + '_'));
                if (p) $(this).attr('data-preview', String(p).replace(/_\d+_/, '_' + i + '_'));
            });
            $(this).find('.asl-preview').each(function() {
                var id = $(this).attr('id');
                if (id) $(this).attr('id', id.replace(/_\d+_/, '_' + i + '_'));
            });
        });
    }

    /* ================================================================
       PRODUCT SELECTOR - AJAX search with preview
       ================================================================ */
    var searchTimer = null;

    // Search input
    $(document).on('input', '.asl-product-search', function() {
        var input = $(this), wrap = input.closest('.asl-product-selector');
        var results = wrap.find('.asl-product-results'), q = input.val().trim();
        clearTimeout(searchTimer);
        if (q.length < 2) { results.hide().empty(); return; }
        searchTimer = setTimeout(function() {
            $.get(aslAdmin.ajaxurl, { action: 'asl_search_products', nonce: aslAdmin.nonce, q: q }, function(res) {
                if (!res.success || !res.data.length) {
                    results.html('<div style="padding:8px;color:#999;">No products found</div>').show();
                    return;
                }
                results.html($.map(res.data, productRow).join('')).show();
            });
        }, 300);
    });

    // Select product
    $(document).on('click', '.asl-product-result', function() {
        var el = $(this), wrap = el.closest('.asl-product-selector');
        wrap.find('.asl-product-slug-input').val(el.data('slug'));
        wrap.find('.asl-product-search').val('');
        wrap.find('.asl-product-results').hide().empty();
        wrap.find('.asl-product-preview').html(productCard({
            slug: el.data('slug'), name: el.data('name'), price: el.data('price'),
            sku: el.data('sku'), image: el.data('image'), category: el.data('category')
        }));
    });

    // Clear product
    $(document).on('click', '.asl-product-clear', function(e) {
        e.preventDefault();
        var wrap = $(this).closest('.asl-product-selector');
        wrap.find('.asl-product-slug-input').val('');
        wrap.find('.asl-product-preview').empty();
    });

    // Hide results on outside click
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.asl-product-selector').length) $('.asl-product-results').hide();
    });

    // Page load: fetch previews for pre-filled slugs
    $('.asl-product-selector').each(function() {
        var wrap = $(this), slug = wrap.find('.asl-product-slug-input').val();
        if (!slug) return;
        $.get(aslAdmin.ajaxurl, { action: 'asl_search_products', nonce: aslAdmin.nonce, q: slug }, function(res) {
            if (!res.success) return;
            var match = null;
            $.each(res.data, function(i, p) { if (p.slug === slug) { match = p; return false; } });
            if (match) wrap.find('.asl-product-preview').html(productCard(match));
        });
    });

    /* ================================================================
       MEDIA LIBRARY - Image upload / remove
       ================================================================ */
    $(document).on('click', '.asl-upload-btn', function(e) {
        e.preventDefault();
        var btn = $(this), target = $(btn.data('target')), preview = $(btn.data('preview'));
        var frame = wp.media({ title: 'Select Image', button: { text: 'Use Image' }, multiple: false });
        frame.on('select', function() {
            var a = frame.state().get('selection').first().toJSON();
            target.val(a.url);
            preview.html('<img src="' + a.url + '" style="max-width:300px;max-height:150px;display:block;margin-top:10px;">');
            btn.siblings('.asl-remove-btn').show();
        });
        frame.open();
    });

    $(document).on('click', '.asl-remove-btn', function(e) {
        e.preventDefault();
        var btn = $(this);
        $(btn.data('target')).val('');
        $(btn.data('preview')).html('');
        btn.hide();
    });

    // Logo upload (stores attachment ID)
    $(document).on('click', '.asl-logo-upload-btn', function(e) {
        e.preventDefault();
        var btn = $(this), tid = $(btn.data('target-id')), turl = $(btn.data('target-url')), preview = $(btn.data('preview'));
        var frame = wp.media({ title: 'Select Logo', button: { text: 'Use as Logo' }, multiple: false });
        frame.on('select', function() {
            var a = frame.state().get('selection').first().toJSON();
            tid.val(a.id); turl.val(a.url);
            preview.html('<img src="' + a.url + '" style="max-width:300px;max-height:150px;display:block;margin-top:10px;">');
            btn.siblings('.asl-logo-remove-btn').show();
        });
        frame.open();
    });

    $(document).on('click', '.asl-logo-remove-btn', function(e) {
        e.preventDefault();
        var btn = $(this);
        $(btn.data('target-id')).val('0');
        $(btn.data('target-url')).val('');
        $(btn.data('preview')).html('');
        btn.hide();
    });

    /* ================================================================
       HERO SLIDES - Add / Remove / Reindex
       ================================================================ */
    function slideTemplate(i) {
        var p = 'asl_hero_slides[' + i + ']', id = 'asl_hero_slides_' + i;
        return '<div class="asl-slide-item" style="background:#f9f9f9;padding:15px;margin-bottom:15px;border:1px solid #ddd;">' +
            '<h4>Slide ' + (i+1) + ' <button type="button" class="button asl-remove-slide" style="float:right;color:red;">Remove</button></h4>' +
            '<table class="form-table">' +
            '<tr><th>Desktop Image</th><td><div class="asl-image-field">' +
            '<input type="hidden" name="' + p + '[image]" id="' + id + '_image" value="">' +
            '<button type="button" class="button asl-upload-btn" data-target="#' + id + '_image" data-preview="#' + id + '_image_preview">Upload Image</button>' +
            '<button type="button" class="button asl-remove-btn" data-target="#' + id + '_image" data-preview="#' + id + '_image_preview" style="display:none;">Remove</button>' +
            '<div id="' + id + '_image_preview" class="asl-preview"></div></div></td></tr>' +
            '<tr><th>Mobile Image</th><td><div class="asl-image-field">' +
            '<input type="hidden" name="' + p + '[mobile]" id="' + id + '_mobile" value="">' +
            '<button type="button" class="button asl-upload-btn" data-target="#' + id + '_mobile" data-preview="#' + id + '_mobile_preview">Upload Image</button>' +
            '<button type="button" class="button asl-remove-btn" data-target="#' + id + '_mobile" data-preview="#' + id + '_mobile_preview" style="display:none;">Remove</button>' +
            '<div id="' + id + '_mobile_preview" class="asl-preview"></div></div></td></tr>' +
            '<tr><th>Link URL</th><td><input type="text" name="' + p + '[link]" value="" class="large-text" placeholder="/shop or https://example.com"></td></tr>' +
            '</table></div>';
    }

    $('#asl-add-slide').on('click', function() {
        var c = $('#asl-hero-slides'); c.append(slideTemplate(c.find('.asl-slide-item').length));
    });
    $(document).on('click', '.asl-remove-slide', function() {
        $(this).closest('.asl-slide-item').remove();
        reindexRepeater($('#asl-hero-slides'), 'asl-slide-item', 'Slide');
    });

    /* ================================================================
       COLLECTIONS - Add / Remove / Reindex
       ================================================================ */
    function collectionTemplate(i) {
        var p = 'asl_collections_items[' + i + ']', id = 'asl_collections_items_' + i;
        return '<div class="asl-collection-item" style="background:#f9f9f9;padding:15px;margin-bottom:15px;border:1px solid #ddd;">' +
            '<h4>Collection ' + (i+1) + ' <button type="button" class="button asl-remove-collection" style="float:right;color:red;">Remove</button></h4>' +
            '<table class="form-table">' +
            '<tr><th>Image</th><td><div class="asl-image-field">' +
            '<input type="hidden" name="' + p + '[image]" id="' + id + '_image" value="">' +
            '<button type="button" class="button asl-upload-btn" data-target="#' + id + '_image" data-preview="#' + id + '_image_preview">Upload Image</button>' +
            '<button type="button" class="button asl-remove-btn" data-target="#' + id + '_image" data-preview="#' + id + '_image_preview" style="display:none;">Remove</button>' +
            '<div id="' + id + '_image_preview" class="asl-preview"></div></div></td></tr>' +
            '<tr><th>Title (EN)</th><td><input type="text" name="' + p + '[title]" value="" class="regular-text"></td></tr>' +
            '<tr><th>Title (AR)</th><td><input type="text" name="' + p + '[title_ar]" value="" class="regular-text" dir="rtl"></td></tr>' +
            '<tr><th>Description (EN)</th><td><textarea name="' + p + '[description]" class="large-text" rows="2"></textarea></td></tr>' +
            '<tr><th>Description (AR)</th><td><textarea name="' + p + '[description_ar]" class="large-text" rows="2" dir="rtl"></textarea></td></tr>' +
            '<tr><th>Link</th><td><input type="text" name="' + p + '[link]" value="" class="large-text" placeholder="/shop or https://example.com"></td></tr>' +
            '</table></div>';
    }

    $('#asl-add-collection').on('click', function() {
        var c = $('#asl-collections-items'); c.append(collectionTemplate(c.find('.asl-collection-item').length));
    });
    $(document).on('click', '.asl-remove-collection', function() {
        $(this).closest('.asl-collection-item').remove();
        reindexRepeater($('#asl-collections-items'), 'asl-collection-item', 'Collection');
    });

    /* ================================================================
       GENERIC REPEATER - Used by Notes, Content Blocks, FAQs, etc.
       ================================================================ */
    $(document).on('click', '.asl-sp-add', function() {
        var container = $('#' + $(this).data('target'));
        var items = container.find('.asl-repeater-item');
        if (!items.length) return;
        var clone = items.last().clone();
        var count = items.length;
        clone.find('input, textarea').each(function() {
            var n = $(this).attr('name');
            if (n) $(this).attr('name', n.replace(/\[\d+\]/, '[' + count + ']'));
            $(this).val('');
        });
        clone.find('.asl-product-preview').empty();
        clone.find('h4').contents().first().replaceWith(
            clone.find('h4').contents().first().text().replace(/\d+/, count + 1)
        );
        container.append(clone);
    });

    $(document).on('click', '.asl-remove-repeater-item', function() {
        var item = $(this).closest('.asl-repeater-item');
        var container = item.parent();
        if (container.find('.asl-repeater-item').length > 1) {
            item.remove();
            container.find('.asl-repeater-item').each(function(i) {
                $(this).find('input, textarea').each(function() {
                    var n = $(this).attr('name');
                    if (n) $(this).attr('name', n.replace(/\[\d+\]/, '[' + i + ']'));
                });
            });
        }
    });

    /* ================================================================
       BANNERS - Add / Remove / Reindex
       ================================================================ */
    function bannerTemplate(i) {
        var p = 'asl_banners_items[' + i + ']', id = 'asl_banners_items_' + i;
        return '<div class="asl-banner-item" style="background:#f9f9f9;padding:15px;margin-bottom:15px;border:1px solid #ddd;">' +
            '<h4>Banner ' + (i+1) + ' <button type="button" class="button asl-remove-banner" style="float:right;color:red;">Remove</button></h4>' +
            '<table class="form-table">' +
            '<tr><th>Desktop Image (EN)</th><td><div class="asl-image-field">' +
            '<input type="hidden" name="' + p + '[image]" id="' + id + '_image" value="">' +
            '<button type="button" class="button asl-upload-btn" data-target="#' + id + '_image" data-preview="#' + id + '_image_preview">Upload Image</button>' +
            '<button type="button" class="button asl-remove-btn" data-target="#' + id + '_image" data-preview="#' + id + '_image_preview" style="display:none;">Remove</button>' +
            '<div id="' + id + '_image_preview" class="asl-preview"></div></div></td></tr>' +
            '<tr><th>Mobile Image (EN)</th><td><div class="asl-image-field">' +
            '<input type="hidden" name="' + p + '[mobile]" id="' + id + '_mobile" value="">' +
            '<button type="button" class="button asl-upload-btn" data-target="#' + id + '_mobile" data-preview="#' + id + '_mobile_preview">Upload Image</button>' +
            '<button type="button" class="button asl-remove-btn" data-target="#' + id + '_mobile" data-preview="#' + id + '_mobile_preview" style="display:none;">Remove</button>' +
            '<div id="' + id + '_mobile_preview" class="asl-preview"></div></div></td></tr>' +
            '<tr><th>Desktop Image (AR)</th><td><div class="asl-image-field">' +
            '<input type="hidden" name="' + p + '[image_ar]" id="' + id + '_image_ar" value="">' +
            '<button type="button" class="button asl-upload-btn" data-target="#' + id + '_image_ar" data-preview="#' + id + '_image_ar_preview">Upload Image</button>' +
            '<button type="button" class="button asl-remove-btn" data-target="#' + id + '_image_ar" data-preview="#' + id + '_image_ar_preview" style="display:none;">Remove</button>' +
            '<div id="' + id + '_image_ar_preview" class="asl-preview"></div></div>' +
            '<p class="description">Arabic version. Falls back to EN image if empty.</p></td></tr>' +
            '<tr><th>Mobile Image (AR)</th><td><div class="asl-image-field">' +
            '<input type="hidden" name="' + p + '[mobile_ar]" id="' + id + '_mobile_ar" value="">' +
            '<button type="button" class="button asl-upload-btn" data-target="#' + id + '_mobile_ar" data-preview="#' + id + '_mobile_ar_preview">Upload Image</button>' +
            '<button type="button" class="button asl-remove-btn" data-target="#' + id + '_mobile_ar" data-preview="#' + id + '_mobile_ar_preview" style="display:none;">Remove</button>' +
            '<div id="' + id + '_mobile_ar_preview" class="asl-preview"></div></div>' +
            '<p class="description">Arabic version. Falls back to EN mobile image if empty.</p></td></tr>' +
            '<tr><th>Title (EN)</th><td><input type="text" name="' + p + '[title]" value="" class="regular-text"></td></tr>' +
            '<tr><th>Title (AR)</th><td><input type="text" name="' + p + '[title_ar]" value="" class="regular-text" dir="rtl"></td></tr>' +
            '<tr><th>Subtitle (EN)</th><td><input type="text" name="' + p + '[subtitle]" value="" class="regular-text"></td></tr>' +
            '<tr><th>Subtitle (AR)</th><td><input type="text" name="' + p + '[subtitle_ar]" value="" class="regular-text" dir="rtl"></td></tr>' +
            '<tr><th>Link</th><td><input type="text" name="' + p + '[link]" value="" class="large-text" placeholder="/shop or https://example.com"></td></tr>' +
            '</table></div>';
    }

    $('#asl-add-banner').on('click', function() {
        var c = $('#asl-banners-items'); c.append(bannerTemplate(c.find('.asl-banner-item').length));
    });
    $(document).on('click', '.asl-remove-banner', function() {
        $(this).closest('.asl-banner-item').remove();
        reindexRepeater($('#asl-banners-items'), 'asl-banner-item', 'Banner');
    });

    /* ================================================================
       CATEGORY SELECTOR - Check/uncheck + drag-and-drop reorder
       ================================================================ */

    function updateCatEmptyMsg() {
        var count = $('#asl-cat-selected-list .asl-cat-selected-item').length;
        $('#asl-cat-empty-msg').toggle(count === 0);
    }

    /** Build a selected-category card from data attributes */
    function buildSelectedCatItem(id, name, slug, count, thumb) {
        var html = '<div class="asl-cat-item asl-cat-selected-item" data-id="' + id + '" style="display:flex;align-items:center;padding:10px;margin-bottom:6px;background:#fff;border:1px solid #c5d9ed;border-radius:4px;cursor:grab;">';
        html += '<span class="dashicons dashicons-menu" style="margin-right:10px;color:#999;cursor:grab;"></span>';
        if (thumb) html += '<img src="' + thumb + '" style="width:40px;height:40px;object-fit:cover;border-radius:4px;margin-right:10px;">';
        html += '<div style="flex:1;"><strong>' + name + '</strong>';
        html += '<small style="color:#666;"> (' + count + ' products) &middot; slug: ' + slug + '</small></div>';
        html += '<input type="hidden" name="asl_categories_selected[]" value="' + id + '">';
        html += '<button type="button" class="button asl-cat-deselect" style="color:red;" title="Remove">&times;</button>';
        html += '</div>';
        return html;
    }

    // Checkbox toggle: add/remove from selected list
    $(document).on('change', '.asl-cat-checkbox', function() {
        var cb = $(this), id = cb.val();
        var availItem = cb.closest('.asl-cat-available-item');
        if (cb.is(':checked')) {
            // Add to selected list
            var name = availItem.data('name'), slug = availItem.data('slug');
            var count = availItem.data('count'), thumb = availItem.data('thumb');
            $('#asl-cat-selected-list').append(buildSelectedCatItem(id, name, slug, count, thumb));
            availItem.css('opacity', '0.4');
        } else {
            // Remove from selected list
            $('#asl-cat-selected-list .asl-cat-selected-item[data-id="' + id + '"]').remove();
            availItem.css('opacity', '1');
        }
        updateCatEmptyMsg();
    });

    // Deselect button in selected list
    $(document).on('click', '.asl-cat-deselect', function(e) {
        e.preventDefault();
        var item = $(this).closest('.asl-cat-selected-item');
        var id = item.data('id');
        // Uncheck the checkbox in available list
        $('.asl-cat-available-item[data-id="' + id + '"]').css('opacity', '1')
            .find('.asl-cat-checkbox').prop('checked', false);
        item.remove();
        updateCatEmptyMsg();
    });

    // jQuery UI Sortable for drag-and-drop reordering
    if ($('#asl-cat-selected-list').length && $.fn.sortable) {
        $('#asl-cat-selected-list').sortable({
            items: '.asl-cat-selected-item',
            handle: '.dashicons-menu',
            placeholder: 'asl-cat-sortable-placeholder',
            tolerance: 'pointer',
            cursor: 'grabbing'
        });
    }

    /* ================================================================
       PRODUCT SELECTOR (for Featured / Bestsellers / New Products)
       Search, select, deselect, drag-and-drop reorder
       ================================================================ */

    var prodSearchTimer = null;

    function updateProdEmptyMsg(section) {
        var list = section.find('.asl-prod-selected-list');
        var count = list.find('.asl-prod-selected-item').length;
        list.find('.asl-prod-empty-msg').toggle(count === 0);
    }

    /** Build a selected-product card */
    function buildProdSelectedItem(sectionKey, p) {
        var safe = $('<span>').text(p.name).html();
        var cat = p.category || '';
        var html = '<div class="asl-prod-selected-item" data-slug="' + p.slug + '" style="display:flex;align-items:center;padding:10px;margin-bottom:6px;background:#fff;border:1px solid #c5d9ed;border-radius:4px;cursor:grab;">';
        html += '<span class="dashicons dashicons-menu" style="margin-right:10px;color:#999;cursor:grab;"></span>';
        if (p.image) html += '<img src="' + p.image + '" style="width:40px;height:40px;object-fit:cover;border-radius:4px;margin-right:10px;">';
        html += '<div style="flex:1;"><strong>' + safe + '</strong>';
        if (cat) html += '<br><small style="color:#0073aa;">Category: ' + cat + '</small>';
        html += '<br><small style="color:#666;">Slug: ' + p.slug + ' &middot; ' + p.price;
        if (p.sku) html += ' &middot; SKU: ' + p.sku;
        html += '</small></div>';
        html += '<input type="hidden" name="asl_' + sectionKey + '_selected_products[]" value="' + p.slug + '">';
        html += '<button type="button" class="button asl-prod-deselect" style="color:red;" title="Remove">&times;</button>';
        html += '</div>';
        return html;
    }

    // Search input for product selector
    $(document).on('input', '.asl-prod-search', function() {
        var input = $(this), section = input.closest('.asl-product-selector-section');
        var results = section.find('.asl-prod-results'), q = input.val().trim();
        clearTimeout(prodSearchTimer);
        if (q.length < 2) { results.hide().empty(); return; }
        prodSearchTimer = setTimeout(function() {
            $.get(aslAdmin.ajaxurl, { action: 'asl_search_products', nonce: aslAdmin.nonce, q: q }, function(res) {
                if (!res.success || !res.data.length) {
                    results.html('<div style="padding:8px;color:#999;">No products found</div>').show();
                    return;
                }
                // Filter out already-selected slugs
                var selectedSlugs = [];
                section.find('.asl-prod-selected-item').each(function() {
                    selectedSlugs.push($(this).data('slug'));
                });
                var filtered = $.grep(res.data, function(p) {
                    return $.inArray(p.slug, selectedSlugs) === -1;
                });
                if (!filtered.length) {
                    results.html('<div style="padding:8px;color:#999;">All matching products already selected</div>').show();
                    return;
                }
                results.html($.map(filtered, function(p) {
                    return productRow(p);
                }).join('')).show();
            });
        }, 300);
    });

    // Select product from search results
    $(document).on('click', '.asl-product-selector-section .asl-product-result', function() {
        var el = $(this), section = el.closest('.asl-product-selector-section');
        var sectionKey = section.data('section');
        var p = {
            slug: el.data('slug'), name: el.data('name'), price: el.data('price'),
            sku: el.data('sku'), image: el.data('image'), category: el.data('category')
        };
        section.find('.asl-prod-selected-list').append(buildProdSelectedItem(sectionKey, p));
        section.find('.asl-prod-search').val('');
        section.find('.asl-prod-results').hide().empty();
        updateProdEmptyMsg(section);
    });

    // Deselect product
    $(document).on('click', '.asl-prod-deselect', function(e) {
        e.preventDefault();
        var item = $(this).closest('.asl-prod-selected-item');
        var section = item.closest('.asl-product-selector-section');
        item.remove();
        updateProdEmptyMsg(section);
    });

    // Hide product search results on outside click
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.asl-product-selector-section').length) {
            $('.asl-prod-results').hide();
        }
    });

    // jQuery UI Sortable for product selector drag-and-drop
    $('.asl-prod-selected-list').each(function() {
        if ($.fn.sortable) {
            $(this).sortable({
                items: '.asl-prod-selected-item',
                handle: '.dashicons-menu',
                placeholder: 'asl-prod-sortable-placeholder',
                tolerance: 'pointer',
                cursor: 'grabbing'
            });
        }
    });

    /* ================================================================
       FOOTER LINKS - Add / Remove / Reindex
       ================================================================ */
    function footerLinkTemplate(container, i) {
        var prefix = container.attr('id') === 'asl-footer-quick-links' ? 'asl_footer_quick_links' : 'asl_footer_cs_links';
        return '<div class="asl-footer-link-item" style="background:#f9f9f9;padding:15px;margin-bottom:10px;border:1px solid #ddd;">' +
            '<h4>Link ' + (i+1) + ' <button type="button" class="button asl-remove-footer-link" style="float:right;color:red;">Remove</button></h4>' +
            '<table class="form-table">' +
            '<tr><th>Label (EN)</th><td><input type="text" name="' + prefix + '[' + i + '][label_en]" value="" class="regular-text"></td></tr>' +
            '<tr><th>Label (AR)</th><td><input type="text" name="' + prefix + '[' + i + '][label_ar]" value="" class="regular-text" dir="rtl"></td></tr>' +
            '<tr><th>URL</th><td><input type="text" name="' + prefix + '[' + i + '][url]" value="" class="large-text" placeholder="/shop or https://example.com"></td></tr>' +
            '</table></div>';
    }

    function reindexFooterLinks(container) {
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
        c.append(footerLinkTemplate(c, c.find('.asl-footer-link-item').length));
    });

    $('#asl-add-cs-link').on('click', function() {
        var c = $('#asl-footer-cs-links');
        c.append(footerLinkTemplate(c, c.find('.asl-footer-link-item').length));
    });

    $(document).on('click', '.asl-remove-footer-link', function() {
        var item = $(this).closest('.asl-footer-link-item');
        var container = item.parent();
        item.remove();
        reindexFooterLinks(container);
    });

    // Page load: fetch product details for pre-filled slugs
    $('.asl-product-selector-section').each(function() {
        var section = $(this), sectionKey = section.data('section');
        section.find('.asl-prod-selected-item').each(function() {
            var item = $(this), slug = item.data('slug');
            if (!slug) return;
            $.get(aslAdmin.ajaxurl, { action: 'asl_search_products', nonce: aslAdmin.nonce, q: slug }, function(res) {
                if (!res.success) return;
                var match = null;
                $.each(res.data, function(i, p) { if (p.slug === slug) { match = p; return false; } });
                if (match) {
                    var safe = $('<span>').text(match.name).html();
                    var info = '<strong>' + safe + '</strong>';
                    if (match.category) info += '<br><small style="color:#0073aa;">Category: ' + match.category + '</small>';
                    info += '<br><small style="color:#666;">Slug: ' + match.slug + ' &middot; ' + match.price;
                    if (match.sku) info += ' &middot; SKU: ' + match.sku;
                    info += '</small>';
                    item.find('.asl-prod-item-info').html(info);
                    if (match.image && !item.find('img').length) {
                        item.find('.dashicons-menu').after('<img src="' + match.image + '" style="width:40px;height:40px;object-fit:cover;border-radius:4px;margin-right:10px;">');
                    }
                }
            });
        });
    });
});
