# DDCNB brandbook color system

## Purpose

The production website uses the official 2026 brandbook palette as its only
runtime color system. `data-color-variant="brand"` remains fixed on the root
element so CSS and WebGL scenes share one semantic-token contract. There is no
palette switcher, local-storage preference, analytics, or random assignment.

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

| Semantic token | Brandbook dark | Brandbook light |
| --- | --- | --- |
| `--background` | `#022622` | `#F8FAF9` |
| `--surface` | `#083B34` | `#FFFFFF` |
| `--text-primary` | `#FFFFFF` | `#022622` |
| `--accent-gold` | `#ECC371` | `#805B08` |
| `--color-forest` | `#0F534C` | `#0F534C` |
| `--color-forest-light` | `#2BBAAC` | `#2BBAAC` |

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
surfaces, forms, text, icons, backgrounds, WebGL models, particle fields, and
shader lighting consume the same token set. WebGL reads those values through
`components/theme/useScenePalette.ts`; new scenes must use that adapter instead
of introducing isolated color literals.
