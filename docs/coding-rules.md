# Coding Rules — Liquid / CSS / JS

> Complements [`../CLAUDE.md`](../CLAUDE.md) (stock-vs-custom governance) with the low-level
> Liquid/CSS/JS style rules. Hard rules. CI (`theme-check`) enforces the ones it can; the rest
> are review gates.

---

## Liquid

1. **`render`, never `include`.** `include` is deprecated and leaks scope.
   ```liquid
   {%- render 'price', product: product -%}   {# correct #}
   {%- include 'price' -%}                     {# forbidden #}
   ```
2. **Whitespace control** — use `{%-` / `-%}` and `{{-` / `-}}` to avoid stray nodes
   that bloat the DOM and break CSS that relies on whitespace.
3. **Prefer the `liquid` tag** for multi-line logic blocks instead of stacking `{% %}`.
4. **Always default user-facing values:** `| default: '…'`.
5. **Guard every loop and lookup** for `blank` / `empty` before rendering wrappers.
6. **No business logic in snippets that mutate global state.** Snippets receive
   everything they need as explicit parameters.
7. **Translate all hardcoded strings** via `{{ 'namespace.key' | t }}` and add keys to
   `locales/en.default.json`. No raw English in markup.
8. **Never use `{{ content_for_index }}`** — incompatible with OS 2.0 JSON templates.

---

## CSS

1. **No inline declarations.** The only permitted `style` attribute usage is passing
   CSS custom properties derived from settings (design tokens).
2. **Section CSS lives in a `{% stylesheet %}` block** within the section, or in an
   existing Impulse asset — never a new render-blocking `<link>`.
3. **Mobile-first**: base styles target small screens; layer up with `min-width`
   media queries only.
4. **Scope by section** to prevent leakage. Prefix the root class
   (`.impulse-<section-name>`) and nest within it.
5. **Use logical properties** (`margin-inline`, `padding-block`) for RTL safety.
6. **Respect `prefers-reduced-motion`** — wrap non-essential transitions/animations.

---

## JavaScript

1. **Default to zero JS.** If a behavior can be done with CSS (`:target`, `details`,
   `:has`, scroll-snap), do it in CSS.
2. **If JS is required**, use a `{% javascript %}` block or extend Impulse's existing
   `theme.js` patterns. No new framework, no jQuery additions.
3. **No inline `<script>`** and no inline event handlers (`onclick=`).
4. **Scope to the section instance** using `section.id`; never query the whole document
   globally in a way that collides with other instances.
5. **Listen for Theme Editor events** so dynamic sections behave in the customizer:
   ```js
   document.addEventListener('shopify:section:load', (e) => { /* init e.detail.sectionId */ });
   document.addEventListener('shopify:section:unload', (e) => { /* teardown */ });
   ```
6. **Defer everything.** No render-blocking script. Initialise on
   `DOMContentLoaded` or via `IntersectionObserver` for below-the-fold work.

---

## Liquid → CSS token bridge (the approved pattern)

```liquid
<div
  class="impulse-banner"
  style="
    --pt: {{ section.settings.padding_top }}px;
    --pb: {{ section.settings.padding_bottom }}px;
    --cols: {{ section.settings.columns }};
  "
>…</div>

{% stylesheet %}
  .impulse-banner {
    padding-block: var(--pt) var(--pb);
  }
  @media (min-width: 750px) {
    .impulse-banner__grid {
      grid-template-columns: repeat(var(--cols), 1fr);
    }
  }
{% endstylesheet %}
```

This keeps declarations out of the DOM while still letting merchant settings drive layout.
