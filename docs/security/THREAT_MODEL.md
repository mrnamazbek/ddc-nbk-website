# Threat model

## Scope and assets

This is a public information website. Primary assets are the integrity of DDC
content, availability of public pages, visitor privacy, deployment integrity,
and the trust implied by links and contact journeys.

Out of scope: payment processing, financial account data, authenticated
transactions, and backend data stores. No such systems exist in this repository.

## Actors and abuse cases

| Actor | Abuse case | Mitigation / status |
| --- | --- | --- |
| External attacker | Inject script/markup through content or URLs | No user-content endpoint; CSP; avoid raw HTML; encoded mailto fields |
| Phishing actor | Abuse an apparently official contact or careers form | No fake submission confirmation; direct external vacancy links; transparent mail-client handoff |
| Supply-chain attacker | Compromise a package or CI action | Lockfile, `npm ci`, dependency audit, minimal direct dependency surface, CI read permission |
| Content editor or compromised commit | Publish unsupported financial claims | Code review and source-backed content policy; no compliance claim without evidence |
| Third-party outage | HeadHunter or icon/font service unavailable | Cached vacancy request with local fallback; same-origin assets preferred |
| Browser attacker | Frame the site, sniff types, retain referrers, or access hardware APIs | CSP, anti-framing, referrer, MIME, permissions, and opener headers |
| Bot/spammer | Submit contact/resume data | The website has no intake endpoint. A future backend must add rate limits, CAPTCHA/abuse controls, validation, and monitoring. |

## Residual risk

- Third-party fonts, Iconify icons, and the Spline WASM runtime remain an
  availability/privacy dependency within the allowlisted CSP origins. Spline
  currently obtains modelling WASM from `unpkg.com`.
- Public `mailto:` disclosure is subject to the visitor's own mail client and
  its configured providers.
- The HeadHunter fetch is a controlled fixed endpoint, but an outage can still
  result in static fallback vacancies.
- Heavy client effects can affect low-end device availability; they need periodic
  device profiling rather than a security control claim.

## Change triggers

Update this model before adding an API route, form backend, authentication,
analytics, upload, external script, new CSP origin, persistent storage, or
financial workflow.
