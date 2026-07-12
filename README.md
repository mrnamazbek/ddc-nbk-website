# DDCNB Website

Public multilingual website for the Digital Development Center (DDC) in the
National Bank of Kazakhstan ecosystem. It presents DDC information, services,
mission, careers, news, contact details, and visual storytelling. It is **not**
a transaction system, customer portal, or authenticated fintech application.

## Capabilities

- Russian, Kazakh, and English routing with `next-intl`
- Dark and light themes with accessibility preferences and reduced-motion paths
- Responsive marketing pages, maps, careers links, news, and contact details
- Progressive enhancement for Lottie, 3D, Spline, and WebGL storytelling
- Contact handoff through the visitor's local email client; no website-side
  contact or resume storage

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS 4 and project design tokens
- `next-intl`, `next-themes`, React Hook Form, Zod
- Framer Motion, GSAP, Three.js / React Three Fiber, Lottie
- Playwright and Axe for browser validation

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for the actual module boundaries, data
flow, trust boundaries, and deployment model. The short version:

```text
app/[locale] routes
  -> marketing layouts and page composition
  -> components/{layout,motion,sections,theme,three,ui}
  -> lib + i18n + static public assets
```

There are no database models, API route handlers, sessions, or server actions
in the reviewed application. The only runtime server-side outbound request is
the cached public HeadHunter vacancy lookup, which falls back to local content.

## Security and privacy

- Runtime browser headers are configured in `next.config.ts`.
- The project does not require runtime application secrets.
- Contact form values are encoded into a `mailto:` draft only after local
  validation; the site does not submit or persist the content.
- Do not add authentication, PII collection, document uploads, or payment data
  without a reviewed server-side design, rate limiting, validation, privacy
  notice, logging policy, and incident response.

Read [SECURITY.md](SECURITY.md), the [threat model](docs/security/THREAT_MODEL.md),
and [incident response guide](docs/security/INCIDENT_RESPONSE.md) before making
security-sensitive changes.

## Accessibility

The project provides theme switching, a low-vision panel, visible focus states,
keyboard controls, and reduced-motion fallbacks. Accessibility is tested with
Playwright/Axe but is not a substitute for a formal conformance audit. See
[testing strategy](docs/quality/TESTING.md).

## Local setup

Prerequisite: Node.js `>=20.9.0` and npm.

```bash
git clone https://github.com/mrnamazbek/ddc-nbk-website.git
cd ddc-nbk-website
npm ci
npm run dev
```

Open `http://localhost:3000/ru`.

### Environment variables

The deployed site has no runtime secret variables. `.env.example` documents
optional local-only credentials for asset discovery tooling. Never commit a
real `.env*` file or expose a credential as `NEXT_PUBLIC_*`.

## Commands

```bash
npm run dev              # development server
npm run lint             # ESLint (warnings are reported but do not fail)
npm run typecheck        # TypeScript, no emit
npm run check:i18n       # translation parity and hardcoded-text guard
npm run test:unit        # lightweight repository contract tests
npm run check:deps       # fail on high/critical production dependency advisories
npm run check            # static, i18n, unit, and dependency checks
npm run build            # production build
npm run test:e2e         # build, then Playwright smoke/security suite
```

## Deployment

GitHub Actions validates pushes and pull requests for `develop` and `main`.
Vercel deployment is repository-integrated and must be confirmed in the Vercel
dashboard; this repository does not treat a Git push as deployment evidence.
Follow [deployment and rollback](docs/operations/DEPLOYMENT.md).

## Repository organization

- `app/` - Next.js App Router routes and layouts
- `components/` - reusable layout, UI, motion, section, theme, and 3D modules
- `i18n/`, `messages/` - locale routing and translated content
- `lib/` - framework-independent utilities
- `public/` - intentionally shipped static assets
- `styles/` - CSS tokens and accessibility styles
- `e2e/`, `tests/` - automated browser and contract checks
- `docs/` - architecture, operations, security, design, and agent guidance
- `scripts/` - deterministic repository checks and agent helpers

## Contribution workflow

Read [CONTRIBUTING.md](CONTRIBUTING.md), `AGENTS.md`, and the PR template.
Keep changes focused and validate them locally. Visual changes require desktop
and mobile checks; security or dependency changes require a risk and rollback
note.

## Known limitations and roadmap

- No server-side form intake, CV upload, spam prevention, authentication, or
  observability service is implemented.
- Several heavy visual scenes need periodic device-performance profiling.
- Existing ESLint warnings are documented technical debt; they are not hidden
  or treated as evidence of a clean codebase.
- A production backend for personal-data workflows requires a separate threat
  model, retention policy, DPA/privacy review, abuse controls, and monitoring.

## License and security reporting

No software license is currently declared in this repository. Confirm legal
ownership and licensing for code, fonts, media, models, and third-party assets
before reuse or publication. Security reporting instructions are in
[SECURITY.md](SECURITY.md).
