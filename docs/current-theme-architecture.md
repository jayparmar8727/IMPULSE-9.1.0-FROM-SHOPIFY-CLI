# Current Theme Architecture — Kansawala working base (Impulse 9.1.0)

> A map of the theme **as it is now**: true-stock Impulse 9.1.0 (CLI pull, baseline rev `40d0dcd`) with
> the project governance layer **and the migrated Kansawala custom sections** on top. The authoritative
> stock record is [`STOCK_BASELINE.md`](STOCK_BASELINE.md); current ownership (stock vs custom) is tracked
> in [`../section-manifest.json`](../section-manifest.json) — look for `"owner": "custom"`.

## Directory snapshot

| Directory | Count | Notes |
|---|---:|---|
| `sections/` | 58 | all **stock** Impulse (no customs migrated in yet) |
| `snippets/` | 142 | stock |
| `blocks/` | 14 | PDP "flex" buy blocks (`_section-flex-pdp-*`) — power `main-product*.liquid` |
| `templates/` | 35 | JSON templates + a few `.liquid` (cart, gift_card, customers/) |
| `assets/` | 126 | ✅ complete stock asset set (all `element.*` modules + `country-flags.*` present) |
| `locales/` | 14 | 7 locales × (`.json` + `.schema.json`) |
| `layout/` | 3 | `theme.liquid`, `password.liquid`, `gift_card.liquid` |
| `config/` | 2 | `settings_schema.json`, `settings_data.json` (protected) |

## Project layer added on top of stock

- `CLAUDE.md` — governance / rules (single source of truth).
- `section-manifest.json` — stock-vs-custom registry (`owner: stock|custom`; the custom sections are migrated in, `pending_migration` is empty).
- `docs/` — `STOCK_BASELINE.md`, `section-standards.md`, `schema-patterns.md`, `coding-rules.md`,
  `ai-section-instructions.md`, `THEME-DEV-WORKFLOW.md`, this file.
- `scripts/` — `theme-dev.ps1`, `theme-pull.ps1`, `theme-push.ps1`, `theme.config.example.ps1`.
- `.theme-check.yml`, `.gitignore`.

## Stock vs. custom — the ownership model

`section-manifest.json` is the **source of truth**: each custom section is marked
`"owner": "custom"` (with `status`/`placed_in`); everything else is stock at rev `40d0dcd`. Check the
manifest, not the filename.

## Custom layer — migrated in

The Kansawala custom sections + foundation (kw-tokens.css, kw-typography.css, kw-fonts, theme.js
engines, head wiring, `templates/index.json`, branding) have been **migrated in** from the prior
build. `pending_migration` in `section-manifest.json` is now empty; its `"owner": "custom"` entries
are the live roster.

## Wiring reference (stock)

- **Layout** `layout/theme.liquid` → `<head>` partials (`head.import-map`, `head.is-land`,
  `font-face`, …) → renders the header/footer/popup **section groups**.
- **Section groups** (`sections/header-group.json`, `footer-group.json`, `popup-group.json`) reference
  sections **by filename** — renaming a referenced section breaks the storefront.
- **Templates** (`templates/*.json`) compose sections; `index.json` drives the homepage.
- **PDP** `sections/main-product*.liquid` compose the `blocks/_section-flex-pdp-*.liquid` buy blocks.
- **JS hydration** `head.import-map.liquid` + `is-land` provide selective hydration; the `element.*.js`
  custom-element modules are resolved through the import-map (all present in this complete base).

## Authoring new sections

Follow [`section-standards.md`](section-standards.md), reuse [`schema-patterns.md`](schema-patterns.md),
obey [`coding-rules.md`](coding-rules.md), and the governance/naming/manifest rules in
[`../CLAUDE.md`](../CLAUDE.md).
