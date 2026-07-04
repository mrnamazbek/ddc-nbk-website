# Architect Review Request for Claude Opus 4.8 High

Context:
We are working on `/Users/namazbekbekzhanov/AntigravityProjects/ddcnb_site`, a Next.js 16 / React 19 / Three.js / R3F site for the Digital Development Center of the National Bank of Kazakhstan.

User goal:
The user wanted the `/services` and `/mission` Variant B pages to feel much closer to the scroll-based 3D work carousel on `https://activetheory.net/work`.

Reference intent from screenshots:
- dark cinematic full-screen WebGL scene
- one strong central vertical 3D artifact
- floating translucent/glass project cards moving through depth during scroll
- premium parallax/camera feeling
- particles/atmosphere around the scene
- for our site, use our own `AltynAdam` 3D model as the central object, not a vertebral bone/spine model

Problem before the latest Codex changes:
Another agent had added a `VertebralColumn` / spine-like object into both `Services3D` and `Mission3D`. That made the scene visually wrong: it looked like Active Theory's vertebral-bone reference instead of our Altyn Adam identity. Scroll progress was also based on the whole document height, which made timing fragile.

Files changed:
- `/Users/namazbekbekzhanov/AntigravityProjects/ddcnb_site/components/sections/Services3D.tsx`
- `/Users/namazbekbekzhanov/AntigravityProjects/ddcnb_site/components/sections/Mission3D.tsx`

Main changes made:
1. Removed `VertebralColumn` import and usage from both 3D sections.
2. Re-centered the scene around `AltynAdam` only.
3. Increased Altyn Adam height and moved it higher so it works as the main vertical anchor behind/through the glass cards.
4. Changed card movement from the earlier wrong cylinder/spine-style setup into a wider Active-Theory-inspired depth travel.
5. Enlarged the glass cards and gave them rounded billboard-like scale.
6. Made the HTML page heading fade almost out after intro, so it does not compete with the 3D card stage.
7. Removed unused 3D intro text (`DDC SERVICES` / `DDC MISSION`) that was being clipped in the middle of the scene.
8. Changed scroll progress to be calculated relative to the current section container instead of the whole document.

Verification already done:
- `npx eslint components/sections/Services3D.tsx components/sections/Mission3D.tsx` passes cleanly.
- `npm run build` passes successfully.
- Production Playwright check on:
  - `http://127.0.0.1:3023/en/services?variant=B`
  - `http://127.0.0.1:3023/en/mission?variant=B`
- Results:
  - `canvasCount: 2` on both pages
  - no console errors
  - screenshots saved in `output/playwright/active-theory-ddc-check-final/`

Current concern:
The scene is now closer than before, but we want an architect-level review. Please check whether this implementation is conceptually and technically correct, and whether there are important improvements before considering it production-ready.

Please review specifically:
1. Is using `AltynAdam` as the only central 3D object the right decision for this user goal?
2. Does the current composition correctly approximate the Active Theory idea without copying irrelevant vertebral-bone details?
3. Is the scroll architecture sound now that progress is section-relative?
4. Are the R3F/Three.js responsibilities clean enough, or should card logic, central model logic, and particle background be extracted into smaller components/hooks?
5. Are there potential performance issues with the current glass card materials, `Environment`, particles, fixed canvas, and `frameloop` behavior?
6. Should the card opacity/depth layering be changed so Altyn Adam remains more visible while card text stays readable?
7. Are there accessibility/reduced-motion concerns with this Variant B approach?
8. What exact next refinements would you recommend, prioritized as P0/P1/P2?

Please answer as an architect review:
- Findings first, ordered by severity.
- Then recommendations.
- Then a short verdict: keep, revise, or rethink.
- Do not rewrite the entire implementation unless there is a serious architecture issue.
