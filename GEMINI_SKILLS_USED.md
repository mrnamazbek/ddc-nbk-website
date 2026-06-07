# GEMINI_SKILLS_USED.md

Mapping of the locally-installed Gemini/Antigravity skills
(`~/.gemini/config/skills/`, ~1,445 skills) to the tasks in this review.

> **Note on tooling.** These are skill definitions authored for the Gemini /
> Antigravity agent. This session runs in **Claude Code**, so the skills are not
> *invoked* as executable tools here — instead their `SKILL.md` guidance was
> **read and applied** as expert checklists. Skills whose guidance directly
> shaped a decision are marked ✅ *Applied*; relevant-but-not-yet-needed ones are
> marked 🔖 *On deck* for the phases still pending.

## Selection method

`ls ~/.gemini/config/skills/ | grep -iE "liquid|glass|swiftui|cursor|frontend|3d-web|motion|react-ui|design"`
surfaced the candidates below. Each candidate's `SKILL.md` front-matter +
overview was read before mapping.

## Skill → task map

| Skill | Phase / task | Status | How it applied |
|---|---|---|---|
| `swiftui-liquid-glass` | P4 — Liquid Glass principles | 🔖 On deck | Authoritative source for Apple's `glassEffect` / `GlassEffectContainer` semantics, modifier order, and fallbacks. Will anchor `LIQUID_GLASS_PRINCIPLES.md` so the web translation maps to *real* API behaviour, not a guess. |
| `frontend-design` | P6 cursor, P7 header/transitions, P5D design review | ✅ Applied | "Designer-engineer, not a layout generator — avoid generic AI UI, express a clear POV." Used as the bar when judging the shanyrak cursor + glass header as genuinely on-brand vs. generic. |
| `fixing-motion-performance` | P5B perf, P6 cursor, cursor/scroll motion | ✅ Applied | Compositor-only animation rules. Confirmed `CustomCursor` is transform/rAF-only (no layout thrash) ✓; flagged the cursor effect's full teardown on visibility toggle and the missing `prefers-reduced-motion` guard. |
| `senior-frontend` | P5 code review (React/Next/TS/a11y/bundle) | ✅ Applied | React/Next/TS review checklist — drove the correctness (tsc/eslint/build), unused-import, and accessibility findings in `CODE_REVIEW.md`. |
| `3d-web-experience` | P5 (3D scene review), R3F components | ✅ Applied | R3F/Three.js idioms. Basis for the call that `useFrame` mutation + `Math.random()` particle seeding are *correct* R3F patterns, so the new `react-hooks/immutability`+`purity` rules are false positives → demoted to warnings, not rewritten. |
| `react-ui-patterns` / `frontend-dev-guidelines` | P5C code quality | 🔖 On deck | Component-structure / hook-pattern references for the deeper quality pass (ref-collection pattern, setState-in-effect cleanups). |
| `design-taste-frontend` | P3 design research, P8 apply | 🔖 On deck | Taste rubric for evaluating pageflows / dirtylinestudio / etc. inspiration before borrowing. |
| `swiftui-performance-audit`, `swiftui-ui-patterns` | P4 supporting | 🔖 On deck | Secondary references for how Apple keeps Liquid Glass cheap (blur/saturation budget) — feeds the web `backdrop-filter` budget guidance. |
| `ui-ux-pro-max` | P5 review, P6 cursor, P7 header/transitions, P8 decisions | ✅ Applied | Design-intelligence DB (99 UX guidelines, 97 palettes, react-performance, 50+ styles). Its CSV guidance drove concrete calls — style #14 Liquid Glass (400–600ms, Framer 10/10) for the page transition, ux #9/#99 reduced-motion, #40 aria-labels, #28 focus, #13 transform-perf, #36 contrast. Cited throughout `DESIGN_DECISIONS.md`. *(Installed via `uipro init --ai antigravity`; note: its `scripts/search.py` is broken on Python <3.12 — I read the CSVs directly.)* |
| `magic-ui-generator` (21st.dev Magic) | P6/P7 component generation | 🔖 On deck | 21st.dev's premium React/Tailwind component generator. Not invoked this pass (the cursor/header/transition components were authored by hand against our existing tokens); on deck for future bespoke UI blocks. |

## Applied this session (CI-unblock + assessment phase)

- **`fixing-motion-performance` + `3d-web-experience`** were the decisive inputs
  for the **CI fix**: they justified treating the React-Compiler-era
  `react-hooks/*` errors on R3F/GSAP code as paradigm false-positives
  (demote-to-warning) rather than rewriting working 3D/animation code — honoring
  "don't break working features."
- **`senior-frontend`** structured the correctness sweep (`tsc --noEmit` clean,
  `eslint` 0 errors, `next build` green) recorded in `CODE_REVIEW.md`.
- **`frontend-design`** set the rubric for the cursor/header assessment.

## Still to load (pending phases)

`swiftui-liquid-glass` (P4) and `design-taste-frontend` (P3) will be read in full
when those research deliverables are produced, per the "load the skill, then do
the task" rule.
