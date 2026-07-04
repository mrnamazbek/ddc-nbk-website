# Small Task Prompt for Gemini 3.5 Flash High in Antigravity

You are working in `/Users/namazbekbekzhanov/AntigravityProjects/ddcnb_site`.

Goal:
Help refine the `/services` and `/mission` Variant B 3D scenes inspired by `https://activetheory.net/work`.

Important design intent:
- Use `AltynAdam` as the main central 3D object.
- Do not use `VertebralColumn` / spine / vertebral-bone objects.
- Keep the scene cinematic, dark, premium, and readable.
- Cards should feel like floating glass/media billboards moving through depth during scroll.
- Do not redesign the entire site.

Files to inspect first:
- `components/sections/Services3D.tsx`
- `components/sections/Mission3D.tsx`
- `components/three/AltynAdam.tsx`

Current validation already passed:
- `npx eslint components/sections/Services3D.tsx components/sections/Mission3D.tsx`
- `npm run build`
- Playwright production screenshots exist in:
  - `output/playwright/active-theory-ddc-check-final/services-top.png`
  - `output/playwright/active-theory-ddc-check-final/services-mid.png`
  - `output/playwright/active-theory-ddc-check-final/services-deep.png`
  - `output/playwright/active-theory-ddc-check-final/mission-top.png`
  - `output/playwright/active-theory-ddc-check-final/mission-mid.png`
  - `output/playwright/active-theory-ddc-check-final/mission-deep.png`

Your task:
Do not make large architecture changes. Identify and propose small, safe improvements only.

Check these specific issues:
1. Is Altyn Adam visible enough behind the glass cards?
2. Is card text readable enough while keeping the glass cinematic effect?
3. Does the HTML heading fade out at the right moment?
4. Are any objects clipped by the navbar or viewport?
5. Is scroll progress smooth and section-relative?
6. Is there any obvious duplicate logic between `Services3D` and `Mission3D` that should be extracted later?
7. Are there any low-risk visual constants to tune: card opacity, targetHeight, model Y/Z position, camera distance, particle count?

Output format:
- Findings
- Small recommended changes
- Exact file/line areas to edit
- Risks

Do not implement unless explicitly asked.
