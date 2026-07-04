"use client";

import { useMemo } from "react";
import { useA11y } from "@/components/theme/AccessibilityProvider";

export type ScrollWordHeroProps = {
  /** Static phrase before the cycling words, e.g. "we " */
  leadIn: string;
  /** Words that cycle through the sticky window, e.g. ["secure.", "connect.", ...] */
  items: string[];
  /** Full sentence for screen readers (always announced, any breakpoint) */
  srSummary: string;
  /** Closing line shown in the full-bleed reveal panel */
  tagline: string;
  /** Where the highlight band sits, in vh (default 50) */
  startVh?: number;
  /** Space below the sticky block before the reveal panel, in vh (default 12) */
  spaceVh?: number;
  className?: string;
};

type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;

/**
 * Sticky word-reveal opener: a lead-in phrase followed by a column of words
 * that "cycle" as the section pins mid-scroll (each successive word is
 * exposed through a fixed vertical window via a stacked negative-offset
 * trick — `top: calc((count - 1) * -1lh)` — the actual mechanism behind the
 * animation), then releases into a full-bleed panel with a closing line.
 *
 * Adapted from a community component: every style is scoped under
 * .scroll-word-hero in styles/scroll-word-hero.css (the source used bare
 * html/body/header/main/footer selectors, which would have overridden this
 * site's real chrome on every page), colors follow the existing light/dark
 * token system, and motion is skipped entirely for reduced-motion /
 * accessibility mode in favour of a static, fully readable fallback.
 */
export default function ScrollWordHero({
  leadIn,
  items,
  srSummary,
  tagline,
  startVh = 50,
  spaceVh = 12,
  className,
}: ScrollWordHeroProps) {
  const { enabled: a11yEnabled, prefersReducedMotion } = useA11y();
  const reduced = a11yEnabled || prefersReducedMotion;

  const style = useMemo<CSSVars>(
    () => ({
      "--swh-count": items.length,
      "--swh-start": `${startVh}vh`,
      "--swh-space": `${spaceVh}vh`,
    }),
    [items.length, startVh, spaceVh]
  );

  if (reduced) {
    return (
      <section className={`scroll-word-hero scroll-word-hero--static ${className ?? ""}`}>
        <div className="scroll-word-hero__static">
          <h2>{srSummary}</h2>
          <p className="scroll-word-hero__tagline scroll-word-hero__tagline--static">{tagline}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`scroll-word-hero ${className ?? ""}`} style={style}>
      <div className="scroll-word-hero__pin">
        <h2 className="sr-only">{srSummary}</h2>
        <div className="scroll-word-hero__stage">
          <span className="scroll-word-hero__lead" aria-hidden="true">
            {leadIn}
          </span>
          <ul className="scroll-word-hero__words" aria-hidden="true">
            {items.map((word, i) => (
              <li key={word} style={{ "--i": i } as React.CSSProperties}>
                {word}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="scroll-word-hero__reveal">
        <div className="scroll-word-hero__panel" aria-hidden="true" />
        <p className="scroll-word-hero__tagline">
          <span>{tagline}</span>
        </p>
      </div>
    </section>
  );
}
