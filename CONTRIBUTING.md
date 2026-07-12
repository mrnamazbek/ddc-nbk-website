# Contributing

## Working agreement

1. Start from an up-to-date branch and inspect `git status` before editing.
   Preserve unrelated work.
2. Read `AGENTS.md` and the linked design contract before changing UI, motion,
   assets, or localization.
3. Keep changes small and focused. Do not combine design changes, dependency
   upgrades, and unrelated refactors in one pull request.
4. Add or update tests and documentation whenever behavior, a trust boundary,
   or an operational command changes.

## Local setup

```bash
npm ci
npm run dev
```

Node.js 20.9 or newer is required. Use `.env.example` only for optional local
asset-tool credentials; the website itself has no runtime secret variables.

## Validation

```bash
npm run check
npm run build
npm run test:e2e
```

`npm run check` intentionally fails on high/critical production dependency
advisories. Lint warnings are tracked debt and must not be silently hidden.

## Pull requests

- Explain the user impact, risk, validation performed, and any follow-up work.
- Include before/after screenshots for visual changes at desktop and mobile.
- Explain any CSP, environment, external endpoint, or dependency change.
- Do not claim a certification, compliance status, uptime, or performance score
  unless the evidence is included in the change.
- Security-sensitive changes require the threat-model and rollback implications
  in the PR description.

## Dependency changes

Remove unused packages only after confirming no source import, dynamic import,
or build-script dependency. Prefer supported patch/minor upgrades; test a
production build and browser smoke suite after every dependency update.
