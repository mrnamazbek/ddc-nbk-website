"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type IconSystem = "mingcute" | "iconsax" | "solar";

interface IconSystemContextType {
  iconSystem: IconSystem;
  setIconSystem: (system: IconSystem) => void;
}

const IconSystemContext = createContext<IconSystemContextType | undefined>(undefined);

export function IconSystemProvider({ children }: { children: React.ReactNode }) {
  const [iconSystem, setIconSystemState] = useState<IconSystem>("mingcute");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ddc-icon-system") as IconSystem;
    if (saved && (saved === "mingcute" || saved === "iconsax" || saved === "solar")) {
      setIconSystemState(saved);
    }
    setMounted(true);
  }, []);

  const setIconSystem = (system: IconSystem) => {
    setIconSystemState(system);
    localStorage.setItem("ddc-icon-system", system);
  };

  // Предотвращаем мерцание при гидратации
  return (
    <IconSystemContext.Provider value={{ iconSystem: mounted ? iconSystem : "mingcute", setIconSystem }}>
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
