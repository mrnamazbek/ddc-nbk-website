"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useA11y } from "@/components/theme/AccessibilityProvider";
import { cn } from "@/lib/utils";

export interface HeroParallaxProduct {
  title: string;
  link: string;
  /** Full-bleed photo tile (legacy). Mutually exclusive with `icon`. */
  thumbnail?: string;
  /** Monochrome icon rendered on a branded gradient tile instead of a photo. */
  icon?: string;
}

export const HeroParallax = ({
  products,
  title,
  subtitle,
}: {
  products: HeroParallaxProduct[];
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}) => {
  const { enabled: a11yEnabled } = useA11y();

  if (a11yEnabled) {
    return (
      <div className="w-full py-16 px-6 max-w-7xl mx-auto flex flex-col items-start bg-white text-black font-sans">
        <div className="max-w-3xl mb-12 text-left">
          {title && (
            <h2 className="font-display text-3xl sm:text-5xl text-black font-bold mb-4">
              {title}
            </h2>
          )}
          {subtitle && <p className="text-zinc-700 text-base sm:text-lg">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          {products.map((product) => (
            <div key={product.title} className="group relative rounded-[16px] overflow-hidden border-2 border-black p-4 bg-white">
              <Link href={product.link} className="block w-full">
                <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden mb-4 bg-zinc-100 flex items-center justify-center">
                  {product.icon ? (
                    <Image src={product.icon} alt="" aria-hidden="true" width={56} height={56} className="object-contain" />
                  ) : (
                    <Image src={product.thumbnail!} alt={product.title} fill className="object-cover" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-black underline decoration-2">{product.title}</h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <HeroParallaxScrollView products={products} title={title} subtitle={subtitle} />;
};

/**
 * Split out from `HeroParallax` so `useScroll`'s ref-target only ever exists
 * for a component instance that mounts fresh — this section is lazy-loaded
 * behind `LazyOnVisible` + `dynamic(..., { ssr: false })`, and on that first
 * paint Motion's internal scroll-tracker subscribes to the ref via an effect
 * keyed on the ref's IDENTITY (not its `.current` value), so it only ever
 * checks once, on mount; a later re-render of the SAME instance doesn't make
 * it re-check, which is why a callback-ref-triggered re-render alone didn't
 * fix the "Target ref is defined but not hydrated" crash this replaced.
 * Gating this whole subtree behind a `mounted` flag one level up guarantees
 * this component's FIRST render is also the render where its ref-carrying
 * div commits, so Motion's subscription sees a populated ref from the start.
 */
function HeroParallaxScrollView({
  products,
  title,
  subtitle,
}: {
  products: HeroParallaxProduct[];
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="min-h-[960px] md:min-h-[2020px]" aria-hidden="true" />;
  }

  return <HeroParallaxScrollViewInner products={products} title={title} subtitle={subtitle} />;
}

function HeroParallaxScrollViewInner({
  products,
  title,
  subtitle,
}: {
  products: HeroParallaxProduct[];
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}) {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef<HTMLDivElement | null>(null);

  // Initialise synchronously from the real viewport width. This component is
  // ssr:false + mount-gated, so `window` exists on the very first render —
  // seeding the correct value here means the scroll transforms below are
  // created with the right (mobile vs desktop) ranges from the start.
  // Initialising to a constant `false` instead let the transforms bake in
  // desktop translate/rotate values that a later setState no longer updated,
  // so phones got the desktop parallax (heavy tilt, -220px vertical drift)
  // and its rows overflowed the section.
  const [isMobile, setIsMobile] = React.useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, isMobile ? 320 : 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, isMobile ? -320 : -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [isMobile ? 0 : 15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [isMobile ? 0 : 20, 0]),
    springConfig
  );
  // The entrance "fly up into place" offset used to start at -450px (desktop)
  // /-80px (mobile). Combined with `opacity`/`rotateX` finishing their own
  // ease by scrollYProgress 0.2, cards were fully visible and nearly
  // untilted while still ~300px displaced upward — landing their top edge
  // underneath the site's fixed liquid-glass header, which isn't opaque
  // enough to fully hide them, so card text visibly bled through the nav.
  // Halving the offset keeps the drift-down feel without the collision.
  //
  // On mobile the vertical drift is removed entirely (0 → 0): the section
  // there is sized to exactly wrap its content, so any downward drift would
  // push the third card row past the clip box and cut it off, while any
  // upward drift would open a gap. The horizontal slide alone carries the
  // parallax on small screens.
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.6], [isMobile ? 0 : -220, isMobile ? 0 : 50]),
    springConfig
  );

  return (
    <div
      ref={ref}
      // `overflow-hidden` alone doesn't reliably clip the row cards on
      // wide/very-wide viewports: the cards sit inside a `[perspective:1000px]`
      // 3D context (via the parent's rotateX/rotateZ), and browsers can let
      // 3D-transformed descendants paint outside a plain overflow:hidden
      // boundary — visible as a stray card corner/rectangle poking out past
      // the section's right edge. `contain: paint` forces a hard paint
      // boundary that isn't subject to that 3D-transform escape.
      // The box is content-sized (auto height + a min-h floor) on BOTH
      // breakpoints rather than a fixed vh value. The header wraps differently
      // per locale/width and the card rows are a fixed pixel height, so any
      // hard height mismatched the content: on mobile it left dead space, and
      // on desktop `180vh` (1440px at a 800px viewport) was ~500px shorter than
      // the 1938px stack — so the third card row sat permanently below the
      // `contain:paint` clip and could never be scrolled into view, since
      // translateY only drifts ~270px. Auto height wraps the rows exactly.
      className="min-h-[780px] py-10 md:py-20 overflow-hidden [contain:paint] antialiased relative z-20 flex flex-col self-auto [perspective:1000px] hero-parallax-wrapper"
    >
      <Header title={title} subtitle={subtitle} />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-8 md:space-x-20 mb-8 md:mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-8 md:mb-20 space-x-8 md:space-x-20">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-8 md:space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

export const Header = ({
  title,
  subtitle,
}: {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}) => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full  left-0 top-0">
      <h1 className="font-display text-3xl md:text-6xl font-medium tracking-tight text-foreground">
        {title ?? (
          <>
            The Ultimate <br /> development studio
          </>
        )}
      </h1>
      <div className="max-w-2xl text-base md:text-xl mt-8 text-foreground/70 font-light">
        {subtitle}
      </div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: HeroParallaxProduct;
  translate: MotionValue<number>;
}) => {
  // Ties the icon's own tilt to the SAME horizontal scroll-driven value
  // (`translate`) that already moves the whole card row — so the icon visibly
  // reacts as the user scrolls the page.
  const iconRotate = useTransform(translate, [-1000, 1000], [-10, 10]);

  if (product.icon) {
    return (
      <motion.div
        whileHover={{ y: -20 }}
        key={product.title}
        style={{
          x: translate,
          background: "var(--showcase-tile-background)",
          borderColor: "var(--showcase-tile-border)",
          boxShadow: "var(--showcase-tile-shadow)",
        }}
        className="group/product h-40 w-[14rem] md:h-96 md:w-[30rem] relative z-20 shrink-0 rounded-[24px] overflow-hidden border transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)] flex flex-col items-center justify-center gap-4 md:gap-6 p-6"
      >
        <Link
          href={product.link}
          aria-label={product.title}
          className="absolute inset-0 z-10"
        />
        <motion.div style={{ rotate: iconRotate }} className="relative h-12 w-12 md:h-24 md:w-24 shrink-0">
          <Image
            src={product.icon}
            alt=""
            aria-hidden="true"
            fill
            // The browser's native lazy-loading intersection check never
            // resolves for these icons — they sit several `transform` layers
            // deep (outer 3D perspective/rotateX, the row's translateX, this
            // wrapper's own scroll-driven rotate), which throws off viewport
            // intersection math enough that `loading="lazy"` (Next's default)
            // never fires the actual fetch, leaving every tile permanently
            // unloaded. Icons are tiny (≤200px) so eager-loading all of them
            // costs nothing worth trading for a blank card grid.
            loading="eager"
            // Every icon is now a static PNG with real alpha (a black glyph on
            // transparency), so one treatment paints them all white. The three
            // animated GIFs this replaced had no transparent colour index —
            // each frame was an opaque white canvas — which forced a
            // `mix-blend-screen` hack that showed a black box on some surfaces.
            className={cn(
              "object-contain opacity-90 group-hover/product:opacity-100 transition-opacity duration-500",
              "[filter:brightness(0)_invert(1)]"
            )}
          />
        </motion.div>
        <h2 style={{ color: "var(--showcase-tile-foreground)" }} className="font-sans text-xs md:text-sm tracking-wider uppercase font-medium text-center">
          {product.title}
        </h2>
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-40 w-[14rem] md:h-96 md:w-[30rem] relative z-20 shrink-0 rounded-[24px] overflow-hidden border border-glass-border shadow-[0_8px_30px_rgba(0,0,0,0.25)] bg-[#0c0e0d] transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
    >
      <Link
        href={product.link}
        aria-label={product.title}
        className="block h-full w-full relative"
      >
        <Image
          src={product.thumbnail!}
          fill
          sizes="(max-width: 768px) 256px, 480px"
          className="object-cover object-left-top absolute h-full w-full inset-0 rounded-[24px]"
          alt={product.title}
        />
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-background pointer-events-none rounded-[24px]"></div>
      <h2 className="absolute bottom-6 left-6 opacity-0 group-hover/product:opacity-100 text-foreground font-sans text-sm tracking-wider uppercase font-medium">
        {product.title}
      </h2>
    </motion.div>
  );
};
