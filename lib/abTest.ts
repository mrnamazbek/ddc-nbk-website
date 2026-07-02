"use client";

import { useState, useEffect } from "react";

export type ABVariant = "A" | "C";

/**
 * A hook to determine which A/B testing variant to display.
 * Resolves to null during SSR to prevent hydration mismatches, then loads the active variant.
 *
 * Variant C is opt-in via ?variant=C or localStorage. The middle WebGL variant
 * was retired after visual QA, so old assignments are normalized back to A.
 */
export function useABTest(pageKey: string): ABVariant | null {
  const [variant, setVariant] = useState<ABVariant | null>("A");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Check URL query parameter (e.g. ?variant=A or ?variant=C)
    const params = new URLSearchParams(window.location.search);
    const urlVariant = params.get("variant")?.toUpperCase();
    if (urlVariant === "A" || urlVariant === "C") {
      setVariant(urlVariant as ABVariant);
      return;
    }
    if (urlVariant === "B") {
      setVariant("A");
      return;
    }

    // 2. Check localStorage
    const storageKey = `ddc_ab_variant_${pageKey}`;
    const stored = localStorage.getItem(storageKey);
    if (stored === "A" || stored === "C") {
      setVariant(stored as ABVariant);
      return;
    }
    if (stored === "B") {
      localStorage.setItem(storageKey, "A");
      setVariant("A");
      return;
    }

    // 3. Fallback to the stable default. C stays opt-in.
    const randomVariant: ABVariant = "A";
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
