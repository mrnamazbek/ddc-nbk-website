"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type BgSystem = "bg-forest" | "bg-teal";

interface BgSystemContextType {
  bgSystem: BgSystem;
  setBgSystem: (system: BgSystem) => void;
}

const BgSystemContext = createContext<BgSystemContextType | undefined>(undefined);

export function BgSystemProvider({ children }: { children: React.ReactNode }) {
  const [bgSystem, setBgSystemState] = useState<BgSystem>("bg-forest");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ddc-bg-system") as BgSystem;
    if (saved && (saved === "bg-forest" || saved === "bg-teal")) {
      setBgSystemState(saved);
      updateHtmlClass(saved);
    } else {
      updateHtmlClass("bg-forest");
    }
    setMounted(true);
  }, []);

  const updateHtmlClass = (system: BgSystem) => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.classList.remove("bg-theme-forest", "bg-theme-teal");
      root.classList.add(`bg-theme-${system === "bg-forest" ? "forest" : "teal"}`);
    }
  };

  const setBgSystem = (system: BgSystem) => {
    setBgSystemState(system);
    localStorage.setItem("ddc-bg-system", system);
    updateHtmlClass(system);
  };

  return (
    <BgSystemContext.Provider value={{ bgSystem: mounted ? bgSystem : "bg-forest", setBgSystem }}>
      {children}
    </BgSystemContext.Provider>
  );
}

export function useBgSystem() {
  const context = useContext(BgSystemContext);
  if (!context) {
    throw new Error("useBgSystem must be used within a BgSystemProvider");
  }
  return context;
}
