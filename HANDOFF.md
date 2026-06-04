# HANDOFF — 3-lens section audit pass (a11y / typography / responsive)

**Date:** 2026-06-04 · **Branch:** `main` · **Status:** committed locally **and pushed to the
unpublished "Impulse" dev theme** (`#152479498414`, store `kansawalasmf`). **Not** on GitHub
(no git remote configured).

Human-readable paper trail. Auto-loaded context lives in the Claude project `MEMORY.md`
(`home-section-audit-pass.md`); this file does not auto-load.

---

## What this session did

Audited **every custom section on the Home page + the footer** through three skills —
`refactoring-ui`, `web-typography`, `web-interface-guidelines` (plus LCP/perf for image-heavy
sections) — then applied + committed targeted fixes (one commit per section, `shopify theme
check` = 0 offenses on each). Then pushed the whole theme to the **Impulse** dev theme with
`scripts/theme-push.ps1` (`--nodelete`). An **About Us page** pass is underway next.

## Recurring issues found + fixed across the board

1. **`hide_desktop` breakpoint leak** — many sections used `@media (min-width: 768px)` while
   `hide_mobile` (and every other switch) used 749/750, so the "Hide on desktop" toggle leaked
   at **750–767px**. → standardized to `min-width: 750px`.
2. **Fixed-px headings snapping at a breakpoint** → replaced with one fluid `clamp()` formula
   (passes through the merchant's mobile px at 375vw and desktop px at 1024vw):
   ```
   clamp({mobile}px, calc({mobile}px + ({desktop} - {mobile}) * (100vw - 375px) / 649), {desktop}px)
   ```
3. **Dead `href="#"` fallbacks** on CTA/card links → omit `href` when the URL setting is blank
   (so it's not a focusable link to nowhere; whole-card links were the worst case).
4. **Below-fold images stealing the hero LCP** — sections far down the page had their first
   image `loading="eager" fetchpriority="high"`. → lazy/auto (only the hero slide is eager+high).
5. **Multi-row grid divider leaks** — `border-right:1px … :last-child` left a stray right-edge
   divider when items exceeded one row → keyed dividers off `:nth-child({cols}n), :last-child`.
6. **Slider/carousel a11y** — dots used `role="tablist"` with plain buttons and never exposed
   `aria-current`; stars were `aria-hidden` with no text alternative. → `role="group"`,
   `aria-current` synced in JS, visually-hidden rating text.

### Two genuine latent bugs caught
- **Bestsellers** secondary product image had a fade transition + `opacity:0` but **no hover
  rule ever revealed it** — broken swap + a wasted image request per card. Added the hover reveal.
- **b2b-trust / three-sacred-metals** dots never told screen readers which slide was active.

## Commit series (home + footer)

`19fcddb` collections-grid · `6fdfed1` marquee-strip · `c549baa` newsletter (+live `index.json`
AA contrast) · `29be099` b2b-trust · `2706f6e` hero-slider · `d8e9baa` global-presence ·
`9c87ecf` bestsellers · `ab36473` brand-story · `de38920` heritage-timeline ·
`2903489` three-sacred-metals · `e35a0dc` ayurveda · `c88dd96` meaning-legacy ·
`6ede218` craft-process · `35a358e` customer-reviews · `680b425` buy-back-promise ·
`2071454` footer-kansawala.

## Flagged but deliberately NOT changed

- **Brass (`#bc843f` / `#d8ae82`) small text on light bg ~3:1** — fails AA but is the
  intentional brand accent (`DO NOT change brass`). Surfaced per-section, not altered.
- **Autoplay pause button (WCAG 2.2.2)** — merchant chose **hover/focus pause only**; no
  visible pause button added (consistent across marquee + sliders).
- **Dead-code cleanups** that touch saved schema settings (e.g. meaning-legacy connector-dot
  controls) — left for a separate decision to avoid orphaning admin values.

## Dark-section color reference (unchanged this pass)

- Background brown `#6b3c23` · darkest brown `#2a1508`
- Heading `#faf5ee` · body `#fee8d9` · canonical brass accent `#d8ae82`
- Marquee text `#e5c2a0` · solid brass separator `#bc843f`

## Settled merchant decisions (don't re-litigate)

- **Vision & Mission uses a colored treatment** — Mission card brass `#d8ae82` label / white
  title / cream body; Vision (brass `#bc843f`) card dark `#2a1508` label+body / white title.
  The dark text on the Vision card is deliberate (fixes the cream-on-brass ~2.7:1 failure).
- **Decorative step numbers should be visible**, not a faint watermark (solid `#d8ae82`).
- **Both marquees use `#e5c2a0` text + `#bc843f` separator** (not `#d8ae82`) — confirmed.
- **Photo heroes use cream (`#faf5ee` / `#fee8d9`), never pure white.**

## Open items / next steps

- [ ] **Preview** the Impulse dev theme: https://kansawalasmf.myshopify.com?preview_theme_id=152479498414
- [ ] Decide whether to **publish** (live theme is the separate Shopflo/Impulse 7.5.1 theme).
- [ ] **About Us page** audit pass (in progress this session) — see commits after `2071454`.
- [ ] Remaining surfaces: header, PDP / collection / cart templates.
- [ ] Optional GitHub backup — needs a remote URL.
