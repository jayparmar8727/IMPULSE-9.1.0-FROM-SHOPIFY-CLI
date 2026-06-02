# SEO — Kansawala (Impulse 9.1.0)

> Meta strategy, canonical rules, and the structured-data plan for the theme.
> Per-section heading/markup detail lives in [COMPONENTS.md](COMPONENTS.md); applied a11y/markup fixes in
> [DESIGN-AUDIT.md](DESIGN-AUDIT.md). **The "Recommended code changes" at the bottom are proposals — not yet applied.**

## 1. Title & meta description

**Title** — `snippets/seo-title.liquid` builds: `{{ page_title }} [– tags] [– Page N] – {{ shop.name }}`.
Tag filters and pagination are handled; shop name is appended. ✅ Good as-is.

**Meta description** — `layout/theme.liquid` (~L23):
```liquid
<meta name="description" content="{{ page_description | escape }}">
```
⚠️ **No fallback.** When `page_description` is blank (collections/products with no description set), the tag is
**omitted entirely** and Google invents a snippet from body text.

**Rule going forward:** every product/collection/page should have a description. Where merchants leave it blank,
use a fallback chain (see Recommended changes #2).

## 2. Canonical rules

`layout/theme.liquid` (~L8): `<link rel="canonical" href="{{ canonical_url }}">` — Shopify's `canonical_url`.
- Product/collection/page canonicals: handled by Shopify. ✅
- Pagination (`?page=2`) and tag/filter URLs: Shopify points the canonical at the primary resource. ✅
- **Don't** hand-roll canonicals for filtered collection URLs — Shopify already self-canonicalises. Leave as-is.

## 3. Open Graph / Twitter

`snippets/social-meta-tags.liquid` outputs `og:site_name/url/title/type/description/image(+secure_url+w/h)`, plus
`og:price:amount/currency` on products, and `twitter:site/card(summary_large_image)/title/description`. ✅ Solid.
⚠️ `twitter:image` is not set explicitly (relies on `og:image` fallback — usually fine, not guaranteed).

## 4. Structured data (JSON-LD)

Stock Impulse **already ships solid JSON-LD** — this is **not** a from-scratch gap. What exists vs. what's missing:

**✅ Already present (stock, don't duplicate):**

| Type | File |
|---|---|
| **Product** (+ `Offer`, `ImageObject`) | `snippets/product-template-variables.liquid` (via `product-template.liquid`) |
| **Article** (+ `Organization`, `WebPage`, `Person`) | `sections/article-template.liquid` |
| **CollectionPage** | `sections/main-collection.liquid` |
| **FAQPage** (+ `Question`/`Answer`) | `sections/faq.liquid` |

**❌ Genuinely missing (worth adding, in priority order):**

| Type | Where it belongs | Why |
|---|---|---|
| **BreadcrumbList** | alongside `snippets/breadcrumbs.liquid` (HTML-only today) | Breadcrumb trail in SERP |
| **WebSite** (+ `SearchAction`) | `theme.liquid` head | Sitelinks search box |
| **Global Organization** ✅ **added** | `snippets/kw-schema-organization.liquid` (rendered in `theme.liquid` head, homepage) | Brand entity / knowledge panel — now emitted site-wide on the homepage (complements stock's article-scoped `Organization`) |

`AggregateRating` on Product is also absent — only worth adding if a reviews app exposes ratings.

## 5. Headings & semantics

- **One `<h1>` per page** — the hero's **first slide** is `<h1>`, later slides `<h2>` (`hero-slider.liquid`). ✅
- Section headings: collections-grid `<h2>` ✅, global-presence `<h2>` ✅, heritage-timeline item `<h3>` ✅.
- ✅ **trust-numbers now has a section heading** — a visually-hidden `<h2>` (via `aria-labelledby`) puts the
  stats band in the heading outline while keeping the design title-free.

## 6. Image alt text

- Product media: `media.alt` (merchant-set) — `snippets/media.liquid`. ✅
- collections-grid: per-card alt with fallback to the collection name. ✅
- Hero backgrounds: decorative `alt=""` (correct — the heading carries meaning). ✅
- global-presence triptych: uses the image's `alt`. ✅
- **Standard:** merchants must fill alt text in Files/Products; decorative-only images stay `alt=""`.

## 7. Robots / sitemap
Shopify auto-generates `/robots.txt` and `/sitemap.xml`. No theme override needed. Gift-card/password pages are
non-indexable by Shopify default. Leave as-is.

---

## Recommended code changes (proposed — NOT applied; approve individually)
1. ✅ **DONE — global Organization JSON-LD** (`snippets/kw-schema-organization.liquid`, rendered in `theme.liquid`
   head on `index`): name, url, `logo` (settings.logo), `sameAs` social links. *(Additive — complements the
   article-scoped `Organization` stock already emits.)*
   - **Setup:** it auto-populates from theme settings — set the **Logo** and **social links** (Customize →
     Theme settings → Logo / Social media), or those fields are simply omitted (the JSON stays valid either way).
   - **Verify after deploy:** paste the homepage URL into **Google Rich Results Test** — the JSON-LD renders live
     with the real shop data, so that's the definitive check.
2. **Meta-description fallback** in `theme.liquid`: `page_description | default: collection.description | default:
   product.description | strip_html | truncatewords: 30 | default: shop.description`. *(1-line edit — stock file,
   minimal & reversible.)*
3. **BreadcrumbList JSON-LD** alongside the HTML in `breadcrumbs.liquid`.
4. **WebSite + SearchAction** JSON-LD in `theme.liquid` head.
5. **trust-numbers `<h2>`** — add an editable (or visually-hidden) section heading for semantics.
6. **`twitter:image`** explicit in `social-meta-tags.liquid` (mirror `og:image`).

> Product/Offer, Article, CollectionPage and FAQPage JSON-LD are **already shipped by stock Impulse** (see §4) —
> don't re-add them.

All are **additive** except #2/#6 (tiny edits to stock head/snippet) and #5 (our own section). None change the
visual design.
