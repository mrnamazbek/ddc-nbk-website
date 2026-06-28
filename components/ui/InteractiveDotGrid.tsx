"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useABTest } from "@/lib/abTest";
import { useA11y } from "../theme/AccessibilityProvider";

// WebGL/R3F shader background - lazy-loaded to prevent SSR issues and compile load
const ShadersDotCursorBackground = dynamic(() => import("./ShadersDotCursorBackground"), { ssr: false });
const FlowingHeroShaderBackground = dynamic(() => import("./ShaderBackground"), { ssr: false });

export default function InteractiveDotGrid() {
  const { enabled: a11yEnabled, prefersReducedMotion } = useA11y();
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const homeLayoutVariant = useABTest("home_layout");

  // If accessibility is enabled or prefers-reduced-motion is active, disable background animations
  if (a11yEnabled || prefersReducedMotion) {
    return null;
  }

  const cleanPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
  if ((cleanPath === "/" || cleanPath === "") && homeLayoutVariant === "B") {
    return null;
  }

  if (cleanPath === "/" || cleanPath === "") {
    return <FlowingHeroShaderBackground isLight={resolvedTheme === "light"} />;
  }

  return <ShadersDotCursorBackground />;
}
