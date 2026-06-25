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
