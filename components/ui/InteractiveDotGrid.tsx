"use client";

import { useEffect, useState } from "react";
import { useA11y } from "../theme/AccessibilityProvider";

export default function InteractiveDotGrid() {
  const { enabled: a11yEnabled, prefersReducedMotion } = useA11y();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If accessibility is enabled or prefers-reduced-motion is active, disable background animations
  if (!mounted || a11yEnabled || prefersReducedMotion) {
    return null;
  }

  // The calm forest/gold gradient only, on every page — no interactive canvas.
  // The flowing shader is a Home-hero-only moment, scoped inside Hero.tsx itself.
  return <div className="site-backdrop fixed inset-0 w-full h-screen -z-50 pointer-events-none" aria-hidden="true" />;
}
