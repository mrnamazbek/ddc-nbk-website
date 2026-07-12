# Architecture

## System overview

DDCNB is a Next.js 16 App Router website. It runs as a multilingual public
frontend and does not contain an application database, authentication system,
payment service, API route handler, or server action.

```text
Browser
  -> Vercel / Next.js edge and application runtime
    -> next-intl proxy and locale layout
      -> marketing route + server/client components
        -> static assets, motion, Lottie, Three/Spline/WebGL
    -> server-side HeadHunter vacancy request (cached, fallback content)
```

## Modules and responsibilities

| Area | Responsibility |
| --- | --- |
| `app/[locale]` | Locale metadata, providers, route composition, marketing pages |
| `components/layout` | Header, footer, navigation, scroll behavior |
| `components/sections` | Page-level content sections and business presentation logic |
| `components/ui` | Reusable presentation primitives, inputs, maps, loaders, Lottie wrappers |
| `components/motion` | Motion policy and shared reveal/transition behavior |
| `components/theme` | Theme, icon/background experiments, accessibility preferences |
| `components/three` | Isolated WebGL, model, and Spline scene integration |
| `i18n`, `messages` | Route locales and translated message catalogs |
| `lib` | Side-effect-free helpers, including safe mail-client URL construction |
| `public` | Explicitly shipped static assets; not a source-data store |

## Client/server boundary

- Pages are server components by default. Client components declare `"use client"`
  for interactive controls, animations, local storage, or canvas work.
- `careers/page.tsx` fetches a public HeadHunter endpoint on the server with a
  one-hour Next cache and falls back to local translated vacancies on failure.
- No visitor data is sent to this app. Contact input becomes a local `mailto:`
  draft after client-side validation.
- Browser preferences are stored locally only (`localStorage`) for theme and
  accessibility settings.

## Trust boundaries

| Boundary | Data | Current control |
| --- | --- | --- |
| Visitor -> browser UI | Public content and optional form values | Zod client validation; no app endpoint |
| Browser -> external mail client | User-chosen contact text | URL encoding, explicit mail-client handoff |
| Next server -> HeadHunter | Public vacancy request | Fixed endpoint, server-side fetch, cached fallback |
| Browser -> third-party assets | Fonts and Iconify icons | CSP allowlist and same-origin-first assets |
| CI -> packages | Lockfile dependencies | `npm ci`, dependency audit, minimal permissions |

## Data flow and storage

There is no persistent application data store. Static content lives in locale
JSON files and `public/` assets. The application must not claim that it records
website form submissions, holds candidate records, or processes financial data.

## Deployment model

The project is configured as a standard Next.js/Vercel deployment. GitHub
Actions runs validation on `develop` and `main`; the deployment platform is the
separate control plane. See `docs/operations/DEPLOYMENT.md` for the required
manual confirmation and rollback steps.

## Design and performance boundaries

- Heavy 3D/Spline/WebGL belongs in isolated components and has reduced-motion
  or mobile fallbacks.
- Design tokens in `styles/tokens.css` are the runtime styling source of truth.
- Do not put remote data fetching, URL construction, or policy decisions inside
  generic visual primitives.
- New integrations should be introduced behind a small server-side adapter,
  input/output validation, timeout, error policy, and documented ownership.

## Planned architecture work

1. Replace public-site mail handoff with a dedicated, rate-limited contact
   service only after privacy, retention, and operational ownership are defined.
2. Move the HeadHunter integration into a dedicated server adapter if it gains
   retries, monitoring, or additional sources.
3. Inventory legacy demo and experimental UI modules before any larger cleanup;
   retain them until ownership and route exposure are confirmed.
