# Incident response guide

## First actions

1. Preserve evidence: deployment URL, commit SHA, timestamps, sanitized logs,
   affected route, and scope. Do not post secrets or personal data publicly.
2. Classify impact: content integrity, privacy, availability, dependency/CI,
   or suspected credential exposure.
3. Contain: disable the affected integration or roll back to a known-good Vercel
   deployment. Do not force-push shared branches.
4. Escalate through the DDC/National Bank official incident and security channel.

## Specific playbooks

### Suspected secret exposure

- Revoke/rotate the secret in its owning provider immediately.
- Remove it from current runtime configuration and Git history only through an
  approved remediation process; do not copy it into tickets or commits.
- Assess deployment logs, CI logs, and preview URLs for exposure.

### Browser security/header regression

- Compare response headers on the affected route with `next.config.ts` and the
  security Playwright test.
- Roll back or patch the header configuration, then rebuild and smoke-test.

### Incorrect content or deceptive workflow

- Remove or correct the claim first.
- Record content source, approver, affected locales, and whether cached pages
  require redeployment.

### Dependency advisory

- Identify reachability and affected production route.
- Apply a compatible patch/minor upgrade or temporary mitigation.
- Run the full validation set and document residual risk if a safe upgrade is
  not available.

## Closure criteria

Document root cause, scope, containment, verification, corrective action,
owner, and follow-up date. Avoid declaring an incident closed until the
deployment and relevant smoke checks are verified.
