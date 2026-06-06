# Project Rules — Kansawala Store (Impulse 9.1.0) · CLI true-stock base

This repo is the **canonical working base** for the Kansawala store: a complete, unmodified
**Shopify "Impulse" theme, version 9.1.0**, pulled fresh via the Shopify CLI ("the **stock**
theme"). It replaces an earlier build whose baseline was an *incomplete* import. These rules exist
so future work — migrations, new sections, upgrades, rollbacks — never destroys or silently
diverges from the stock baseline.

> Stock baseline is recorded in [`docs/STOCK_BASELINE.md`](docs/STOCK_BASELINE.md).
> Baseline git rev: `40d0dcd` ("Initial pull of Impulse theme with editor customizations").
> **At baseline: 394 tracked files · 126 assets · 58 stock sections** — **complete true stock**,
> the trustworthy reference for stock-vs-custom diffs and upgrades. (The current tree has grown
> past these numbers as custom work landed; the manifest, not these counts, is the live registry.)

> **Status:** the Kansawala custom sections **have been migrated in.** `pending_migration` in
> [`section-manifest.json`](section-manifest.json) is now empty; the manifest is the source of
> truth for what's custom (look for `"owner": "custom"`). The homepage transfer is complete.

---

## Golden rules

1. **Know the baseline before you touch anything.**
   Before migrating code or adding a section, check `docs/STOCK_BASELINE.md`
   (or run `git ls-files`) to confirm whether a file is **stock** or **ours**.
   Never assume — verify.

2. **Stock vs. ours — keep them distinguishable.**
   - Files at baseline rev `40d0dcd` are **stock**. Editing them is allowed, but every edit must be
     intentional and noted in the commit message.
   - **New** custom files we add should be clearly named (see naming rule below)
     so a human can tell at a glance what is stock and what is custom.

3. **Never overwrite a stock file wholesale.** Prefer surgical edits (the `Edit`
   tool / minimal diffs). If a feature needs a heavily-changed version of a stock
   section, **copy it to a new custom-named file** instead of rewriting the
   original, so the stock version stays intact for comparison/rollback.

4. **Additive, reversible changes.** Every change should be reviewable as a clean
   diff and revertible with `git revert` / `git checkout 40d0dcd -- <file>`.

## Research / sources

**Official Shopify sources first; third-party only as a fallback — and say so when you use one.**
This is the canonical copy of the rule (it also lives in Claude's local memory).

When building, debugging, or researching theme/section work, consult sources in this order:

1. **Official Shopify docs & tooling** — [shopify.dev/docs](https://shopify.dev/docs), surfaced through the
   official skills/MCP: `shopify-liquid` (section/schema/Liquid authoring), `shopify-dev` +
   `search_docs_chunks` (full doc search), `shopify-custom-data` (metafields/metaobjects), and the official
   `Shopify` MCP server (`graphql_schema`, `validate_graphql_codeblocks`, …).
2. **Shopify CLI & `shopify theme check`** (`shopify-use-shopify-cli`) for validation and store workflows.
3. **Third-party** (blogs, StackOverflow, community themes) — only if the official docs don't cover it, and
   **flag clearly** in the response that the suggestion is non-official so a human can verify it.

## Naming conventions (custom code)

- **`section-manifest.json` is the source of truth** for what's custom: each entry has
  `"owner": "custom"` or `"owner": "stock"`. Check it (not the filename) to tell them apart.
- Prefer a `kw-` or `custom-` prefix for **new** custom files (e.g. `kw-newsletter.liquid`,
  `custom-promo-banner.liquid`) so they're obvious at a glance.
- Some custom sections from the prior build are **unprefixed** (`hero-slider`, `marquee-strip`,
  `collections-grid`, `global-presence`, `heritage-timeline`, `trust-numbers`, …) and the snippet
  `kw-fonts.liquid`. When they are migrated in, they arrive under those names and are referenced by
  filename in `templates/index.json`, `section-manifest.json`, and `layout/theme.liquid` — **do NOT
  rename them**; they're tracked as custom via the manifest.
- Do **not** rename or repurpose existing stock files; create new ones instead.

## Protected / high-risk files — extra care

- `config/settings_schema.json` & `config/settings_data.json`
  — global theme settings. **Append** new settings; never wipe or reorder
  existing blocks. A bad merge here breaks the whole theme editor.
- `sections/*-group.json` (`header-group`, `footer-group`, `popup-group`)
  and JSON templates (`index.json`, `product.*.json`, `collection*.json`, …)
  — these reference sections **by filename**. Renaming/removing a section
  without updating its references will break the storefront.
- `blocks/_section-flex-pdp-*.liquid` (14 files)
  — these power `main-product*.liquid` (the PDP buy block). New PDP features
  should **reuse** these blocks, not duplicate their logic.
- `layout/theme.liquid` — global wrapper; edits affect every page.
- `locales/*.json` — keep keys in sync across all 14 locale files.

## Section authoring checklist (new section)

1. Create `sections/kw-<name>.liquid` (or `custom-<name>.liquid`) with a `{% schema %}` block, and register
   it in `section-manifest.json` with `"owner": "custom"`.
2. Add a `presets` entry so it appears in the theme editor.
3. Add any new translatable strings to **all** `locales/*.json` files.
4. Do **not** edit JSON templates unless the section must appear there by default.
5. Verify the stock files in the baseline are untouched (`git status`).

Authoring standards live in [`docs/section-standards.md`](docs/section-standards.md),
[`docs/schema-patterns.md`](docs/schema-patterns.md), [`docs/coding-rules.md`](docs/coding-rules.md),
and [`docs/ai-section-instructions.md`](docs/ai-section-instructions.md).

## Migration / upgrade procedure

When migrating sections in **or** upgrading Impulse to a newer version:

1. **Snapshot first.** Confirm the current state is committed; the stock baseline doc + git rev
   `40d0dcd` is the rollback anchor.
2. **Diff stock vs ours** to see customizations before overlaying new code:
   ```
   git diff 40d0dcd -- <path>           # what we changed vs stock
   git ls-files | grep -i custom        # what we added
   ```
3. Apply new/migrated files, then **re-apply our customizations** on top — do not let an upgrade
   silently revert our changes.
4. Update `docs/STOCK_BASELINE.md` if the stock baseline itself changes (e.g. after an Impulse
   version bump), and bump the recorded version + git rev.

## Rollback cheatsheet

```
# restore a single stock file to baseline
git checkout 40d0dcd -- sections/<file>.liquid

# see everything that differs from the stock baseline
git diff --stat 40d0dcd

# list files we added that don't exist in stock
git diff --name-status 40d0dcd | grep '^A'
```

## Theme dev workflow (local ↔ admin) — don't lose admin customizations

The storefront has **two** editing surfaces — **code** (VS Code → git) and **content/settings** (Shopify
admin "Customize") — both rendering from one shared dev theme. Two traps silently wipe admin edits (a
one-way push from bare `shopify theme dev`, and the ~7-day auto-delete of CLI Development themes). The
**full explanation + one-time setup + recovery steps live in
[`docs/THEME-DEV-WORKFLOW.md`](docs/THEME-DEV-WORKFLOW.md) — that doc is canonical.** The operative rules:
- **Never run bare `shopify theme dev`.** Use `scripts/theme-dev.ps1` — it pins a **persistent** dev theme
  and runs `--theme-editor-sync` (two-way). (Create your machine-local `scripts/theme.config.ps1` from
  `theme.config.example.ps1` first.)
- **Pull + commit admin edits before ending a session:** `scripts/theme-pull.ps1`, then `git commit` —
  else the edits are lost when the dev theme changes/expires.
- **Split by tool:** code in VS Code; content/settings in admin.

## Git / branch rules

- Develop on `main` (the project's working branch). Use a short-lived `claude/<topic>` branch only for
  isolated/risky work, then merge back to `main`.
- Commit with clear messages stating **stock vs custom** intent.
- Push with `git push -u origin <branch>` (or `main`). Do not open PRs unless asked.
