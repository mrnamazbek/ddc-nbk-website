"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import CareerCultureValues from "./CareerCultureValues";
import CareerCenterConverge from "./CareerCenterConverge";

/**
 * The cinematic scroll-scrubbed letter convergence needs real viewport width
 * to scatter six pieces legibly and a stable scroll axis to scrub against —
 * neither holds up on touch/mobile, so those (and reduced-motion) get the
 * static card-list version instead.
 */
export default function CareerCenterSection() {
  const prefersReducedMotion = useReducedMotion();
  const [canConverge, setCanConverge] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setCanConverge(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (prefersReducedMotion || !canConverge) {
    return <CareerCultureValues />;
  }

  return <CareerCenterConverge />;
}
