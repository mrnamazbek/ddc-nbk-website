"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type A11yScheme = "bw" | "wb" | "blue"; // чёрным по белому / белым по чёрному / синяя
export type A11yScale = 100 | 125 | 150 | 200;
export type A11ySpacing = "n" | "m" | "l";

export interface A11yState {
  enabled: boolean;
  scheme: A11yScheme;
  scale: A11yScale;
  spacing: A11ySpacing;
  grayscale: boolean;
  serif: boolean;
}

const DEFAULT: A11yState = {
  enabled: false,
  scheme: "bw",
  scale: 125,
  spacing: "n",
  grayscale: false,
  serif: false,
};

interface A11yCtx extends A11yState {
  setEnabled: (b: boolean) => void;
  setScheme: (s: A11yScheme) => void;
  setScale: (s: A11yScale) => void;
  setSpacing: (s: A11ySpacing) => void;
  setGrayscale: (b: boolean) => void;
  setSerif: (b: boolean) => void;
  reset: () => void;
  panelOpen: boolean;
  setPanelOpen: (b: boolean) => void;
  prefersReducedMotion: boolean;
}

const Ctx = createContext<A11yCtx | null>(null);

export const useA11y = (): A11yCtx => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useA11y must be used within AccessibilityProvider");
  return c;
};

const ALL_CLASSES = [
  "a11y",
  "a11y-scheme-bw", "a11y-scheme-wb", "a11y-scheme-blue",
  "a11y-font-100", "a11y-font-125", "a11y-font-150", "a11y-font-200",
  "a11y-spacing-n", "a11y-spacing-m", "a11y-spacing-l",
  "a11y-grayscale", "a11y-serif",
];

/** Writes the low-vision state onto <html> as classes (scoped CSS lives in styles/a11y.css). */
function applyToHtml(s: A11yState) {
  if (typeof document === "undefined") return;
  const r = document.documentElement;
  r.classList.remove(...ALL_CLASSES);
  if (!s.enabled) return;
  r.classList.add("a11y", `a11y-scheme-${s.scheme}`, `a11y-font-${s.scale}`, `a11y-spacing-${s.spacing}`);
  if (s.grayscale) r.classList.add("a11y-grayscale");
  if (s.serif) r.classList.add("a11y-serif");
}

export default function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<A11yState>(DEFAULT);
  const [panelOpen, setPanelOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ddc-a11y");
      if (raw) {
        const s: A11yState = { ...DEFAULT, ...JSON.parse(raw) };
        setState(s);
        applyToHtml(s);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const update = useCallback((patch: Partial<A11yState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem("ddc-a11y", JSON.stringify(next));
      } catch {
        /* ignore */
      }
      applyToHtml(next);
      return next;
    });
  }, []);

  const value: A11yCtx = {
    ...state,
    setEnabled: (b) => update({ enabled: b }),
    setScheme: (s) => update({ scheme: s, enabled: true }),
    setScale: (s) => update({ scale: s, enabled: true }),
    setSpacing: (s) => update({ spacing: s, enabled: true }),
    setGrayscale: (b) => update({ grayscale: b, enabled: true }),
    setSerif: (b) => update({ serif: b, enabled: true }),
    reset: () => update(DEFAULT),
    panelOpen,
    setPanelOpen,
    prefersReducedMotion,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
