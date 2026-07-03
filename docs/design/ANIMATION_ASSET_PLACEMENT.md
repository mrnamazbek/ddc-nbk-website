# Animation Asset Placement

Lottie JSON animations are stored in `public/animations/` and rendered through
`components/ui/LottieAnimation.tsx`.

## Current Placements

- `career-programmer-code.json` — Careers page, near the "Why Us" block. Context: engineering culture, coding, career growth.
- `it-infrastructure-server-data.json` — Services page, infrastructure cybersecurity card. Context: secure server and data-transfer infrastructure.
- `data-science-pc-screen.json` — Services page, financial analytics and big data card. Context: dashboards, data factory, analytical reporting.
- `data-science-floating-laptop.json` — Mission page, security and data operations support panel. Context: data operator role and financial flows.

## Rules

- Do not use Lottie as a generic decoration. Each animation must clarify the adjacent content.
- Keep only one heavy animation visible per viewport where possible.
- Use `LottieAnimation` so viewport loading, reduced-motion behavior, and DDC shell styling stay consistent.
- Prefer forest/gold shell styling around third-party animation assets to keep brand coherence.
