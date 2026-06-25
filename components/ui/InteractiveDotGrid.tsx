"use client";

import dynamic from "next/dynamic";
import { useA11y } from "../theme/AccessibilityProvider";
import { usePathname } from "next/navigation";
import { useABTest } from "@/lib/abTest";

// WebGL/R3F shader background - lazy-loaded to prevent SSR issues and compile load
const ShadersDotCursorBackground = dynamic(() => import("./ShadersDotCursorBackground"), { ssr: false });

export default function InteractiveDotGrid() {
  const { enabled: a11yEnabled, prefersReducedMotion } = useA11y();
  const pathname = usePathname();
  const cleanPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
  const homeLayoutVariant = useABTest("home_layout");

  // If accessibility is enabled or prefers-reduced-motion is active, disable background animations
  if (a11yEnabled || prefersReducedMotion) {
    return null;
  }

  // If we are on the home page and layout Variant B (particle sphere) is active, hide the dot grid
  if ((cleanPath === "/" || cleanPath === "") && homeLayoutVariant === "B") {
    return null;
  }

  return <ShadersDotCursorBackground />;
}