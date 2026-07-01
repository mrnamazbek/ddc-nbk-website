"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type IconSystem = "solar" | "phosphor";

interface IconSystemContextType {
  iconSystem: IconSystem;
  setIconSystem: (system: IconSystem) => void;
}

const IconSystemContext = createContext<IconSystemContextType | undefined>(undefined);

export function IconSystemProvider({ children }: { children: React.ReactNode }) {
  const [iconSystem, setIconSystemState] = useState<IconSystem>("solar");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlSystem = params.get("icons") as IconSystem | null;
    if (urlSystem === "solar" || urlSystem === "phosphor") {
      localStorage.setItem("ddc-icon-system", urlSystem);
      setIconSystemState(urlSystem);
      setMounted(true);
      return;
    }

    const saved = localStorage.getItem("ddc-icon-system") as IconSystem;
    if (saved === "solar" || saved === "phosphor") {
      setIconSystemState(saved);
    } else {
      const assigned: IconSystem = Math.random() < 0.5 ? "solar" : "phosphor";
      localStorage.setItem("ddc-icon-system", assigned);
      localStorage.setItem("ddc-icon-ab-variant", assigned);
      setIconSystemState(assigned);
    }
    setMounted(true);
  }, []);

  const setIconSystem = (system: IconSystem) => {
    setIconSystemState(system);
    localStorage.setItem("ddc-icon-system", system);
  };

  // Предотвращаем мерцание при гидратации
  return (
    <IconSystemContext.Provider value={{ iconSystem: mounted ? iconSystem : "solar", setIconSystem }}>
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
