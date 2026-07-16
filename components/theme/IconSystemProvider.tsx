"use client";

import React, { createContext, useContext, useState } from "react";
import { useClientOnce } from "@/lib/clientState";

export type IconSystem = "solar" | "phosphor";

interface IconSystemContextType {
  iconSystem: IconSystem;
  setIconSystem: (system: IconSystem) => void;
}

const IconSystemContext = createContext<IconSystemContextType | undefined>(undefined);

/**
 * Начальное значение читается один раз на клиенте (URL → localStorage →
 * случайное A/B-назначение) без setState-в-эффекте: SSR отдаёт "solar",
 * клиент сразу после гидрации — фактическое значение. Побочные записи в
 * localStorage происходят в том же одноразовом чтении.
 */
function readInitialIconSystem(): IconSystem {
  const params = new URLSearchParams(window.location.search);
  const urlSystem = params.get("icons") as IconSystem | null;
  if (urlSystem === "solar" || urlSystem === "phosphor") {
    localStorage.setItem("ddc-icon-system", urlSystem);
    return urlSystem;
  }

  const saved = localStorage.getItem("ddc-icon-system") as IconSystem;
  if (saved === "solar" || saved === "phosphor") {
    return saved;
  }

  const assigned: IconSystem = Math.random() < 0.5 ? "solar" : "phosphor";
  localStorage.setItem("ddc-icon-system", assigned);
  localStorage.setItem("ddc-icon-ab-variant", assigned);
  return assigned;
}

export function IconSystemProvider({ children }: { children: React.ReactNode }) {
  const initial = useClientOnce<IconSystem | null>(readInitialIconSystem, null);
  const [override, setOverride] = useState<IconSystem | null>(null);

  const iconSystem = override ?? initial ?? "solar";

  const setIconSystem = (system: IconSystem) => {
    setOverride(system);
    localStorage.setItem("ddc-icon-system", system);
  };

  return (
    <IconSystemContext.Provider value={{ iconSystem, setIconSystem }}>
      {children}
    </IconSystemContext.Provider>
  );
}

export function useIconSystem() {
  const context = useContext(IconSystemContext);
  if (!context) {
    throw new Error("useIconSystem must be used within an IconSystemProvider");
  }
  return context;
}
