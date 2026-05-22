"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative w-full min-h-screen bg-[#0A0A0A] overflow-hidden flex flex-col justify-center items-center font-sans px-6 text-center">
      {/* Мягкие бэкграунд-эффекты */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-forest/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-forest-light/5 animate-[spin_80s_linear_infinite] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl relative z-10"
      >
        <span className="text-[120px] sm:text-[180px] font-display font-light text-gradient-gold leading-none tracking-tighter">
          404
        </span>

        <h1 className="text-2xl sm:text-4xl font-sans font-bold text-white tracking-wide mb-6">
          Страница не найдена или перемещена
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed max-w-md mx-auto mb-12">
          Запрашиваемый адрес отсутствует. Возможно, ссылка устарела или в адресе допущена опечатка. Попробуйте вернуться на главную страницу DDC.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <Button
            variant="gold"
            size="md"
            className="w-full sm:w-auto flex items-center justify-center gap-2 group"
            onClick={() => window.location.href = "/"}
          >
            <Home className="w-4 h-4" />
            На главную
          </Button>
          
          <Button
            variant="outline"
            size="md"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
