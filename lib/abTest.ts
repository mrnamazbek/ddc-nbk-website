"use client";

import { useState, useEffect } from "react";

export type ABVariant = "A" | "B";

/**
 * A hook to determine which A/B testing variant to display.
 * Resolves to null during SSR to prevent hydration mismatches, then loads the active variant.
 */
export function useABTest(pageKey: string): ABVariant | null {
  const [variant, setVariant] = useState<ABVariant | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Check URL query parameter (e.g. ?variant=B or ?variant=A)
    const params = new URLSearchParams(window.location.search);
    const urlVariant = params.get("variant")?.toUpperCase();
    if (urlVariant === "A" || urlVariant === "B") {
      setVariant(urlVariant as ABVariant);
      return;
    }

    // 2. Check localStorage
    const storageKey = `ddc_ab_variant_${pageKey}`;
    const stored = localStorage.getItem(storageKey);
    if (stored === "A" || stored === "B") {
      setVariant(stored as ABVariant);
      return;
    }

    // 3. Fallback to random 50/50 split
    const randomVariant: ABVariant = Math.random() < 0.5 ? "A" : "B";
    try {
      localStorage.setItem(storageKey, randomVariant);
    } catch (e) {
      // ignore
    }
    setVariant(randomVariant);
  }, [pageKey]);

  return variant;
}

/**
 * Sets the active variant for a page in localStorage.
 */
export function setABVariant(pageKey: string, variant: ABVariant) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`ddc_ab_variant_${pageKey}`, variant);
}
