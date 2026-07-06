"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import { ENTRANCE_EASE } from "@/components/motion/ScrollReveal";

export interface LeaderProfile {
  name: string;
  role: string;
  img: string;
  desc?: string;
  linkedinUrl?: string;
  tag?: string | null;
}

interface LeaderProfileModalProps {
  leader: LeaderProfile | null;
  closeLabel: string;
  onClose: () => void;
}

// Icons8 catalogs this LinkedIn glyph as an animated icon (id Zmq8UwmfMf8B,
// "m_rounded" style), but the MCP tool only exposes a static PNG frame of it —
// there's no Lottie/SVG animation endpoint available here. The hover/tap
// motion on the badge below is this site's own interaction, layered on top.
// The color param recolors the icon server-side to the exact site gold token
// (--color-gold, #C9A84C) instead of Icons8's default LinkedIn blue.
const LINKEDIN_ICON_URL = "https://img.icons8.com/?id=Zmq8UwmfMf8B&format=png&size=96&color=C9A84C";

export function LeaderProfileModal({ leader, closeLabel, onClose }: LeaderProfileModalProps) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!leader) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [leader, onClose]);

  return (
    <AnimatePresence>
      {leader && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.15 : 0.35, ease: ENTRANCE_EASE }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={leader.name}
        >
          <button
            onClick={onClose}
            aria-label={closeLabel}
            className="fixed right-5 top-5 z-[110] flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/50 text-zinc-300 backdrop-blur-md transition-colors duration-300 hover:border-gold/30 hover:text-gold"
          >
            <Icon name="x" size={18} />
          </button>

          <div
            className="relative flex w-full max-w-4xl max-h-[88vh] flex-col overflow-y-auto md:flex-row md:items-center md:overflow-visible"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Square photo — its own entrance */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              transition={{ duration: shouldReduceMotion ? 0.15 : 0.5, ease: ENTRANCE_EASE }}
              className="relative aspect-square w-full shrink-0 overflow-hidden rounded-[28px] border border-white/10 shadow-2xl md:w-[320px] lg:w-[380px]"
            >
              <Image
                src={leader.img}
                alt={leader.name}
                fill
                sizes="380px"
                className="object-cover saturate-[0.9] contrast-[1.05]"
                priority
              />
            </motion.div>

            {/* Overlapping info panel — slides in from the right, after the photo */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 24 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.15 : 0.5, delay: shouldReduceMotion ? 0 : 0.15, ease: ENTRANCE_EASE }}
              data-hover="gold"
              className="relative z-10 mt-6 overflow-hidden liquid-glass-strong rounded-[28px] p-6 shadow-2xl sm:p-8 md:-ml-10 md:mt-0 md:max-w-md md:flex-1"
            >
              <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />

              {leader.tag && (
                <span className="relative mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                  {leader.tag}
                </span>
              )}
              <h3 className="relative mb-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {leader.name}
              </h3>
              <p className="relative mb-5 text-xs sm:text-sm font-mono uppercase tracking-wider leading-relaxed text-gold-light">
                {leader.role}
              </p>

              {leader.desc && (
                <p className="relative mb-7 text-sm sm:text-base font-light leading-relaxed text-zinc-200">
                  {leader.desc}
                </p>
              )}

              {leader.linkedinUrl && (
                <a
                  href={leader.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 transition-all duration-300 hover:scale-105 hover:border-gold/60 hover:bg-gold/20"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={LINKEDIN_ICON_URL} alt="" width={22} height={22} />
                </a>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LeaderProfileModal;
