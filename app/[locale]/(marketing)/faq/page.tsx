"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import Icon from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";
import { BubbleText } from "@/components/ui/BubbleText";
import { useA11y } from "@/components/theme/AccessibilityProvider";

interface FAQItem {
  question: string;
  answer: string;
}

/** Number of q{n}/a{n} pairs present in the FAQPage namespace. */
const FAQ_COUNT = 6;

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const { enabled: a11yEnabled } = useA11y();
  const reduce = useReducedMotion() || a11yEnabled;
  const t = useTranslations("FAQPage");

  // Previously this array held the questions and answers as hardcoded Russian
  // string literals, so English and Kazakh visitors read a Russian FAQ.
  const faqs: FAQItem[] = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    question: t(`q${i + 1}`),
    answer: t(`a${i + 1}`),
  }));

  return (
    <div className="relative w-full bg-transparent overflow-hidden min-h-screen pt-32 pb-24 font-sans">
      <div className="max-w-4xl mx-auto px-6 sm:px-12 relative z-10">

        {/* Заголовок */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-gold-light font-medium mb-4 block">
            {t("overline")}
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-white mb-6">
            <BubbleText text={t("titleLine1")} /> <br />
            <BubbleText text={t("titleAccent")} activeClassName="text-gold font-black" />
          </h1>
          <p className="text-zinc-300 font-light leading-relaxed">
            <BubbleText text={t("subtitle")} />
          </p>
        </motion.div>

        {/* Список FAQ с аккордеонами */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <GlassCard
                key={idx}
                isTiltEnabled={false}
                className="p-0 border-white/5 hover:border-gold/10 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left p-6 sm:p-8 flex items-center justify-between gap-6 cursor-pointer focus:outline-none focus:bg-white/5 transition-colors duration-300"
                >
                  <div className="flex items-center gap-4">
                    <Icon name="help" size={20} className="text-gold shrink-0" />
                    <h2 className="text-base sm:text-lg font-sans font-semibold text-white tracking-wide">
                      <BubbleText text={faq.question} />
                    </h2>
                  </div>
                  <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                    {isOpen ? <Icon name="minus" size={16} /> : <Icon name="plus" size={16} />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduce ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0 : 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 sm:px-8 sm:pb-8 border-t border-white/5 pt-4">
                        <p className="text-sm sm:text-base text-zinc-400 font-sans font-light leading-relaxed">
                          <BubbleText text={faq.answer} />
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            );
          })}
        </div>

      </div>
    </div>
  );
}
