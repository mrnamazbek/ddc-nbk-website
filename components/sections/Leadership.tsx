"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";
import Image from "next/image";
import GlassCard from "@/components/ui/GlassCard";

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
              <GlassCard
                hoverAccent={leaders[0].accent}
                isTiltEnabled={true}
                variant="liquid-strong"
                className="w-full text-center group"
              >
                <div className="relative w-36 h-36 mx-auto mb-6 rounded-full overflow-hidden border-2 border-gold/40 shadow-[0_0_20px_rgba(232,200,122,0.15)] group-hover:border-gold/80 transition-colors duration-300">
                  <Image
                    src={leaders[0].img}
                    alt={t(`${leaders[0].key}.name`)}
                    fill
                    priority
                    sizes="144px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-sans font-semibold text-white mb-2 transition-colors group-hover:text-gold">
                  {t(`${leaders[0].key}.name`)}
                </h3>
                <p className="text-xs uppercase font-mono tracking-wider text-zinc-400">
                  {t(`${leaders[0].key}.role`)}
                </p>
              </GlassCard>
            </div>
          </div>

          {/* Deputies Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {leaders.slice(1).map((leader) => (
              <div key={leader.key} ref={addToRefs} className="w-full">
                <GlassCard
                  hoverAccent={leader.accent}
                  isTiltEnabled={true}
                  variant="liquid"
                  className="w-full text-center group h-full flex flex-col justify-between"
                >
                  <div>
                    <div className={`relative w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden border-2 ${
                      leader.accent === "gold" 
                        ? "border-gold/30 shadow-[0_0_15px_rgba(232,200,122,0.1)] group-hover:border-gold/60" 
                        : "border-forest-light/30 shadow-[0_0_15px_rgba(82,183,136,0.1)] group-hover:border-forest-light/60"
                    } transition-colors duration-300`}>
                      <Image
                        src={leader.img}
                        alt={t(`${leader.key}.name`)}
                        fill
                        sizes="112px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="text-base font-sans font-semibold text-white mb-2 transition-colors group-hover:text-gold">
                      {t(`${leader.key}.name`)}
                    </h3>
                  </div>
                  <p className="text-[11px] uppercase font-mono tracking-wider text-zinc-500 mt-2">
                    {t(`${leader.key}.role`)}
                  </p>
                </GlassCard>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
