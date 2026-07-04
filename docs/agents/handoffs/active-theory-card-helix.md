# Variant B card motion — the HELIX model (canonical spec)

Applies to: `components/sections/CinematicAltynAdamExperience.tsx` (`ChapterCard`),
used by `/services?variant=B` and `/mission?variant=B`.

This is the agreed motion model for the Active-Theory-inspired chapter cards.
Any agent touching this animation must preserve this model. Do NOT "simplify"
it back into a flat left/right slide — that was the previous mistake.

## The mental model (what the user asked for, verbatim intent)

Axes: **Y is vertical**, X/Z form the horizontal plane (ordinary 3D).

The cards live on a **helix (spiral staircase) around the central column**
(the Altyn Adam statue). As the visitor scrolls:

1. every card **rises along Y** (the whole helix screws upward), and
2. simultaneously **orbits the column in the X/Z plane**.

A card becomes the ACTIVE one at the moment its orbit angle brings it to the
**front of the column at eye level**. It is NOT a carousel that slides cards
right-to-left across the screen; the right-to-left reading at the front is
just the visible arc of the orbit.

```
        (top view, camera at bottom)          (side view)

              back of orbit                      │ past card (parked, high)
           ┌───── φ=180° ─────┐                ──┼──
     left  │        ●         │  right           │ ● active card (eye level)
   (past)  │      column      │ (upcoming)     ──┼──
           └── φ=+64°   φ=−64°┘                  │ ● upcoming card (low)
                  φ=0                            │
               CAMERA                         scroll ⇒ everything climbs
```

## The math (all of it — it is deliberately simple)

One scroll value `progress ∈ [0..1]` drives everything (RAF-damped upstream).
The chapters own the window `CHAPTER_ZONE_START=0.28 … +CHAPTER_ZONE_WIDTH=0.5`.

Per card `i` of `total`:

```ts
span   = CHAPTER_ZONE_WIDTH / total
center = CHAPTER_ZONE_START + (i + 0.5) * span
u      = clamp((progress - center) / span, -SPREAD, +SPREAD)  // signed distance
                                                              // in segments;
                                                              // u=0 → my turn
```

Helix parameterisation (constants live next to `ChapterCard`):

```ts
φ (orbit angle) = u * ORBIT_STEP        // ORBIT_STEP = 64°; φ=0 → front
screenX         = -sin(φ) * ORBIT_RADIUS_VW   // upcoming (u<0) waits RIGHT,
                                              // crosses front, retreats LEFT
screenY         = -u * RISE_VH                // enters from BELOW, eye level
                                              // at front, keeps CLIMBING up
depth cue front = (cos(φ) + 1) / 2            // 1 at front … 0 behind column
scale           = lerp(0.42, 1, front^1.15)   // perspective
opacity         = lerp(0.12, 1, front^1.4) * edge-of-spread fade
blur            = (1 - front) * 9px           // distance haze
rotateY         = deg(φ) * 0.55               // tangent to orbit: faces the
                                              // camera ONLY at the front
zIndex          = 50 + round(front * 40)      // nearer = above
```

Key invariants:

- **Single source of truth**: every visual property is a pure function of `u`.
  No timers, no keyframes, no per-card state. If you need a new behaviour,
  derive it from `u` too.
- **Continuity**: neighbours at u=±1 are visible mid-orbit (side, lower/higher,
  hazed). During a handoff TWO cards are always in frame — outgoing climbing
  away up-left, incoming rising in from down-right. Never a hard cut.
- **The column never moves for the cards.** Altyn Adam is the axis of the
  helix; it only has its own gentle idle sway (inside `AltynAdam.tsx` — do not
  add a second rotation on top).
- **Depth is faked honestly**: cards are DOM (accessibility/i18n), so far-side
  occlusion by the statue is expressed with the `front` haze (opacity+blur+
  scale+z-index), which matches the reference's dusty distance look.
- `scrollToChapter(i)` must land on `u=0` for that card — i.e. progress
  `CHAPTER_ZONE_START + (i + 0.5)/total * CHAPTER_ZONE_WIDTH`. Keep it in sync
  with these constants.

## Tuning knobs (safe to adjust, keep proportions sane)

| Constant          | Current | Meaning                                   |
|-------------------|---------|-------------------------------------------|
| `ORBIT_STEP`      | 64°     | angular gap between neighbouring cards    |
| `ORBIT_RADIUS_VW` | 36      | horizontal reach of the orbit on screen   |
| `RISE_VH`         | 30      | helix pitch — vertical climb per segment  |
| `CARD_SPREAD`     | 1.8     | how many segments away a card stays mounted |

## Related pieces (same file)

- `ParticleRibbon` — background dust; drifts WITH the sweep direction but
  slower (parallax lines in the vertex shader). Keep the drift subtle.
- `ConnectionBurst` — soft round dust flare at chapter handoffs (uses a radial
  canvas sprite; plain square points are forbidden).
- Intro title — dissolves with blur (Active Theory's RGB glitch-shred is their
  signature; we deliberately use a calmer defocus for this brand).
- Reduced motion / a11y mode → `StaticExperience` (no canvas, no sticky, no
  scroll-driven transforms). Any new motion must stay inside the non-reduced
  branch.

## Verified

2026-07-04, Chrome (dev server): both pages, full scroll range, console clean,
`tsc --noEmit` and `eslint` clean. Handoff signature confirmed visually:
outgoing card up-left + incoming down-right, orbiting the statue.
