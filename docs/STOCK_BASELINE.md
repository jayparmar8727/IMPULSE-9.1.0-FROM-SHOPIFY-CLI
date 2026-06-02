# Stock Baseline — Impulse 9.1.0 (complete true stock)

This is the authoritative record of the **stock (unmodified) Shopify Impulse theme, v9.1.0** for
this working base. Unlike the prior build's incomplete import, this baseline was pulled **complete
via the Shopify CLI** — use it to tell **stock vs. custom**, to plan migrations/upgrades, and to
roll back.

- **Theme:** Impulse (Archetype) **9.1.0**
- **Baseline git rev:** `40d0dcd` — "Initial pull of Impulse theme with editor customizations"
- **Total tracked files:** 394
- **Captured:** 2026-06-02 (Shopify CLI pull)
- **Completeness:** ✅ complete — includes all assets the theme's own code references (no missing
  PDP element modules / country-flags, unlike the prior `db0e1c1` import).

> See [`../CLAUDE.md`](../CLAUDE.md) for the rules that govern changes to these files.

## File counts by directory

| Directory   | Files |
|-------------|-------|
| `sections/` | 58    |
| `snippets/` | 142   |
| `templates/`| 35    |
| `blocks/`   | 14    |
| `layout/`   | 3     |
| `config/`   | 2     |
| `locales/`  | 14    |
| `assets/`   | 126   |
| **Total**   | **394** |

## blocks/ (14) — PDP "flex" buy blocks (power main-product*.liquid)

```
_section-flex-pdp-buy-buttons.liquid     _section-flex-pdp-price.liquid
_section-flex-pdp-description.liquid      _section-flex-pdp-quantity-picker.liquid
_section-flex-pdp-divider.liquid          _section-flex-pdp-sku.liquid
_section-flex-pdp-installments.liquid     _section-flex-pdp-title.liquid
_section-flex-pdp-inventory.liquid        _section-flex-pdp-variant-picker.liquid
_section-flex-pdp-media-gallery.liquid    _section-flex-pdp-vendor.liquid
_section-flex-pdp-pick-up.liquid
_section-flex-pdp-policies.liquid
```

## Enumerate the full baseline

```bash
git ls-files sections   # 58 stock sections
git ls-files assets     # 126 assets (full element.* + country-flags set present)
git ls-files            # all 394 tracked files at rev 40d0dcd
```

## How to use this baseline

```bash
# Is a file stock or ours?  -> check if it exists at the baseline rev:
git cat-file -e 40d0dcd:sections/<file>.liquid && echo STOCK || echo CUSTOM

# What have we changed vs stock?
git diff --stat 40d0dcd

# Restore a stock file:
git checkout 40d0dcd -- <path>
```

When the stock theme itself is upgraded (e.g. Impulse 9.2.0), regenerate this file and update the
version + git rev above.
