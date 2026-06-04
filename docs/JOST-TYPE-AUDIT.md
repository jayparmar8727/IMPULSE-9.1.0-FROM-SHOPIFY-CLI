# Jost Type Audit — Stock vs Custom (size consistency)

**Date:** 2026-06-04 · Goal: site-wide **Jost** size consistency between **stock** Impulse pages
(product, collection, normal pages) and the **custom `kw` sections** (home, about, footer).

> **The font is already consistent.** Stock sets **both** header and body to **Jost 400**
> (`type_header_font_family = type_base_font_family = jost_n4`), and custom `--d` is Jost too.
> Cormorant is **custom-only** (serif accent) and not part of this — so this audit is **size only**.

---

## A. STOCK Jost scale (computed from theme settings)

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

## B. CUSTOM Jost scale (`assets/kw-tokens.css` → `kw-typography.css`)

The `.t-*` classes default to a **fluid** Major-Third scale (`clamp()` that GROWS with viewport):

| Token | `.t-*` users | Renders (mobile → desktop) |
|-------|--------------|----------------------------|
| `--fs-xs` | `.t-eyebrow`, `.t-label`, `.t-link` | 11 → **12px** |
| `--fs-sm` | `.t-body-sm` | 13 → **14px** |
| `--fs-base` | **`.t-body`** | **16 → 18px** |
| `--fs-md` | `.t-body-lg` | 18 → **20px** |
| `--fs-lg` | `.t-heading-sm` | 22 → **25px** |
| `--fs-xl` | `.t-heading`, `.t-card-title` | 26 → **32px** |
| `--fs-2xl` | `.t-display-sm`, `.t-quote` | 32 → **40px** |
| `--fs-3xl` | `.t-display`, `.t-stat` | 40 → **56px** |
| `--fs-hero` | `.t-display-lg` | 48 → **96px** |

**BUT** most section *headings* and *body* are then overridden by **per-section px settings** in the
theme editor (e.g. `heading_size_desktop` 43/48, `body_size_desktop` 16). After this session's pass,
headings are fluid `clamp(mobileSetting → desktopSetting)`.

---

## C. Where stock and custom DIVERGE (the actual inconsistency)

| Role | Stock | Custom | Divergence |
|------|-------|--------|------------|
| **Body / description text** | **16px fixed** | `.t-body` = `--fs-base` = **16→18px fluid** *(unless a section sets `body_size_desktop:16`)* | ⚠️ On desktop, custom body can render **18px** vs stock **16px** — this is the "home description bigger than normal page" effect |
| Section heading (home) | H2 = 43px | default 43px | ✅ matches at desktop (mobile 30 vs 32 — close) |
| Section heading (about) | page title 48px | default 48px | ✅ matches |
| Body-small | 14px | `.t-body-sm` = 13→14px | ✅ ~matches at desktop |
| Labels / eyebrows | 13px accent | `.t-*` = 11→12px | slightly smaller (intentional kicker style) |
| Collection-grid card name | (product card 14px) | `.t-cc-card-name` 18/16px | ⚠️ custom-only mismatch (category vs product card) |

**Root cause of the inconsistency you're seeing:** custom uses a **fluid (`clamp`) scale that grows on
wider screens**, while stock is **fixed**. The most visible case is **body/description text** —
`.t-body` (`--fs-base`) hits **18px** on desktop while every stock page stays at **16px**.

---

## D. How to SEE / verify it yourself

1. Open the **preview**: https://kansawalasmf.myshopify.com?preview_theme_id=152479498414
2. Open a **stock page** (e.g. a product page, or a normal Page) and a **custom page** (home).
3. **DevTools → Inspect** a paragraph of body text on each → read **computed `font-size`**:
   - Stock body → **16px**
   - Custom `.t-body` paragraph on a wide screen → **~18px**
4. To watch the fluid growth: inspect a custom `.t-body` element and **drag the window wider** — its
   `font-size` climbs 16 → 18px; the stock one never moves.

---

## E. Consistency options — ✅ OPTION 1 APPLIED (2026-06-04)

**Done:** Option 1 was applied — `kw-tokens.css` `--fs-base/-sm/-xs/-md` now alias the stock
`--type*` vars (`0ebebab`), so custom body text = 16px fixed like stock and follows the single
"Body size" customizer setting. All product/category card names unified to 14px (`4d587a6`,
`cc16372`, `.t-card-name` fix). Headings stay per-section (already match stock). The options below
are kept for reference / future Option-2 work.

All are **custom-only** edits (no stock files touched — Golden Rule #3):

1. **Match stock exactly (recommended for consistency):** make the custom body token **fixed 16px**
   like stock — e.g. set `--fs-base: 16px` (or alias it to stock's `var(--typeBaseSize)`), and
   similarly pin `--fs-sm`/`--fs-xs` to stock's 14/13px. Removes the fluid growth so home description
   text = normal-page text everywhere. *One change in `kw-tokens.css`, applies site-wide.*
2. **Keep fluid but cap at 16px:** change `--fs-base` clamp max from `1.125rem` to `1rem` (16px) so it
   never exceeds stock. Same visual result for body, keeps the token structure.
3. **Per-role alignment:** leave the scale, but audit each section's `body_size_desktop` default to 16
   and switch any bare `.t-body` usages to a fixed 16px. More surgical, more files.
4. **Leave as-is:** accept the fluid scale as a deliberate "custom sections read slightly larger."

> My recommendation: **Option 1 or 2** for body text (`--fs-base`) — it's the one that produces the
> "description size on home = normal page" consistency you described, in a single token change.

---

## F. Also flagged (separate, custom-only)

- **Collections-grid card name** `.t-cc-card-name` = 18/16px vs product cards 14px. Bring to 14px to
  match, or keep as the category-card treatment — your call (tracked in `CUSTOM-CODE-AUDIT.md`).
