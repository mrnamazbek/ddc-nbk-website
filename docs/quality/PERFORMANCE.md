# Performance validation

## Purpose

`scripts/performance/measure.mjs` runs a reproducible browser performance
check against a local production server. It is a release guard for the public
marketing routes, not a substitute for field data from real visitors.

## Prerequisites

1. Install dependencies with `npm ci`.
2. Build the production app with `npm run build`.
3. Start it with `npm run start -- --port 3000`.
4. Use a locally installed Google Chrome, or set `CHROME_EXECUTABLE` to a
   Chromium-compatible executable.

## Commands

| Command | Scope |
| --- | --- |
| `npm run perf:measure` | One-run core suite, cold and warm cache, constrained mobile and desktop |
| `npm run perf:core` | Two-run median for the core routes |
| `npm run perf:check` | Cold-cache regression check for core routes; exits non-zero when a budget fails |

The route suites are defined in the script: `core` covers Home, About,
Services, Mission, Careers, Contact, and News; `all` covers every public
localized route. Example:

```bash
npm run perf:measure -- --suite=all --profiles=mobile-constrained,desktop --cache=cold --screenshots=true
```

Reports, raw traces, and screenshots are written under `output/performance/`.
They are intentionally ignored by Git because they are machine-specific.

## Regression budgets

`npm run perf:check` evaluates each run independently:

| Metric | Budget | Reason |
| --- | --- | --- |
| Page errors | 0 | A performance pass cannot hide a broken route |
| Largest Contentful Paint | <= 2500 ms | Cold simulated mobile/desktop release guard |
| Cumulative Layout Shift | < 0.1 | Prevents visible layout jumps |
| Scroll frame rate | >= 45 FPS | Detects obvious animation or rendering regressions |

Budgets can be overridden for an investigation with `--maxLcpMs`, `--maxCls`,
and `--minScrollFps`. Do not relax the defaults in a release check without a
documented reason.

## Measurement notes

- The `mobile-constrained` profile uses a 375x812 touch viewport, 4x CPU
  slowdown, 150 ms latency, and 1.6 Mbps download throughput.
- The desktop profile uses 1440x900 with a local production server. It is
  useful for regression detection but does not represent Vercel edge latency.
- The harness records LCP, CLS, FCP, TTFB, resource transfer, long tasks,
  JavaScript/layout time, and a 1.6-second scroll sample. Its interaction
  sample is not a field INP measurement.
- Validate a representative Vercel deployment separately when release timing,
  CDN caching, or third-party availability changes.

## Manual follow-up

For WebGL, Lottie, font, image, or motion changes, inspect the generated
screenshots and run Chrome DevTools Performance tracing for the affected
route. Include reduced-motion and real-device checks before release.
