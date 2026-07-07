# Animation Asset Placement

Lottie JSON animations are stored in `public/animations/` and rendered through
`components/ui/LottieAnimation.tsx`.

## Current Placements

- `career-programmer-code.json` — Careers page, near the "Why Us" block. Context: engineering culture, coding, career growth.
- `online-banking-laptop.json` — Home About section. Context: DDC as the technological wing behind digital financial services. Replaces the previous generic building/liquid collage.
- `lounge-digital-data-protection-and-information-security.json` — Mission page, Step 3 (Information Security). Context: encryption, controlled access, and protection of critical financial data.
- `server-data-sync.json` — Services page, information systems/API integration card. Context: synchronization between internal systems and service layers.
- `data-science-pc-screen.json` — Services page, financial analytics and big data card. Context: dashboards, data factory, analytical reporting.
- `data-science-floating-laptop.json` — Mission page, security and data operations support panel. Context: data operator role and financial flows.

## Audited Candidate Library

| Source file | Decision | Best use case |
| --- | --- | --- |
| `coworking-male-programmer-writing-program-code.json` | Used as `career-programmer-code.json` | Careers, engineering culture, teamwork, "Why choose us" |
| `taxi-data-science-graphs-on-pc-screen.json` | Used as `data-science-pc-screen.json` | Big data, dashboards, analytical reporting |
| `taxi-data-science-graphs-floating-from-laptop.json` | Used as `data-science-floating-laptop.json` | Data operations, innovation, mission support narrative |
| `server-hardware-transferring-digital-data-it-infrastructure-and-networking.json` | Available, not currently used | Heavy server infrastructure scenes only; large file, avoid above the fold |
| `storyline-online-banking-on-laptop-screen.json` | Used as `online-banking-laptop.json` | Digital banking platform, DDC as financial-system technology wing |
| `secure-folder-with-encryption-key-and-password-cyber-defense-and-digital-data-protection.json` | Used as `secure-data-protection.json` | Information security, encryption, access control |
| `network-server-transferring-and-synchronizing-data.json` | Used as `server-data-sync.json` | Microservices, API gateway, data synchronization |
| `network-reviewing-online-resume-of-job-applicant.json` | Candidate only | Future hiring/recruitment process section if such a block is added |
| `network-fintech-startup-and-business-investment.json` | Candidate only | Future innovation/fintech lab content; avoid if it feels too startup/sales-oriented |
| `network-fraud-detection-and-prevention-practices.json` | Candidate only | Future risk/fraud monitoring or compliance section |
| `storyline-biometrics-and-cybersecurity-for-data-protection.json` | Candidate only | Future remote biometric identification/security content; file is relatively heavy |
| `storyline-cryptocurrency-and-nft-market-analytics.json` | Not recommended | Crypto/NFT semantics do not match DDC's public-infrastructure positioning |
| `network-game-development-and-game-design.json` | Not recommended | Game-development context does not fit the site |
| `network-seo-statistics-for-optimization-with-computer-monitor.json` | Not recommended | SEO semantics are unrelated to National Bank infrastructure |
| `outline-rocket-launching-from-computer-monitor.json` | Not recommended | Startup launch metaphor is too generic for regulator infrastructure |

## Rules

- Do not use Lottie as a generic decoration. Each animation must clarify the adjacent content.
- Keep only one heavy animation visible per viewport where possible.
- Use `LottieAnimation` so viewport loading, reduced-motion behavior, and DDC shell styling stay consistent.
- Prefer forest/gold shell styling around third-party animation assets to keep brand coherence.
- Recolor first-party decorative Lottie assets to forest/gold before use. Do not introduce blue/purple marketplace defaults into DDC-owned UI.
