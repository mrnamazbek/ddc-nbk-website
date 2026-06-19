"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useA11y } from "@/components/theme/AccessibilityProvider";

// The WebGL coin is heavy and client-only — load it lazily, never on the server.
const Coin3D = dynamic(() => import("@/components/three/Coin3D"), { ssr: false });

/**
 * «Эмблема DDC» — a procedural 3D coin (the DDC emblem extruded in gold-iridescent
 * relief on emerald enamel). Falls back to a flat mark in a11y / reduced-motion.
 */
export default function CoinShowcase() {
  const t = useTranslations("CoinShowcase");
  const { enabled: a11yEnabled, prefersReducedMotion } = useA11y();
  const staticMode = a11yEnabled || prefersReducedMotion;

  return (
    <section className="relative w-full overflow-hidden border-t border-glass-border bg-black py-24 sm:py-32">
      {/* Ambient brand glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[120px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 sm:px-12 lg:grid-cols-2 lg:px-16">
        <div className="max-w-xl">
          <span className="mb-4 block text-xs font-medium uppercase tracking-[0.25em] text-gold">
            {t("overline")}
          </span>
          <h2 className="mb-6 font-display text-3xl font-normal tracking-tight text-white sm:text-5xl">
            {t("title")}
          </h2>
          <p className="text-base font-light leading-relaxed text-zinc-300 sm:text-lg">
            {t("subtitle")}
          </p>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[520px]">
          {staticMode ? (
            <Image
              src="/images/logo/ddc-emblem.svg"
              alt=""
              aria-hidden
              width={360}
              height={360}
              className="absolute left-1/2 top-1/2 h-3/5 w-3/5 -translate-x-1/2 -translate-y-1/2 opacity-90"
            />
          ) : (
            <Coin3D className="absolute inset-0 h-full w-full" />
          )}
        </div>
      </div>
    </section>
  );
}
