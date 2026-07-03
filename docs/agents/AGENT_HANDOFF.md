# Agent Handoff Protocol

Use this when splitting tasks between Codex, Claude Code, Cursor, and
Antigravity/Gemini.

## Roles

- Lead Frontend Architect: owns architecture, scope, final integration, and
  rollback strategy.
- UI Component Worker: implements a narrow UI component or page section.
- Motion/WebGL Worker: owns a specific animation scene or shader file.
- Asset Librarian: researches Icons8/IconScout/assets and prepares optimized
  files.
- QA Engineer: runs Playwright, mobile, zoom, accessibility, console, and build
  checks.
- Reviewer: reads diffs and reports risks without editing unless explicitly
  assigned.

## Rules

- One owner per file at a time.
- Declare write scope before edits.
- Do not edit files outside the write scope.
- Do not revert changes made by another user or agent.
- If the same file must be touched by multiple roles, sequence the work and
  write a handoff note first.
- Every requested commit should be atomic: one purpose, one diff.

## Handoff Template

```md
## Agent Handoff

Role:
Objective:
Write scope:
Read-only context:
MCP/tools allowed:
Do not touch:
Design rules:
Validation required:

Status:
Files changed:
Commands run:
Screenshots:
Risks:
Next step:
```

## External Agent Prompts

### Claude Code

Use Claude for architecture/review/cross-file reasoning:

```txt
Read AGENTS.md, DESIGN_SYSTEM.md, docs/agents/AGENT_DESIGN_CONTRACT.md,
design-system/ddcnb-website/MASTER.md, docs/agents/MCP_USAGE.md, and
docs/agents/AGENT_HANDOFF.md first.

Role: Reviewer / Frontend Architect.
Task: [specific task]
Write scope: [none or exact files]
Do not touch: everything outside write scope.
Output: findings, risks, exact files/lines, suggested patch plan.
```

### Antigravity / Gemini

Use Antigravity/Gemini for narrow implementation or QA:

```bash
agy --print --model "Gemini 3.5 Flash (High)" \
  "Read AGENTS.md, design-system/ddcnb-website/MASTER.md, and
   docs/agents/AGENT_HANDOFF.md. Role: QA Engineer.
   Task: inspect [page/section]. Do not edit files. Return issues with
   screenshots/steps and exact viewport sizes."
```

For edits, include an exact file list and tell it to stop if another target file
has changed.
