# Consolidation Plan & Record — Kansawala (Impulse 9.1.0)

> Durable record of the documentation consolidation done on **2026-06-02**. The canonical theme
> repo is the single source of truth; the separate `SHOPIFY DEV DOCS` sibling folder was an older
> generic framework draft (with a nested self-duplicate) that has now been merged here.

## Why

Two parallel doc sets had drifted: this repo, and an out-of-tree `SHOPIFY DEV DOCS` framework
folder. AI tools only load rules that live **inside** this repo, so the out-of-tree standards were
dead weight, and the recorded stock baseline (`db0e1c1`) was quietly misleading. This pass folds the
useful generic standards into `docs/`, corrects the baseline record, and documents the real state —
**without** touching storefront code (MD-only scope).

## Verified state at HEAD `13ca579` (re-audited)

- `assets/` = **65** files. The 4 PDP element modules + 2 country-flags assets are **missing but
  actively referenced** (broken). Custom-element modules `element.image.parallax.js` /
  `element.base-media.js` must **not** be restored (already defined in `theme.js`). Full detail in
  [`ASSET-AUDIT.md`](ASSET-AUDIT.md).
- Baseline docs cited `db0e1c1` / 332 files / 63 assets as "stock" — an **incomplete import**.
- No competing AI-rule files in the repo (`CLAUDE.md` is the only rules file). The `SHOPIFY DEV
  DOCS` folder *did* contain `.cursorrules` / `claude.md` / `copilot-instructions.md` — deliberately
  **not** copied in.

## What was done (this pass — all `.md`)

| Action | File(s) |
|---|---|
| Added incomplete-baseline ⚠️ warning | [`STOCK_BASELINE.md`](STOCK_BASELINE.md), [`../CLAUDE.md`](../CLAUDE.md) |
| New asset findings + missing-asset TODO + do-not-restore guard | [`ASSET-AUDIT.md`](ASSET-AUDIT.md) |
| New architecture map (stock vs custom, wiring) | [`current-theme-architecture.md`](current-theme-architecture.md) |
| Merged generic standards (refs repointed; CLAUDE.md governs) | [`section-standards.md`](section-standards.md), [`schema-patterns.md`](schema-patterns.md), [`coding-rules.md`](coding-rules.md), [`ai-section-instructions.md`](ai-section-instructions.md) |
| Folded unique perf rules into the single perf home | [`../PERFORMANCE.md`](../PERFORMANCE.md) (no `docs/performance-rules.md` created) |
| Removed stale duplicate skills dir (local, gitignored) | `.claude/skills/` deleted; `.agents/skills/` kept (6 official) |

### Deliberately excluded
- `performance-rules.md` as a standalone file — its unique content went into `PERFORMANCE.md`.
- `.cursorrules`, `claude.md`, `copilot-instructions.md`, `.github/copilot-instructions.md`,
  hub `README.md`/`.theme-check.yml` — competing/duplicate rule or config files. `CLAUDE.md` remains
  the one rules file; the repo's own `.theme-check.yml` stays.

## Outstanding TODO

1. ✅ **DONE 2026-06-02 — restored the missing assets** (7 files: `element.base-media.js` +
   `element.video/model/quantity-selector/text.rte.js` + `country-flags.css.liquid` +
   `country-flags-40.png`) from the true-stock source `IMPULSE 9.1.0 FROM SHOPIFY CLI`. `theme check`
   shows no new errors; the only do-not-restore file is `element.image.parallax.js` (collides with
   `theme.js`). Detail in [`ASSET-AUDIT.md`](ASSET-AUDIT.md). *(Note: the earlier "do-not-restore
   base-media" guidance was an error — base-media registers nothing and is a required dependency.)*
2. **Establish a true-stock reference** via `shopify theme pull` of Impulse 9.1.0, and point
   upgrade-diffs at that instead of `db0e1c1`.
3. *(Outside repo)* Retire the `SHOPIFY DEV DOCS` hub and delete its nested
   `impulse-ai-framework/impulse-ai-framework/` self-duplicate, now that its standards live here.

## Doc map (where things live now)

- **Rules / governance:** [`../CLAUDE.md`](../CLAUDE.md) (single source of truth)
- **Stock baseline:** [`STOCK_BASELINE.md`](STOCK_BASELINE.md) (+ incomplete-import caveat)
- **Current architecture:** [`current-theme-architecture.md`](current-theme-architecture.md)
- **Asset state:** [`ASSET-AUDIT.md`](ASSET-AUDIT.md)
- **Section authoring:** [`section-standards.md`](section-standards.md),
  [`schema-patterns.md`](schema-patterns.md), [`coding-rules.md`](coding-rules.md),
  [`ai-section-instructions.md`](ai-section-instructions.md)
- **Performance:** [`../PERFORMANCE.md`](../PERFORMANCE.md)
- **Dev workflow:** [`THEME-DEV-WORKFLOW.md`](THEME-DEV-WORKFLOW.md)
