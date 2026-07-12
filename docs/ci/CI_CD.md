# CI/CD

## GitHub Actions

`.github/workflows/ci.yml` runs on pushes and pull requests targeting `develop`
and `main` with read-only repository permissions.

The workflow performs:

1. `npm ci`
2. `npm run check` (lint, TypeScript, i18n, unit contract tests, production
   dependency audit at high/critical severity)
3. `npm run build`
4. Chromium installation and Playwright smoke/security checks

Failed Playwright runs upload an HTML report artifact. Concurrency cancellation
prevents an outdated workflow for the same branch from consuming capacity.

## Vercel

Vercel is an external deployment control plane. The repository provides the
Next.js build configuration but does not contain a deployment token or assert a
deployment outcome. Review the Vercel deployment record and follow
`docs/operations/DEPLOYMENT.md` for release and rollback.

## Supply-chain policy

- Use the committed `package-lock.json` through `npm ci`.
- Keep direct dependencies justified by a source or build use.
- Review lower-severity advisories; high/critical production advisories fail the
  CI dependency check.
- Upgrade GitHub Actions and npm dependencies deliberately, with a production
  build and browser validation.
