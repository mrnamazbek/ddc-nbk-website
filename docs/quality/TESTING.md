# Testing strategy

## Automated layers

| Command | Purpose |
| --- | --- |
| `npm run lint` | Static linting; existing warnings are visible technical debt |
| `npm run typecheck` | TypeScript correctness without emitting files |
| `npm run check:i18n` | Locale-key parity and hardcoded-text guard |
| `npm run test:unit` | Repository-level contract checks for security-critical behavior |
| `npm run check:deps` | Fails on high/critical production dependency advisories |
| `npm run build` | Production compilation and route generation |
| `npm run test:e2e` | Production build plus Playwright browser smoke and header tests |
| `npm run perf:check` | Cold-cache LCP, CLS, scroll-FPS, and page-error budget check for core public routes |

`e2e/smoke.spec.ts` validates the public localized route matrix at reduced
motion. `e2e/security.spec.ts` verifies the header contract and the honest
contact handoff copy.

## Manual quality checks

Run when visual, motion, accessibility, external-link, or asset behavior
changes:

- Desktop and mobile screenshots at 390px and 1440px widths
- Keyboard-only navigation, focus visibility, zoom at 150%/200%, and reduced
  motion
- Light and dark theme contrast
- Network/console review for third-party asset failures
- Header, language switcher, theme switcher, contact mail-client handoff, and
  careers external application links

See [Performance validation](PERFORMANCE.md) for local production-server
profiles, browser budgets, reports, and limitations.

Historical visual-audit specs are intentionally not part of the CI contract
because they write to machine-specific absolute paths or query a live external
deployment. Treat them as references to migrate, not release evidence.

## Test data rules

- Do not enter real personal data in local, CI, preview, or recorded tests.
- Keep screenshots and Playwright artifacts out of Git.
- Do not mock a successful server-side submission when no server endpoint exists.
