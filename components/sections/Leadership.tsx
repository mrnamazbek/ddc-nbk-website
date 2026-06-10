"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CometCard } from "@/components/ui/comet-card";

interface Leader {
  key: string;
  img: string;
  linkedin: string;
}

export default function Leadership() {
  const t = useTranslations("Leadership");
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const leaders: Leader[] = [
    {
      key: "l1",
      img: "/images/team/Amardinov.jpg",
      linkedin: "https://www.linkedin.com/in/malik-amardinov-23945a165",
    },
    {
      key: "l2",
      img: "/images/team/Durmagambetov.jpg",
      linkedin: "https://www.linkedin.com/in/erlan-durmagambetov",
    },
    {
      key: "l3",
      img: "/images/team/Kentbekov.jpg",
      linkedin: "https://www.linkedin.com",
    },
    {
      key: "l4",
      img: "/images/team/Imajanov.jpg",
      linkedin: "https://www.linkedin.com",
    },
  ];

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

      // Fade-in carousel
      gsap.fromTo(
        carouselRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
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

  const handleNext = () =>
    setCurrentIndex((index) => (index + 1) % leaders.length);
  
  const handlePrevious = () =>
    setCurrentIndex((index) => (index - 1 + leaders.length) % leaders.length);

  const currentLeader = leaders[currentIndex];

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

        {/* Carousel Container */}
        <div ref={carouselRef} className="w-full max-w-5xl mx-auto">
          {/* Desktop Layout (md and up) */}
          <div className="hidden md:flex relative items-center justify-center">
            {/* Avatar Photo */}
            <div className="w-[380px] h-[380px] lg:w-[450px] lg:h-[450px] rounded-3xl overflow-hidden bg-neutral-900 flex-shrink-0 relative border border-white/10 shadow-2xl z-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentLeader.img}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="w-full h-full relative"
                >
                  <Image
                    src={currentLeader.img}
                    alt={t(`${currentLeader.key}.name`)}
                    fill
                    sizes="(max-width: 768px) 100vw, 450px"
                    className="object-cover saturate-[0.85] contrast-[1.05]"
                    draggable={false}
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Content overlay card (CometCard) */}
            <div className="ml-[-60px] lg:ml-[-85px] z-10 max-w-xl flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentLeader.key}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <CometCard className="p-8 sm:p-10 flex flex-col justify-between min-h-[340px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-mono tracking-[0.2em] text-gold uppercase">
                          {currentLeader.key === "l1" ? "#CHAIRMAN" : "#DEPUTY"}
                        </span>
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-sans font-bold text-white mb-2 tracking-wide leading-tight transition-colors duration-300 hover:text-gold">
                        {t(`${currentLeader.key}.name`)}
                      </h3>
                      
                      <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-6">
                        {t(`${currentLeader.key}.role`)}
                      </p>
                      
                      <p className="text-sm sm:text-base text-zinc-300 font-sans font-light leading-relaxed mb-6">
                        {t(`${currentLeader.key}.desc`)}
                      </p>
                    </div>

                    {/* Social links */}
                    <div className="flex space-x-4 pt-5 border-t border-white/5">
                      <a
                        href={currentLeader.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white/[0.03] border border-white/10 hover:border-gold/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer text-zinc-400 hover:text-gold"
                        aria-label="LinkedIn"
                      >
                        <svg
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    </div>
                  </CometCard>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Layout (below md) */}
          <div className="md:hidden max-w-sm mx-auto text-center bg-transparent">
            {/* Avatar Photo */}
            <div className="w-full aspect-square bg-neutral-900 rounded-3xl overflow-hidden mb-6 relative border border-white/10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentLeader.img}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="w-full h-full relative"
                >
                  <Image
                    src={currentLeader.img}
                    alt={t(`${currentLeader.key}.name`)}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-cover saturate-[0.85] contrast-[1.05]"
                    draggable={false}
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Mobile Content (CometCard) */}
            <div className="px-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentLeader.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <CometCard className="p-6 text-left flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <div>
                      <span className="text-[9px] font-mono tracking-[0.2em] text-gold uppercase mb-1.5 block">
                        {currentLeader.key === "l1" ? "#CHAIRMAN" : "#DEPUTY"}
                      </span>
                      
                      <h3 className="text-lg font-sans font-bold text-white mb-1.5 tracking-wide">
                        {t(`${currentLeader.key}.name`)}
                      </h3>
                      
                      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-4">
                        {t(`${currentLeader.key}.role`)}
                      </p>
                      
                      <p className="text-xs sm:text-sm text-zinc-300 font-sans font-light leading-relaxed mb-4">
                        {t(`${currentLeader.key}.desc`)}
                      </p>
                    </div>

                    {/* Social links */}
                    <div className="flex space-x-3 pt-4 border-t border-white/5">
                      <a
                        href={currentLeader.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-white/[0.03] border border-white/10 hover:border-gold/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer text-zinc-400 hover:text-gold"
                        aria-label="LinkedIn"
                      >
                        <svg
                          className="w-3.5 h-3.5 fill-current"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    </div>
                  </CometCard>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-6 mt-12">
            {/* Prev Button */}
            <button
              onClick={handlePrevious}
              aria-label="Previous manager"
              className="w-12 h-12 rounded-full liquid-glass border border-white/10 hover:border-gold/40 shadow-md flex items-center justify-center hover:bg-white/[0.08] transition-colors cursor-pointer text-zinc-400 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Navigation Dots */}
            <div className="flex gap-2">
              {leaders.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors cursor-pointer ${
                    idx === currentIndex
                      ? "bg-gold"
                      : "bg-zinc-600 hover:bg-zinc-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              aria-label="Next manager"
              className="w-12 h-12 rounded-full liquid-glass border border-white/10 hover:border-gold/40 shadow-md flex items-center justify-center hover:bg-white/[0.08] transition-colors cursor-pointer text-zinc-400 hover:text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
