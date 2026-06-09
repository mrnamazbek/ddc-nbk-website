"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Что такое Digital Development Center (DDC)?",
      answer: "Digital Development Center — это специализированная дочерняя организация Национального Банка Казахстана. Мы занимаемся разработкой, развитием, тестированием и интеграцией инновационных технологических решений и критических платформ для всей государственной финансовой инфраструктуры страны.",
    },
    {
      question: "Что такое Цифровой Тенге и чем он отличается от обычных денег?",
      answer: "Цифровой Тенге — это третья форма национальной валюты Республики Казахстан, которая будет дополнять существующие наличные и безналичные тенге. Он является уникальным цифровым токеном, выпускаемым непосредственно Национальным Банком, поддерживающим функции программирования (смарт-контракты) и двухуровневого оффлайн-обращения.",
    },
    {
      question: "Каковы преимущества использования Цифрового Тенге для бизнеса?",
      answer: "Для бизнеса это открывает возможности автоматизации расчетов за счет смарт-контрактов (например, мгновенное распределение налогов, эскроу-счета без комиссии банков, автоматический контроль целевого расхода бюджетов), снижение транзакционных издержек и мгновенные расчеты в режиме реального времени.",
    },
    {
      question: "Как обеспечивается безопасность транзакций в системах DDC?",
      answer: "Мы используем подход «Security-by-Design» и архитектуру нулевого доверия (Zero Trust). Все транзакции шифруются с использованием сертифицированных государственных криптографических стандартов (СТ РК) на базе сертифицированных аппаратных модулей безопасности (HSM). Наша инфраструктура имеет высший класс защиты в Республике Казахстан.",
    },
    {
      question: "Может ли Цифровой Тенге работать без интернета?",
      answer: "Да. Одной из ключевых инноваций DDC является разработка двухуровневой оффлайн-архитектуры. Используя специальные чипы безопасности (Secure Element) в смарт-картах или мобильных телефонах, пользователи могут совершать транзакции напрямую друг с другом без подключения к интернету или мобильной связи.",
    },
    {
      question: "Открыты ли вы к сотрудничеству с разработчиками?",
      answer: "Да. В рамках инициативы Open Banking мы активно разрабатываем единые стандарты Open API и песочницу (Sandbox) для интеграции коммерческих банков, страховых и финтех-компаний. Подробности можно найти в нашем разделе решений или связавшись с нами через форму.",
    },
  ];

  return (
    <div className="relative w-full bg-black overflow-hidden min-h-screen pt-32 pb-24 font-sans">
      {/* Мягкие свечения */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-forest/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 sm:px-12 relative z-10">
        
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-4 block">
            ВОПРОСЫ И ОТВЕТЫ
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-white mb-6">
            Часто задаваемые <br />
            <span className="text-gradient-gold font-medium">вопросы</span>
          </h1>
          <p className="text-zinc-400 font-light leading-relaxed">
            Ответы на ключевые вопросы об архитектуре систем DDC, Цифровом Тенге, открытом банкинге и стандартах кибербезопасности.
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
                    <HelpCircle className="w-5 h-5 text-gold shrink-0" />
                    <h3 className="text-base sm:text-lg font-sans font-semibold text-white tracking-wide">
                      {faq.question}
                    </h3>
                  </div>
                  <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 sm:px-8 sm:pb-8 border-t border-white/5 pt-4">
                        <p className="text-sm sm:text-base text-zinc-400 font-sans font-light leading-relaxed">
                          {faq.answer}
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
