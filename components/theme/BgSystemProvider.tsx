"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useClientOnce } from "@/lib/clientState";

export type BgSystem = "bg-forest" | "bg-teal";

interface BgSystemContextType {
  bgSystem: BgSystem;
  setBgSystem: (system: BgSystem) => void;
}

const BgSystemContext = createContext<BgSystemContextType | undefined>(undefined);

// Вынесена на модульный уровень: не зависит от состояния компонента, а её
// прежнее объявление ПОСЛЕ использующего эффекта ловил линтер
// («Cannot access variable before it is declared»).
function updateHtmlClass(system: BgSystem) {
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    root.classList.remove("bg-theme-forest", "bg-theme-teal");
    root.classList.add(`bg-theme-${system === "bg-forest" ? "forest" : "teal"}`);
  }
}

function readSavedBgSystem(): BgSystem | null {
  const saved = localStorage.getItem("ddc-bg-system");
  return saved === "bg-forest" || saved === "bg-teal" ? saved : null;
}

export function BgSystemProvider({ children }: { children: React.ReactNode }) {
  // Сохранённое значение читается один раз на клиенте без setState-в-эффекте:
  // SSR отдаёт дефолт, клиент сразу после гидрации — сохранённое.
  const saved = useClientOnce<BgSystem | null>(readSavedBgSystem, null);
  const [override, setOverride] = useState<BgSystem | null>(null);

  const bgSystem = override ?? saved ?? "bg-forest";

  // Синхронизация класса на <html> — это side effect, ему место в эффекте;
  // setState здесь больше нет.
  useEffect(() => {
    updateHtmlClass(bgSystem);
  }, [bgSystem]);

  const setBgSystem = (system: BgSystem) => {
    setOverride(system);
    localStorage.setItem("ddc-bg-system", system);
    updateHtmlClass(system);
  };

  return (
    <BgSystemContext.Provider value={{ bgSystem, setBgSystem }}>
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
