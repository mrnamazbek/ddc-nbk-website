"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "@/lib/gsap";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    // Disable smooth scroll if user prefers reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    // Expose the instance for programmatic scroll control (debugging the
    // scroll-driven 3D acts, deep-linking to a section, etc.). Harmless in prod.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // Synchronize ScrollTrigger with Lenis scroll events
    const updateScrollTrigger = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", updateScrollTrigger);

    // Bind GSAP ticker to Lenis requestAnimationFrame
    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);

    // Disable default ticker lag smoothing
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", updateScrollTrigger);
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
    };
  }, []);

  return <>{children}</>;
}
