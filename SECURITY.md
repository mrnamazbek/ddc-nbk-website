# Security Policy

## Supported scope

This repository is a public, content-focused Next.js website. It does not
operate payment flows, customer accounts, session-based authentication, or a
database. It must not be described as a banking transaction system.

Security work in scope includes browser security headers, client-side data
handling, third-party assets, CI/CD integrity, dependency hygiene, and the
deployment configuration of this repository.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability or include personal,
credential, production-host, or exploit details in GitHub comments.

1. Contact the DDC security owner through the official National Bank / DDC
   contact channel.
2. Include the affected URL or file, a minimal reproduction, impact, and any
   suggested mitigation.
3. Do not access, alter, or exfiltrate data that you do not own.

The maintainers will acknowledge the report through the agreed private channel.
There is no public bug bounty or SLA claimed by this repository.

## Security controls currently implemented

- No application secrets are required at runtime; `.env*` is ignored except for
  `.env.example`.
- Baseline CSP, anti-framing, referrer, MIME-sniffing, permissions, and opener
  policies are configured in `next.config.ts`.
- Contact details are not posted to an application endpoint. The contact form
  prepares a `mailto:` draft in the visitor's own mail client.
- Careers direct candidates to the listed external vacancy source rather than
  simulating HR-system intake.
- CI runs lint, type checking, i18n validation, unit contract checks, a
  production build, and Playwright smoke/security checks.

## Known limits

- The website has no server-side contact intake, spam protection, authentication,
  audit logging, or secure document upload. Add a reviewed backend and privacy
  notice before collecting applications, resumes, or other personal data.
- The current CSP permits the specific Google Fonts, Iconify, and Spline WASM
  endpoints used by the site. The Spline runtime currently loads its modelling
  WASM from `unpkg.com`; this is an availability and supply-chain dependency.
  Adding external scripts, frames, analytics, or CSP origins requires a security
  review and a CSP update.
- `npm audit` is enforced at high severity in CI. Lower-severity advisories are
  reviewed during dependency maintenance; see `CHANGELOG.md` and the security
  review documents for current status.

## Secure contribution checklist

- Never commit secrets, private keys, user data, screenshots containing private
  information, or Vercel tokens.
- Validate and encode all untrusted data before it reaches URLs, HTML, logs, or
  external services.
- Do not add `dangerouslySetInnerHTML` without a documented sanitization and
  threat-model review.
- Do not suppress browser errors globally; fix or explicitly test expected
  behavior.
- Run `npm run check`, `npm run build`, and `npm run test:e2e` before review.
