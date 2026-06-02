# Accessibility — Kansawala (Impulse 9.1.0)

> Theme-level **WCAG 2.1 AA checklist**, contrast & motion policy, and merchant guidance.
> Per-section findings + the specific fixes applied live in [DESIGN-AUDIT.md](DESIGN-AUDIT.md) — this doc is the
> consolidated standard, not a re-list. Tokens/colours: [BRAND.md](BRAND.md).

## Theme-wide infrastructure ✅
- `<html lang="{{ request.locale.iso_code }}" dir="{{ settings.text_direction }}">` — language + RTL.
- **Skip link** → `#MainContent` (`layout/theme.liquid`), and `<main id="MainContent">` landmark.
- **Global reduced-motion floor** in `assets/kw-tokens.css` collapses all transitions/animations under
  `prefers-reduced-motion: reduce`; JS autoplay/count-up also gate on `matchMedia(...reduce)`.
- All merchant text in our sections is `| escape`-d (no markup injection).

## WCAG 2.1 AA checklist (theme level)
| Criterion | Status | Where / note |
|---|---|---|
| 1.1.1 Non-text content (alt) | ✅ | Product/collection alt from metadata; hero bg `alt=""`; see [SEO.md](SEO.md) §6 |
| 1.3.1 Info & relationships | ✅ | One `<h1>` (hero), section `<h2>`, content items `<h3>`; product/collection tiles + labels non-heading (stock-aligned); trust-numbers has a visually-hidden `<h2>` |
| 1.4.3 Contrast (text) | ⚠️ mostly | Core text passes AA; **brand buff/brass accents intentionally below AA** — see Policy |
| 1.4.11 Non-text contrast | ✅ | Focus rings, control borders meet 3:1 |
| 2.1.1 Keyboard | ✅ | Dots/arrows/links keyboard-operable; roving tabindex on hero dots |
| 2.2.2 Pause/stop/hide | ⚠️ partial | Autoplay **pauses on hover & focus** (no visible pause button, by merchant choice); marquee pauses on hover |
| 2.4.1 Bypass blocks | ✅ | Skip link |
| 2.4.7 Focus visible | ✅ | `:focus-visible` rings on hero/collections controls + CTAs |
| 2.5.8 Target size (min) | ✅ | Hero dots = 24×24 hit area (6px visual) |
| 3.1.1 Language of page | ✅ | `lang` on `<html>` |
| 3.2.x Predictable | ✅ | No focus-stealing; autoplay is pausable; no auto-submit |
| 4.1.2 Name/role/value | ✅ | Carousel ARIA, `role="region"`, `aria-current`, `aria-labelledby`; inactive slides `inert`+`aria-hidden` |
| 4.1.3 Status messages | ⚠️ n/a-ish | Count-up uses a `visually-hidden` final value (no live spam); forms not yet audited |

## Contrast policy
Targets: **4.5:1** small text, **3:1** large (≥24px or ≥18.66px bold) & UI/non-text.
- Core readable text (hero heading/body, collection/global-presence headings, trust labels) meets **AA/AAA** —
  set in kansa brown `#6b3c23` (on cream) / cream `#fee8d9`/`#faf5ee` (on brown).
- **Intentional exceptions (conscious brand decision, owned trade-off):** the brand brass is used for small
  **accent** text (eyebrows, labels, heading-italics) and sits below AA-small — `#bc843f` on cream ≈ 3:1, and
  its dark-bg shade buff `#d8ae82` on brown ≈ 3.2:1. Kept because it's the canonical brand brass (stock Impulse
  uses `#bc843f` the same way for sale tags / save price). See BRAND.md + MIGRATION-LOG Phase 17.
- **Merchants:** when changing colours in the Customizer, keep **body** text ≥ 4.5:1. Safe pairings: cream
  `#faf5ee` bg → use `#6b3c23`; brown `#6b3c23` bg → use `#fee8d9`/`#faf5ee`.

## Motion policy
- Everything animated respects `prefers-reduced-motion` (global floor + JS gates) → content **snaps in**, never
  hidden. The reveal (`.fu`) and count-up are **no-JS safe** (`.js-kw-fadeup` gate; counters show final value).
- Autoplay (hero, marquee) pauses on hover/focus; merchants can lower autoplay speed or disable it.
- Known minor gap: reduced-motion is read once at load (no live re-check if toggled mid-session).

## Merchant do's & don'ts
- **Do:** fill image alt text; keep Customizer colour contrast ≥ AA (above); write one clear page description.
- **Don't:** put HTML in text fields (it's escaped anyway); don't set autoplay faster than ~5s; don't remove the
  only `<h1>` (the hero's first slide).

## Known gaps / not yet audited
- **Forms** (newsletter, contact, search) — label/error/validation a11y not yet reviewed.
- **Video** captions/transcripts — if video sections are added.
- Live reduced-motion toggle listener.

## Testing
- Automated: **Lighthouse a11y**, **axe DevTools**, **WAVE** on a preview URL.
- Manual: keyboard-only tab-through; screen reader spot-check (NVDA + Firefox / VoiceOver + Safari) on the hero
  carousel and trust-numbers count-up.

---

## Recommended code changes (proposed — NOT applied; approve individually)
1. **trust-numbers `<h2>`** section heading (also a SEO win — see [SEO.md](SEO.md) #5).
2. **Forms a11y pass** — audit newsletter/contact/search for labels + error association.
3. *(Optional)* visible **pause button** on autoplaying sections for full WCAG 2.2.2 (you previously chose to omit
   it; hover/focus-pause is the current mitigation).
