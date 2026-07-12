"use client";

import { useSyncExternalStore } from "react";

export type ScenePalette = {
  isLight: boolean;
  backgroundForest: string;
  backgroundTeal: string;
  backgroundLight: string;
  modelDarkBase: string;
  modelDarkAccent: string;
  modelLightBase: string;
  modelLightAccent: string;
  keyLight: string;
  fillLight: string;
  particlePrimary: string;
  particleAccent: string;
  particleHighlight: string;
  particleSize: number;
};

const fallbackPalette: ScenePalette = {
  isLight: false,
  backgroundForest: "#022622",
  backgroundTeal: "#01201C",
  backgroundLight: "#F8FAF9",
  modelDarkBase: "#0F534C",
  modelDarkAccent: "#ECC371",
  modelLightBase: "#0F534C",
  modelLightAccent: "#FFFFFF",
  keyLight: "#FFFFFF",
  fillLight: "#2BBAAC",
  particlePrimary: "#2BBAAC",
  particleAccent: "#ECC371",
  particleHighlight: "#FFBB34",
  particleSize: 1.16,
};

function readToken(styles: CSSStyleDeclaration, name: string, fallback: string) {
  return styles.getPropertyValue(name).trim() || fallback;
}

export function readScenePalette(): ScenePalette {
  if (typeof document === "undefined") return fallbackPalette;

  const root = document.documentElement;
  const styles = window.getComputedStyle(root);

  return {
    isLight: root.classList.contains("light"),
    backgroundForest: readToken(styles, "--scene-background-forest", fallbackPalette.backgroundForest),
    backgroundTeal: readToken(styles, "--scene-background-teal", fallbackPalette.backgroundTeal),
    backgroundLight: readToken(styles, "--scene-background-light", fallbackPalette.backgroundLight),
    modelDarkBase: readToken(styles, "--scene-model-dark-base", fallbackPalette.modelDarkBase),
    modelDarkAccent: readToken(styles, "--scene-model-dark-accent", fallbackPalette.modelDarkAccent),
    modelLightBase: readToken(styles, "--scene-model-light-base", fallbackPalette.modelLightBase),
    modelLightAccent: readToken(styles, "--scene-model-light-accent", fallbackPalette.modelLightAccent),
    keyLight: readToken(styles, "--scene-key-light", fallbackPalette.keyLight),
    fillLight: readToken(styles, "--scene-fill-light", fallbackPalette.fillLight),
    particlePrimary: readToken(styles, "--scene-particle-primary", fallbackPalette.particlePrimary),
    particleAccent: readToken(styles, "--scene-particle-accent", fallbackPalette.particleAccent),
    particleHighlight: readToken(styles, "--scene-particle-highlight", fallbackPalette.particleHighlight),
    particleSize: Number.parseFloat(readToken(styles, "--scene-particle-size", String(fallbackPalette.particleSize))) || fallbackPalette.particleSize,
  };
}

function getPaletteState() {
  if (typeof document === "undefined") return "brand:dark";

  const root = document.documentElement;
  return `${root.dataset.colorVariant ?? "brand"}:${root.classList.contains("light") ? "light" : "dark"}`;
}

function subscribeToPaletteState(onStoreChange: () => void) {
  const root = document.documentElement;
  const observer = new MutationObserver(onStoreChange);
  observer.observe(root, {
    attributes: true,
    attributeFilter: ["class", "data-color-variant"],
  });

  return () => observer.disconnect();
}

/**
 * Re-reads computed semantic scene tokens after either theme or palette changes.
 * CSS variables cannot be passed directly to Three.js uniforms, so this is the
 * one deliberate boundary between the DOM design system and WebGL scenes.
 */
export function useScenePalette() {
  const paletteState = useSyncExternalStore(
    subscribeToPaletteState,
    getPaletteState,
    () => "brand:dark",
  );

  // Read after the subscribed root attribute has changed. Referencing the
  // snapshot keeps React subscribed while the token read stays synchronous.
  void paletteState;
  return readScenePalette();
}
