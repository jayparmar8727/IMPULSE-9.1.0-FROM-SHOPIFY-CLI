# Design Audit — Kansawala 9.1.0

> Per-section typography + web-design + accessibility + Shopify/Liquid audit,
> run with the installed skills (`typography-audit`, `web-typography`,
> `frontend-design`, `ui-ux-designer`, `shopify-liquid`). Each finding has a
> resolution status. See [MIGRATION-LOG.md](MIGRATION-LOG.md), [BRAND.md](BRAND.md),
> [COMPONENTS.md](COMPONENTS.md).

## hero-slider — audited & fixed 2026-05-30

Three read-only audits (typography / design-UX-a11y / Shopify-Liquid) produced
the findings below. **Items 1–16 (Critical/High/Medium) are fixed**; LOW polish
items are noted for later.

### Fixed — Critical
1. **Autoplay pauses on hover & keyboard focus** so a slide can't advance while
   a user is reading or operating a control. (A visible pause button was added
   then removed per merchant preference — uncommon on marketing heroes. Note:
   this is a partial WCAG 2.2.2 mitigation rather than a discoverable control;
   merchants can also lower `autoplay_speed` or disable autoplay.)
   `assets/theme.js` (`HeroSlider`).
2. **Inactive slides hidden from AT/keyboard.** Non-active slides get
   `aria-hidden` + `inert` (set in markup and toggled in `goSlide()`), so screen
   readers and Tab skip off-screen slides.
3. **Paragraph contrast.** `.s-p` default raised to `#ffffffe6` (~90%) + a
   `text-shadow` for AA legibility independent of alignment/imagery.
4. **Merchant text escaped.** `| escape` on heading/heading_italic/eyebrow/tag/
   paragraph/badge/buttons — prevents broken markup / injection in the `<h1>`.
5. **Default-copy punctuation.** `" . "` → `·` (middot) in all eyebrows;
   `" - "` → `–` (en dash) in the brass/sets paragraphs; `"Sets &"` now safely
   escaped to `&amp;`.
6. **Faux font-weight.** `.t-stat` 100 → 200 (Jost Thin 100 isn't loaded).
   `assets/kw-typography.css`.

### Fixed — High
7. **Responsive images.** Slides switched from CSS `background-image` to a
   `<picture>` + `<img class="slide-bg">` with `srcset`/`sizes`, `object-fit:cover`,
   `loading="lazy"` (slides 2+), `fetchpriority="high"` (slide 1), explicit
   `width`/`height`. Replaces the all-eager non-responsive backgrounds and the
   manual preload.
8. **`max_blocks: 8`** added — caps slide count / eager fetches.
9. **Paragraph leading** `1.9` → `1.7`.

### Fixed — Medium
10. **Dot tap targets** → 24×24 hit area (WCAG 2.5.8) with a 6px visual dot via `::before`.
11. **Focus-visible** rings added for dots, arrows, pause, and both CTAs.
12. **ARIA pattern** corrected to the carousel model: section
    `aria-roledescription="carousel"`, slides `role="group" aria-roledescription="slide"`,
    dots are a labelled button group using `aria-current` (replaced the incomplete tablist).
13. **Alignment legibility** — paragraph `text-shadow` keeps contrast for
    center/right alignment over the lighter end of the gradient.
14. **`overlay_gradient` safety** — a safe default `background` is declared first,
    so an invalid merchant value can't break the inline `<style>`.
15. **Mobile density** — the category tag is hidden ≤749px (brand eyebrow +
    headline lead). The now-unused `tag_size_mobile` control was removed.
16. **Body letter-spacing** — `.t-body*` set to `normal` (don't track body text).

### Noted — Low / polish (not yet changed)
- Heading weight (300) is lighter than body (400) — intentional luxury aesthetic,
  mitigated by shadow + overlay.
- `display=swap` FOUT on the headline; could self-host Jost/Cormorant + preload woff2.
- Outline-button border (`#fee8d961`) can fade on busy images — consider ~60–70% alpha.
- Schema labels / ARIA strings are literal English (not `t:` keys) — fine for a single store.
- Reduced-motion is read once at load (no runtime `matchMedia` change listener).

### Verified clean
`node --check` on `theme.js`; schema valid JSON (68 section + 14 slide settings,
`max_blocks: 8`, no dup IDs); Liquid tags balanced; `shopify theme check` → no
errors (one inherent `RemoteAsset` **warning** on the optional external-URL
image fallback).

## marquee-strip — audited & fixed 2026-05-30

3-agent audit of the CSS-only scrolling tagline strip. **Fixed (the tiers you picked):**

### Fixed
- **Escape merchant text** — `{{ block.settings.text }}` + `{{ separator }}` now `| escape` (security/markup safety).
- **Reduced-motion clipping** *(real bug)* — under `prefers-reduced-motion` the track was `nowrap` +
  `overflow:hidden`, showing only the first 1–2 taglines. Now wraps (`white-space:normal; flex-wrap:wrap;
  justify-content:center`) and hides the duplicate copy + trailing separator (`.strip-dup`/`.strip-trail`).
- **Letter-spacing** — `.strip-item` overrides `.t-label`'s `.28em` → `.12em` for legibility on moving text.
- **Screen-reader access** — added a static `visually-hidden` `<ul>` of the taglines (trust claims like NABL /
  free shipping); `aria-hidden` moved from the wrapper onto the animated `.strip-track` only.
- **`max_blocks: 12`** — caps the (doubled) DOM for the seamless loop.
- **Punctuation** — default separator `|` → `·` (middot); preset `Eco-Friendly & Sustainable` → `and`.

### Noted — brand decision (resolved in MIGRATION-LOG Phase 17)
- **Contrast** — text `#d8ae82` on `#6b3c23` ≈ 3.3:1 (below AA 4.5:1 at 14/12px). **Resolved as a conscious
  brand decision:** the brand brass is kept, and `#d8ae82` is the readable "brass-on-dark" shade for exactly
  these dark-bg accents. See BRAND.md + MIGRATION-LOG Phase 17.
- No visible pause control added (consistent with the hero — merchant preference; reduced-motion + hover-pause remain).
- Optional polish deferred: editor anchor when `show_section=false`, mobile gap scaling, `will-change`.

### Verified clean
Schema valid (`max_blocks: 12`, no dup IDs); Liquid balanced; `shopify theme check` → **0 offenses**.

## collections-grid — audited & fixed 2026-05-30

3-agent audit of the static collection-card grid. **All four fix tiers applied (you picked everything):**

### Fixed
- **Escape** `eyebrow`/`heading`/`heading_italic`/`metal`/`name` + the external image `src`.
- **`max_blocks: 12`**; removed the no-op `| plus: 0` in the `sizes` calc.
- **LCP** — first-row images now `loading="eager"` + `fetchpriority="high"` (was all `lazy`).
- **Keyboard focus** — `.cc:focus-visible` ring (was none); card name underlines on hover (affordance).
- **Screen readers** — removed the card `aria-label` that overrode/suppressed the metal label; the visible
  `<h3>`+metal now name the link. Gated `aria-labelledby` so it never dangles when the heading is blank.
- **Editor empty-state** — `request.design_mode` hint when a section has no cards.
- **Typography** — `Ayurveda's` → `Ayurveda’s` (curly); aligned schema card defaults (`For Eating`/`Kansa Bronze`
  → `Eating`/`Kansa`) to the preset; `-webkit-line-clamp: 2 → 1` for short names.
- **Contrast (Phase 3 darkening — REVERTED in Phase 17)** — this pass tentatively darkened the metal label
  (`#d8ae82 → #8f5e2c`) + eyebrow (`#bc843f → #a05f1f`) for AA on cream. **Later reverted to the brand brass
  `#bc843f`** (merchant prefers it; stock Impulse uses it too). The metal label — near-invisible buff before —
  now renders in brass `#bc843f` (more legible than `#d8ae82`, accepted below-AA-small). `#8f5e2c` is gone.

### Verified clean
Schema valid (`max_blocks: 12`, no dup IDs); Liquid balanced (2 `liquid` tags, if/for balanced);
`shopify theme check` → only the inherent `RemoteAsset` **warning** on the optional external-URL fallback.

### Follow-up — mobile caption spacing (design rec, 2026-05-30)
On iPhone (2-col), the image→metal-label→name rhythm read too loose/ambiguous. Per a design-skill
consultation, scoped a `@media (max-width:749px)` override: `.cc-card` padding-top `14→10px` and
`.cc-card-eye` margin-bottom `10→4px` (≈2.5:1 ratio) so label+name group as one caption under the image.
Desktop unchanged.

## global-presence — audited & fixed 2026-05-30

3-agent audit of the two-column stats + triptych section. **All four fix tiers applied:**

### Fixed
- **Escape** all merchant text (eyebrow/heading/heading_italic/body, stat number/label, panel eyebrow/title/sub)
  + the `--tri-focal` focal point.
- **Stat-label overflow** — dropped `white-space:nowrap` on `.pstat-l` so long labels ("Countries Reached")
  wrap instead of clipping.
- **LCP** — first triptych panel `loading="eager"` + `fetchpriority="high"` (rest stay lazy); image base
  `width:1200 → 1600`.
- **Empty-state** — placeholder panel fills the right column when no `panel` blocks (was a blank brown
  rectangle); editor hint when no `stat` blocks.
- **Accessible name** — `<h2 id="gp-h-…">` + section `aria-labelledby` (fallback `aria-label`).
- **Contrast (brand change)** — eyebrow `#bc843f → #a05f1f` to pass AA on cream (consistent with Collections
  Grid). Stat number left on brand brass (large text); caption sub fine over the dark overlay.
- **Robustness** — `max_blocks:12` + stat `limit:8`; decorative `alt` (avoids the title being announced twice);
  removed the redundant `@media(max-width:1024px)` padding rule; aligned hide breakpoints to `769/768`.

### Not changed / reverted
- **Thin-space around `·`** — attempted, but the invisible-char insertion was fragile (dropped a space);
  reverted to standard `·` spacing, which is correct and readable. Negligible gain.

### New shared utility
- **Fade-up reveal** added to `assets/theme.js` — self-booting IIFE (`[data-kw-fade-up]` → `.js-kw-fadeup` on
  `<html>`, IntersectionObserver reveals `.fu`). No hidden-content trap (visible if JS/observer absent);
  reduced-motion snaps content in via the kw-tokens floor. Reused by ~7 later sections.

### Verified clean
`node --check` theme.js; schema valid (`max_blocks:12`, stat `limit:8`, scopes OK); Liquid balanced;
`shopify theme check` → **0 offenses** on the section + theme.js.

## trust-numbers — audited & fixed 2026-05-30

2-agent audit of the animated stat band. **All fix tiers applied:**

### Fixed
- **No-JS hidden-content trap (critical)** — `.fu { opacity:0 }` was ungated, so any JS failure hid the whole
  band. Now gated on `.js-kw-fadeup` (set by the count-up IIFE at boot) → visible without JS.
- **Escape** all merchant text (label/source/number/target/suffix) + the `data-target`/`data-suffix` attributes.
- **Count-up accessibility** — `role="region"` on the band; the animating numeral is `aria-hidden` with a
  `visually-hidden` static final value, so screen readers read the real figure (not "0+"/interim).
- **Number formatting** — `toLocaleString` grouping (e.g. **10,000+**) for interim + final + no-IO frames.
- **Count-up jitter** — `font-variant-numeric: tabular-nums` on `.tn`; numeral `overflow-wrap:normal`.
- **"0+" stick** — count threshold `0.5 → 0.2` so it starts as the band enters view.
- **Contrast** — label `#fee8d97a → #fee8d9d9` (~85%, clears AA at 9–10px) and dropped the source caption's
  extra `0.6` opacity (was ~1.7:1, near-invisible).
- **Robustness** — `max_blocks:4` (grid/divider math is 4-wired); removed the dead `container_width` control;
  editor empty-state.

### New shared utility
- **Count-up IIFE** in `assets/theme.js` (`[data-kw-trust-numbers]`): IO count-up + fade-up reveal,
  reduced-motion jumps to final, no-IntersectionObserver fallback. Sets `.js-kw-fadeup`.

### Verified clean
`node --check` theme.js; schema valid (`max_blocks:4`, no dead settings); Liquid balanced;
`shopify theme check` → **0 offenses** on the section + theme.js.

## heritage-timeline — audited & fixed 2026-05-30

1-agent audit of the era band (foundation-only; reuses the shared fade-up). No critical issues. **All fixes applied:**

### Fixed
- **No-JS hidden-content trap** — `.fu { opacity:0 }` was ungated; now gated on `.js-kw-fadeup` (set by the shared
  fade-up IIFE) → band visible without JS.
- **Escape** era / title / description + the `aria_label` attribute.
- **Stagger** — added reveal delays for eras 5–6 (was only 2–4 with `max_blocks:6`).
- **Empty-state** — editor hint when no era blocks.
- **Semantics** — era year `<div>` → `<p>`.

### Confirmed good
Contrast is light-on-brown and strong (title `#faf5ee` 8.4:1, desc `#fee8d9` 7.7:1; era `#d8ae82` ~4.5:1 but
always large); `divided_by:100.0` float math; schema valid (`max_blocks:6`, ranges OK, no dup IDs); `container_width`
used; `shopify_attributes` wired; reduced-motion via the global floor.

### Verified clean
Schema valid; Liquid balanced; `shopify theme check` → **0 offenses**.
