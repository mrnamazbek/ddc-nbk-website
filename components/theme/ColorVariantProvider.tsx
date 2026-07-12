"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

export type ColorVariant = "current" | "brand";

const STORAGE_KEY = "ddc-color-variant";

interface ColorVariantContextValue {
  variant: ColorVariant;
  setVariant: (variant: ColorVariant) => void;
}

const ColorVariantContext = createContext<ColorVariantContextValue | null>(null);

function normalizeVariant(value: string | null): ColorVariant {
  return value === "brand" ? "brand" : "current";
}

function applyVariant(variant: ColorVariant) {
  document.documentElement.dataset.colorVariant = variant;
}

function getVariantSnapshot(): ColorVariant {
  if (typeof document === "undefined") return "current";
  return normalizeVariant(document.documentElement.dataset.colorVariant ?? null);
}

function getServerVariantSnapshot(): ColorVariant {
  return "current";
}

function subscribeToVariant(listener: () => void) {
  window.addEventListener("ddc-color-variant-change", listener);
  return () => window.removeEventListener("ddc-color-variant-change", listener);
}

export default function ColorVariantProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const variant = useSyncExternalStore(
    subscribeToVariant,
    getVariantSnapshot,
    getServerVariantSnapshot,
  );

  const setVariant = useCallback((nextVariant: ColorVariant) => {
    applyVariant(nextVariant);
    window.localStorage.setItem(STORAGE_KEY, nextVariant);
    window.dispatchEvent(new Event("ddc-color-variant-change"));
  }, []);

  const value = useMemo(
    () => ({ variant, setVariant }),
    [setVariant, variant],
  );

  return (
    <ColorVariantContext.Provider value={value}>
      {children}
    </ColorVariantContext.Provider>
  );
}

export function useColorVariant() {
  const context = useContext(ColorVariantContext);

  if (!context) {
    throw new Error("useColorVariant must be used within ColorVariantProvider");
  }

  return context;
}
