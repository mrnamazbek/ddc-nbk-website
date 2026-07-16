"use client";

import { useClientOnce } from "@/lib/clientState";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { IconSystemProvider } from "@/components/theme/IconSystemProvider";
import "./globals.css";

const translations = {
  ru: {
    title: "Страница не найдена или перемещена",
    desc: "Запрашиваемый адрес отсутствует. Возможно, ссылка устарела или в адресе допущена опечатка. Попробуйте вернуться на главную страницу DDC.",
    home: "На главную",
    back: "Назад",
  },
  en: {
    title: "Page Not Found or Moved",
    desc: "The requested address does not exist. The link may be outdated or there is a typo in the address. Try returning to the DDC home page.",
    home: "Home",
    back: "Back",
  },
  kz: {
    title: "Бет табылмады немесе көшірілді",
    desc: "Сұралған мекенжай жоқ. Сілтеме ескірген болуы мүмкүн немесе мекенжайда қате жіберілген. DDC басты бетіне оралып көріңіз.",
    home: "Басты бетке",
    back: "Артқа",
  },
};

export default function NotFound() {
  // Локаль читается из URL один раз, без setState-в-эффекте: SSR отдаёт
  // ru-дефолт, клиент сразу после гидрации — локаль из пути.
  const locale = useClientOnce<"ru" | "en" | "kz">(() => {
    const detected = window.location.pathname.split("/")[1];
    return detected === "en" || detected === "kz" || detected === "ru" ? detected : "ru";
  }, "ru");

  const t = translations[locale];

  return (
    <html lang={locale} className="h-full">
      <body className="min-h-full bg-background text-foreground transition-colors duration-300">
        <IconSystemProvider>
          <div className="relative w-full min-h-screen overflow-hidden flex flex-col justify-center items-center font-sans px-6 text-center">
            {/* Мягкие бэкграунд-эффекты */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-border animate-[spin_80s_linear_infinite] pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl relative z-10"
            >
              <span className="text-[120px] sm:text-[180px] font-display font-light text-gradient-gold leading-none tracking-tighter">
                404
              </span>

              <h1 className="text-2xl sm:text-4xl font-display font-normal text-foreground tracking-wide mb-6">
                {t.title}
              </h1>

              <p className="text-sm sm:text-base text-text-secondary font-light leading-relaxed max-w-md mx-auto mb-12">
                {t.desc}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                <Button
                  variant="gold"
                  size="md"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 group"
                  onClick={() => window.location.href = `/${locale}`}
                >
                  <Icon name="home" size={16} />
                  {t.home}
                </Button>
                
                <Button
                  variant="outline"
                  size="md"
                  className="w-full sm:w-auto flex items-center justify-center gap-2"
                  onClick={() => window.history.back()}
                >
                  <Icon name="arrow-left" size={16} />
                  {t.back}
                </Button>
              </div>
            </motion.div>
          </div>
        </IconSystemProvider>
      </body>
    </html>
  );
}
