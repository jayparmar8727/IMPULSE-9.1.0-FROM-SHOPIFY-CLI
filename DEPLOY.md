# Deploy & update-safety — Kansawala (Impulse 9.1.0)

> How to push changes to Shopify safely, and how to take an Impulse version update without losing the custom layer.
> Conventions: [CLAUDE.md](CLAUDE.md). Port history: [MIGRATION-LOG.md](MIGRATION-LOG.md).
>
> **For day-to-day dev** (running the dev server + keeping admin "Customize" edits from vanishing), use
> [docs/THEME-DEV-WORKFLOW.md](docs/THEME-DEV-WORKFLOW.md) + the `scripts/theme-*.ps1` helpers. This file covers
> **one-off pushes** (after a code review / fix).

## Targets
- **Store:** `kansawalasmf` · **Development (Draft) theme:** `152401707182` (unpublished — safe to push to).
- Never push directly to the **published/live** theme. Work on the Draft, preview, then publish.

## Safe push workflow
1. **Lint:** `shopify theme check` → fix any **errors in OUR files** (stock pre-existing findings are left alone;
   see the `.theme-check.yml` note below).
2. **JS sanity:** if `assets/theme.js` changed → `node --check assets/theme.js`.
3. **Push only what changed** to the Draft theme — never the whole theme:
   ```bash
   shopify theme push --store kansawalasmf --theme 152401707182 \
     --only sections/<file>.liquid --only assets/theme.js --nodelete
   ```
   - `--only` = push just those files. `--nodelete` = never delete remote files not in the push set.
   - ⚠️ **Never `--only`-push `templates/*.json` or `config/settings_data.json`** — those hold the merchant's editor
     layout/settings; pushing local copies clobbers their work.
4. **Preview** the Draft (`…/admin/themes/152401707182/editor` or `?preview_theme_id=152401707182`); hard-refresh
   (`Ctrl+Shift+R`) so cached `theme.js`/CSS reload.
5. **Publish** only after visual + behaviour review.

### Caveat — schema-default changes
Changing a section's `{% schema %}` **defaults** only affects **newly-added** instances. Sections already placed in
the editor keep their saved settings — re-set the relevant sliders, or remove + re-add. (Inline CSS / `theme.js`
changes apply to all instances on push.)

## The custom layer (what's "ours" vs stock)
Everything custom is **additive & namespaced** so it survives an Impulse base update:
- **New assets:** `assets/kw-tokens.css`, `assets/kw-typography.css` · **New snippet:** `snippets/kw-fonts.liquid`
- **New sections:** the custom homepage sections (hero-slider, collections-grid, bestsellers, three-sacred-metals,
  … — the authoritative list is `section-manifest.json` entries with `"owner": "custom"`), all using `kw-*`
  classes / `--d/--s/--fs-*` tokens / `.t-*` utilities.
- **Docs + config:** `BRAND/COMPONENTS/DESIGN-AUDIT/MIGRATION-LOG/SEO/PERFORMANCE/ACCESSIBILITY/DEPLOY.md`,
  `section-manifest.json`, `.theme-check.yml` (local dev-tooling — **not** a theme asset, not pushed).
- **Edits to stock files (the only 2):**
  1. `layout/theme.liquid` `<head>` — after `theme.css`: two `stylesheet_tag`s (`kw-tokens.css`, `kw-typography.css`)
     + `{% render 'kw-fonts' %}`.
  2. `assets/theme.js` — three additive blocks: the `theme.HeroSlider` class + its
     `theme.sections.register('hero-slider', …)` line; the **fade-up** reveal IIFE (`[data-kw-fade-up]`); the
     **count-up** IIFE (`[data-kw-trust-numbers]`).

## Taking an Impulse version update (e.g. 9.1.0 → 9.2.0)
1. Pull/unzip the new stock Impulse into a **fresh folder**; commit it as a clean baseline.
2. Copy over the **new files** (the `kw-*` assets/snippet, the 6 section `.liquid`s, the docs, `section-manifest.json`,
   `.theme-check.yml`).
3. Re-apply the **2 stock-file edits** above (head wiring + the 3 `theme.js` blocks). These are small and documented;
   diff against the old `theme.liquid`/`theme.js` if anything moved.
4. Keep the **conventions:** additive-only (never restyle stock), stock spacing **75/40/17** + max-width **1500**,
   **no opacity (%) controls**, all merchant text `| escape`-d, JS gated on `prefers-reduced-motion`.
5. `shopify theme check` → push to a Draft → preview → publish.

## `.theme-check.yml`
Local config that silences the expected `RemoteAsset`/`AssetPreload` warnings on our `kw-fonts.liquid` + the two
image sections (Google Fonts + the optional external-image-URL fields). It is **not** uploaded by `theme push` and
changes no code. Stock lint stays visible.

## Git
- Remote: `github.com/jayparmar8727/-Kansawala-Stock-Impulse-9.1.0`.
- Commit our additive files; never commit secrets. The theme deploy is via `shopify theme push` (not Git → Shopify)
  unless GitHub integration is connected to the theme.

---

## Recommended (optional)
- Connect the GitHub repo to the Shopify theme for Git-based deploys (push to branch → auto-sync to a theme).
- A short `scripts/push-custom.sh` wrapping the `--only … --nodelete` command for the custom files.
