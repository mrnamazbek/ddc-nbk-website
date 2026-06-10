"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";
import Image from "next/image";
import { CometCard } from "@/components/ui/comet-card";

interface Leader {
  key: string;
  img: string;
  accent: "gold" | "forest";
}

export default function Leadership() {
  const t = useTranslations("Leadership");
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  cardsRef.current = [];

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useGSAP(
    () => {
      // Fade-in title
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Staggered cards fade-in
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1.0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: containerRef }
  );

  const leaders: Leader[] = [
    {
      key: "l1",
      img: "/images/team/Amardinov.jpg",
      accent: "gold",
    },
    {
      key: "l2",
      img: "/images/team/Durmagambetov.jpg",
      accent: "forest",
    },
    {
      key: "l3",
      img: "/images/team/Kentbekov.jpg",
      accent: "gold",
    },
    {
      key: "l4",
      img: "/images/team/Imajanov.jpg",
      accent: "forest",
    },
  ];

  return (
    <section
      id="leadership"
      ref={containerRef}
      className="relative w-full py-24 sm:py-32 bg-black overflow-hidden border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* Title area */}
        <div ref={titleRef} className="max-w-3xl mb-16 sm:mb-20">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-mono font-medium mb-4 block">
            {t("overline")}
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-white mb-6 leading-tight">
            {t("titleLine1")} <br />
            <span className="text-gradient-gold font-medium">{t("titleAccent")}</span>
          </h2>
          <p className="text-sm sm:text-base font-sans font-light text-zinc-400 leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Leadership Grid */}
        <div className="flex flex-col gap-6">
          {/* Chairman (Top Centered) */}
          <div className="flex justify-center">
            <div ref={addToRefs} className="w-full max-w-sm">
              <CometCard className="p-4 flex flex-col items-stretch group cursor-pointer">
                <div className="mx-2 flex-1">
                  <div className="relative mt-2 aspect-[3/4] w-full rounded-[16px] overflow-hidden border border-white/10 bg-[#000000]">
                    <Image
                      src={leaders[0].img}
                      alt={t(`${leaders[0].key}.name`)}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 384px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105 saturate-[0.85] group-hover:saturate-100 contrast-[0.95]"
                    />
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-2 p-4">
                  <h3 className="text-lg font-sans font-bold text-white tracking-wide transition-colors duration-300 group-hover:text-gold">
                    {t(`${leaders[0].key}.name`)}
                  </h3>
                  <div className="flex justify-between items-center font-mono text-[10px] text-zinc-500">
                    <span className="uppercase tracking-wider leading-none">{t(`${leaders[0].key}.role`)}</span>
                    <span className="text-gold/60 leading-none">#CHAIRMAN</span>
                  </div>
                </div>
              </CometCard>
            </div>
          </div>

          {/* Deputies Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {leaders.slice(1).map((leader) => (
              <div key={leader.key} ref={addToRefs} className="w-full">
                <CometCard className="p-4 flex flex-col items-stretch group cursor-pointer h-full justify-between">
                  <div className="mx-2 flex-1">
                    <div className="relative mt-2 aspect-[3/4] w-full rounded-[16px] overflow-hidden border border-white/10 bg-[#000000]">
                      <Image
                        src={leader.img}
                        alt={t(`${leader.key}.name`)}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105 saturate-[0.85] group-hover:saturate-100 contrast-[0.95]"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-2 p-4">
                    <h3 className="text-base font-sans font-bold text-white tracking-wide transition-colors duration-300 group-hover:text-gold leading-snug">
                      {t(`${leader.key}.name`)}
                    </h3>
                    <div className="flex justify-between items-center font-mono text-[10px] text-zinc-500 mt-1">
                      <span className="uppercase tracking-wider leading-none line-clamp-1">{t(`${leader.key}.role`)}</span>
                      <span className="text-gold/60 leading-none">#DEPUTY</span>
                    </div>
                  </div>
                </CometCard>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
