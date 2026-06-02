# Kansawala — Impulse 9.1.0 (working base)

The **canonical working repository** for the Kansawala storefront: a complete, true-stock
**Shopify Impulse 9.1.0** theme pulled via the Shopify CLI, with a governance + standards layer on
top. This base replaces an earlier build whose import was incomplete.

## Status

- **Stock baseline:** rev `40d0dcd` — complete true stock (394 files, 126 assets, 58 sections).
  See [`docs/STOCK_BASELINE.md`](docs/STOCK_BASELINE.md).
- **Customizations:** none migrated in yet. The 17 Kansawala custom sections + foundation are
  **pending migration** — see `pending_migration` in [`section-manifest.json`](section-manifest.json).

## Start here

- **Rules / governance:** [`CLAUDE.md`](CLAUDE.md) — single source of truth.
- **Stock-vs-custom registry:** [`section-manifest.json`](section-manifest.json).
- **Architecture map:** [`docs/current-theme-architecture.md`](docs/current-theme-architecture.md).
- **Section authoring:** [`docs/section-standards.md`](docs/section-standards.md),
  [`docs/schema-patterns.md`](docs/schema-patterns.md), [`docs/coding-rules.md`](docs/coding-rules.md),
  [`docs/ai-section-instructions.md`](docs/ai-section-instructions.md).
- **Dev workflow:** [`docs/THEME-DEV-WORKFLOW.md`](docs/THEME-DEV-WORKFLOW.md) +
  `scripts/theme-dev.ps1` / `theme-pull.ps1` / `theme-push.ps1`.

## Local dev (Windows / PowerShell)

1. Copy `scripts/theme.config.example.ps1` → `scripts/theme.config.ps1` (gitignored) and set the
   store + persistent dev-theme id.
2. `.\scripts\theme-dev.ps1` — two-way dev server (`--theme-editor-sync`).
3. Validate: `shopify theme check`.

No build step — Impulse 9.1.0 is a no-build theme (ships pre-built `theme.js` / `theme.css`).
