# Asset Audit — Kansawala (Impulse 9.1.0)

> State of `assets/`, the missing-asset history, and what must **never** be re-added. The recorded
> stock baseline (`db0e1c1`) is an incomplete import — see [`STOCK_BASELINE.md`](STOCK_BASELINE.md).
> **Update 2026-06-02:** the missing PDP/flag assets were restored from the true-stock source
> `IMPULSE 9.1.0 FROM SHOPIFY CLI` — see the "Restored" section below.

## Summary

- `assets/` now holds **72 files** (was 65; +7 restored on 2026-06-02).
- The 4 PDP element modules + their base class + the 2 country-flags assets are **restored and
  wired** (import-map + snippets resolve correctly).
- **1 asset must NOT be restored:** `element.image.parallax.js` — re-adding it crashes the
  storefront via duplicate custom-element registration.

---

## ✅ Restored 2026-06-02 (source: `F:\Website Devlopment\IMPULSE 9.1.0 FROM SHOPIFY CLI`)

Version-matched stock Impulse 9.1.0 files copied into `assets/`:

| Restored asset | Registers / role | Imported by (verified) |
|---|---|---|
| `element.base-media.js` | `export default class extends HTMLElement` — **abstract base class, registers nothing** | `element.video.js`, `element.model.js` (`import BaseMedia from 'element.base-media'`) |
| `element.video.js` | `customElements.define('video-media', …)` | import-map `element.video`; `snippets/element.video.liquid`; media-gallery |
| `element.model.js` | `customElements.define('model-media', …)` | import-map `element.model`; `snippets/element.model.liquid`; media/grid |
| `element.quantity-selector.js` | `customElements.define('quantity-selector', …)` | import-map; `snippets/section.flex-pdp.quantity-picker.liquid:66` |
| `element.text.rte.js` | `customElements.define('element-text-rte', …)`; imports `util.misc` | import-map; `snippets/element.text.liquid` |
| `country-flags.css.liquid` | Multi-currency flag styles | `layout/theme.liquid:331` (guarded by `shop.enabled_currencies.size > 1`) |
| `country-flags-40.png` | Flag sprite for the CSS above | `country-flags.css` |

**Why base-media was added (correcting the earlier audit):** a previous note said base-media must
not be restored. That was an error — it conflated base-media with the `image-element`/`parallax-image`
classes defined inline in `assets/theme.js`. `element.base-media.js` calls **no**
`customElements.define()`, so it cannot collide; it is a **required dependency** of `element.video.js`
and `element.model.js` and must be present for them to work.

**Dependency deps already present:** `util.misc.js`, `util.resource-loader.js`, `util.product-loader.js`.

---

## 🚫 Do NOT restore — would crash the storefront

`element.image.parallax.js` is intentionally **absent** and must stay that way. Its custom element
is already defined inline in the main bundle:

- `assets/theme.js:2703` → `customElements.define('parallax-image', ParallaxImage);`
- `assets/theme.js:4030` → `customElements.define('image-element', ImageElement);`

Re-adding `element.image.parallax.js` would call `customElements.define('parallax-image', …)` a
second time → **`NotSupportedError` / runtime crash**. Nothing `import`s `element.image.parallax`
(only a lazy, unused import-map entry references it), so leaving it out is safe — the parallax
functionality already ships inside `theme.js`.

---

## How to re-verify

```bash
# asset count (expect 72)
git ls-files assets | wc -l

# the restored element modules register tags NOT in theme.js (no collision)
grep -rn "customElements.define" assets/element.*.js

# theme.js still owns parallax-image / image-element (do-not-restore guard)
grep -n "customElements.define('parallax-image'" assets/theme.js
grep -n "customElements.define('image-element'"  assets/theme.js

# validate
shopify theme check
```
