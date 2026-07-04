"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { BubbleText } from "@/components/ui/BubbleText";
import TerminalGridBackground from "@/components/ui/TerminalGridBackground";
import ScrollWordHero from "@/components/ui/scroll-hero-section";
import LottieAnimation from "@/components/ui/LottieAnimation";
import { FeatureCarousel } from "@/components/ui/feature-carousel";
import type { Step } from "@/components/ui/feature-carousel";

function Mission2D() {
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
    <div className="relative w-full bg-transparent overflow-hidden min-h-screen pt-12 pb-24 font-sans flex items-center">
      {/* Background radial/gradient flows to maintain premium design */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full bg-forest/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] rounded-full bg-gold/5 blur-[70px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#52B78803_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
      <TerminalGridBackground className="opacity-75" />

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
                <BubbleText text={t("titleLine1")} />{" "}
                <BubbleText text={t("titleAccent")} activeClassName="text-gold font-black" />{" "}
                {t("titleLine2")}
              </h1>
              <p className="text-base sm:text-lg text-text-secondary font-light leading-relaxed max-w-2xl mx-auto">
                <BubbleText text={t("subtitle")} />
              </p>
            </div>
          }
        >
          <FeatureCarousel
            title={t("titleLine1") + " " + t("titleAccent")}
            description={t("subtitle")}
            steps={steps}
            step1img1Class={cn(
              "pointer-events-none transition-all duration-500 absolute",
              "w-[46%] left-[4%] top-[10%] h-[240px]"
            )}
            step1img2Class={cn(
              "pointer-events-none transition-all duration-500 absolute",
              "w-[46%] left-[50%] top-[10%] h-[240px]"
            )}
            step2img1Class={cn(
              "pointer-events-none transition-all duration-500 absolute",
              "w-[45%] left-[4%] top-[10%] h-[240px]"
            )}
            step2img2Class={cn(
              "pointer-events-none transition-all duration-500 absolute",
              "w-[45%] left-[50%] top-[10%] h-[240px]"
            )}
            step3imgClass={cn(
              "pointer-events-none transition-all duration-500 absolute",
              "w-[80%] left-[10%] top-[5%] h-[280px]"
            )}
            step4imgClass={cn(
              "pointer-events-none transition-all duration-500 absolute",
              "w-[80%] left-[10%] top-[5%] h-[280px]"
            )}
            image={{
              step1light1: "/animations/it-infrastructure-server-data.json",
              step1light2: "/animations/secure-data-protection.json",
              step2light1: "/animations/server-data-sync.json",
              step2light2: "/animations/data-science-pc-screen.json",
              step3light: "/animations/data-science-floating-laptop.json",
              step4light: "/animations/career-programmer-code.json",
              alt: t("step1Name"),
            }}
            bgClass="!bg-transparent !border-none !shadow-none"
          />
        </ContainerScroll>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center -mt-8 md:-mt-20">
          <div className="lg:col-span-5">
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-4 block">
              {t("step3Name")}
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-normal tracking-tight text-foreground mb-5">
              {t("step3Title")}
            </h2>
            <p className="text-sm sm:text-base text-text-secondary font-light leading-relaxed">
              {t("step3Desc")}
            </p>
          </div>
          <div className="lg:col-span-7">
            <LottieAnimation
              src="/animations/data-science-floating-laptop.json"
              label="Data graphs floating from a laptop"
              className="relative"
              frameClassName="min-h-[280px] sm:min-h-[340px] lg:min-h-[420px]"
              animationClassName="scale-[1.05]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MissionPage() {
  const wordHero = useTranslations("Mission.wordHero");

  return (
    <>
      <ScrollWordHero
        leadIn={wordHero("leadIn")}
        items={wordHero.raw("words")}
        srSummary={wordHero("srSummary")}
        tagline={wordHero("tagline")}
      />
      <Mission2D />
    </>
  );
}
