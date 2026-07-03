<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- LAZYWEB:ROUTER:BEGIN — managed by Lazyweb -->
## Use Lazyweb by default for product UI work

Before designing, critiquing, or changing any product UI — screens, flows,
landing pages, onboarding, paywalls, pricing, checkout, dashboards, settings
— use Lazyweb first instead of answering from training data. Pull real
evidence with the lazyweb_* tools (lazyweb_search for the exact screen, or
lazyweb_get_workflows to pick a mode), or invoke the matching /lazyweb skill
when local skills are installed. When unsure whether a UI request qualifies,
use Lazyweb. Skip it only for backend/CLI/infra work, prose editing, or
non-product visuals.
<!-- LAZYWEB:ROUTER:END -->

---

# DDCNB Agent Operating Contract

This file is the shared instruction source for Codex, Claude Code, Cursor,
Antigravity/Gemini, and any other coding agent working in this repository.
Do not fork separate design rules per agent. If a tool needs its own entry file
(`CLAUDE.md`, `GEMINI.md`, Cursor rules), that file must point back here.

## Required Reading Order

Before changing product UI, frontend architecture, motion, icons, content, or
assets, read these files in order:

1. `AGENTS.md`
2. `DESIGN_SYSTEM.md`
3. `design-system/ddcnb-website/MASTER.md`
4. `docs/agents/AGENT_DESIGN_CONTRACT.md`
5. `docs/agents/MCP_USAGE.md`
6. `docs/agents/AGENT_HANDOFF.md`
7. Target source files and nearby components
8. Relevant Next.js docs in `node_modules/next/dist/docs/` before using Next APIs

## Product UI Workflow

- Use Lazyweb first for product UI/design work, per the router block above.
- Use the existing component system before creating new UI primitives.
- Use Playwright for visual validation on desktop and mobile when UI changes.
- Use UI UX Pro Max as a recommendation engine, but adapt its output to DDC
  tokens and `design-system/ddcnb-website/MASTER.md`.
- Keep visual changes scoped. One visual decision equals one atomic commit when
  commits are requested.
- Never redesign unrelated pages while fixing one section.

## Canonical Design Rules

- Brand colors are deep forest green, gold, and neutral ink/cream only. Avoid
  blue, purple, neon lime, beige/orange, and random gradients unless the user
  explicitly approves a specific reference.
- Runtime tokens in `styles/tokens.css` win over prose. Do not hardcode new
  color values, radii, shadows, fonts, or durations in TSX.
- Text/headings use Nohemi via project font variables. Statistics and numeric
  hero values use the old numeric/stat font through the existing number classes.
- Use `components/ui/Button.tsx` for buttons, `components/ui/GlassCard.tsx` or
  approved liquid/glass globals for cards, and `components/ui/Icon.tsx` for
  semantic icons.
- Cards use `--radius-card`; buttons use `--radius-button`; inputs use
  `--radius-input`.
- Motion must be premium and quiet: opacity, transform, subtle scale, and smooth
  scroll choreography. Respect reduced-motion preferences.
- Heavy WebGL/particle effects are reserved for hero/stat/story scenes. Other
  sections should stay cleaner for readability.

## Agent Coordination

- Declare role, objective, owned files, and validation plan before edits when
  working as a delegated agent.
- Do not let two agents edit the same file at the same time.
- If a file changed unexpectedly, assume another human/agent did it. Read it,
  adapt, and do not revert unrelated changes.
- Use `docs/agents/handoffs/` for handoff notes when splitting work between
  Codex, Claude, and Antigravity/Gemini.
- Claude should be used for architecture review, risk review, and cross-file
  reasoning unless assigned a narrow write scope.
- Antigravity/Gemini should be used for small isolated implementation, research,
  asset audits, and visual QA tasks with explicit file boundaries.
