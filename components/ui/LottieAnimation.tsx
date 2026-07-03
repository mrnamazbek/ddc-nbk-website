"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

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
  shell = true,
}: LottieAnimationProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rootRef, { once: true, margin: "160px" });
  const shouldReduceMotion = useReducedMotion();
  const [animationData, setAnimationData] = useState<unknown>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!isInView || animationData || hasError) return;

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
  }, [animationData, hasError, isInView, src]);

  return (
    <motion.div
      ref={rootRef}
      role="img"
      aria-label={label}
      initial={{ opacity: 0, y: 18, scale: 0.98, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative overflow-hidden", className)}
    >
      {shell ? (
        <>
          <div className="absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_30%_10%,rgba(232,200,122,0.14),transparent_36%),radial-gradient(circle_at_85%_80%,rgba(82,183,136,0.16),transparent_44%)]" />
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        </>
      ) : null}

      <div
        className={cn(
          "relative flex min-h-[240px] items-center justify-center rounded-[inherit]",
          shell && "border border-white/8 bg-[#031009]/42 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm",
          frameClassName,
        )}
      >
        {animationData ? (
          <Lottie
            animationData={animationData}
            autoplay={!shouldReduceMotion}
            loop={!shouldReduceMotion && loop}
            className={cn("h-full w-full max-h-[420px]", animationClassName)}
          />
        ) : (
          <div className="flex h-40 w-40 items-center justify-center rounded-full border border-gold/15 bg-gold/[0.04]">
            <div className="size-10 rounded-full border border-gold/30 border-t-gold-light animate-spin" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
