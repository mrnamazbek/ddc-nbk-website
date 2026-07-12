# Deployment and rollback

## Preconditions

Before a deployment candidate is approved, run:

```bash
npm ci
npm run check
npm run build
npm run test:e2e
```

Review `git status`, the final diff, dependency changes, and any content claims.
Do not deploy from a dirty working tree or by force-pushing history.

## Delivery flow

1. Open a pull request with the completed validation evidence.
2. GitHub Actions validates the branch.
3. Confirm the Vercel preview's route behavior, console, headers, and key
   desktop/mobile flows.
4. Merge according to the repository branch policy.
5. Confirm the Vercel production deployment status, deployed commit, headers,
   and smoke routes. A successful Git push alone is not evidence of deployment.

## Production smoke checks

- `/ru`, `/kz`, and `/en` return expected localized pages.
- Contact page clearly opens a mail-client draft and does not claim data was
  recorded by this website.
- Careers fallback remains usable if the HeadHunter API is unavailable.
- Security headers are present on an HTML route.
- No new console errors or unexpected failed requests appear on the primary
  routes.

## Rollback

1. Identify the last known-good deployment and its Git commit.
2. Promote/redeploy that immutable deployment through the Vercel dashboard, or
   revert the offending commit with a new reviewed commit.
3. Do not rewrite shared history or force-push to recover a website release.
4. Validate the same smoke checks after rollback.
5. Record the event, impact, decision, and follow-up in the incident log.

## Configuration changes

Changes to Vercel domains, environment variables, redirects, headers, build
settings, or third-party providers require a peer review and a rollback plan.
This repository does not contain production credentials.
