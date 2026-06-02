# Kansawala — Components & sections (9.1.0)

> Per-section spec + class map for the custom Kansawala sections ported into
> Impulse 9.1.0. For brand tokens/typography see [BRAND.md](BRAND.md); for port
> status see [MIGRATION-LOG.md](MIGRATION-LOG.md) and
> [section-manifest.json](section-manifest.json).

Classes with a local prefix (`s-h`, `est-yr`, …) set colour/size/spacing only;
the `.t-*` class sets the font. When fixing a typo, change **only the text**.

---

## Ported sections

### hero-slider — `sections/hero-slider.liquid`
Full-bleed hero carousel (Kansa / Brass / Copper / Sets slides). Fade between
slides, autoplay, optional dots + arrows, optional "Est." badge.

**Wiring**
- Root: `<section class="hero-slider hero-{{ section.id }}" data-section-type="hero-slider" data-section-id data-autoplay data-speed>`
- Engine: `theme.HeroSlider` in `assets/theme.js`, registered as `hero-slider`.
- Structural CSS: inline in the section, scoped to `.hero-{{ section.id }}`
  (`.slide`, `.slide-bg`, `.slide-overlay`, `.slide-content`, `.s-btns`,
  `.slider-dots`, `.s-arr-l/-r`, `.hero-est`). Dynamic colour/size rules are
  also inline (per-setting). Fonts come from `.t-*` + tokens.

**Class map**
- eyebrow — `s-eye t-eyebrow t-eyebrow--dash`
- tag — `s-tag t-label`
- heading — `s-h t-display` (first slide `<h1>`, rest `<h2>`; italic line is `<em>`)
- paragraph — `s-p t-body`
- primary button — `btn-k t-link`; outline button — `btn-o t-link`
- badge year — `est-yr t-stat-serif-upright`; badge label — `est-lb t-label`
- dots — `.dot` / `.dot.active`; arrows — `.s-arr .s-arr-l|.s-arr-r`

**Behaviour (theme.HeroSlider)**
- Fade via `.slide.active`; subtle `scale(1.04)→1` bg zoom on the active slide.
- Autoplay from `data-autoplay` + `data-speed` (seconds); paused under
  `prefers-reduced-motion`.
- Dots are an ARIA tablist with roving tabindex (←→↑↓ / Home / End).
- Prev/next arrows; 40px touch-swipe.
- Theme editor: `onBlockSelect` jumps to the selected slide (matched by
  `data-block-id`) and pauses; `onBlockDeselect` / `onDeselect` resume;
  `onUnload` clears the timer and listeners.

### marquee-strip — `sections/marquee-strip.liquid`
Brown strip of infinitely scrolling taglines (CSS `@keyframes` marquee — **no JS**). Pauses on hover,
honours `prefers-reduced-motion` (wraps to a static centred list).

**Wiring**
- Root `.kw-strip-{{ section.id }}`; animated row `.strip-track` (carries `aria-hidden="true"`).
- Items `.strip-item t-label` (uppercase Jost, `.12em` tracking override); separators `.strip-sep`.
- Seamless loop = blocks rendered twice; the duplicate copy + first trailing separator are
  `.strip-dup`/`.strip-trail` (hidden under reduced-motion). `@keyframes kw-strip-<uid>` is per-section.
- A `visually-hidden` `<ul>` of the taglines (not animated, not `aria-hidden`) gives screen readers the
  trust claims.

**Class map** — item: `strip-item t-label`; separator: `strip-sep` (no `.t-*`, coloured locally).

### collections-grid — `sections/collections-grid.liquid`
"Collections Grid Style 1" — header (eyebrow + display heading) over a responsive grid of collection cards
(image + metal eyebrow + name). Static, **no JS**; CSS hover-zoom (covered by the global reduced-motion floor).

**Wiring**
- Root `.colls-{{ section.id }}` → `.colls-inner` → `.coll-hdr` + `.coll-grid` (2-col mobile, `cols_desktop` ≥1024).
- Card = `<a class="cc">` wrapping `.cc-img-wrap > img` (responsive srcset/sizes; first row `eager`+`fetchpriority`)
  and `.cc-card` (metal eyebrow + name). Each card resolves image/link from a `collection` block setting with
  `image`/`image_url`/`link` overrides (nil-safe fallbacks).
- Keyboard focus ring on `.cc:focus-visible`; card name underlines on hover.

**Class map** — eyebrow: `t-eyebrow t-eyebrow--dash`; heading: `t-display` (+ `em`); card metal:
`cc-card-eye t-eyebrow t-eyebrow--dash t-cc-card-eye`; card name: `cc-card-name t-cc-card-name` (1-line clamp).

### global-presence — `sections/global-presence.liquid`
"Our Global Presence / From Sihor to the world's tables." Two-column: left = eyebrow + display heading +
body + a 2×2 **stats** grid; right = a 3-image **triptych** with captions. Two block types: `stat`, `panel`
(`panel` limited to 3). Static section; entrance fade-up via the shared JS.

**Wiring**
- Root `.gp2-{{ section.id }}` carries `data-kw-fade-up` → the shared **fade-up IIFE** in `assets/theme.js`
  (adds `.js-kw-fadeup` to `<html>`, reveals `.fu` elements on scroll; reduced-motion snaps them in).
- Left `.pres-l`: eyebrow, `h2.pres-h` (has `id`, referenced by the section's `aria-labelledby`), body,
  `.pres-stats` (each `.pstat` = `.pstat-n` numeral + `.pstat-l` label).
- Right `.pres-r > .tri-grid > .tri-panel`: responsive `image_tag` (`tri-img`, focal point via `--tri-focal`),
  bottom-fade `::after`, divider `::before`, caption `.tri-cap` (eye/title/sub). First panel eager-loads.
- Empty-state: placeholder panel when no `panel` blocks; editor hint when no `stat` blocks.

**Class map** — eyebrow `t-eyebrow t-eyebrow--dash`; heading `pres-h t-display` (+ `em`); body `pres-p t-body`;
stat numeral `pstat-n t-stat-serif-upright`; stat label `pstat-l t-label t-label-fit-m`; panel eyebrow
`tri-cap-eye t-eyebrow t-eyebrow--dash`; panel title `tri-cap-ttl t-card-title-serif-italic`; panel sub
`tri-cap-sub t-eyebrow t-eyebrow-fit`.

### trust-numbers — `sections/trust-numbers.liquid`
Full-bleed brown band of 4 **animated stat counters** (2-col mobile / 4-col desktop) with divider borders.
Numbers count up on scroll and the items fade up.

**Wiring**
- Root `.trust-{{ section.id }}` carries `data-kw-trust-numbers` + `role="region"` → the **count-up IIFE** in
  `assets/theme.js`. The IIFE sets `.js-kw-fadeup` on `<html>` (so `.fu` only hides with JS alive — no-JS safe),
  counts `.trust-num[data-target]` up (IO 0.2, `toLocaleString` grouping, `tabular-nums`), and reveals `.fu`.
- Each `.ti`: numeral `.tn` + label `.tl` + optional source `.ts`. When animating, the visible numeral is
  `aria-hidden` and a `visually-hidden` span carries the real final value for screen readers.
- `max_blocks: 4` (the grid + `:nth-child` divider math is hardwired to 4 / 2-col).

**Class map** — number `tn t-stat-serif-upright` (+ `trust-num` when animated); label `tl t-label t-label-stat`;
source `ts t-eyebrow`.

### heritage-timeline — `sections/heritage-timeline.liquid`
Full-bleed brown band — a 4-col (desktop) / 1-col (mobile) grid of **era** blocks (year + title + description),
each topped by a dot, revealing on scroll. Static; reuses the shared fade-up. `max_blocks: 6`.

**Wiring**
- Root `.htl-{{ section.id }}` carries `data-kw-fade-up` → shared fade-up IIFE (adds `.js-kw-fadeup` to `<html>`;
  the `.fu` reveal is gated on that flag → no-JS safe). Stagger delays for items 2–6.
- Each `.ht-item.fu`: dot (`::before`, `--shadow-ring`), `.ht-era` year, `.ht-title`, `.ht-desc`.
- Editor empty-state when no era blocks.

**Class map** — year `ht-era t-stat-serif-upright`; title `ht-title t-label`; description `ht-desc t-body-sm`.

### bestsellers — `sections/bestsellers.liquid`
Tabbed featured-products grid. `tab` blocks (label + `collection` + `product_count`) switch server-rendered product
panels. Self-booting **tabs IIFE** (`data-section-type="bestsellers"`) drives a real ARIA tablist; first panel is
`.is-active` so it works with no JS. Stock `product-grid-item` left untouched — the kw product card is reproduced
inline.

**Wiring** — root `.bsl-{{ section.id }}`; `.bsl-tabs[role=tablist]` > `.bsl-tab[role=tab][data-bsl-tab][data-block-id]`;
`.bsl-panel[role=tabpanel][data-bsl-panel]` > `.bsl-grid` > `.bsl-card`. First tab's first row eager+`fetchpriority`.
**Class map** — eyebrow `t-eyebrow t-eyebrow--dash`; heading `t-display`(+`em`); tab `t-label t-label-tab`; product
name `t-card-name`; ATC `t-card-cta`; empty `t-body`.

### brand-story — `sections/brand-story.liquid`
Two-column image + story (eyebrow, heading, body, pull-quote, body, pills, CTA) + optional "Est." badge. Static,
fade-up. Native `image_tag` (picker) / lazy `<img>` (external URL) — 9.0.0's `kw-image` snippet was reimplemented.

**Wiring** — root `.bst-{{ section.id }}` `data-kw-fade-up`; `.story-grid` > `.s-vis.fu` (image + badge) + `.s-text.fu`.
**Class map** — eyebrow `t-eyebrow--dash`; heading `t-display`(+`em`); body `t-body`; quote `t-body-serif`; pill
`t-label`; CTA `t-link`; badge year `t-stat-serif-upright` + label `t-label`.

### three-sacred-metals — `sections/three-sacred-metals.liquid`
3 metal cards (image + label + name + subtitle + description + 3 benefits + CTA). Desktop static 3-col; **mobile
scroll-snap slider** (dots + autoplay) via the self-booting `tsm` IIFE (mobile-only, reduced-motion-paused). Benefit
lines baked at `opacity:.75`. `metal_card` blocks.

**Wiring** — root `.tsm-{{ section.id }}` `data-section-type="three-sacred-metals"` `data-autoplay/-interval/-dots`;
`.tsm-grid` (scroll track) > `.tsm-card[data-tsm-slide][data-block-id]`; `.tsm-dot[data-tsm-dot]`.
**Class map** — eyebrow `t-eyebrow--dash`; heading `t-display`(+`em`); label `t-label`; name `t-card-title`(+`em`);
desc `t-body-sm`; benefits `t-label-tight`; CTA `t-link t-link-spacious`.

### ayurveda — `sections/ayurveda.liquid`
4 `benefit` cards (tag/number + title + description) in a column-divided grid with a top border. Static, fade-up.
Preserves 9.0.0's 900/749 breakpoints (4→2→1 col).

**Wiring** — root `.ayv-{{ section.id }}` `data-kw-fade-up`; `.ayur-grid` > `.ag.fu`.
**Class map** — eyebrow `t-eyebrow t-eyebrow--dash`; heading `t-display`(+`em`); tag `t-label`; title `t-label`;
description `t-body-sm`.

### b2b-trust — `sections/b2b-trust.liquid`
Three parts: client-logo **CSS marquee** (`client` blocks, sr-only real list, reduced-motion-safe) + **testimonial
slider** (`testimonial` blocks; self-booting `b2b` IIFE: dots/autoplay/swipe, mobile-only) + a 4-stat brown band.

**Wiring** — root `.b2b-{{ section.id }}` `data-section-type="b2b-trust"` `data-autoplay/-interval/-dots`;
`.b2b-strip`/`.b2b-strip-track` (CSS marquee, JS never touches); `.b2b-grid` > `.b2b-card[data-b2b-slide][data-block-id]`;
`.b2b-dot[data-b2b-dot]`; `.b2b-band`.
**Class map** — eyebrow `t-eyebrow--dash`; heading `t-display`(+`em`); sub `t-body-sm`; client name
`t-card-title-serif-italic`; card title `t-card-title`; stars `t-stars`; band/stat numerals `t-stat-serif-upright`.

### meaning-legacy — `sections/meaning-legacy.liquid`
4 `step` gift cards (image + label + title + description + CTA) on a stepper/spine. Static, fade-up. Native
`image_tag` + focal point (`--focal` → `object-position`).

**Wiring** — root `.mlg-{{ section.id }}` `data-kw-fade-up`; each `.mlg-step.fu` (image, `mlg-num`, label, title,
desc, link).
**Class map** — eyebrow `t-eyebrow--dash`; heading `t-display`(+`em`); step number `t-stat-serif-upright`; label
`t-label`; title `t-heading`; description `t-body-sm`; link `t-link`.

### customer-reviews — `sections/customer-reviews.liquid`
Wraps the **Judge.me `@app` block** with a rating badge + heading + CTA. Schema `blocks: [{ "type": "@app" }]`;
markup iterates `section.blocks` and renders `block.type == '@app'` via `{% render block %}`. Empty-state when no app
block. No custom JS (Judge.me self-renders).

**Wiring** — root `.crv-{{ section.id }}`; `.crv-app` wraps the rendered app block.
**Class map** — eyebrow `t-eyebrow--dash`; heading `t-display`(+`em`); score `t-stat-serif-upright`; stars `t-stars`;
count `t-eyebrow`; empty `t-body-serif`; CTA `t-link`.

### craft-process — `sections/craft-process.liquid`
Full-bleed **brown** band; 4 `step` blocks (big **faded** step number + title + description). Static, fade-up. Step
number baked at `opacity:.3`. Faithful full-bleed spacing (88 / `padding_x` 0).

**Wiring** — root `.cpr-{{ section.id }}` `data-kw-fade-up`; `.cpr-steps` > `.cpr-step.fu` (`cpr-num`, `cpr-title`,
`cpr-desc`).
**Class map** — eyebrow `t-eyebrow--dash`; heading `t-display`(+`em`); subtitle `t-body`; step number
`t-stat-serif-upright`; title `t-label`; description `t-body-sm`.

### buy-back-promise — `sections/buy-back-promise.liquid`
Two-column: left cream price-proof frame (eyebrow + heading + sub + 3 proof rows + metal note); right **brown**
promise (heading + 2 paragraphs + 3 pillars + outline button). **Settings-only** (no blocks). `promise_h` is an
`inline_richtext` (intentional `<em>`) — left un-escaped with a scoped `em` rule; everything else escaped.

**Wiring** — root `.bbp-{{ section.id }}` `data-kw-fade-up`; `.bbp-l.fu` (proof frame) + `.bbp-r.fu` (promise).
**Class map** — eyebrow `t-eyebrow--dash`; heading `t-display`; sub `t-body`; proof price `t-stat-serif-upright`;
detail `t-body-sm`; pillar number `t-stat-serif-upright`; pillar label `t-label`; button `t-link`.

### kw-newsletter — `sections/kw-newsletter.liquid`
Eyebrow + heading + subtext + a real Shopify email signup. Uses `{% form 'customer' %}` (hidden `contact[tags]` =
`newsletter`, `posted_successfully?` success via `role="status"`, `default_errors`), optional consent checkbox. No
custom JS.

**Wiring** — root `.nws-{{ section.id }}`; `.nws-form` wraps the `{% form 'customer' %}` input + button.
**Class map** — eyebrow `t-eyebrow t-eyebrow--dash`; heading `t-display`(+`em`); subtext `t-body`; input/button styled
locally (`.nws-*`).
