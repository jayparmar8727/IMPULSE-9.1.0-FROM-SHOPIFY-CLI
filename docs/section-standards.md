# Section Standards — Impulse 9.1.0 / OS 2.0

> **Governance note:** This is the *how to build a section well* standard. For *stock-vs-custom
> rules, naming (`kw-`/`custom-`), the `section-manifest.json` registry, and protected files*,
> [`../CLAUDE.md`](../CLAUDE.md) is the source of truth and takes precedence. This doc complements
> it; it does not restate it.

This document defines the mandatory requirements for **every** section added to this
theme. A section that does not meet all applicable rules below is not considered
production-ready and must not be merged.

---

## 1. Compatibility baseline

| Requirement | Rule |
|---|---|
| Online Store 2.0 | Every section must be JSON-template compatible and usable in the Theme Editor. No section may rely on `content_for_index` or hardcoded template assumptions. |
| Impulse 9.1.0 | Sections must use Impulse's existing CSS utility classes, grid helpers, and JS event hooks (`theme.js`). Do not introduce a parallel design system. |
| Section groups | Header, footer, and any aside/overlay regions must be authored so they can live inside a `sections/*.json` section group. App blocks (`@app`) should be allowed in the block list where relevant. |
| Forward migration | No edits to Shopify core objects. Custom logic stays inside the section or a namespaced snippet so a future Impulse update can be merged with minimal conflict. |

---

## 2. Required structure of a section file

Every `sections/*.liquid` file must contain, in this order:

1. **Liquid logic / capture blocks** (assign defaults, compute values).
2. **Markup** — semantic HTML, mobile-first.
3. `{% stylesheet %}` block (section-scoped CSS) — **never** inline `style=""`.
4. `{% javascript %}` block **only if unavoidable** — prefer no JS.
5. `{% schema %}` block — settings, blocks, presets.

```liquid
{%- liquid
  assign heading = section.settings.heading | default: 'Default heading'
-%}

<section
  class="impulse-feature color-{{ section.settings.color_scheme }}"
  style="--section-pt: {{ section.settings.padding_top }}px; --section-pb: {{ section.settings.padding_bottom }}px;"
  aria-labelledby="feature-{{ section.id }}"
>
  {%- if heading != blank -%}
    <h2 id="feature-{{ section.id }}">{{ heading }}</h2>
  {%- endif -%}

  {%- for block in section.blocks -%}
    {%- render 'feature-block', block: block -%}
  {%- endfor -%}
</section>

{% schema %}
{ ... }
{% endschema %}
```

> The one acceptable use of the `style` attribute is passing **CSS custom properties**
> (design tokens) computed from settings — e.g. `style="--section-pt: 40px"`. This is
> not "inline styling"; it is the OS 2.0-sanctioned way to feed dynamic values into a
> static stylesheet. All actual declarations live in `{% stylesheet %}`.

---

## 3. Schema requirements

- A `presets` array is **mandatory** so the section appears in the "Add section" picker.
- Every text/richtext/image setting that can sensibly bind to a metafield must declare
  `"info"` guidance and, where supported, use dynamic-source-friendly setting types.
- Default values must be supplied for all settings so a freshly added section renders
  without a blank/broken state.
- Blocks must define a sensible `max_blocks` and at least one default block in the preset.

See [`schema-patterns.md`](schema-patterns.md) for copy-paste setting groups.

---

## 4. Dynamic sources (metafields)

- Text, richtext, image_picker, url, and product/collection settings should be
  authored so a merchant can click the "Connect dynamic source" icon in the editor.
- Never hardcode content that a merchant would reasonably want to drive from a
  metafield (product spec tables, badges, certifications, etc.).
- When reading a metafield directly in Liquid, always guard for `blank`:

```liquid
{%- assign spec = product.metafields.custom.spec_sheet.value -%}
{%- if spec != blank -%} … {%- endif -%}
```

---

## 5. Blocks & reordering

- Repeatable content must be modelled as **blocks**, not as N numbered settings.
- Each block must emit `{{ block.shopify_attributes }}` on its top-level element so the
  Theme Editor can highlight/reorder it.
- Block rendering should be delegated to a snippet via `render` for reuse and testability.

---

## 6. Accessibility (WCAG 2.1 AA)

- One logical heading order per section; never skip levels arbitrarily.
- All interactive elements keyboard-reachable with a visible focus state.
- Images require `alt`; decorative images use `alt=""`.
- Color-scheme settings must preserve a contrast ratio ≥ 4.5:1 for body text.
- Sliders/carousels need pause controls and `aria-live` where content auto-rotates.
- Icon-only buttons require an accessible name (`aria-label` or visually-hidden text).

---

## 7. Performance

- Above-the-fold hero/first image: `loading="eager"` + `fetchpriority="high"`.
- All other images: `loading="lazy"` with explicit `width`/`height` to reserve space (CLS).
- Use the `image_url` + `image_tag` filter pair with a tuned `widths` list and `sizes`.
- No render-blocking JS. Defer or drop JS entirely; prefer CSS-only interactions.
- Do not import heavy libraries per-section. Reuse Impulse's bundled vendor JS.

See [`../PERFORMANCE.md`](../PERFORMANCE.md) for the theme's Core-Web-Vitals budget + LCP checklist.

---

## 8. Definition of Done

- [ ] Renders correctly when added fresh from the picker (defaults present)
- [ ] Passes `theme-check` with zero errors
- [ ] All repeatable content is block-based and reorderable
- [ ] Responsive image filter used; LCP image prioritised, rest lazy
- [ ] No inline CSS declarations, no inline `<script>`
- [ ] Uses `render`, never `include`
- [ ] Keyboard navigable + alt text + adequate contrast
- [ ] Has a `presets` entry with default blocks
- [ ] No edits to Shopify core or unrelated theme files
- [ ] Registered in [`../section-manifest.json`](../section-manifest.json) with `"owner": "custom"` (per CLAUDE.md)
