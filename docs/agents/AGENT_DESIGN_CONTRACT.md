# Agent Design Contract

This is the compact contract every agent follows before touching DDCNB UI. It
keeps the site premium, coherent, and easy to roll back.

## Source Of Truth

- Runtime tokens: `styles/tokens.css`
- Global implementation details: `app/globals.css`
- Human design intent: `DESIGN_SYSTEM.md`
- UI/UX Pro Max adaptation: `design-system/ddcnb-website/MASTER.md`
- Shared agent policy: `AGENTS.md`
- Component primitives: `components/ui/*`

If a doc conflicts with runtime tokens, update the doc or ask. Do not invent a
third style in a component.

## Brand Palette

Use the site palette only:

- Forest: `--color-forest`, `--color-forest-mid`, `--color-forest-light`,
  `--color-forest-dark`
- Gold: `--color-gold`, `--color-gold-light`, `--color-gold-muted`,
  `--color-gold-dark`
- Neutral: `--background`, `--foreground`, `--text-*`, `--surface`
- Glass: `--glass-bg`, `--glass-border`, `--glass-border-gold`,
  `--glass-border-forest`

No accidental blue/purple UI. Blue is allowed only for third-party product logos
or explicitly approved references.

## Typography

- Use Nohemi for text, headings, labels, buttons, and navigation.
- Use the existing numeric/stat font classes for numbers and data hero values.
- Do not add font A/B tests unless the user explicitly asks.
- Keep letter spacing non-negative. Large uppercase labels may use tracked
  spacing, but body copy should remain readable.

## Components

- Buttons: use `components/ui/Button.tsx` first.
- Hero-only buttons: `MetalButton` or `ShimmerButton` only where already
  established.
- Cards: use `components/ui/GlassCard.tsx`, `Card`, or approved `liquid-glass`
  classes. Avoid raw one-off card shells.
- Icons: use `components/ui/Icon.tsx` semantic names. Add missing names there
  rather than importing icon packs directly inside pages.
- Logos: use the approved DDC logo assets. Do not replace them with approximate
  generated SVGs unless the logo has been verified visually.

## Motion

Default motion recipe:

- Duration: `--duration-base` for hover, `--duration-slow` for reveal
- Ease: `--ease-out-expo` for entrances, `--ease-smooth` for ordinary UI
- Properties: `opacity`, `transform`, `scale`, `translate`, `clip-path` only
  when already used in the local pattern
- Reduced motion: every custom animation must have a reduced-motion path

Avoid animating layout, blur, large filters, or color loops in ordinary content.
WebGL/particle effects belong in hero/stat/story scenes only.

## Page Structure

- First screen should be the usable product/brand experience, not generic
  marketing filler.
- Keep section transitions soft: gradient/fade, no harsh divider lines unless a
  section intentionally needs a rule.
- Keep dense operational content scannable. Use cards for repeated items, not
  every section wrapper.

## Quality Gate

Before handing off UI changes, run the relevant checks:

- `npm run build` for code changes
- Playwright desktop screenshot for layout-sensitive changes
- Playwright mobile screenshot for navigation, hero, maps, or cards
- Check 150% and 200% zoom if header/navigation/accessibility changed
- Check console for runtime errors
