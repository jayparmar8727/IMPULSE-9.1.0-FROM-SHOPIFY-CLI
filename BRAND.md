# Kansawala — Brand tokens & typography (9.1.0)

> Source of truth for the custom design system layered on Impulse 9.1.0.
> Tokens live in [assets/kw-tokens.css](assets/kw-tokens.css); the `.t-*`
> typography utilities in [assets/kw-typography.css](assets/kw-typography.css);
> fonts in [snippets/kw-fonts.liquid](snippets/kw-fonts.liquid). All additive —
> the stock Impulse site keeps its Fahkwang/`--type*`/`--color*` system.

## 1. Palette
| Token | Hex | Role |
|---|---|---|
| `--W`  | `#FFFFFF` | white |
| `--C`  | `#FEE8D9` | cream (light text on dark) |
| `--Bu` | `#D8AE82` | brass on **dark** bg — lighter brass shade, keeps gold accents readable on dark sections |
| `--Br` | `#BC843F` | brass — **non-text** decoration only (borders, dividers, accent lines/dashes, dots, button/CTA-hover); stock Sale/Save/cart |
| `--Br-aa` | `#9A6326` | accessible brass — brass as **readable text** on light bg (eyebrows, heading-italics, labels, names, prices, stat numerals, links) **and rating stars**. AA ≈5:1 |
| `--K`  | `#6B3C23` | kansa brown (primary button bg) |
| `--Dk` | `#2A1508` | dark brown (overlays) |
| `--off`| `#FAF5EE` | off-white surface |
| `--err`| `#B0413E` | error |

## 2. Fonts
Cormorant Garamond is loaded from Google Fonts via `snippets/kw-fonts.liquid`; Jost is **not** —
it comes from the theme font picker, which on our dev/preview theme is set to `jost_n4` (Jost).

- **`--d` → Jost** — display sans. Headings, eyebrows, labels, buttons.
  NOT loaded by `kw-fonts.liquid` — Jost comes from the theme font picker (`jost_n4`).
  Weight 400 is guaranteed; 200 is used by `.t-stat`; Jost Thin 100 is NOT available.
- **`--s` → Cormorant Garamond** — serif. Italic accent lines inside display
  headings, stat/year numerals. Loaded weights: upright 300 + 700, italic 300 + 400.

## 3. Fluid type scale (Major Third, 1.25×)
`--fs-xs` · `--fs-sm` · `--fs-base` · `--fs-md` · `--fs-lg` · `--fs-xl` ·
`--fs-2xl` · `--fs-3xl` · `--fs-hero`. Each is a `clamp()` so type scales
mobile→desktop without breakpoint CSS. Change the token to resize everywhere.

## 4. Tracking, line-height, weights
- Tracking: `--ls-label:.28em` `--ls-eye:.38em` `--ls-hd:-.01em` `--ls-body:.015em`
- Line-height: `--lh-tight:1.1` `--lh-snug:1.25` `--lh-base:1.7` `--lh-loose:1.9`
- Weights: `--fw-thin:100` `--fw-light:300` `--fw-regular:400` `--fw-medium:500` `--fw-bold:700`
- Icon glyph sizes: `--icon-sm:14` `--icon-md:18` `--icon-lg:24`

## 5. Motion
Semantic durations, not a linear scale. `--dur-snap` (220ms) powers the
hero-slider nav transitions. All motion tokens collapse to `0.01ms` under
`prefers-reduced-motion: reduce`, and the section JS skips autoplay intervals
under the same query.

## 6. `.t-*` typography utilities
Set font only (family/size/weight/spacing/transform); colour stays section-local.

| Class | Use |
|---|---|
| `.t-eyebrow` (+ `.t-eyebrow--dash`) | tiny uppercase kicker, optional leading dash |
| `.t-display` (+ `em`) | main section title; `em` renders as Cormorant italic block |
| `.t-display-lg` / `.t-display-sm` | larger / smaller display |
| `.t-heading` / `.t-heading-sm` | secondary / tertiary headings |
| `.t-label` | metal/category pills, button labels |
| `.t-body` / `.t-body-lg` / `.t-body-sm` / `.t-body-serif` | body copy |
| `.t-link` | CTA links (hover widens the gap) |
| `.t-stat` / `.t-stat-serif-upright` | big numerals / year/step numbers |
| `.t-card-*`, `.t-cc-card-*`, `.t-quote` | card + quote variants (for later sections) |

## 7. Header spacing convention
Eyebrow → heading → optional italic `em` → optional body. Keep the eyebrow at
`margin-bottom: 14px`; never add `margin-top` to `.t-display em` (it already
has `display:block`). Heading→body gap varies 12–32px per section but stays
consistent within a file.

## 8. Accessibility & stock-coupling notes
- **Brass as readable text on light backgrounds — and rating stars — use the accessible amber `--Br-aa`
  (`#9A6326`, AA ≈5:1)**: eyebrows, heading-italics, labels, metal/card names, prices, stat numerals, links,
  star glyphs/fills. Plain `--Br` (`#BC843F`, ≈3:1) is **retained for non-text decoration only** (borders,
  dividers, accent lines/dashes, connector dots, button/CTA-hover states), plus stock Impulse's own Sale tags /
  Save price / cart lines. Dark-bg sections (hero, marquee, heritage, craft) keep the lighter brass
  (`#D8AE82` / `#E5C2A0`) — brass/tan on dark already meets AA, so it is unchanged. _(Reconciled 2026-06-07
  with the thecolorpalettestudio.com palette audit; the earlier "brass text on light is a conscious sub-AA
  choice" rule is fully superseded — vision-mission header included.)_
- **`.rte h4–h6` is the one place the KW layer reaches into Impulse internals.** It styles merchant rich-text
  sub-headings via Impulse's own `--typeHeaderPrimary / --typeHeaderFallback / --typeHeaderWeight /
  --typeHeaderSpacing / --typeHeaderLineHeight / --typeH3Size / --typeH3SizeMobile / --typeBaseSize` vars.
  If a future Impulse upgrade renames or drops those `--type*` vars, re-check `assets/kw-typography.css`.
- **`layout/theme.liquid` is modified (+5 lines)** — the `<head>` includes that load `kw-tokens.css`,
  `kw-typography.css` and `kw-fonts.liquid`. It's the one stock file the KW layer edits; re-apply after any
  Impulse theme update.
- **STOCK-MATCH weights (Jost 400 + body line-height 1.4) live in the base `.t-*` rules**, not a trailing
  override — so reordering `kw-typography.css` can't silently revert them. Cormorant accents stay 300.
