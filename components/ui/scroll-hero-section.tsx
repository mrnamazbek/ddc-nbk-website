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
  /**
   * Content revealed inside the full-bleed panel. The page supplies it from the
   * i18n catalogue — on the Mission page that is the section intro (overline,
   * heading, subtitle), which is why the pillars section no longer repeats it.
   */
  children: React.ReactNode;
  /** Where the highlight band sits, in vh (default 50) */
  startVh?: number;
  /** Space below the sticky block before the reveal panel, in vh (default 50) */
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
  children,
  startVh = 50,
  // Matches the reference: the word column needs a full viewport of run-out
  // before the panel arrives, otherwise the panel starts covering the words
  // while they are still cycling through the highlight band.
  spaceVh = 50,
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
          <h2 className="sr-only">{srSummary}</h2>
          <div className="scroll-word-hero__copy scroll-word-hero__copy--static">{children}</div>
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
        <div className="scroll-word-hero__copy">{children}</div>
      </div>
    </section>
  );
}
