# Icon And Asset Pipeline

Use this when adding Icons8, IconScout, Phosphor, Solar, or any other icon
source to the site.

## What Icons8 And IconScout Are Good For

- Premium 3D/illustration assets for scene objects and storytelling sections.
- Consistent icon families when the local registry lacks a specific metaphor.
- SVG source for custom particle masks, microservice objects, office/location
  markers, and abstract infrastructure visuals.
- Licensed source material for static images, not random screenshots.

## What They Should Not Do

- They should not replace the approved DDC logo.
- They should not introduce a new page-by-page icon style.
- They should not override `components/ui/Icon.tsx` for ordinary UI.
- They should not bring blue/purple/default marketplace colors into first-party
  DDC components.

## Standard Workflow

1. Define the semantic need: example `linkedin`, `instagram`, `microservices`,
   `data-processing`, `contact-center`.
2. Search Icons8/IconScout for 3-5 candidates in the same visual family.
3. Pick one style family for the page or section.
4. Download SVG when possible.
5. Recolor first-party assets to DDC:
   - primary stroke/fill: `#C9A84C`
   - deep fill/background: `#08140D` or `#0F241A`
   - secondary accent: `#52B788`
6. Optimize SVG with SVGO or an equivalent optimizer.
7. Store files under:
   - `public/icons/` for reusable icons
   - `public/images/particle-targets/` for particle masks/targets
   - `public/images/illustrations/` for larger visuals
8. Register UI icons in `components/ui/Icon.tsx`.
9. Validate in dark and light themes.

## Naming

Use descriptive lowercase names:

```txt
public/icons/social-linkedin-gold.svg
public/icons/social-instagram-gold.svg
public/images/particle-targets/microservices-cubes-gold.svg
public/images/particle-targets/data-processing-conveyor-gold.svg
```

## Icon System Rules

- Interface icons go through `components/ui/Icon.tsx`.
- Social icons may use Phosphor/Iconify/Solar through the semantic registry if
  the visual weight matches.
- Scene/object SVGs can be imported directly only inside the owning scene
  component.
- All first-party SVGs must support `currentColor` or DDC token colors.

## API Credentials

Do not commit real credentials. Use local environment variables:

```bash
ICONSCOUT_CLIENT_ID=
ICONSCOUT_CLIENT_SECRET=
ICONS8_API_KEY=
```

Example IconScout search:

```bash
curl "https://api.iconscout.com/v3/search?asset=icon&query=microservices" \
  -H "Client-ID: $ICONSCOUT_CLIENT_ID"
```

Example IconScout SVG download:

```bash
curl -X POST "https://api.iconscout.com/v3/items/$ITEM_UUID/api-download" \
  -H "Client-ID: $ICONSCOUT_CLIENT_ID" \
  -H "Client-Secret: $ICONSCOUT_CLIENT_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"format":"svg"}'
```

## Review Checklist

- Does it match DDC forest/gold palette?
- Does it match stroke/fill weight with nearby icons?
- Is it readable at 16, 24, 32, and 48px?
- Does it work in dark and light themes?
- Is the file optimized?
- Is the source/license clear?
