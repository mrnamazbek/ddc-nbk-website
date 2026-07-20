"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";
import CareerCultureValues from "./CareerCultureValues";
import CareerCenterConverge from "./CareerCenterConverge";

const DESKTOP_MOTION_QUERY = "(min-width: 1280px)";

function subscribeToDesktopLayout(callback: () => void) {
  const mediaQuery = window.matchMedia(DESKTOP_MOTION_QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getDesktopLayoutSnapshot() {
  return window.matchMedia(DESKTOP_MOTION_QUERY).matches;
}

function getDesktopLayoutServerSnapshot() {
  return false;
}

/**
 * The restored cinematic sequence requires a desktop viewport and native
 * motion. Touch, smaller screens, and reduced-motion users keep the existing
 * accessible culture-values list instead.
 */
export default function CareerCenterSection() {
  const prefersReducedMotion = useReducedMotion();
  const canConverge = useSyncExternalStore(
    subscribeToDesktopLayout,
    getDesktopLayoutSnapshot,
    getDesktopLayoutServerSnapshot,
  );

  if (prefersReducedMotion || !canConverge) {
    return <CareerCultureValues />;
  }

  return <CareerCenterConverge />;
}
