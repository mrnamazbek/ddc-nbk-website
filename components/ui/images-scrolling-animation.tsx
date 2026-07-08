"use client";

import { useRef } from "react";
import { motion, MotionValue, useScroll, useTransform } from "motion/react";

export interface NewsArticle {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  gradient: string;
  link: string;
  image?: string;
}

export interface StackingCard {
  index: number;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  accentColor: string;
  href: string;
}

interface CardItemProps {
  card: StackingCard;
  i: number;
  total: number;
  progress: MotionValue<number>;
  readMoreText: string;
}

// #8B7035 (--color-gold-muted) measured ~3.88:1 against the photo scrim — below
// WCAG's 4.5:1 text minimum — so it's swapped for the brighter --color-gold tone.
const accentColors = ["#E8C87A", "#52B788", "#C9A84C", "#7FD8A8", "#C9A84C", "#D8B85F", "#2D6A4F"];

// Each card rests `STICKY_TOP_STEP_PX` further down than the one before it,
// so once it's stuck, only a thin sliver of every earlier card — the accent
// bar plus a hint of its image — still peeks out above it. `SCALE_STEP`
// tapers older cards down very slightly for extra depth as scroll continues.
const STICKY_TOP_BASE_VH = 6;
const STICKY_TOP_STEP_PX = 25;
const SCALE_STEP = 0.05;

// All N per-card sticky wrappers are equal-height siblings under one shared
// parent, which — per how position:sticky release is computed — makes them
// ALL let go at the exact same scroll position: the instant the last card's
// own slot begins. Without this buffer, the collected pile would vanish the
// moment the last card appears instead of staying put while it's read. One
// extra empty slot at the end pushes that shared release point past the
// last card's whole slot, so the pile holds throughout and only unwinds
// during this trailing buffer, right before the next page section takes over.
const RELEASE_BUFFER_VH = 100;

function articleToCard(article: NewsArticle, index: number, readTimeSuffix: string): StackingCard {
  return {
    index: index + 1,
    label: article.category,
    title: article.title,
    subtitle: `${article.date} · ${article.readTime} ${readTimeSuffix}`,
    description: article.excerpt,
    imageUrl:
      article.image ||
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&crop=center",
    accentColor: accentColors[index % accentColors.length],
    href: article.link,
  };
}

function CardItem({ card, i, total, progress, readMoreText }: CardItemProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Own-position zoom: tracks this card's sticky wrapper directly (not the
  // shared scroll progress), so the image eases from zoomed-in to 1x exactly
  // as the card slides up into place, regardless of how many cards there are.
  const { scrollYProgress: enterProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"],
  });
  const imageScale = useTransform(enterProgress, [0, 1], [1.5, 1]);

  // Depth taper driven by the shared progress: once this card's own turn
  // begins (i / total), it keeps easing down to a slightly smaller resting
  // scale by the time scrolling finishes — later cards taper less, since
  // they spend less of the remaining scroll "behind" newer ones.
  const range: [number, number] = [i / total, 1];
  const targetScale = 1 - (total - i) * SCALE_STEP;
  const scale = useTransform(progress, range, [1, targetScale]);

  const plainTitle = card.title.replace("\n", " ");

  return (
    <div ref={cardRef} className="sticky top-0 flex h-screen w-full items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.article
        style={{
          scale,
          top: `calc(${STICKY_TOP_BASE_VH}vh + ${i * STICKY_TOP_STEP_PX}px)`,
          originY: 0,
        }}
        className="relative mx-auto h-[70vh] sm:h-[76vh] w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl"
        role="group"
        aria-label={`Card ${card.index} of ${total}: ${plainTitle}`}
      >
        <motion.div aria-hidden="true" className="absolute inset-0 h-full w-full" style={{ scale: imageScale }}>
          <img src={card.imageUrl} alt="" className="h-full w-full object-cover" />
        </motion.div>

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.82) 100%)",
          }}
        />

        <div aria-hidden="true" className="absolute left-0 right-0 top-0 h-[3px]" style={{ background: card.accentColor }} />

        <div className="absolute left-6 top-6 flex items-center gap-3 sm:left-9 sm:top-8">
          <div aria-hidden="true" className="h-[6px] w-[6px] shrink-0 rounded-full" style={{ background: card.accentColor }} />
          <span
            className="text-[10px] font-medium uppercase tracking-[0.2em] sm:text-[11px] sm:tracking-[0.22em]"
            style={{ color: card.accentColor, fontFamily: "var(--font-mono, monospace)" }}
          >
            {card.label}
          </span>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-5 top-5 select-none text-[4.5rem] font-black leading-none sm:right-8 sm:text-[6rem]"
          style={{
            color: "transparent",
            WebkitTextStroke: `1px ${card.accentColor}`,
            opacity: 0.22,
            lineHeight: 1,
          }}
        >
          {String(card.index).padStart(2, "0")}
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-5 pb-7 sm:px-9 sm:pb-10">
          <p
            className="mb-2 text-[8px] font-medium uppercase tracking-[0.16em] sm:mb-3 sm:text-[11px] sm:tracking-[0.2em]"
            style={{ color: card.accentColor, fontFamily: "var(--font-mono, monospace)" }}
          >
            {card.subtitle}
          </p>

          <h2
            className="mb-3 line-clamp-3 font-black leading-[1.02] text-white sm:mb-5 sm:leading-[1.05]"
            style={{
              fontSize: "clamp(1rem, 4.2vw, 3.5rem)",
              whiteSpace: "pre-line",
              letterSpacing: "-0.01em",
            }}
          >
            {card.title}
          </h2>

          <div className="mb-4 flex items-start gap-3 sm:mb-5 sm:gap-4">
            <div aria-hidden="true" className="mt-[8px] h-[1px] w-7 shrink-0 sm:mt-[10px] sm:w-10" style={{ background: card.accentColor }} />
            <p className="line-clamp-1 max-w-[55ch] text-[10px] leading-relaxed text-white/70 sm:line-clamp-3 sm:text-[13px]">{card.description}</p>
          </div>

          <a
            href={card.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded py-2 text-[12px] font-semibold uppercase tracking-[0.15em] transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            style={{ color: card.accentColor, fontFamily: "var(--font-mono, monospace)" }}
            aria-label={`${readMoreText}: ${plainTitle}`}
          >
            {readMoreText}
            <svg width="28" height="10" viewBox="0 0 28 10" fill="none" aria-hidden="true">
              <path d="M0 5h26M22 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div
          aria-hidden="true"
          className="absolute bottom-10 right-8 top-20 hidden flex-col items-center justify-center sm:flex"
          style={{ writingMode: "vertical-rl" }}
        >
          <span className="text-[10px] uppercase tracking-[0.25em] text-white opacity-30" style={{ fontFamily: "var(--font-mono, monospace)" }}>
            {card.index} / {total}
          </span>
        </div>
      </motion.article>
    </div>
  );
}

/**
 * Deliberately NOT wrapped in <ReactLenis root> — the site already runs one
 * global Lenis instance via components/layout/SmoothScroll.tsx, mounted around
 * the whole (marketing) layout (so it's already active on this page). A second
 * `root` instance here would fight the first over the same native scroll via
 * two competing rAF loops. useScroll() below reads real scrollY, which the
 * site's existing Lenis instance already drives correctly.
 *
 * Architecture note: each card is genuinely `position: sticky` inside its own
 * full-height slot — the same approach as the reference implementation this
 * was built from. An earlier version faked "sticky" with a single shared
 * `position: fixed` frame plus JS-computed enter/collect transforms, gated by
 * a React-state opacity toggle; that extra JS/state indirection was exactly
 * why cards visibly popped in and out instead of following the scroll
 * smoothly. Native sticky is driven by the compositor on every scroll frame
 * with zero React involvement, so it's inherently as smooth as the scroll
 * itself. (This only works because the page no longer has an overflow-hidden
 * ancestor between here and the viewport — see news/page.tsx — which would
 * otherwise silently stop sticky from engaging at all.)
 */
const ImagesScrollingAnimation = ({
  articles,
  readTimeSuffix,
  readMoreText,
}: {
  articles: NewsArticle[];
  readTimeSuffix: string;
  readMoreText: string;
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // The section's height is the sum of each card's own h-screen slot plus
  // the trailing RELEASE_BUFFER_VH spacer (normal document flow — no manual
  // height calculation needed), so this progress naturally spans that range.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const cards = articles.map((article, index) => articleToCard(article, index, readTimeSuffix));
  const total = cards.length;

  return (
    <section ref={sectionRef} aria-label="Stacking news cards" className="relative w-full">
      {cards.map((card, i) => (
        <CardItem key={card.index} card={card} i={i} total={total} progress={scrollYProgress} readMoreText={readMoreText} />
      ))}
      <div aria-hidden="true" style={{ height: `${RELEASE_BUFFER_VH}vh` }} />
    </section>
  );
};

export { ImagesScrollingAnimation, CardItem as StickyCard_001 };
