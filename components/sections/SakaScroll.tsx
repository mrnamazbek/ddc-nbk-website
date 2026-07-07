"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { BubbleText } from "@/components/ui/BubbleText";

export default function SakaScroll() {
  const t = useTranslations("SakaScroll");

  return (
    <section className="relative w-full bg-transparent overflow-hidden">
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center">
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-4 block">
              {t("overline")}
            </span>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-foreground mb-6 leading-tight max-w-4xl mx-auto">
              <BubbleText text={t("titleLine1")} />{" "}
              <BubbleText text={t("titleAccent")} activeClassName="text-gold font-black" />{" "}
              {t("titleLine2")}
            </h2>
            <p className="text-sm sm:text-base text-text-secondary font-light leading-relaxed max-w-2xl mx-auto mb-4">
              <BubbleText text={t("description")} />
            </p>
          </div>
        }
      >
        <div className="relative w-full h-full rounded-[14px] sm:rounded-[22px] overflow-hidden bg-charcoal/40 group flex items-center justify-center p-2 sm:p-4">
          {/* Internal soft gold/green glow behind image */}
          <div className="absolute inset-0 bg-gradient-to-tr from-forest/5 to-gold/5 opacity-50 pointer-events-none" />

          <Image
            src="/images/saka_core_render.png"
            alt="Saka Core Platform Render"
            fill
            className="object-cover rounded-[12px] sm:rounded-[20px] transition-transform duration-700 group-hover:scale-[1.03]"
            priority
          />
        </div>
      </ContainerScroll>
    </section>
  );
}
