"use client";

import { useMounted } from "@/lib/clientState";
import { useA11y } from "../theme/AccessibilityProvider";

export default function InteractiveDotGrid() {
  const { enabled: a11yEnabled, prefersReducedMotion } = useA11y();
  const mounted = useMounted();

  // If accessibility is enabled or prefers-reduced-motion is active, disable background animations
  if (!mounted || a11yEnabled || prefersReducedMotion) {
    return null;
  }

  // The calm forest/gold gradient only, on every page — no interactive canvas.
  // The flowing shader is a Home-hero-only moment, scoped inside Hero.tsx itself.
  return <div className="site-backdrop fixed inset-0 w-full h-screen -z-50 pointer-events-none" aria-hidden="true" />;
}
