"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

const FeatureCarousel = dynamic(
  () => import("@/components/ui/feature-carousel").then((mod) => mod.FeatureCarousel),
  { ssr: false }
);

import type { Step } from "@/components/ui/feature-carousel";

export default function MissionPage() {
  const t = useTranslations("Mission");

  // Load translations for the 4 steps of the carousel dynamically
  const steps: readonly Step[] = [
    {
      id: "1",
      name: t("step1Name"),
      title: t("step1Title"),
      description: t("step1Desc"),
    },
    {
      id: "2",
      name: t("step2Name"),
      title: t("step2Title"),
      description: t("step2Desc"),
    },
    {
      id: "3",
      name: t("step3Name"),
      title: t("step3Title"),
      description: t("step3Desc"),
    },
    {
      id: "4",
      name: t("step4Name"),
      title: t("step4Title"),
      description: t("step4Desc"),
    },
  ];

  return (
    <div className="relative w-full bg-background overflow-hidden min-h-screen pt-12 pb-24 font-sans flex items-center">
      {/* Background radial/gradient flows to maintain premium design */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full bg-forest/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] rounded-full bg-gold/5 blur-[70px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#52B78803_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10 w-full">
        <ContainerScroll
          className="h-[55rem] sm:h-[65rem] md:h-[82rem] pt-24 md:pt-40"
          cardClassName="min-h-[30rem] sm:min-h-[38rem] md:min-h-[44rem] h-auto w-full"
          titleComponent={
            <div className="max-w-3xl mx-auto text-center mb-6">
              <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-4 block">
                {t("overline")}
              </span>
              <h1 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-foreground mb-6 leading-tight">
                {t("titleLine1")}{" "}
                <span className="text-gradient-gold font-medium">
                  {t("titleAccent")}
                </span>{" "}
                {t("titleLine2")}
              </h1>
              <p className="text-base sm:text-lg text-text-secondary font-light leading-relaxed max-w-2xl mx-auto">
                {t("subtitle")}
              </p>
            </div>
          }
        >
          <FeatureCarousel
            title={t("titleLine1") + " " + t("titleAccent")}
            description={t("subtitle")}
            steps={steps}
            step1img1Class={cn(
              "pointer-events-none border border-border transition-all duration-500 rounded-[24px] absolute object-cover aspect-[4/3] shadow-2xl",
              "w-[46%] max-md:rounded-[12px] left-[4%] top-[15%] md:w-[50%] md:left-[35px] md:top-[15%] md:group-hover:translate-y-2"
            )}
            step1img2Class={cn(
              "pointer-events-none border border-border transition-all duration-500 overflow-hidden absolute object-cover aspect-[4/3] shadow-2xl",
              "w-[46%] max-md:rounded-[12px] left-[50%] top-[25%] md:w-[55%] md:top-[5%] md:left-[calc(45%+35px+1rem)] md:group-hover:-translate-y-6"
            )}
            step2img1Class={cn(
              "pointer-events-none rounded-[24px] overflow-hidden border border-border transition-all duration-500 absolute object-cover aspect-[4/3] shadow-2xl",
              "w-[46%] max-md:rounded-[12px] left-[4%] top-[20%] md:w-[45%] md:left-[35px] md:top-[12%] md:group-hover:translate-y-2"
            )}
            step2img2Class={cn(
              "pointer-events-none rounded-[24px] border border-border transition-all duration-500 overflow-hidden absolute object-cover aspect-[4/3] shadow-2xl",
              "w-[46%] max-md:rounded-[12px] left-[50%] top-[10%] md:w-[45%] md:top-[8%] md:left-[calc(45%+27px+1rem)] md:group-hover:-translate-y-6"
            )}
            step3imgClass={cn(
              "pointer-events-none border border-border rounded-[24px] transition-all duration-500 overflow-hidden absolute aspect-[16/9] object-cover shadow-2xl",
              "w-[80%] md:w-[70%] left-[10%] top-[15%] md:top-[10%] md:left-[15%]"
            )}
            step4imgClass={cn(
              "pointer-events-none border border-border rounded-[24px] transition-all duration-500 overflow-hidden absolute aspect-[16/9] object-cover shadow-2xl",
              "w-[80%] md:w-[70%] left-[10%] top-[15%] md:top-[10%] md:left-[15%]"
            )}
            image={{
              step1light1: "/images/nbk_architecture.png",
              step1light2: "/images/3d/shanyrak-gold.png",
              step2light1: "/images/saka_core_render.png",
              step2light2: "/images/backgrounds/steppe-horizon-abstract.png",
              step3light: "/images/saka_refractive_glass.png",
              step4light: "/images/backgrounds/glass-card-bg.png",
              alt: t("step1Name"),
            }}
            bgClass="!bg-transparent !border-none !shadow-none"
          />
        </ContainerScroll>
      </div>
    </div>
  );
}
