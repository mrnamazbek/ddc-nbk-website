# MCP Usage Policy

Use MCP tools intentionally. The goal is a coherent DDCNB site, not a collage of
unrelated component libraries.

## Default Order For UI Work

1. Lazyweb for real product UI references.
2. Project design contract and existing components.
3. Specialized MCP only if it directly supports the task.
4. Implementation.
5. Playwright QA.

## Active Tools

### Lazyweb

Use for product UI research, redesigns, critiques, and reference gathering. It
answers: "What do strong real products do for this screen/pattern?"

Current installed version: `0.14.5`.

Use the router first for non-trivial work:

- `lazyweb-design` — default for improving, critiquing, optimizing, or creating
  product screens. Use when the user wants design decisions, not just examples.
- `lazyweb-design-create` — backend route for a brand-new screen from scratch.
- `lazyweb-quick-search` — lightweight references only. Use when the user asks
  for quick examples or when a fast preflight is enough.
- `lazyweb-generate-flowchart` — canonical architecture/product flow chart.
- `lazyweb-update-flowchart` — refresh an existing chart after code changes.
- `lazyweb-propose-ui-changes` — hosted accept/decline proposal for UI/flow
  changes.
- `lazyweb-explain-flow` — explanatory flow diagram that does not overwrite the
  product's canonical chart.

Before a Lazyweb-driven design task, call `lazyweb_get_workflows` with
`operation=fetch` for the relevant workflow and follow its live instructions.

### Playwright

Use for visual QA, responsive checks, console errors, screenshots, scroll
animation checks, and accessibility smoke testing.

### shadcn

Use for baseline component structure only. Adapt output to DDC tokens and
existing primitives. Do not paste default shadcn styling unchanged.

### Motion / motion-dev

Use for animation references and motion patterns. Final implementation must
still follow `docs/agents/AGENT_DESIGN_CONTRACT.md`.

### shaders

Use only for shader/background/particle tasks. Do not use it for ordinary cards,
forms, or navigation.

### 21st.dev

Use for component inspiration and micro-interaction ideas. Treat results as
references, not final visual language.

### Icons8 MCP

Use for finding premium icon or illustration candidates when the existing icon
registry is insufficient. Downloaded assets must be stored under `public/icons`
or `public/images` with clear names and recolored to the DDC forest/gold palette
when used as first-party UI. Follow `docs/design/ICON_ASSET_PIPELINE.md`.

### IconScout API

Use through scripts or curl only when credentials are available in environment
variables. Never commit `Client-ID`, `Client-Secret`, API tokens, or downloaded
license metadata with secrets. Follow `docs/design/ICON_ASSET_PIPELINE.md`.

Recommended env names:

```bash
ICONSCOUT_CLIENT_ID=
ICONSCOUT_CLIENT_SECRET=
ICONS8_API_KEY=
MOTION_TOKEN=
```

## Optional / Disabled By Default

### Figma

Use only when the user provides a Figma URL or explicitly asks to create/update
Figma. It should not guide normal website changes.

## Project MCP Config Guidance

- Keep project MCP config small and practical.
- Put secrets in local environment variables, never in versioned JSON.
- If a server is experimental, document its purpose before adding it globally.
- Remove or disable MCP servers that are not used by this project.

## Asset Rules

- Prefer SVG for simple logos/icons.
- Use real/generated bitmap imagery for inspectable people, buildings, places,
  and product visuals.
- Recolor first-party SVGs to DDC tokens.
- Keep third-party brand logos in their brand colors unless they are decorative
  monochrome marks.
