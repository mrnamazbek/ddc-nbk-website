import { BubbleText } from "@/components/ui/BubbleText";
import ScrollReveal, { ENTRANCE_DURATION, STAGGER } from "@/components/motion/ScrollReveal";
import { cn } from "@/lib/utils";

type PageIntroProps = {
  overline: string;
  titleLine1: string;
  titleAccent: string;
  subtitle: string;
  titleLine2?: string;
  className?: string;
};

/**
 * Canonical opening copy for content routes. It deliberately stays left-aligned
 * and uses the same quiet reveal cadence as the News page rather than giving
 * each route an unrelated hero animation.
 */
export default function PageIntro({
  overline,
  titleLine1,
  titleAccent,
  subtitle,
  titleLine2,
  className,
}: PageIntroProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <ScrollReveal blur={10} duration={ENTRANCE_DURATION.label}>
        <span className="mb-4 block text-xs font-medium uppercase tracking-[0.25em] text-gold-light">
          {overline}
        </span>
      </ScrollReveal>
      <ScrollReveal blur={10} duration={ENTRANCE_DURATION.title} delay={STAGGER.tight}>
        <h1 className="font-display text-4xl font-normal tracking-tight text-foreground sm:text-6xl">
          <BubbleText text={titleLine1} />{" "}
          <BubbleText text={titleAccent} activeClassName="text-gold font-black" />
          {titleLine2 ? (
            <>
              <br />
              <BubbleText text={titleLine2} />
            </>
          ) : null}
        </h1>
      </ScrollReveal>
      <ScrollReveal blur={10} duration={ENTRANCE_DURATION.subtitle} delay={STAGGER.base}>
        <p className="mt-6 text-lg font-light leading-relaxed text-text-secondary">
          <BubbleText text={subtitle} />
        </p>
      </ScrollReveal>
    </div>
  );
}
