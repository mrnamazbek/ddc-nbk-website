"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { cn } from "@/lib/utils";
import { ENTRANCE_EASE } from "@/components/motion/ScrollReveal";

interface LottieAnimationProps {
  src: string;
  label: string;
  className?: string;
  frameClassName?: string;
  animationClassName?: string;
  loop?: boolean;
  delay?: number;
  shell?: boolean;
}

export default function LottieAnimation({
  src,
  label,
  className,
  frameClassName,
  animationClassName,
  loop = true,
  delay = 0,
  shell = false,
}: LottieAnimationProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const shouldLoad = useInView(rootRef, { once: true, margin: "180px" });
  const isActive = useInView(rootRef, { once: false, margin: "80px" });
  const shouldReduceMotion = useReducedMotion();
  const [animationData, setAnimationData] = useState<unknown>(null);
  const [hasError, setHasError] = useState(false);
  const revealInitial = shouldReduceMotion
    ? false
    : { opacity: 0, y: 22, scale: 0.985, filter: "blur(10px)" };
  const revealInView = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" };

  useEffect(() => {
    if (!shouldLoad || animationData || hasError) return;

    const controller = new AbortController();

    fetch(src, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load animation: ${src}`);
        }
        return response.json();
      })
      .then((data) => setAnimationData(data))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error(error);
        setHasError(true);
      });

    return () => controller.abort();
  }, [animationData, hasError, shouldLoad, src]);

  useEffect(() => {
    const animation = lottieRef.current;
    if (!animation || shouldReduceMotion) return;

    if (isActive) {
      animation.play();
    } else {
      animation.pause();
    }
  }, [isActive, shouldReduceMotion, animationData]);

  return (
    <motion.div
      ref={rootRef}
      role="img"
      aria-label={label}
      initial={revealInitial}
      whileInView={revealInView}
      viewport={{ once: true, margin: "-8%" }}
      transition={{
        duration: shouldReduceMotion ? 0.18 : 0.9,
        delay: shouldReduceMotion ? 0 : delay,
        ease: ENTRANCE_EASE,
      }}
      className={cn("relative overflow-visible", className)}
    >
      <div
        className={cn(
          "relative flex min-h-[240px] items-center justify-center overflow-visible rounded-[inherit]",
          shell && "bg-transparent",
          frameClassName,
        )}
      >
        {animationData ? (
          <Lottie
            lottieRef={lottieRef}
            animationData={animationData}
            autoplay={!shouldReduceMotion && isActive}
            loop={!shouldReduceMotion && loop}
            className={cn("h-full w-full max-h-[520px] overflow-visible", animationClassName)}
          />
        ) : (
          <div className="size-10 rounded-full border border-gold/20 border-t-gold-light animate-spin" />
        )}
      </div>
    </motion.div>
  );
}
