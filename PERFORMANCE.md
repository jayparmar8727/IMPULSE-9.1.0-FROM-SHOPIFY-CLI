# Performance — Kansawala (Impulse 9.1.0)

> Core Web Vitals targets + asset budget for the theme. Per-section image/LCP work is already done and logged in
> [DESIGN-AUDIT.md](DESIGN-AUDIT.md); this is the theme-level budget + checklist. **"Recommended changes" are
> proposals — not yet applied.**

## Core Web Vitals targets
| Metric | Target (good) | Main levers in this theme |
|---|---|---|
| **LCP** | < 2.5s | Hero slide-1 image (eager + `fetchpriority=high`), `theme.css` parse, fonts |
| **CLS** | < 0.1 | `width`/`height` on all `<img>`, fixed section heights, `font-display: swap` |
| **INP** | < 200ms | `defer`-ed JS, `is-land` islands, light IntersectionObserver handlers |

Measure on a **preview URL** (not the editor) with Lighthouse / PageSpeed Insights, mobile + desktop.

## What's already optimised ✅ (see DESIGN-AUDIT for per-section detail)
- **Images:** responsive `<img>` with `srcset`/`sizes`, `loading="lazy"`, `decoding="async"`, explicit
  `width`/`height`; **first tile eager + `fetchpriority="high"`** (hero, collections-grid, global-presence);
  `<picture>` art-direction + focal point where relevant. `max_blocks` caps eager fetches.
- **JS:** `theme.js` + `vendor-scripts-v11.js` both `defer`; `is-land` islands + import-map for selective hydration;
  our IIFEs (fade-up, count-up, HeroSlider) are small and IntersectionObserver-gated.
- **Fonts:** Cormorant Garamond via Google Fonts async `print`/`onload` swap + preconnect + `<noscript>`
  (`kw-fonts.liquid`), `display=swap` → no FOIT. Jost is served by the theme font picker (`jost_n4`), not
  by `kw-fonts.liquid`. (No Fahkwang — the picker is on Jost.)
- **Motion:** global `prefers-reduced-motion` floor (`kw-tokens.css`) collapses transitions.

## Asset budget
| Asset | Current | Note / cap |
|---|---|---|
| `theme.css` | ~759K | Stock Impulse, `preload: true`. Don't fork it; keep our additions tiny. |
| `kw-tokens.css` + `kw-typography.css` | ~15K (2 requests) | Mergeable into one request. |
| `theme.js` + `vendor-scripts-v11.js` | ~279K + ~126K | Stock + our additive IIFEs. Keep new JS in the shared file, IO-gated. |
| Web fonts | Jost (theme picker `jost_n4`) + Cormorant Garamond (upright 300/700 + italic 300/400 = 4 faces) | No Fahkwang. KW sections mainly use Cormorant 300 + 300-italic — the 700/400-italic faces are trimmable. |
| **LCP / eager images** | merchant-set | Keep eager/above-fold images **≤ ~150K**; pre-crop to the rendered ratio. |

## Optimisation checklist (priority order)
- [ ] **Trim font weights** to what's used (Jost 200/400; Cormorant 300 + 300-italic) — biggest easy win.
- [ ] **Self-host** Jost + Cormorant (woff2 in `assets/`, `@font-face`) **or** add `<link rel="preload" as="font">`
      for the 2–3 critical weights → removes the Google round-trip and the `RemoteAsset` warnings.
- [ ] **Merge** `kw-tokens.css` + `kw-typography.css` into one file (one request).
- [ ] **Tighten hero `sizes`** — it's `100vw`; for boxed/aligned layouts a more precise `sizes` avoids over-fetch.
- [ ] Keep above-the-fold (hero/first-row) images small; lazy-load everything below.
- [ ] Re-check LCP after placing the real homepage sections (the hero image is the likely LCP element).

## Per-section quick reference
- **hero-slider:** LCP image — eager + high priority + preloaded picture; 8s Ken-Burns is GPU `transform`.
- **collections-grid / global-presence:** first tile/panel eager + high priority; rest lazy.
- **marquee / trust-numbers / heritage-timeline:** no images; CSS animation / IO count-up, reduced-motion-safe.

## New-section authoring — Core Web Vitals rules
> This is the single home for performance rules (merged from the old framework `performance-rules.md`).
> Section *structure/schema/a11y* standards live in [`docs/section-standards.md`](docs/section-standards.md) §7.

- **LCP:** there is exactly one LCP element per page (usually the hero/first image). Mark it eager
  (`loading: 'eager'`, `fetchpriority: 'high'`) — expose via the `priority_image` checkbox
  ([`docs/schema-patterns.md`](docs/schema-patterns.md)). **Never `loading="lazy"` the LCP image** —
  it's the #1 cause of slow LCP on Shopify themes. Don't wrap it in a JS-dependent carousel that
  hides it until hydration.
- **Images:** always `image_url` + `image_tag` with tuned `widths`/`sizes`, explicit `width`/`height`
  (CLS), `placeholder_svg_tag` fallback; everything below the fold `loading="lazy"`.
- **JS budget ≈ 0 added per section.** No new vendor libraries — reuse Impulse's bundle. Defer all
  scripts; init below-the-fold work via `IntersectionObserver`; tear down on `shopify:section:unload`
  to avoid editor leaks.
- **CSS:** ship via `{% stylesheet %}` (Shopify concatenates it) — no new render-blocking `<link>`;
  gate animations behind `prefers-reduced-motion: no-preference`.
- **Liquid:** keep loops bounded (`max_blocks`, `products_to_show`); avoid N+1 metafield lookups in
  large loops (assign once outside); use whitespace-controlled tags to keep the DOM lean.
- **Before merge:** Lighthouse mobile shows no regression vs. the previous preview.

---

## Recommended changes (proposed — NOT applied; approve individually)
1. **Self-host or `preload` the 2–3 used webfont weights** (`kw-fonts.liquid` / new `assets/*.woff2`). *(Additive;
   also clears the `RemoteAsset`/`AssetPreload` lint on `kw-fonts.liquid`.)*
2. **Merge** `kw-tokens.css` + `kw-typography.css` → one `kw-foundation.css`; update the two `stylesheet_tag`s in
   `theme.liquid`. *(Small, additive.)*
3. **Trim** the Google Fonts weight list to what's actually used.
4. **Precise `sizes`** on the hero `<img>`.
None change the design; all are reversible.
