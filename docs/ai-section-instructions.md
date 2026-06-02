# AI Section Generation Instructions (Impulse 9.1.0 / OS 2.0)

> The section-generation spec for any AI tool (Claude, Cursor, Copilot, etc.) building sections
> in this repo. **Governance precedence:** [`../CLAUDE.md`](../CLAUDE.md) is the single rules file
> for this repository (stock-vs-custom, naming, manifest, protected files) — this doc is the
> *how-to-author* spec it relies on. This repo intentionally has **no** `.cursorrules`,
> `copilot-instructions.md`, or second `claude.md`; do not add competing rule files.

## Context

- Theme: **Impulse 9.1.0** (Shopify Vintage theme, OS 2.0 compatible).
- It is **not** Dawn. Do not generate Dawn component CSS, `assets/component-*.css`
  links, or `<script type="module">` web-component patterns. Match Impulse's existing
  asset pipeline (`theme.js`, `theme.scss.liquid`, section `{% stylesheet %}` blocks).
- Storefront functionality must not change. Only add/modify the section being requested.

## Non-negotiable rules for every generated section

1. OS 2.0 compatible; appears in the Theme Editor; has a `presets` entry.
2. `render`, never `include`.
3. No inline CSS declarations. The **only** allowed `style=""` usage is passing CSS
   custom properties (design tokens) computed from settings. All declarations live in a
   `{% stylesheet %}` block.
4. No inline `<script>` and no inline event handlers. Prefer **zero JS**. If JS is
   unavoidable, use a `{% javascript %}` block scoped by `section.id` and wired to
   `shopify:section:load` / `:unload`.
5. Mobile-first responsive CSS (base = mobile, `min-width` queries to scale up).
6. Responsive images via `image_url` + `image_tag` with `widths`, `sizes`, `alt`.
   - LCP/first image: `loading: 'eager'`, `fetchpriority: 'high'`.
   - All others: `loading: 'lazy'`.
   - Explicit dimensions to prevent CLS; `placeholder_svg_tag` fallback.
7. Repeatable content = **blocks**, reorderable, each emitting `{{ block.shopify_attributes }}`.
8. Dynamic sources: author text/image/url/product/collection settings so merchants can
   bind metafields. Guard every metafield read for `blank`.
9. Accessibility (WCAG 2.1 AA): semantic headings, keyboard focus, alt text, ≥4.5:1
   contrast, reduced-motion guards, accessible names on icon buttons.
10. All user-facing strings translated with `| t` and added to `locales/en.default.json`
    (and kept in sync across all `locales/*.json` per CLAUDE.md).
11. Must pass `theme-check` with zero errors (see `.theme-check.yml`).
12. Support section groups / `@app` blocks where applicable.
13. No edits to Shopify core objects or unrelated theme files (forward-migration safe).

## Required output shape

Generate a complete `sections/<kebab-name>.liquid` containing, in order:
Liquid logic → semantic markup → `{% stylesheet %}` → optional `{% javascript %}` →
`{% schema %}` (settings, blocks, `presets`). Delegate block markup to a snippet via
`render` when blocks are non-trivial. Name + register the file per
[`../CLAUDE.md`](../CLAUDE.md) (use a `kw-`/`custom-` prefix; add to `section-manifest.json`
with `"owner": "custom"`).

## Reuse, don't reinvent

Pull setting groups verbatim from [`schema-patterns.md`](schema-patterns.md) (spacing, color,
typography, image, video, product, collection, button, layout). Keep setting IDs stable across
sections.

## Before writing, confirm

- Section purpose and target template/page.
- Which content is repeatable (→ blocks) vs. single (→ settings).
- Which element is the LCP candidate.

## Self-check before returning code

Run through the Definition of Done in [`section-standards.md`](section-standards.md) §8 and the
Performance rules in [`section-standards.md`](section-standards.md) §7. State explicitly which items
pass and flag anything that needs the merchant's input (e.g. metafield namespace, image dimensions).

## Reference

Official Shopify theme docs first: https://shopify.dev/docs (themes → architecture, Liquid
reference, section schema, dynamic sources, theme-check). Third-party sources only as a fallback,
flagged as such — see the "Research / sources" rule in [`../CLAUDE.md`](../CLAUDE.md).
