# Changelog

All notable repository changes are documented here. Dates represent repository
changes, not a claim of a production release.

## Unreleased

### Security and delivery

- Added baseline browser security headers and removed the `X-Powered-By` header.
- Removed misleading client-only contact and job-application success flows.
  Contact uses an explicit local mail-client handoff; careers use the official
  external vacancy links already displayed on the page.
- Removed global browser-console interception so runtime errors remain visible
  to users, QA, and monitoring tools.
- Replaced translation HTML injection with `next-intl` rich-text rendering.
- Added type, i18n, unit-contract, dependency-audit, browser smoke, and
  security-header checks to the documented validation workflow and CI.
- Removed confirmed unused direct dependencies to reduce supply-chain surface.

### Documentation

- Replaced outdated implementation claims with architecture, security,
  deployment, testing, threat-model, incident-response, and CI/CD documents.

## Historical notes

Earlier repository documents included design proposals, test snapshots, and
claims that were not always aligned with the implementation. They are not a
source of operational guarantees. Consult the current docs and code instead.
