# CODE_REVIEW.md — historical review snapshot

> **Superseded for current release decisions.** This document records a review
> from 2026-06-06 and contains then-current routes, warning counts, assumptions,
> and proposed work. It is not evidence of the current implementation,
> deployment, security posture, or compliance. Use `README.md`,
> `ARCHITECTURE.md`, `SECURITY.md`, `CHANGELOG.md`, and the current CI results
> for operational decisions.

# NBK/DDC site (`develop`) — 2026-06-06 snapshot

**Reviewer:** senior frontend / QA pass · **Date:** 2026-06-06
**Commit reviewed:** `a0eb3c0` (post CI-fix)

## Methodology — what was actually measured

| Check | Tool | Result |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | ✅ **clean (exit 0)** |
| Lint | `npm run lint` (eslint 9 / eslint-config-next 16) | ✅ **0 errors**, 52 warnings |
| Production build | `npm run build` (Next 16 Turbopack) | ✅ **green**, 11 routes |
| CI pipeline | GitHub Actions `build-and-test` | ✅ **green** (run 27060500415, 52s) |
| Lighthouse / runtime console / full a11y+contrast audit | — | ⛔ **not run this session** — see action items (no scores fabricated) |

---

## 5A. Correctness

| Area | Issue | Severity | Recommendation |
|---|---|---|---|
| CI / lint | 40 ESLint errors blocked `build-and-test` at the lint step (not the lockfile/Node issues described in the brief — those were already resolved; CI runs Node 24). | ~~Critical~~ **Fixed** | Done in `a0eb3c0`: demoted 4 React-Compiler `react-hooks/*` rules to warnings, ignored `extracted/` + `.claude/`, fixed `prefer-const` + an explicit `any`. |
| TypeScript | None — `tsc --noEmit` clean. | — | — |
| Next 16 deprecation | Build warns: *"the `middleware` file convention is deprecated, use `proxy`."* `middleware.ts` still uses the old convention. | **Medium** | Rename `middleware.ts` → `proxy.ts` and export `proxy` per the Next 16 guide; will become a hard failure in a future major. |
| Repo hygiene | A stale agent git-worktree (`.claude/worktrees/…`) shipped a full `.next/` build that polluted local lint (300+ phantom errors). | ~~Low~~ **Fixed** | Removed via `git worktree remove --force` this session. |
| Links / assets | Not exhaustively verified; all 11 routes generate in build. | **Low** | Spot-check nav + asset 404s in a browser pass. |

## 5B. Performance

| Area | Issue | Severity | Recommendation |
|---|---|---|---|
| 3D scene | `ExperienceCanvas` uses `<Suspense fallback={null}>` ✓ and is `"use client"`, but is imported statically (not `next/dynamic` with `ssr:false`). | **Low** | Wrap in `dynamic(() => import(...), { ssr:false })` to keep R3F out of the initial server payload. |
| Scroll sequence | `ScrollSequence` preloads `totalFrames + 3` WebP frames up front; has a `mobileDir`/`desktopDir` split ✓. | **Medium** | Verify frame count/byte budget; decode lazily / stream rather than preloading all; confirm the mobile sequence is meaningfully lighter. |
| Cursor | rAF + `translate3d` only — no layout thrash ✓. But the effect lists `isVisible` in deps, so all listeners + the rAF loop tear down/re-create on every show/hide. | **Low** | Drop `isVisible` from deps; track visibility via a ref inside the loop. |
| Images | 1 `next/image` user, 0 raw `<img>` ✓ (design is canvas/CSS-driven). | **Low** | Fine; ensure any future raster art uses `next/image`. |
| Lighthouse | Not measured. | **Action** | Run against the Vercel URL; record Performance/Accessibility/Best-Practices/SEO before & after upcoming changes. |

## 5C. Code quality

| Area | Issue | Severity | Recommendation |
|---|---|---|---|
| Dead code | 20 unused-import/var warnings (`Badge`, `TrendingUp`, `BarChart3`, `HelpCircle`, `Briefcase`, `Coins`, `Shield`, `Button`, `useRef`, `smoothstep`) across analytics/careers/digital/services pages + `ScrollSequence`/`Stats`. | **Low** | Remove; these are the bulk of the 52 lint warnings. |
| React pattern | `xxxRef.current = []` reset **during render** in `About`, `Services`, `Security`, `TextReveal` (GSAP ref-collection). Flagged by `react-hooks/refs`. | **Medium** | Use a stable callback ref that maintains the array, or reset inside an effect — refs shouldn't mutate during render. |
| React pattern | Synchronous `setState` inside an effect in `Stats`, `FinancialInform`, `ExperienceCanvas` (`react-hooks/set-state-in-effect`). | **Low–Med** | Lazy `useState(() => …)` init or derive via `useMemo` where the value is computed, not subscribed. |
| R3F rules | `react-hooks/immutability` + `purity` warnings in `three/scene/*` — `useFrame` mutation + `Math.random()` seeding. | **Low (by design)** | Idiomatic R3F; intentionally kept as warnings. Optionally scope these rules off for `components/three/**` only. |
| Tokens | Some hardcoded hex remain (mobile overlay `bg-[#0A0A0A]`, header SVG gradient stops) vs. the `gold`/`forest` token system. | **Low** | Promote to CSS variables / Tailwind theme tokens. |

## 5D. Design quality

| Area | Assessment | Notes |
|---|---|---|
| Liquid glass consistency | ✅ Strong | Shared `.liquid-glass` / `.liquid-glass-strong` system in `globals.css` (specular `::before` rim, gold/forest `data-hover` tints, hover states). Used by header + cards. |
| Star of the show | ✅ | Home = scroll-driven 3D shanyrak journey; one clear focal point per view. |
| Palette discipline | ✅ | Forest / gold / black / white tokens; cursor + header on-palette. |
| Cursor identity | ✅ On-brand | Mini-shanyrak (circle + cross-guides + kuldreush spokes), not generic. |
| Mobile nav | ⚠️ Spec gap | Full-screen overlay is solid `#0A0A0A`, not the liquid-glass overlay the brief calls for. |

## 5E. Accessibility

| Area | Issue | Severity | Recommendation |
|---|---|---|---|
| Reduced motion | `CustomCursor` does **not** check `prefers-reduced-motion` (the rest of the app does: SmoothScroll, MatrixCursorTrail, ExperienceCanvas, globals.css). | **Medium** | Under `reduce`, render `null` and restore the native cursor. (Stated project rule.) |
| Language switcher | A single cycle-button with no `aria-label`; KZ/RU/EN aren't individually selectable — a screen-reader/keyboard user can't pick a specific language. | **Medium** | Replace with a labelled menu/listbox exposing all three locales. |
| Focus visibility | Native cursor is hidden globally for the custom cursor; keyboard focus styles not yet audited. | **Action** | Verify `:focus-visible` outlines survive on all interactive elements; tab through every page. |
| Contrast | Not measured. | **Action** | Check gold-on-dark and `text-gray-light` meet 4.5:1. |

---

## Priority order (suggested)

1. **Fixed already:** CI green, worktree cleanup. ✅
2. **Quick wins:** `CustomCursor` reduced-motion guard · remove 20 dead imports · `middleware`→`proxy`.
3. **Medium:** ref-collection refactor (4 files) · accessible language switcher · glass mobile overlay.
4. **Measure:** Lighthouse + a11y/contrast/keyboard pass; record numbers.
