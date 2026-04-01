jQuery(document).ready(function($) {

    /* ================================================================
       PRODUCT SELECTOR — AJAX search with preview
       ================================================================ */
    var searchTimer = null;

    // Search input handler
    $(document).on('input', '.asl-product-search', function() {
        var input = $(this);
        var wrap = input.closest('.asl-product-selector');
        var results = wrap.find('.asl-product-results');
        var q = input.val().trim();
        clearTimeout(searchTimer);
        if (q.length < 2) { results.hide().empty(); return; }
        searchTimer = setTimeout(function() {
            $.get(aslAdmin.ajaxurl, {
                action: 'asl_search_products', nonce: aslAdmin.nonce, q: q
            }, function(res) {
                if (!res.success || !res.data.length) {
                    results.html('<div style="padding:8px;color:#999;">No products found</div>').show();
                    return;
                }
                var html = '';
                $.each(res.data, function(i, p) {
                    html += '<div class="asl-product-result" data-slug="' + p.slug + '" data-name="' + $('<span>').text(p.name).html() + '" data-price="' + p.price + '" data-sku="' + (p.sku||'') + '" data-image="' + (p.image||'') + '" data-stock="' + p.stock + '" data-category="' + (p.category||'') + '" style="display:flex;align-items:center;padding:8px;cursor:pointer;border-bottom:1px solid #eee;">';
                    html += '<img src="' + (p.image || '') + '" style="width:40px;height:40px;object-fit:cover;border-radius:4px;margin-right:10px;' + (p.image ? '' : 'display:none;') + '">';
                    html += '<div style="flex:1;"><strong>' + p.name + '</strong>' + (p.category ? '<br><small style="color:#0073aa;">Category: ' + p.category + '</small>' : '') + '<br><small style="color:#666;">' + p.price + (p.sku ? ' &middot; SKU: ' + p.sku : '') + ' &middot; ' + p.stock + '</small></div>';
                    html += '</div>';
                });
                results.html(html).show();
            });
        }, 300);
    });

    // Select a product from results
    $(document).on('click', '.asl-product-result', function() {
        var el = $(this);
        var wrap = el.closest('.asl-product-selector');
        var slug = el.data('slug');
        wrap.find('.asl-product-slug-input').val(slug);
        wrap.find('.asl-product-search').val('');
        wrap.find('.asl-product-results').hide().empty();
        // Update preview
        var preview = wrap.find('.asl-product-preview');
        var img = el.data('image');
        var cat = el.data('category') || '';
        preview.html(
            '<div style="display:flex;align-items:center;padding:10px;background:#f0f7ff;border:1px solid #c5d9ed;border-radius:4px;margin-top:8px;">' +
            (img ? '<img src="' + img + '" style="width:50px;height:50px;object-fit:cover;border-radius:4px;margin-right:12px;">' : '') +
            '<div><strong>' + el.data('name') + '</strong>' + (cat ? '<br><small style="color:#0073aa;">Category: ' + cat + '</small>' : '') + '<br>' +
            '<small style="color:#666;">Slug: ' + slug + ' &middot; ' + el.data('price') + (el.data('sku') ? ' &middot; SKU: ' + el.data('sku') : '') + '</small></div>' +
            '<button type="button" class="button asl-product-clear" style="margin-left:auto;color:red;">✕</button>' +
            '</div>'
        );
    });

    // Clear selected product
    $(document).on('click', '.asl-product-clear', function(e) {
        e.preventDefault();
        var wrap = $(this).closest('.asl-product-selector');
        wrap.find('.asl-product-slug-input').val('');
        wrap.find('.asl-product-preview').empty();
    });

    // Hide results when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.asl-product-selector').length) {
            $('.asl-product-results').hide();
        }
    });

    // On page load, fetch product details for pre-filled slugs
    $('.asl-product-selector').each(function() {
        var wrap = $(this);
        var slug = wrap.find('.asl-product-slug-input').val();
        if (!slug) return;
        $.get(aslAdmin.ajaxurl, {
            action: 'asl_search_products', nonce: aslAdmin.nonce, q: slug
        }, function(res) {
            if (!res.success) return;
            var match = null;
            $.each(res.data, function(i, p) { if (p.slug === slug) { match = p; return false; } });
            if (!match) return;
            var preview = wrap.find('.asl-product-preview');
            var cat = match.category || '';
            preview.html(
                '<div style="display:flex;align-items:center;padding:10px;background:#f0f7ff;border:1px solid #c5d9ed;border-radius:4px;margin-top:8px;">' +
                (match.image ? '<img src="' + match.image + '" style="width:50px;height:50px;object-fit:cover;border-radius:4px;margin-right:12px;">' : '') +
                '<div><strong>' + match.name + '</strong>' + (cat ? '<br><small style="color:#0073aa;">Category: ' + cat + '</small>' : '') + '<br>' +
                '<small style="color:#666;">Slug: ' + match.slug + ' &middot; ' + match.price + (match.sku ? ' &middot; SKU: ' + match.sku : '') + '</small></div>' +
                '<button type="button" class="button asl-product-clear" style="margin-left:auto;color:red;">✕</button>' +
                '</div>'
            );
        });
    });

    // Media Library Upload
    $(document).on('click', '.asl-upload-btn', function(e) {
        e.preventDefault();
        var btn = $(this);
        var target = $(btn.data('target'));
        var preview = $(btn.data('preview'));
        var removeBtn = btn.siblings('.asl-remove-btn');
        
        var frame = wp.media({
            title: 'Select Image',
            button: { text: 'Use Image' },
            multiple: false
        });
        
        frame.on('select', function() {
            var attachment = frame.state().get('selection').first().toJSON();
            target.val(attachment.url);
            preview.html('<img src="' + attachment.url + '" style="max-width:300px;max-height:150px;display:block;margin-top:10px;">');
            removeBtn.show();
        });
        
        frame.open();
    });
    
    // Remove Image
    $(document).on('click', '.asl-remove-btn', function(e) {
        e.preventDefault();
        var btn = $(this);
        var target = $(btn.data('target'));
        var preview = $(btn.data('preview'));
        target.val('');
        preview.html('');
        btn.hide();
    });

    // Logo Upload (stores attachment ID)
    $(document).on('click', '.asl-logo-upload-btn', function(e) {
        e.preventDefault();
        var btn = $(this);
        var targetId = $(btn.data('target-id'));
        var targetUrl = $(btn.data('target-url'));
        var preview = $(btn.data('preview'));
        var removeBtn = btn.siblings('.asl-logo-remove-btn');

        var frame = wp.media({
            title: 'Select Logo',
            button: { text: 'Use as Logo' },
            multiple: false
        });

        frame.on('select', function() {
            var attachment = frame.state().get('selection').first().toJSON();
            targetId.val(attachment.id);
            targetUrl.val(attachment.url);
            preview.html('<img src="' + attachment.url + '" style="max-width:300px;max-height:150px;display:block;margin-top:10px;">');
            removeBtn.show();
        });

        frame.open();
    });

    // Logo Remove
    $(document).on('click', '.asl-logo-remove-btn', function(e) {
        e.preventDefault();
        var btn = $(this);
        var targetId = $(btn.data('target-id'));
        var targetUrl = $(btn.data('target-url'));
        var preview = $(btn.data('preview'));
        targetId.val('0');
        targetUrl.val('');
        preview.html('');
        btn.hide();
    });
    
    // Add Hero Slide
    $('#asl-add-slide').on('click', function() {
        var container = $('#asl-hero-slides');
        var count = container.find('.asl-slide-item').length;
        var html = '<div class="asl-slide-item" style="background:#f9f9f9;padding:15px;margin-bottom:15px;border:1px solid #ddd;">' +
            '<h4>Slide ' + (count + 1) + ' <button type="button" class="button asl-remove-slide" style="float:right;color:red;">Remove</button></h4>' +
            '<table class="form-table">' +
            '<tr><th>Desktop Image</th><td><div class="asl-image-field">' +
            '<input type="hidden" name="asl_hero_slides[' + count + '][image]" id="asl_hero_slides_' + count + '_image" value="">' +
            '<button type="button" class="button asl-upload-btn" data-target="#asl_hero_slides_' + count + '_image" data-preview="#asl_hero_slides_' + count + '_image_preview">Upload Image</button>' +
            '<button type="button" class="button asl-remove-btn" data-target="#asl_hero_slides_' + count + '_image" data-preview="#asl_hero_slides_' + count + '_image_preview" style="display:none;">Remove</button>' +
            '<div id="asl_hero_slides_' + count + '_image_preview" class="asl-preview"></div></div></td></tr>' +
            '<tr><th>Mobile Image</th><td><div class="asl-image-field">' +
            '<input type="hidden" name="asl_hero_slides[' + count + '][mobile]" id="asl_hero_slides_' + count + '_mobile" value="">' +
            '<button type="button" class="button asl-upload-btn" data-target="#asl_hero_slides_' + count + '_mobile" data-preview="#asl_hero_slides_' + count + '_mobile_preview">Upload Image</button>' +
            '<button type="button" class="button asl-remove-btn" data-target="#asl_hero_slides_' + count + '_mobile" data-preview="#asl_hero_slides_' + count + '_mobile_preview" style="display:none;">Remove</button>' +
            '<div id="asl_hero_slides_' + count + '_mobile_preview" class="asl-preview"></div></div></td></tr>' +
            '<tr><th>Link URL</th><td><input type="url" name="asl_hero_slides[' + count + '][link]" value="" class="large-text"></td></tr>' +
            '</table></div>';
        container.append(html);
    });
    
    // Remove Hero Slide
    $(document).on('click', '.asl-remove-slide', function() {
        $(this).closest('.asl-slide-item').remove();
        reindexSlides();
    });
    
    function reindexSlides() {
        $('#asl-hero-slides .asl-slide-item').each(function(i) {
            $(this).find('h4').contents().first().replaceWith('Slide ' + (i + 1) + ' ');
            $(this).find('input[name^="asl_hero_slides"]').each(function() {
                var name = $(this).attr('name').replace(/\[\d+\]/, '[' + i + ']');
                var id = $(this).attr('id').replace(/_\d+_/, '_' + i + '_');
                $(this).attr('name', name).attr('id', id);
            });
            $(this).find('.asl-upload-btn, .asl-remove-btn').each(function() {
                var target = $(this).data('target').replace(/_\d+_/, '_' + i + '_');
                var preview = $(this).data('preview').replace(/_\d+_/, '_' + i + '_');
                $(this).attr('data-target', target).attr('data-preview', preview);
            });
            $(this).find('.asl-preview').each(function() {
                var id = $(this).attr('id').replace(/_\d+_/, '_' + i + '_');
                $(this).attr('id', id);
            });
        });
    }
    
    // Add Collection
    $('#asl-add-collection').on('click', function() {
        var container = $('#asl-collections-items');
        var count = container.find('.asl-collection-item').length;
        var html = '<div class="asl-collection-item" style="background:#f9f9f9;padding:15px;margin-bottom:15px;border:1px solid #ddd;">' +
            '<h4>Collection ' + (count + 1) + ' <button type="button" class="button asl-remove-collection" style="float:right;color:red;">Remove</button></h4>' +
            '<table class="form-table">' +
            '<tr><th>Image</th><td><div class="asl-image-field">' +
            '<input type="hidden" name="asl_collections_items[' + count + '][image]" id="asl_collections_items_' + count + '_image" value="">' +
            '<button type="button" class="button asl-upload-btn" data-target="#asl_collections_items_' + count + '_image" data-preview="#asl_collections_items_' + count + '_image_preview">Upload Image</button>' +
            '<button type="button" class="button asl-remove-btn" data-target="#asl_collections_items_' + count + '_image" data-preview="#asl_collections_items_' + count + '_image_preview" style="display:none;">Remove</button>' +
            '<div id="asl_collections_items_' + count + '_image_preview" class="asl-preview"></div></div></td></tr>' +
            '<tr><th>Title (EN)</th><td><input type="text" name="asl_collections_items[' + count + '][title]" value="" class="regular-text"></td></tr>' +
            '<tr><th>Title (AR)</th><td><input type="text" name="asl_collections_items[' + count + '][title_ar]" value="" class="regular-text" dir="rtl"></td></tr>' +
            '<tr><th>Description (EN)</th><td><textarea name="asl_collections_items[' + count + '][description]" class="large-text" rows="2"></textarea></td></tr>' +
            '<tr><th>Description (AR)</th><td><textarea name="asl_collections_items[' + count + '][description_ar]" class="large-text" rows="2" dir="rtl"></textarea></td></tr>' +
            '<tr><th>Link</th><td><input type="url" name="asl_collections_items[' + count + '][link]" value="" class="large-text"></td></tr>' +
            '</table></div>';
        container.append(html);
    });
    
    // Remove Collection
    $(document).on('click', '.asl-remove-collection', function() {
        $(this).closest('.asl-collection-item').remove();
        reindexCollections();
    });
    
    function reindexCollections() {
        $('#asl-collections-items .asl-collection-item').each(function(i) {
            $(this).find('h4').contents().first().replaceWith('Collection ' + (i + 1) + ' ');
            $(this).find('input[name^="asl_collections_items"], textarea[name^="asl_collections_items"]').each(function() {
                var name = $(this).attr('name').replace(/\[\d+\]/, '[' + i + ']');
                var id = $(this).attr('id') ? $(this).attr('id').replace(/_\d+_/, '_' + i + '_') : '';
                $(this).attr('name', name);
                if (id) $(this).attr('id', id);
            });
            $(this).find('.asl-upload-btn, .asl-remove-btn').each(function() {
                var target = $(this).data('target').replace(/_\d+_/, '_' + i + '_');
                var preview = $(this).data('preview').replace(/_\d+_/, '_' + i + '_');
                $(this).attr('data-target', target).attr('data-preview', preview);
            });
            $(this).find('.asl-preview').each(function() {
                var id = $(this).attr('id').replace(/_\d+_/, '_' + i + '_');
                $(this).attr('id', id);
            });
        });
    }
    
    // Generic repeater Add (for Static Pages module)
    $(document).on('click', '.asl-sp-add', function() {
        var targetId = $(this).data('target');
        var container = $('#' + targetId);
        var items = container.find('.asl-repeater-item');
        var count = items.length;
        if (count === 0) return; // Need at least one template
        var last = items.last();
        var clone = last.clone();
        // Update index in names and clear values
        clone.find('input, textarea').each(function() {
            var name = $(this).attr('name');
            if (name) {
                $(this).attr('name', name.replace(/\[\d+\]/, '[' + count + ']'));
            }
            $(this).val('');
        });
        clone.find('h4').contents().first().replaceWith(
            clone.find('h4').contents().first().text().replace(/\d+/, count + 1)
        );
        container.append(clone);
    });

    // Generic repeater Remove
    $(document).on('click', '.asl-remove-repeater-item', function() {
        var item = $(this).closest('.asl-repeater-item');
        var container = item.parent();
        if (container.find('.asl-repeater-item').length > 1) {
            item.remove();
            // Reindex
            container.find('.asl-repeater-item').each(function(i) {
                $(this).find('input, textarea').each(function() {
                    var name = $(this).attr('name');
                    if (name) {
                        $(this).attr('name', name.replace(/\[\d+\]/, '[' + i + ']'));
                    }
                });
            });
        }
    });

    // Add Banner
    $('#asl-add-banner').on('click', function() {
        var container = $('#asl-banners-items');
        var count = container.find('.asl-banner-item').length;
        var html = '<div class="asl-banner-item" style="background:#f9f9f9;padding:15px;margin-bottom:15px;border:1px solid #ddd;">' +
            '<h4>Banner ' + (count + 1) + ' <button type="button" class="button asl-remove-banner" style="float:right;color:red;">Remove</button></h4>' +
            '<table class="form-table">' +
            '<tr><th>Desktop Image</th><td><div class="asl-image-field">' +
            '<input type="hidden" name="asl_banners_items[' + count + '][image]" id="asl_banners_items_' + count + '_image" value="">' +
            '<button type="button" class="button asl-upload-btn" data-target="#asl_banners_items_' + count + '_image" data-preview="#asl_banners_items_' + count + '_image_preview">Upload Image</button>' +
            '<button type="button" class="button asl-remove-btn" data-target="#asl_banners_items_' + count + '_image" data-preview="#asl_banners_items_' + count + '_image_preview" style="display:none;">Remove</button>' +
            '<div id="asl_banners_items_' + count + '_image_preview" class="asl-preview"></div></div></td></tr>' +
            '<tr><th>Mobile Image</th><td><div class="asl-image-field">' +
            '<input type="hidden" name="asl_banners_items[' + count + '][mobile]" id="asl_banners_items_' + count + '_mobile" value="">' +
            '<button type="button" class="button asl-upload-btn" data-target="#asl_banners_items_' + count + '_mobile" data-preview="#asl_banners_items_' + count + '_mobile_preview">Upload Image</button>' +
            '<button type="button" class="button asl-remove-btn" data-target="#asl_banners_items_' + count + '_mobile" data-preview="#asl_banners_items_' + count + '_mobile_preview" style="display:none;">Remove</button>' +
            '<div id="asl_banners_items_' + count + '_mobile_preview" class="asl-preview"></div></div></td></tr>' +
            '<tr><th>Title (EN)</th><td><input type="text" name="asl_banners_items[' + count + '][title]" value="" class="regular-text"></td></tr>' +
            '<tr><th>Title (AR)</th><td><input type="text" name="asl_banners_items[' + count + '][title_ar]" value="" class="regular-text" dir="rtl"></td></tr>' +
            '<tr><th>Subtitle (EN)</th><td><input type="text" name="asl_banners_items[' + count + '][subtitle]" value="" class="regular-text"></td></tr>' +
            '<tr><th>Subtitle (AR)</th><td><input type="text" name="asl_banners_items[' + count + '][subtitle_ar]" value="" class="regular-text" dir="rtl"></td></tr>' +
            '<tr><th>Link</th><td><input type="url" name="asl_banners_items[' + count + '][link]" value="" class="large-text"></td></tr>' +
            '</table></div>';
        container.append(html);
    });
    
    // Remove Banner
    $(document).on('click', '.asl-remove-banner', function() {
        $(this).closest('.asl-banner-item').remove();
        reindexBanners();
    });
    
    function reindexBanners() {
        $('#asl-banners-items .asl-banner-item').each(function(i) {
            $(this).find('h4').contents().first().replaceWith('Banner ' + (i + 1) + ' ');
            $(this).find('input[name^="asl_banners_items"], textarea[name^="asl_banners_items"]').each(function() {
                var name = $(this).attr('name').replace(/\[\d+\]/, '[' + i + ']');
                var id = $(this).attr('id') ? $(this).attr('id').replace(/_\d+_/, '_' + i + '_') : '';
                $(this).attr('name', name);
                if (id) $(this).attr('id', id);
            });
            $(this).find('.asl-upload-btn, .asl-remove-btn').each(function() {
                var target = $(this).data('target').replace(/_\d+_/, '_' + i + '_');
                var preview = $(this).data('preview').replace(/_\d+_/, '_' + i + '_');
                $(this).attr('data-target', target).attr('data-preview', preview);
            });
            $(this).find('.asl-preview').each(function() {
                var id = $(this).attr('id').replace(/_\d+_/, '_' + i + '_');
                $(this).attr('id', id);
            });
        });
    }
});
