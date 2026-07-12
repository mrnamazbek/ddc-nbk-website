# DDCNB Website Documentation

This folder is the canonical project memory for agents and maintainers.

## Structure

- `agents/` — agent rules, MCP usage, handoff protocol, and review workflows.
- `agents/handoffs/` — temporary handoff notes for split work. Keep only active or recent notes.
- `architecture/` — implementation notes that affect code structure or runtime behavior.
- `design/` — design system extensions, icon/asset pipeline, animation placement rules.
- `ci/` — CI/CD controls and delivery workflow.
- `operations/` — deployment and rollback guidance.
- `quality/` — automated and manual testing strategy.
- `security/` — threat model and incident-response guidance.
  Includes the current security and architecture review.

## Required Reading For UI Work

1. `AGENTS.md`
2. `DESIGN_SYSTEM.md`
3. `design-system/ddcnb-website/MASTER.md`
4. `docs/agents/AGENT_DESIGN_CONTRACT.md`
5. `docs/agents/MCP_USAGE.md`
6. `docs/agents/AGENT_HANDOFF.md`

When changing UI, use Lazyweb first, keep motion subtle, and commit one logical change at a time.

For repository or delivery changes, begin with `README.md`, `ARCHITECTURE.md`,
`SECURITY.md`, `CONTRIBUTING.md`, and the relevant document in `docs/`.
