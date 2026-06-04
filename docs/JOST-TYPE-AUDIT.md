# Jost Type Audit — Stock vs Custom (size consistency)

**Date:** 2026-06-04 · **Re-audit v2** (after the consistency pass) · Goal: site-wide **Jost** size
consistency between **stock** Impulse pages (product, collection, normal pages) and the **custom `kw`
sections** (home, about, footer).

> **The font was already consistent.** Stock sets **both** header and body to **Jost 400**
> (`type_header_font_family = type_base_font_family = jost_n4`), and custom `--d` is Jost too.
> Cormorant is **custom-only** (serif accent) and out of scope — so this audit is **size only**.

> **v2 status: the size mismatch is now FIXED.** The body/label tokens are pinned to the stock Jost
> scale and all card names are unified to 14px. Verified against the working tree at commit `75d6ffa`.
> Details per section below; what changed since v1 is summarised in §E.

---

## A. STOCK Jost scale (computed from theme settings) — unchanged

Driven by 2 settings → `type_header_base_size: 50`, `type_base_size: 16` (line-height: headers 1.1,
body 1.4). Formulas live in `snippets/css-variables.liquid`:

| Role | CSS var | Desktop | Mobile |
|------|---------|---------|--------|
| Hero H1 | `--typeH1SizeHero` | **73px** | — |
| H1 / page title | `--typeH1Size` | **50px** | 38px |
| H2 | `--typeH2Size` | **43px** | 32px |
| H3 | `--typeH3Size` | **33px** | 26px |
| **Body / description** | `--typeBodySize` | **16px** | 15px |
| Body small | `--typeBodySmallSize` | **14px** | 14px |
| Accent / label small | `--typeAccentSmallSize` | **13px** | 13px |
| Body x-small | `--typeBodyExtraSmallSize` | **12px** | 12px |
| Hero subtitle | `--typeHeroSubtitleSize` | **18px** | — |
| Enlarged text | `--typeHeroTextSize` | **21px** | — |
| Product card title | ≈ base − 2 | **14px** | — |
| Collection title | `--typeCollectionTitle` | **15px** | 12px |

Stock sizes are **fixed px** (with a couple of simple mobile reductions).

---

## B. CUSTOM Jost scale (`assets/kw-tokens.css` → `kw-typography.css`) — NOW PINNED

The **body-range** tokens are now aliased to the stock `--type*` vars (one customizer lever, like stock).
Only the **heading-range** tokens (lg→hero) stay fluid — and those are almost always overridden by a
section's own px size setting before they render.

| Token | Definition | Renders | `.t-*` users |
|-------|-----------|---------|--------------|
| `--fs-xs` | `var(--typeBodyExtraSmallSize, 12px)` | **12px fixed** | `.t-eyebrow`, `.t-label`, `.t-link` |
| `--fs-sm` | `var(--typeBodySmallSize, 14px)` | **14px fixed** | `.t-body-sm` |
| `--fs-base` | `var(--typeBodySize, 16px)` | **16px fixed** | **`.t-body`** |
| `--fs-md` | `var(--typeHeroSubtitleSize, 18px)` | **18px fixed** | `.t-body-lg` |
| `--fs-lg` | `clamp(…)` | 22 → 25px fluid | `.t-heading-sm` |
| `--fs-xl` | `clamp(…)` | 26 → 32px fluid | `.t-heading`, `.t-card-title` |
| `--fs-2xl` | `clamp(…)` | 32 → 40px fluid | `.t-display-sm`, `.t-quote` |
| `--fs-3xl` | `clamp(…)` | 40 → 56px fluid | `.t-display`, `.t-stat` |
| `--fs-hero` | `clamp(…)` | 48 → 96px fluid | `.t-display-lg` |

**Card names** are hardcoded in `kw-typography.css` (no token): `.t-card-name` = **14px**,
`.t-cc-card-name` = **14px**, `.t-card-cta` = 16/14px. Section headings/body still take **per-section px
settings** from the theme editor (e.g. `heading_size_desktop` 43/48, `body_size_desktop` 16), rendering
as `clamp(mobileSetting → desktopSetting)`.

---

## C. Stock vs custom — alignment status (post-fix)

| Role | Stock | Custom | Status |
|------|-------|--------|--------|
| **Body / description text** | 16px fixed | `.t-body` = `--fs-base` = **16px fixed** | ✅ **RESOLVED** (`0ebebab`) — was 16→18 fluid; the "home description bigger than normal page" effect is gone |
| Body-large | 18px (hero subtitle) | `.t-body-lg` = `--fs-md` = **18px** | ✅ matches |
| Body-small | 14px | `.t-body-sm` = `--fs-sm` = **14px** | ✅ matches |
| Labels / eyebrows | 13px accent | `.t-*` = `--fs-xs` = **12px** | ◐ 1px smaller — pinned to stock x-small (12), intentional kicker; bump token to `--typeAccentSmallSize` (13) if exact match wanted |
| **Product card name** | 14px | `.t-card-name` = **14px** | ✅ **RESOLVED** (`4d587a6`) |
| **Collection-grid card name** | (product card 14px) | `.t-cc-card-name` = **14px** | ✅ **RESOLVED** (`cc16372`, `75d6ffa`) — was 18/16 |
| Section heading (home) | H2 = 43px | default 43px | ✅ matches desktop (mobile 30 vs 32 — close) |
| Section heading (about) | page title 48px | default 48px | ✅ matches |
| Heading tokens `lg`→`hero` (bare) | — | still fluid clamp | ⚠️ **residual** — only renders if a section uses a bare `.t-heading`/`.t-display` with **no** px size setting; those few cases still grow on wide screens |

**Net:** the visible inconsistency (custom body/description reading larger than stock pages) is **fixed** —
custom body now renders **16px fixed**, identical to stock, and is driven by the same single "Body size"
setting. The only remaining fluid surface is the bare heading tokens, which sections normally override.

---

## D. How to VERIFY (post-fix)

1. Open the **preview**: https://kansawalasmf.myshopify.com?preview_theme_id=152479498414
2. Open a **stock page** (product / normal Page) and a **custom page** (home).
3. **DevTools → Inspect** a body paragraph on each → computed `font-size` should now read **16px on both**.
4. **Drag the window wider** on a custom `.t-body` element — its `font-size` should **stay at 16px** (no
   fluid growth). If it climbs, the `--fs-base` pin regressed.
5. Inspect a product card name (stock) and a collections-grid card name (custom) → both **14px**.

---

## E. What changed since v1 (the consistency pass)

All edits are **custom-only** (no stock files touched — Golden Rule #3):

- **`0ebebab`** — pinned `--fs-base/-sm/-xs/-md` in `kw-tokens.css` to the stock `--type*` vars, so
  custom body/label text = stock sizes (fixed) and follows the single "Body size" customizer setting.
  *This is "Option 1" from v1 of this audit.*
- **`4d587a6`** — bestsellers product-card title unified to 14px (was 15px on mobile).
- **`cc16372`** — collections-grid card name 18px → 14px to match product cards.
- **`75d6ffa`** — last card-name unified to 14px (`.t-card-name` / `.t-cc-card-name` both 14px).

**Remaining options (optional, not yet done):**
1. **Exact label match:** repoint `--fs-xs` from `--typeBodyExtraSmallSize` (12px) to
   `--typeAccentSmallSize` (13px) if eyebrows/labels should match stock's 13px exactly.
2. **Pin bare heading tokens:** if any bare `.t-heading`/`.t-display` (no per-section px) should also
   stop growing on wide screens, alias those tokens to fixed px too — otherwise leave fluid by design.

---

## F. Residual / tracked elsewhere

- Bare heading tokens (`--fs-lg`→`--fs-hero`) remain fluid by design; see §C residual row and §E option 2.
- Broader custom-section scope tracked in `CUSTOM-CODE-AUDIT.md`.
