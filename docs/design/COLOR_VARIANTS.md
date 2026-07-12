# DDCNB color variants

## Purpose

The site keeps the existing palette as **Variant A / Current** and exposes the
official 2026 brandbook palette as **Variant B / Brandbook**. The switcher is a
manual visual comparison only: it performs no analytics, tracking, cookies, or
random assignment.

The persisted value is `ddc-color-variant` in local storage and is applied to
`<html data-color-variant="current|brand">` before hydration. All routes share
the same document attribute, so navigation does not reset the selection.

## Brandbook source palette

| Brandbook role | Raw value | Intended use |
| --- | --- | --- |
| Primary forest | `#0F534C` | Brand identity, primary green surfaces |
| Deep forest | `#022622` | Dark foundation and readable dark foreground |
| White | `#FFFFFF` | High-contrast dark-theme foreground |
| Gold | `#ECC371` | Brand accent on dark surfaces |
| Teal | `#2BBAAC` | Support accent, status, focus-adjacent decoration |
| Grey | `#9FA3A6` | Secondary neutral source token |
| Light grey | `#E6E6E6` | Neutral border/source token |
| Amber | `#FFBB34` | High-energy brand highlight, not body text on light surfaces |

The source is `brandbook.pptx`, slides 5, 8–11. The book specifies Halvar and
SF Pro, but the website deliberately retains Nohemi because this task does not
change typography.

## Semantic mapping

| Semantic token | Variant A / Current | Variant B / Brandbook dark | Variant B / Brandbook light |
| --- | --- | --- | --- |
| `--background` | `#08140D` | `#022622` | `#F8FAF9` |
| `--surface` | `#0F1F17` | `#083B34` | `#FFFFFF` |
| `--text-primary` | `#F4F7F1` | `#FFFFFF` | `#022622` |
| `--accent-gold` | `#D1B45A` | `#ECC371` | `#805B08` |
| `--color-forest` | `#1A3D2B` | `#0F534C` | `#0F534C` |
| `--color-forest-light` | `#52B788` | `#2BBAAC` | `#2BBAAC` |

`#805B08` is a derived accessible gold for text and interactive labels on
white. The raw official `#ECC371` and `#FFBB34` remain available as
`--brandbook-gold` and `--brandbook-amber` for backgrounds and meaningful
graphics, where they are not used as normal-sized text.

## WCAG contrast verification

| Pair | Contrast | Result |
| --- | ---: | --- |
| White on `#022622` | 16.12:1 | Pass AAA |
| Brandbook gold `#ECC371` on `#022622` | 9.68:1 | Pass AAA |
| Brandbook teal `#2BBAAC` on `#022622` | 6.69:1 | Pass AA |
| `#022622` text on `#F8FAF9` | 15.38:1 | Pass AAA |
| Secondary light text `#315B55` on `#F8FAF9` | 7.26:1 | Pass AAA |
| Accessible gold `#805B08` on `#F8FAF9` | 5.86:1 | Pass AA |
| `#022622` on amber `#FFBB34` control | 9.52:1 | Pass AAA |

## Audit scope and limitations

The global semantic system, Tailwind theme aliases, header, mobile menu,
surfaces, forms that consume shared tokens, and text/icon utility colors follow
the selected variant. A source audit identified hard-coded colors in isolated
WebGL, particle, Lottie/SVG, and animation material definitions. They cannot
be safely recolored by a document CSS token alone; they require their own
runtime palette props. They are intentionally not mass-edited in this variant
change to preserve existing animation behavior.

Future animation work should consume the exposed `--brandbook-*` raw variables
through a shared palette adapter rather than introducing new literals.
