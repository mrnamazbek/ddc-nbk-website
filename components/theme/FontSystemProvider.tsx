"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type FontSystem = 
  | "pair-a" 
  | "pair-b" 
  | "pair-c" 
  | "nohemi" 
  | "neue-regrade" 
  | "quantify" 
  | "neue-power" 
  | "serena";

interface FontSystemContextType {
  fontSystem: FontSystem;
  setFontSystem: (system: FontSystem) => void;
}

const FontSystemContext = createContext<FontSystemContextType | undefined>(undefined);

export function FontSystemProvider({ children }: { children: React.ReactNode }) {
  const [fontSystem, setFontSystemState] = useState<FontSystem>("pair-a");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let initialSystem: FontSystem | null = null;
    const validFonts: FontSystem[] = [
      "pair-a",
      "pair-b",
      "pair-c",
      "nohemi",
      "neue-regrade",
      "quantify",
      "neue-power",
      "serena"
    ];

    // 1. Check URL parameters for forced testing ?font=
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlFont = params.get("font") as FontSystem;
      if (urlFont && validFonts.includes(urlFont)) {
        initialSystem = urlFont;
        localStorage.setItem("ddc-font-system", urlFont);
      }
    }

    // 2. Check localStorage for already assigned font system
    if (!initialSystem) {
      const saved = localStorage.getItem("ddc-font-system") as FontSystem;
      if (saved && validFonts.includes(saved)) {
        initialSystem = saved;
      }
    }

    // 3. Fallback to A/B testing randomization if brand new visitor
    if (!initialSystem) {
      const rand = Math.random();
      if (rand < 0.5) {
        initialSystem = "pair-a"; // Control group
      } else {
        const variants: FontSystem[] = ["nohemi", "neue-regrade", "quantify", "neue-power", "serena"];
        initialSystem = variants[Math.floor(Math.random() * variants.length)];
      }
      localStorage.setItem("ddc-font-system", initialSystem);
      localStorage.setItem("ddc-font-ab-variant", initialSystem); // Track variant for analytics
    }

    setFontSystemState(initialSystem);
    updateHtmlClass(initialSystem);
    setMounted(true);
  }, []);

  const updateHtmlClass = (system: FontSystem) => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.classList.remove(
        "font-pair-a", 
        "font-pair-b", 
        "font-pair-c", 
        "font-nohemi", 
        "font-neue-regrade", 
        "font-quantify", 
        "font-neue-power", 
        "font-serena"
      );
      root.classList.add(`font-${system}`);
    }
  };

  const setFontSystem = (system: FontSystem) => {
    setFontSystemState(system);
    localStorage.setItem("ddc-font-system", system);
    updateHtmlClass(system);
  };

  return (
    <FontSystemContext.Provider value={{ fontSystem: mounted ? fontSystem : "pair-a", setFontSystem }}>
      {children}
    </FontSystemContext.Provider>
  );
}

export function useFontSystem() {
  const context = useContext(FontSystemContext);
  if (!context) {
    throw new Error("useFontSystem must be used within a FontSystemProvider");
  }
  return context;
}
