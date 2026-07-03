# DDCNB Website Design System Master

> Global source of truth for UI/UX Pro Max recommendations adapted to the real
> DDCNB brand and runtime tokens. Page-specific overrides live in
> `design-system/ddcnb-website/pages/`.

**Project:** DDCNB Website  
**Audience:** National Bank ecosystem, government/public services, financial
infrastructure, investors, partners, citizens  
**Priority:** Premium, credible, accessible, fast, production-ready

---

## Non-Negotiable Rules

- Runtime tokens in `styles/tokens.css` win over generated recommendations.
- Text/headings use Nohemi. Numbers/statistics use the existing numeric/stat
  font classes.
- Brand palette is forest green, gold, and neutral surfaces. Avoid accidental
  blue/purple/default marketplace colors.
- Use project primitives before adding any new component:
  - `components/ui/Button.tsx`
  - `components/ui/GlassCard.tsx`
  - `components/ui/Icon.tsx`
- Motion must be quiet, useful, and readable. Respect reduced motion.
- Heavy particle/WebGL effects belong only in hero/stat/story scenes.

---

## UI/UX Pro Max Synthesis

### Pattern

Use an immersive journey only where it helps storytelling:

1. Hero: clear value statement and brand identity.
2. Proof/stat scene: controlled particle/WebGL moment.
3. Service explanation: clean cards, concrete content, low visual noise.
4. Mission/careers/news/contact: lighter sections with strong readability.
5. Footer: useful navigation and trust links.

Avoid turning every section into a separate experimental animation.

### Style

The correct style for DDCNB is:

- Premium public-infrastructure fintech
- Accessible and ethical
- High contrast
- Token-driven glass/liquid surfaces
- Calm motion and precise spacing
- Government credibility with modern digital polish

### Palette Mapping

Use existing CSS variables, not the generic generated palette:

| Role | Token |
| --- | --- |
| Background | `--background` |
| Foreground | `--foreground` |
| Primary forest | `--color-forest` |
| Secondary forest | `--color-forest-mid` |
| Active green | `--color-forest-light` |
| Premium gold | `--color-gold` |
| Gold hover | `--color-gold-light` |
| Glass | `--glass-bg`, `--glass-border` |
| Text muted | `--text-secondary`, `--text-tertiary` |

### Typography Mapping

- Heading/body/navigation/buttons: Nohemi through project font variables.
- Numbers/statistics: existing numeric/stat classes.
- Body minimum: 16px on mobile.
- Body line-height: 1.5-1.75.
- Paragraph width: roughly 65-75 characters.

### Component Rules

Buttons:

- Use the project `Button` component.
- Minimum touch target: 44px.
- Hover: subtle lift/opacity/border, no layout shift.
- Async actions need loading and disabled states.

Cards:

- Use `GlassCard`, `Card`, or approved `liquid-glass`.
- No nested decorative card shells.
- Stable height where lists/grid cards repeat.
- Interactive cards need focus and hover states.

Icons:

- Use semantic registry in `components/ui/Icon.tsx`.
- Add missing semantic names there.
- Use Icons8/IconScout only through `docs/ICON_ASSET_PIPELINE.md`.

Motion:

- Micro-interactions: 150-300ms.
- Reveals: 350-700ms.
- Use transform/opacity.
- No aggressive parallax over readable text.
- Always include reduced-motion handling.

---

## Accessibility Checklist

- Visible focus rings.
- Keyboard order matches visual order.
- Icon-only buttons have `aria-label`.
- Language selector exposes individual language choices.
- Text contrast meets WCAG AA.
- Touch targets are at least 44x44px.
- 150% and 200% zoom do not break header/floating controls.
- Images have meaningful alt text or empty alt when decorative.

---

## Performance Checklist

- Use `next/image` or optimized assets for content images.
- Dynamically import heavy WebGL/3D below critical content where possible.
- Reserve layout space to avoid CLS.
- Provide mobile fallback for heavy scenes.
- Keep console clean.
- Validate production build before handoff.

---

## Anti-Patterns

- Random blue/purple component defaults.
- Different card radii per page.
- Direct icon-pack imports inside pages.
- Emoji UI icons.
- Animations that compete with text.
- Hero visuals that delay first meaningful content.
- Hard divider lines between immersive sections unless intentional.
- Separate “agent-specific” design systems.
