"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "@/lib/gsap";
import { usePathname } from "@/i18n/navigation";
import { useA11y } from "../theme/AccessibilityProvider";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname();
  const isPopStateRef = useRef(false);
  const { enabled: a11yEnabled, prefersReducedMotion } = useA11y();
  const [useNativeScroll, setUseNativeScroll] = useState(true);

  useEffect(() => {
    const updateScrollMode = () => {
      const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const noHover = window.matchMedia("(hover: none)").matches;
      const narrowViewport = window.innerWidth < 1024;
      setUseNativeScroll(coarsePointer || noHover || narrowViewport);
    };

    updateScrollMode();
    window.addEventListener("resize", updateScrollMode);
    return () => window.removeEventListener("resize", updateScrollMode);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      isPopStateRef.current = true;
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    // Smooth scroll to hash anchor after page navigation
    if (typeof window !== "undefined") {
      if (window.location.hash) {
        const hash = window.location.hash;
        const targetElement = document.querySelector<HTMLElement>(hash);
        if (targetElement) {
          const timer = setTimeout(() => {
            const lenis = window.__lenis;
            if (lenis) {
              lenis.scrollTo(targetElement);
            } else {
              targetElement.scrollIntoView({ behavior: "smooth" });
            }
            isPopStateRef.current = false;
          }, 400); // Wait for transition and mounting to complete
          return () => clearTimeout(timer);
        }
      } else {
        // If this is a popstate (back/forward) navigation, do not reset scroll to top.
        // Let the browser / Lenis handle restoration, then refresh ScrollTrigger.
        if (isPopStateRef.current) {
          isPopStateRef.current = false;
          const timer = setTimeout(() => {
            ScrollTrigger.refresh();
          }, 400);
          return () => clearTimeout(timer);
        }

        // For normal navigation, reset scroll to top after route change
        const timer = setTimeout(() => {
          const lenis = window.__lenis;
          if (lenis) {
            lenis.scrollTo(0, { immediate: true });
          } else {
            window.scrollTo(0, 0);
          }
          ScrollTrigger.refresh();
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname]);

  useEffect(() => {
    // Keep touch devices and mobile browsers on native scrolling. Lenis wheel
    // smoothing is great for desktop storytelling, but on phones it competes
    // with the browser compositor and can freeze scroll-heavy WebGL sections.
    if (a11yEnabled || prefersReducedMotion || useNativeScroll) {
      if (typeof window !== "undefined") {
        delete window.__lenis;
      }
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      smoothTouch: false,
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
      if (typeof window !== "undefined") {
        delete window.__lenis;
      }
    };
  }, [a11yEnabled, prefersReducedMotion, useNativeScroll]);

  return <>{children}</>;
}
