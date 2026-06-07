# Custom Code Audit — Kansawala (Impulse 9.1.0)

**Date:** 2026-06-04 · **Auditor:** Claude (Opus 4.8) · **Branch:** `main` (local; pushed to the
unpublished **Impulse** dev theme `#152479498414`, store `kansawalasmf`).

Scope: **the entire custom `kw` codebase** — 25 custom sections + the custom foundation files.
**No stock Impulse files were modified** (per CLAUDE.md Golden Rules). Method: each unit reviewed
through three skills — `refactoring-ui`, `web-typography`, `web-interface-guidelines` — plus
LCP/perf for image-heavy sections, with `shopify theme check` = **222 files / 0 offenses** after
every change.

---

## 1. What was audited

**25 custom sections** (source of truth: `section-manifest.json`, `owner: custom`):
- **Home (15):** hero-slider, marquee-strip, collections-grid, global-presence, bestsellers,
  brand-story, heritage-timeline, three-sacred-metals, ayurveda, b2b-trust, meaning-legacy,
  customer-reviews, craft-process, buy-back-promise, kw-newsletter.
- **Footer (1):** footer-kansawala.
- **About Us (9):** about-us-hero, mission-quote, trust-numbers, legacy-timeline, craft-operations,
  our-values, vision-mission, sihor-workshop, about-cta.

**Foundation files:** `snippets/kw-fonts.liquid`, `snippets/kw-schema-organization.liquid`,
`layout/theme.liquid` (head wiring only), `assets/kw-sections.js`, `assets/kw-tokens.css`,
`assets/kw-typography.css`.

---

## 2. What WAS changed (recurring fixes)

| # | Issue | Fix | Sections affected |
|---|-------|-----|-------------------|
| 1 | `hide_desktop` used `@media(min-width:768px)` while `hide_mobile` used 749 → toggle leaked at 750–767px | standardized to `min-width:750px` | most sections |
| 2 | Fixed-px headings snapped hard at a breakpoint (and were stuck at the mobile size across tablets) | one fluid `clamp()` formula¹ | nearly all sections |
| 3 | Dead `href="#"` fallback on CTA/card links | omit `href` when the URL setting is blank | collections-grid, hero-slider, brand-story, meaning-legacy, customer-reviews, buy-back-promise, about-cta, footer |
| 4 | Below-fold first image was `loading="eager" fetchpriority="high"`, competing with the hero LCP | lazy/auto | global-presence, three-sacred-metals |
| 5 | Multi-row grid `border-right … :last-child` left a stray right-edge divider | `:nth-child({cols}n), :last-child` | heritage-timeline, ayurveda, craft-process, craft-operations |
| 6 | Carousel/accordion a11y | dots `role="tablist"`→`group` + `aria-current` synced in JS; stars given visually-hidden text; footer accordion keyboard-toggle fixed | b2b-trust, three-sacred-metals, customer-reviews, footer |

¹ `clamp({mobile}px, calc({mobile}px + ({desktop} - {mobile}) * (100vw - 375px) / 649), {desktop}px)`

**Two genuine latent bugs caught & fixed:**
- **bestsellers** — secondary product image had a fade transition + `opacity:0` but **no hover rule
  ever revealed it**: broken swap + a wasted image request per card.
- **b2b-trust / three-sacred-metals** — slider dots never exposed the active slide to screen readers.

**Marquee wide-screen gap** (marquee-strip + footer strip) — rebuilt to render enough runs that one
half always exceeds a wide viewport, so the loop is gapless.

**Newsletter** — subtitle color was `#6b3c2394` (~2.9:1, **fails AA**) → solid `#6b3c23`, fixed in
**both** the schema default **and** the live `templates/index.json` value.

---

## 3. What was DELIBERATELY NOT changed — and the rule that says so

This is the important part: several things *look* like issues but were left alone on purpose,
each tied to a written rule or a recorded merchant decision.

| Not changed | Why | Source rule |
|-------------|-----|-------------|
| **All stock Impulse files** (sections, snippets, `theme.css`, templates we didn't author) | Stock is the trustworthy baseline for diffs/rollback; surgical custom-only edits | CLAUDE.md **Golden Rules #1–#3** ("Never overwrite a stock file"; manifest `owner` decides stock vs custom) |
| **Non-text brass `#bc843f` / `#d8ae82`** (borders, dividers, accent lines/dashes, button/CTA-hover, dots, all dark-bg accents) | Brass is the intentional brand decoration; non-text brass needs no AA, and brass/tan on dark already meets AA | `kw-section-conventions` memory. **UPDATE 2026-06-07:** ALL brass *text on light* + *rating stars* (incl. vision-mission header) reconciled to accessible amber `#9a6326` (AA) — see BRAND.md §8 / `assets/kw-tokens.css` `--Br-aa`. Only non-text decorative brass is unchanged. |
| **Autoplay pause buttons** (WCAG 2.2.2) on marquee + sliders | Hover/focus pause + `prefers-reduced-motion` are the agreed mitigation | Merchant decision (declined a visible pause button) |
| **vision-mission card colours** (Mission brass-label/cream-body; Vision dark-on-brass) | Settled after a revert round; the dark-on-brass deliberately fixes a cream-on-brass contrast fail | HANDOFF.md "Settled merchant decisions" |
| **Decorative step numbers** kept solid/visible (not faint watermark) | Faint `opacity:.3` was explicitly rejected | HANDOFF.md |
| **Both marquees use `#e5c2a0` text + `#bc843f` separator** (not canonical `#d8ae82`) | Merchant confirmed the lighter tan | HANDOFF.md |
| **meaning-legacy dead connector-dot CSS + schema controls** | Removing schema settings with saved values risks orphaning admin data | Caution on `settings`-bearing files (CLAUDE.md protected-files spirit) |
| **Cormorant `0,700` font weight** (likely unused) | Browsers don't download unused weights, so ~0 gain + real risk if a serif-bold exists | web-typography (no measurable benefit) |
| **`.theme-check.yml`** | Never touched; the `83/3350` reading was a shell-cwd artifact, not a config change | `theme-check-config` memory (config intentionally silences stock noise) |

---

## 4. Stock vs custom typography (the open font-size question)

**Fonts already match:** stock headers = **Jost 400** (`type_header_font_family: jost_n4`); custom
sections use the same Jost via `--d` + the `.t-*` classes. Stock base = **16px**.

**Card-name sizes differ _within custom code_** (not vs an editable stock file):

| Card | Class | Desktop | Mobile | Matches stock product card (~14px)? |
|------|-------|---------|--------|-------------------------------------|
| Bestsellers product card | `.bsl-card__name` | **14px** | 15px | ✅ matched intentionally (commit `98b1d6d`) |
| kw product card | `.t-card-name` | **14px** | 14px | ✅ |
| **Collections-grid category card** | `.t-cc-card-name` | **18px** | 16px | ❌ larger — different card *type* (collection vs product) |

→ **Decision needed (Section 6):** should the **collections-grid** category-card name (18/16px) be
brought down to the **14px** product-card size for consistency, or is the larger size intentional
(it labels metal *categories*, not products)? This is a one-line change in `kw-typography.css`
(`.t-cc-card-name`) — **custom only, no stock touched** — pending your confirmation.

---

## 5. Verification & delivery

- `shopify theme check` = **222 files / 0 offenses** after every change (run from repo root).
- All changes committed to local `main` (one commit per section/area) and **pushed** to the
  unpublished **Impulse** dev theme. Live storefront (*Shopflo · Impulse 7.5.1*) untouched.
- Preview: https://kansawalasmf.myshopify.com?preview_theme_id=152479498414

---

## 6. Open / optional (your call — none blocking)

- [ ] **Confirm the collections-grid card-name size** (Section 4): bring `.t-cc-card-name` to 14px
      to match product cards, or keep 18px as the category treatment.
- [ ] **Publish** the dev theme to live when satisfied.
- [ ] **`LocalBusiness` JSON-LD** upgrade (Sihor address/phone/geo) for richer SEO.
- [ ] **GitHub backup** — needs a remote URL (no git remote configured).
- [ ] Remaining surfaces are all **stock** (header, PDP, collection, cart) — outside the custom
      audit scope unless you want them done.
