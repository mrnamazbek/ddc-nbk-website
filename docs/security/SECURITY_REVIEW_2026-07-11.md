# Security and architecture review — 2026-07-11

## Scope and method

Reviewed the public Next.js website, its CI configuration, dependency manifest
and lockfile, browser-facing source, deployment configuration, and local
production build. This review did not assess external National Bank systems,
Vercel account permissions, HeadHunter, email providers, or third-party CDN
infrastructure.

Validation completed locally: `npm run check`, `npm run build`, and the
Playwright smoke/security suite against a production build.

## Remediated findings

| ID | Severity | Component | Evidence and root cause | Smallest safe fix | Validation | Remaining risk |
| --- | --- | --- | --- | --- | --- | --- |
| SEC-001 | P1 | `contact/page.tsx` | The form delayed locally, logged form data to the browser console, and displayed a success state despite having no server-side recipient or storage. | Replaced the simulation with validated, encoded `mailto:` draft generation; removed the PII log and false success claim. | Unit contract test and browser smoke check pass. | Delivery and privacy now depend on the visitor's mail provider; there is no server-side intake or anti-spam control. |
| SEC-002 | P1 | `JobApplicationForm.tsx` | The careers form collected candidate data and claimed that it was stored in an HR database, but no intake endpoint existed. | Removed the misleading form and direct candidates to the listed external vacancy URL. | Type check, i18n check, and public-route smoke pass. | External vacancy provider availability and privacy terms remain outside this repository. |
| SEC-003 | P1 | `ThemeProvider.tsx` | Global overrides of `console.error` and `console.warn` suppressed React and runtime diagnostics. | Removed the overrides so production errors remain observable. | Production Playwright run completed with no page errors. | Browser reporting/alerting service is not configured. |
| SEC-004 | P2 | `next.config.ts` | No baseline browser security headers were configured. | Added CSP, anti-framing, MIME-sniffing, referrer, permissions, and opener policies; disabled `X-Powered-By`. | Header assertions pass in Playwright. | CSP contains narrowly scoped inline style/script allowances needed by Next and animation tooling; review them when those dependencies change. |
| SEC-005 | P2 | `analytics/page.tsx` | Translated strings were rendered with `dangerouslySetInnerHTML`, creating an unnecessary raw HTML path. | Replaced it with `next-intl` rich-text interpolation using a controlled `strong` renderer. | Type check and build pass; raw HTML search found no remaining implementation use. | Translation files remain trusted repository content and must still be reviewed. |
| SEC-006 | P2 | Root and locale layouts; typewriter component | Invalid nested document shells plus first-render motion preference branching caused production hydration errors once logging was restored. | Moved the document shell to the root layout, made locale content a language-marked wrapper, and deferred motion preference to client state. | Production build and reduced-motion route smoke pass without page errors. | The root document defaults to Russian while the localized application wrapper provides the page language; keep that wrapper when changing layouts. |
| DEP-001 | P2 | `package.json`, lockfile | Direct manifest contained unused packages and audit reported vulnerable dependency paths. | Removed verified unused direct packages; upgraded Next and ESLint config; pinned PostCSS through `overrides`. | Full `npm audit` and production dependency check report zero vulnerabilities. | Dependency security requires recurring updates; package install scripts still require maintainer review. |
| ARCH-001 | P2 | Test and CI boundaries | CI did not run a coherent production build plus focused smoke/security suite; historical E2E files had machine-specific assumptions. | Added reproducible contract, smoke, and header tests; narrowed CI to maintained tests and upload report on failure. | `npm run test:e2e` passes locally. | Historical test files remain excluded until they are rewritten against stable fixtures. |

## Residual findings and follow-up work

| ID | Severity | Component | Evidence / impact | Recommended next step |
| --- | --- | --- | --- | --- |
| RES-001 | P3 | Spline scenes | The modelling WASM is dynamically loaded from `https://unpkg.com`; an outage or compromise affects scene availability and adds a third-party trust boundary. | Self-host and integrity-review the runtime artifact, or replace the dependency with a locally bundled alternative. |
| RES-002 | P3 | GitHub Actions | Workflow actions are version-tagged rather than commit-SHA pinned. A mutable tag is a supply-chain exposure. | Pin actions to reviewed full commit SHAs and review on update. |
| RES-003 | P3 | Lint baseline | `npm run lint` exits successfully but reports existing warnings. Warning debt can hide new regressions. | Address warnings in focused changes; do not disable rules globally. |
| RES-004 | P3 | Public service data | Careers uses an external vacancy source and has a local fallback; content accuracy and availability are not controlled by the website. | Establish an owner and update cadence for public content and external links. |

## Repository cleanup decisions

- Removed the tracked generated Playwright `test-results/.last-run.json` and
  ignored future `.playwright-cli/` artifacts.
- Retained `.codex/`, historical extracted content, and other non-obvious
  assets because their runtime/documentation use was not proven absent.
- Preserved the untracked user file `news-current.png`; it is outside this
  review's change set.

## Release assessment

Within the reviewed repository scope, there are no known unresolved P0/P1
findings. The project is suitable for a **controlled public-content release**
provided the residual third-party, content-governance, and monitoring limits
are accepted. It is not evidence of compliance certification or readiness for
transactional financial workflows.
