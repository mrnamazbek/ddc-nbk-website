# LIQUID_GLASS_PRINCIPLES.md

Apple's **Liquid Glass** (iOS/macOS 26+) translated from its native SwiftUI API
to web (CSS / WebGL), and mapped onto this project's existing
`.liquid-glass` / `.liquid-glass-strong` system. Sourced from the
`swiftui-liquid-glass` Gemini skill + `ui-ux-pro-max` style #14.

---

## What it is

Liquid Glass is a **material**, not a colour. In SwiftUI it's applied with
`.glassEffect(.regular.tint(…).interactive(), in: .rect(cornerRadius: …))`,
grouped in a `GlassEffectContainer`, and morphed across hierarchy changes with
`glassEffectID` + `@Namespace`. It deliberately layers **real-time refraction,
a specular rim, an adaptive tint, and motion-reactive lensing** over live
content — which is exactly what makes it read as physical glass rather than a
flat blur.

Native API anchors (what each principle maps *from*):

| SwiftUI | Role |
|---|---|
| `.glassEffect(.regular)` | the base refractive blur material |
| `.tint(color)` | adaptive colour pulled toward content/brand |
| `.interactive()` | reacts to touch/pointer (the lensing) |
| `GlassEffectContainer(spacing:)` | merges neighbours so they share one optical pass |
| `glassEffectID` + `@Namespace` | **morphing** between states (our page transition!) |
| `#available(iOS 26)` else `.ultraThinMaterial` | graceful fallback |
| modifier order: glass **after** layout | correctness |

---

## The 5 principles → web technique → our status

### 1. Refraction / lensing (light bends through the glass)
- **Apple:** content behind is displaced + blurred, not just dimmed.
- **Web:** `backdrop-filter: blur() saturate()`; for true displacement, an SVG
  `feDisplacementMap` or a WebGL refraction shader on a captured layer.
- **Ours:** `.liquid-glass-strong { backdrop-filter: blur(50px) saturate(220%) }`
  ✅. True displacement is not done (acceptable; blur+saturate reads as glass).

### 2. Specular highlight / the bright rim (edges catch light)
- **Apple:** a thin bright edge that traces the shape.
- **Web:** a gradient-border drawn with a `::before` + `mask-composite` ring.
- **Ours:** `.liquid-glass::before` paints `--glass-border-gradient`
  (white 0.5→0 top/bottom) via `mask: …; mask-composite: exclude` ✅ — textbook.
  The page-transition overlay extends this with **gold leading-edge rims**.

### 3. Adaptive tint (colour pulled from content/brand behind)
- **Apple:** `.tint(...)`; glass leans toward what's under it.
- **Web:** `background-blend-mode` / `mix-blend-mode: luminosity` + a low-opacity
  brand wash.
- **Ours:** `.liquid-glass-strong { background-blend-mode: luminosity }` ✅, plus
  `[data-hover="gold"]` / `[data-hover="forest"]` swap the rim to brand tints ✅.

### 4. Motion-reactive lensing (it responds as you move)
- **Apple:** `.interactive()` — the lens shifts under the pointer/touch.
- **Web:** a subtle `transform: scale()` / parallax shift on hover; pointer-driven
  highlight position.
- **Ours:** glass surfaces transition `transform`/`box-shadow` on hover
  (`cubic-bezier(0.16,1,0.3,1)`) ✅. Opportunity: pointer-tracked specular
  position on key CTAs (small, optional).

### 5. Blur · saturation · brightness balance (the "recipe")
- **Apple:** regular glass is legible — never a frosted slab; saturation lifts
  colour so it doesn't go grey.
- **Web:** pair `blur()` with `saturate()` (and optionally `brightness()`); keep
  text contrast ≥ 4.5:1 over the glass (ux-guideline #36, style #14 caveat).
- **Ours:** light `.liquid-glass` = `blur(8px) saturate(180%)`; strong =
  `blur(50px) saturate(220%)` ✅. Add `brightness(1.05)` only if a surface looks
  muddy over dark content.

### 6. Morphing (bonus — the transition)
- **Apple:** `glassEffectID` morphs glass as the hierarchy animates.
- **Web:** an animated glass surface that sweeps/morphs across a route change.
- **Ours:** the **Phase-7B page transition** *is* the web analogue — a
  `.liquid-glass-strong` panel that covers → commits → reveals, 400–600ms
  (style #14), Framer-driven, with a gold rim. This is the most "Apple LG"
  moment on the site.

---

## Our recipe (reuse these, don't reinvent)

```css
/* already defined in app/globals.css */
.liquid-glass        { backdrop-filter: blur(8px)  saturate(180%); }
.liquid-glass-strong { backdrop-filter: blur(50px) saturate(220%); background-blend-mode: luminosity; }
/* rim via ::before + --glass-border-gradient + mask-composite: exclude */
/* brand tint via [data-hover="gold"|"forest"] */
```

- **Group like Apple's `GlassEffectContainer`:** avoid stacking many independent
  `backdrop-filter` layers (each is a separate, expensive optical pass) — prefer
  one glass parent over N glass children where possible.
- **Always provide the fallback:** Apple gates on `#available`; on web, glass
  degrades to the solid tint when `backdrop-filter` is unsupported, and to
  **no animation** under `prefers-reduced-motion` (the page transition already
  does this).

## Performance & accessibility budget

- Heavy blur (50px) is GPU-costly — keep it to **transient/large surfaces** (the
  transition overlay, the header on scroll), not dozens of simultaneous cards.
- Animate **transform/opacity only** (ux-guideline #13); never animate `blur()`
  values per-frame.
- Respect `prefers-reduced-motion` everywhere (#9/#99). Maintain ≥4.5:1 text
  contrast over every glass surface (#36) — the one real risk of this material.
