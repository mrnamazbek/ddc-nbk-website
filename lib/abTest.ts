"use client";

import { useState, useEffect } from "react";

export type ABVariant = "A" | "B" | "C";

/**
 * A hook to determine which A/B testing variant to display.
 * Resolves to null during SSR to prevent hydration mismatches, then loads the active variant.
 *
 * Variant C is opt-in only (via ?variant=C or localStorage) — the random split
 * stays A/B so live traffic never lands on the in-progress C experience.
 */
export function useABTest(pageKey: string): ABVariant | null {
  const [variant, setVariant] = useState<ABVariant | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Check URL query parameter (e.g. ?variant=B, ?variant=A or ?variant=C)
    const params = new URLSearchParams(window.location.search);
    const urlVariant = params.get("variant")?.toUpperCase();
    if (urlVariant === "A" || urlVariant === "B" || urlVariant === "C") {
      setVariant(urlVariant as ABVariant);
      return;
    }

    // 2. Check localStorage
    const storageKey = `ddc_ab_variant_${pageKey}`;
    const stored = localStorage.getItem(storageKey);
    if (stored === "A" || stored === "B" || stored === "C") {
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
