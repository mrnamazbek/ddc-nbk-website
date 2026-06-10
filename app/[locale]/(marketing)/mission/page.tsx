"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

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
    <div className="relative w-full bg-background overflow-hidden min-h-screen pt-32 pb-24 font-sans flex items-center">
      {/* Background radial/gradient flows to maintain premium design */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-forest/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gold/5 blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#52B78803_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10 w-full">
        {/* Page Heading with standard delay animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-12"
        >
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
          <p className="text-lg text-text-secondary font-light leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Feature Carousel Demo Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl mx-auto pointer-events-auto"
        >
          <div className="rounded-[34px] bg-charcoal/30 p-2 border border-border backdrop-blur-xl">
            <div className="relative z-10 grid w-full gap-8 rounded-[28px] bg-background p-2">
              <FeatureCarousel
                title={t("titleLine1") + " " + t("titleAccent")}
                description={t("subtitle")}
                steps={steps}
                step1img1Class={cn(
                  "pointer-events-none w-[50%] border border-border transition-all duration-500 rounded-[24px] absolute",
                  "max-md:scale-[130%] max-md:rounded-[16px] rounded-[24px] left-[10%] top-[45%] md:left-[35px] md:top-[15%]",
                  "md:group-hover:translate-y-2 object-cover aspect-[4/3] shadow-2xl"
                )}
                step1img2Class={cn(
                  "pointer-events-none w-[55%] border border-border transition-all duration-500 overflow-hidden absolute",
                  "max-md:scale-[130%] rounded-[24px] max-md:rounded-[16px] left-[55%] top-[35%] md:top-[5%] md:left-[calc(45%+35px+1rem)]",
                  "md:group-hover:-translate-y-6 object-cover aspect-[4/3] shadow-2xl"
                )}
                step2img1Class={cn(
                  "pointer-events-none w-[45%] rounded-[24px] overflow-hidden border border-border transition-all duration-500 absolute",
                  "max-md:scale-[130%] left-[10%] top-[50%] md:left-[35px] md:top-[12%]",
                  "md:group-hover:translate-y-2 object-cover aspect-[4/3] shadow-2xl"
                )}
                step2img2Class={cn(
                  "pointer-events-none w-[45%] rounded-[24px] border border-border transition-all duration-500 overflow-hidden absolute",
                  "max-md:scale-[120%] left-[55%] top-[30%] md:top-[8%] md:left-[calc(45%+27px+1rem)]",
                  "md:group-hover:-translate-y-6 object-cover aspect-[4/3] shadow-2xl"
                )}
                step3imgClass={cn(
                  "pointer-events-none w-[80%] md:w-[70%] border border-border rounded-[24px] transition-all duration-500 overflow-hidden absolute",
                  "left-[10%] top-[25%] md:top-[10%] md:left-[15%] shadow-2xl aspect-[16/9] object-cover"
                )}
                step4imgClass={cn(
                  "pointer-events-none w-[80%] md:w-[70%] border border-border rounded-[24px] transition-all duration-500 overflow-hidden absolute",
                  "left-[10%] top-[25%] md:top-[10%] md:left-[15%] shadow-2xl aspect-[16/9] object-cover"
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
                bgClass="bg-gradient-to-tr from-background to-charcoal/20"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
