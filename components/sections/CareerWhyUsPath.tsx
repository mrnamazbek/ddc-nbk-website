"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import GlassCard from "@/components/ui/GlassCard";
import Icon from "@/components/ui/Icon";
import LottieAnimation from "@/components/ui/LottieAnimation";
import { AutoRevealingHeading } from "@/components/motion/AutoRevealingHeading";

interface CareerWhyUsPathProps {
  title: string;
  points: string[];
}

const SPOTLIGHT_ANIMATIONS = [
  "/animations/career-center/excellence.json",
  "/animations/career-center/team.json",
  "/animations/career-center/efficiency.json",
  "/animations/career-center/result.json",
];

/** Full Careers adaptation of the downloaded Code (6) connected spotlight. */
export default function CareerWhyUsPath({ title, points }: CareerWhyUsPathProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useGSAP(
    () => {
      const path = pathRef.current;
      if (!path) return;

      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: shouldReduceMotion ? 0 : length,
      });

      if (shouldReduceMotion) return;

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 68%",
          end: "bottom 62%",
          scrub: 0.7,
        },
      });
    },
    { scope: sectionRef, dependencies: [shouldReduceMotion] },
  );

  return (
    <section ref={sectionRef} className="relative mb-24 isolate py-8 sm:py-12 lg:py-20">
      <header className="relative z-20 mb-12 sm:mb-16 lg:mb-20">
        <h2 className="font-display text-3xl font-bold tracking-wide text-white sm:text-4xl">{title}</h2>
      </header>

      <div className="relative">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full overflow-visible lg:block"
          viewBox="0 0 1200 1760"
          preserveAspectRatio="none"
        >
          <path
            d="M 600 8 C 600 120 505 160 505 285 C 505 430 695 440 695 585 C 695 730 505 744 505 885 C 505 1035 695 1040 695 1190 C 695 1330 600 1388 600 1530 C 600 1620 600 1680 600 1752"
            fill="none"
            stroke="color-mix(in srgb, var(--color-forest-light) 16%, transparent)"
            strokeLinecap="round"
            strokeWidth="5"
          />
          <path
            ref={pathRef}
            d="M 600 8 C 600 120 505 160 505 285 C 505 430 695 440 695 585 C 695 730 505 744 505 885 C 505 1035 695 1040 695 1190 C 695 1330 600 1388 600 1530 C 600 1620 600 1680 600 1752"
            fill="none"
            stroke="var(--accent-gold)"
            strokeLinecap="round"
            strokeWidth="5"
          />
        </svg>

        <ol className="relative z-10 space-y-16 sm:space-y-20 lg:space-y-28">
          {points.slice(0, 4).map((point, index) => {
            const cardIsFirst = index % 2 === 0;

            return (
              <li
                key={point}
                className="grid min-h-[340px] items-center gap-8 lg:grid-cols-2 lg:gap-24"
              >
                <div className={cardIsFirst ? "lg:order-1" : "lg:order-2"}>
                  <GlassCard
                    hoverAccent="gold"
                    variant="glass"
                    isTiltEnabled={false}
                    className="border border-white/5 p-6 hover:border-gold/20 sm:p-8"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-gold-light">
                        <Icon name="check" size={17} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="mb-3 block font-mono text-xs text-gold-light/80">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <AutoRevealingHeading
                          text={point}
                          splitBy="word"
                          delay={0.018}
                          className="text-base font-light leading-relaxed text-zinc-200 sm:text-lg"
                        />
                      </div>
                    </div>
                  </GlassCard>
                </div>

                <div
                  className={`relative flex min-h-[280px] items-center justify-center bg-transparent sm:min-h-[320px] ${
                    cardIsFirst ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <LottieAnimation
                    src={SPOTLIGHT_ANIMATIONS[index]}
                    label={`${title} ${index + 1}`}
                    className="w-full max-w-[390px] bg-transparent"
                    frameClassName="min-h-[280px] bg-transparent sm:min-h-[320px]"
                    animationClassName="max-h-[340px] w-full"
                    delay={index * 0.05}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
