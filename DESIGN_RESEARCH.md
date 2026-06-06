# DESIGN_RESEARCH.md — inspiration sources → NBK/DDC

Deep-dive on four sources, each with **3 to borrow / 1 to avoid / how it maps**
to our cursor · header · sections · motion. Researched 2026-06-06.

---

## 1. pageflows.com — real user-flow recordings

A curated library of annotated screen-recordings of real product flows
(Airbnb, Spotify, Revolut, Dropbox…) across web/iOS/Android.

**Borrow**
1. **Staged/progressive disclosure** — leading apps introduce capability
   incrementally instead of front-loading. → Our scroll-driven 3D shanyrak
   journey should reveal its "acts" one beat at a time, never two focal points
   at once.
2. **Account-state micro-interactions** — login/verify/reset flows communicate
   status through small, legible feedback. → Apply to the contact form
   (inline validation, clear success/error using `role="alert"`).
3. **Checkout-style field minimization + progress** — fewer fields, visible
   progress, strategic confirmation. → The contact / careers application forms.

**Avoid:** copying a competitor's *visual* (button colour, layout) without the
underlying intent — produces decoration, not UX.

**Maps to:** motion **pacing** (transition timing for our page-transition sweep),
**navigation** patterns for the header, form UX for the marketing sub-pages.

---

## 2. uigoodies.com — curated UI resource directory

Nine categories of vetted tools (icons, color, type, mockups, AI, graphics).

**Borrow**
1. **Colorable / contrast auditors** — palette contrast matrices. → Directly
   serves our open a11y item: verify gold-on-dark and `text-gray-light` clear
   4.5:1 (ux-guidelines #36).
2. **HDR Gradients (wide-gamut CSS builder)** — sophisticated P3 gradients. →
   Upgrade our aurora/gold gradient stops and the liquid-glass tints toward
   wide-gamut without banding.
3. **Phosphor Icons (multi-weight, 9k+)** — one coherent multi-weight family. →
   We currently mix `lucide-react`; a single multi-weight set would tighten
   visual consistency (ux-guideline `no-emoji-icons` → SVG only, already true).

**Avoid:** novelty tools like *Efecto* (3D→ASCII) — undermines the credibility
a national-bank subsidiary needs.

**Maps to:** **color/contrast** tooling for accessibility, **gradients** for the
liquid-glass tint system, **icon** consistency across sections.

---

## 3. dirtylinestudio.com — type foundry / studio

High-end foundry site; their own fonts are the demo.

**Borrow**
1. **Expressive-display + utilitarian-sans duality** — a wide display face against
   a functional sans. → We already ship this trio (Cormorant Garamond display +
   Inter body + JetBrains Mono for data); lean into it harder for hierarchy
   (big serif numerals over mono labels in Stats).
2. **Client logos as quiet social proof** — recognizable brands, no long
   testimonials. → Our `PartnerMarquee` — keep it understated, monochrome logos.
3. **Featured-item rotation + hierarchical scroll reveal** — depth without
   homepage clutter; work reveals progressively on scroll.

**Avoid:** overcrowding the hero — resist stacking competing animations/messages
around the core tagline. (Our hero already runs a 3D scene + headline; keep ONE
star of the show.)

**Maps to:** **typography** hierarchy (opacity/scale tiers), **hero discipline**,
**scroll-reveal** pacing for sections.

---

## 4. getillustra.com — illustration inspiration gallery

Browsable 2D/3D/isometric illustration inspiration for product teams.

**Borrow**
1. **Figma-plugin workflow** — pull references straight into design files.
2. **Isometric category** — dimensional product-mockup reference for the
   "Digital Tenge" / platform sections.
3. **Mobile-illustration set** — UI/UX reference for the responsive layouts.

**Avoid — and this is the important one:** **no blanket commercial license** —
"copyright belongs to respective creators," so each asset needs individual
permission. For a **government / central-bank** property that's a hard no for
production assets. Also, the bright, playful house style **clashes** with our
muted gold + forest-green luxury palette.

**Maps to:** **inspiration only.** Our bespoke React-Three-Fiber gold assets
(shanyrak, coins, dust) are a stronger, license-clean, on-palette fit than any
stock illustration. Use Illustra to *study* dimensionality, not to source art.

---

## Cross-cutting takeaways applied

- **One star per view** (dirtyline) + **staged disclosure** (pageflows) →
  reinforced in how the 3D journey and page transitions are paced.
- **Contrast + gradient tooling** (uigoodies) → folded into the open
  accessibility action items in `CODE_REVIEW.md`.
- **License discipline** (illustra) → keep generating bespoke 3D rather than
  importing stock; matters doubly for a public-sector brand.

See `DESIGN_DECISIONS.md` for which of these were actually implemented this pass.
