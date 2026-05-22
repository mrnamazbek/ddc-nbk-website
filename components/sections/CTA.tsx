"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { ArrowRight, Mail } from "lucide-react";

export default function CTA() {
  const containerVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative w-full py-24 sm:py-32 bg-[#0A0A0A] overflow-hidden border-t border-white/5">
      {/* Анимированный фоновый градиент (мягкие переливы) */}
      <div className="absolute inset-0 bg-radial-[at_50%_50%] from-[#0F251A] via-[#0A0A0A] to-[#0A0A0A] opacity-60 pointer-events-none" />
      
      {/* Декоративные вращающиеся круги на фоне */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-forest-light/5 animate-[spin_60s_linear_infinite] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border-t border-dashed border-gold-muted/5 animate-[spin_40s_linear_infinite] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="glass-panel border-white/5 rounded-3xl p-8 sm:p-16 relative overflow-hidden shadow-2xl"
        >
          {/* Световой блик внутри панели */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-forest/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gold/10 rounded-full blur-[80px] pointer-events-none" />

          <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-6 block relative z-10">
            технологическое партнерство
          </span>

          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white mb-6 leading-tight relative z-10">
            Создаем технологический <br className="hidden sm:inline" />
            <span className="text-gradient-gold font-medium">суверенитет вместе</span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 font-sans font-light leading-relaxed max-w-2xl mx-auto mb-10 relative z-10">
            Мы открыты к сотрудничеству с финансовыми институтами, финтех-разработчиками и академическими кругами для совместного проектирования будущего платежных экосистем.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center relative z-10">
            <Button
              variant="gold"
              size="lg"
              className="w-full sm:w-auto flex items-center justify-center gap-2 group"
              onClick={() => {
                const target = document.getElementById("contact");
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.location.href = "/contact";
                }
              }}
            >
              Связаться с нами
              <Mail className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
            </Button>
            
            <Button
              variant="glass"
              size="lg"
              className="w-full sm:w-auto flex items-center justify-center gap-2 group"
              onClick={() => {
                window.location.href = "/careers";
              }}
            >
              Присоединиться к команде
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
