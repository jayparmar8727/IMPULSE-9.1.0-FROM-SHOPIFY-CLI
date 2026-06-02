# Schema Patterns — Reusable Setting Groups

Copy-paste these into a section's `{% schema %}`. They are tuned for Impulse 9.1.0 and
OS 2.0. Keep IDs stable across sections so merchant muscle memory and any global CSS
tokens stay consistent.

---

## Spacing controls

```json
{ "type": "header", "content": "Spacing" },
{
  "type": "range",
  "id": "padding_top",
  "label": "Top padding",
  "min": 0, "max": 120, "step": 4, "unit": "px",
  "default": 40
},
{
  "type": "range",
  "id": "padding_bottom",
  "label": "Bottom padding",
  "min": 0, "max": 120, "step": 4, "unit": "px",
  "default": 40
}
```

---

## Color controls

Prefer Impulse/OS 2.0 **color schemes** over raw color pickers where the theme exposes
them; fall back to `color` / `color_background` for one-offs.

```json
{ "type": "header", "content": "Colors" },
{
  "type": "color_scheme",
  "id": "color_scheme",
  "label": "Color scheme",
  "default": "scheme-1"
},
{
  "type": "color",
  "id": "accent",
  "label": "Accent color",
  "default": "#1a1a1a"
},
{
  "type": "color_background",
  "id": "gradient",
  "label": "Background gradient"
}
```

---

## Typography controls

```json
{ "type": "header", "content": "Typography" },
{
  "type": "select",
  "id": "heading_size",
  "label": "Heading size",
  "options": [
    { "value": "h3", "label": "Small" },
    { "value": "h2", "label": "Medium" },
    { "value": "h1", "label": "Large" }
  ],
  "default": "h2"
},
{
  "type": "select",
  "id": "text_alignment",
  "label": "Text alignment",
  "options": [
    { "value": "left", "label": "Left" },
    { "value": "center", "label": "Center" },
    { "value": "right", "label": "Right" }
  ],
  "default": "left"
}
```

---

## Image settings

```json
{ "type": "header", "content": "Image" },
{
  "type": "image_picker",
  "id": "image",
  "label": "Image",
  "info": "Connect a metafield via the dynamic source icon if desired."
},
{
  "type": "select",
  "id": "image_ratio",
  "label": "Aspect ratio",
  "options": [
    { "value": "adapt", "label": "Adapt to image" },
    { "value": "square", "label": "Square (1:1)" },
    { "value": "portrait", "label": "Portrait (3:4)" },
    { "value": "landscape", "label": "Landscape (4:3)" }
  ],
  "default": "adapt"
},
{
  "type": "checkbox",
  "id": "priority_image",
  "label": "Treat as LCP image (load eagerly)",
  "info": "Enable only for the first above-the-fold image.",
  "default": false
}
```

Rendering (responsive + lazy):

```liquid
{%- liquid
  assign loading = 'lazy'
  assign fetchpriority = 'auto'
  if section.settings.priority_image
    assign loading = 'eager'
    assign fetchpriority = 'high'
  endif
-%}
{%- if section.settings.image != blank -%}
  {{
    section.settings.image
    | image_url: width: 1600
    | image_tag:
      loading: loading,
      fetchpriority: fetchpriority,
      widths: '320, 480, 640, 768, 1024, 1280, 1600',
      sizes: '(min-width: 750px) 50vw, 100vw',
      alt: section.settings.image.alt | default: section.settings.heading
  }}
{%- else -%}
  {{ 'image' | placeholder_svg_tag: 'placeholder' }}
{%- endif -%}
```

---

## Video settings

```json
{ "type": "header", "content": "Video" },
{
  "type": "video",
  "id": "video",
  "label": "Video (Shopify-hosted)"
},
{
  "type": "video_url",
  "id": "video_url",
  "label": "External video URL",
  "accept": ["youtube", "vimeo"],
  "info": "Used as a fallback if no hosted video is selected."
},
{
  "type": "checkbox",
  "id": "video_autoplay",
  "label": "Autoplay (muted)",
  "default": false
}
```

> Autoplaying video must be `muted` + `playsinline`, must respect
> `prefers-reduced-motion`, and should never be the LCP element.

---

## Product selector

```json
{
  "type": "product",
  "id": "featured_product",
  "label": "Product"
}
```

```liquid
{%- assign p = section.settings.featured_product -%}
{%- if p != blank -%}{%- render 'product-card', product: p -%}{%- endif -%}
```

## Collection selector

```json
{
  "type": "collection",
  "id": "featured_collection",
  "label": "Collection"
},
{
  "type": "range",
  "id": "products_to_show",
  "label": "Products to show",
  "min": 2, "max": 12, "step": 1,
  "default": 4
}
```

---

## Button settings (as a block-friendly group)

```json
{ "type": "header", "content": "Button" },
{ "type": "text", "id": "button_label", "label": "Button label" },
{ "type": "url",  "id": "button_link",  "label": "Button link" },
{
  "type": "select",
  "id": "button_style",
  "label": "Button style",
  "options": [
    { "value": "primary",   "label": "Primary" },
    { "value": "secondary", "label": "Secondary" },
    { "value": "link",      "label": "Text link" }
  ],
  "default": "primary"
}
```

```liquid
{%- if section.settings.button_label != blank and section.settings.button_link != blank -%}
  <a class="btn btn--{{ section.settings.button_style }}" href="{{ section.settings.button_link }}">
    {{ section.settings.button_label }}
  </a>
{%- endif -%}
```

---

## Layout settings

```json
{ "type": "header", "content": "Layout" },
{
  "type": "select",
  "id": "width",
  "label": "Section width",
  "options": [
    { "value": "page",   "label": "Page width" },
    { "value": "full",   "label": "Full width" }
  ],
  "default": "page"
},
{
  "type": "range",
  "id": "columns_desktop",
  "label": "Columns on desktop",
  "min": 1, "max": 5, "step": 1,
  "default": 3
},
{
  "type": "select",
  "id": "columns_mobile",
  "label": "Columns on mobile",
  "options": [
    { "value": "1", "label": "1 column" },
    { "value": "2", "label": "2 columns" }
  ],
  "default": "1"
}
```

---

## Canonical block + preset skeleton

```json
{% schema %}
{
  "name": "Feature columns",
  "tag": "section",
  "class": "impulse-feature-columns",
  "settings": [
    { "type": "inline_richtext", "id": "heading", "label": "Heading", "default": "Heading" }
  ],
  "blocks": [
    {
      "type": "column",
      "name": "Column",
      "settings": [
        { "type": "image_picker", "id": "image", "label": "Image" },
        { "type": "inline_richtext", "id": "title", "label": "Title", "default": "Title" },
        { "type": "richtext", "id": "text", "label": "Text",
          "default": "<p>Use this text to share information.</p>" }
      ]
    }
  ],
  "max_blocks": 12,
  "presets": [
    {
      "name": "Feature columns",
      "blocks": [
        { "type": "column" },
        { "type": "column" },
        { "type": "column" }
      ]
    }
  ]
}
{% endschema %}
```

Notes:
- `"tag"` + `"class"` let Impulse/OS 2.0 wrap the section element for you — pair with
  the token-bridge `style` attribute when you need dynamic values.
- Emit `{{ block.shopify_attributes }}` on each block's root element.
- Add `{ "type": "@app" }` to the `blocks` array if the section should accept app blocks.
