"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { MapPin, Clock, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

interface Job {
  title: string;
  department: string;
  location: string;
  type: string;
  badgeVariant: "gold" | "green" | "gray";
  salary: string;
  experience: string;
}

export default function CareersPage() {
  const jobs: Job[] = [
    {
      title: "Senior Go Engineer (Blockchain Lab)",
      department: "Лаборатория DLT",
      location: "Алматы",
      type: "Полная занятость",
      badgeVariant: "gold",
      salary: "От конкурентная",
      experience: "От 5 лет",
    },
    {
      title: "Senior Database Developer (PostgreSQL/Oracle)",
      department: "Департамент транзакционных систем",
      location: "Алматы / Гибрид",
      type: "Полная занятость",
      badgeVariant: "green",
      salary: "Конкурентная",
      experience: "От 4 лет",
    },
    {
      title: "Data Engineer (Big Data Platform)",
      department: "Отдел анализа финансовых рынков",
      location: "Астана / Алматы",
      type: "Полная занятость",
      badgeVariant: "green",
      salary: "Конкурентная",
      experience: "От 3 лет",
    },
    {
      title: "Junior Database Developer (Стажировка)",
      department: "Отдел разработки клиринговых систем",
      location: "Алматы",
      type: "Стажировка (Оплачиваемая)",
      badgeVariant: "gray",
      salary: "Оплачиваемая",
      experience: "Без опыта",
    },
  ];

  const coreBenefits = [
    "Участие в проектах национального масштаба, меняющих финансовый сектор страны",
    "Официальное оформление, стабильность и престиж работы в структуре Национального Банка РК",
    "Конкурентная заработная плата и годовые премиальные выплаты по результатам KPI",
    "Современный технологический стек (без легаси ради легаси, фокус на результат)",
    "Оплачиваемое обучение, сертификация и участие в международных конференциях",
    "Комфортные офисы в Алматы и Астане с зонами отдыха и гибким графиком",
  ];

  return (
    <div className="relative w-full bg-[#0A0A0A] overflow-hidden min-h-screen pt-32 pb-24 font-sans">
      {/* Мягкие свечения */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-forest/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-20"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-4 block">
            КАРЬЕРА В DDC
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-white mb-6">
            Стройте будущее <br />
            <span className="text-gradient-gold font-medium">вместе с нами</span>
          </h1>
          <p className="text-lg text-zinc-400 font-light leading-relaxed">
            Мы объединяем сильнейших IT-специалистов Казахстана для разработки передовых финансовых технологий. Наша цель — надежность, безопасность и инновации.
          </p>
        </motion.div>

        {/* Секция Культуры / Преимуществ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-24 pb-12 border-b border-white/5">
          <div className="lg:col-span-7">
            <h3 className="text-2xl font-bold text-white mb-6 tracking-wide">Почему выбирают DDC?</h3>
            <ul className="space-y-4">
              {coreBenefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3.5 text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
                  <CheckCircle2 className="w-5 h-5 text-forest-light shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-5 bg-charcoal/40 border border-white/5 p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-forest/20 rounded-full blur-2xl pointer-events-none" />
            <div className="w-12 h-12 rounded-xl bg-forest/30 border border-forest-light/20 flex items-center justify-center text-gold mb-6">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Старт для молодых талантов</h4>
            <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6">
              Мы активно развиваем программы стажировок для Junior-разработчиков баз данных и Data-инженеров. Лучшие стажеры получают оффер в штат по окончании программы.
            </p>
            <Button variant="gold" className="w-full justify-center text-xs" onClick={() => {
              const target = document.getElementById("jobs-list");
              target?.scrollIntoView({ behavior: "smooth" });
            }}>
              Посмотреть вакансии стажировок
            </Button>
          </div>
        </div>

        {/* Список вакансий */}
        <div id="jobs-list">
          <h2 className="font-display text-2xl sm:text-4xl text-white mb-8 font-normal tracking-tight">
            Открытые <span className="text-gradient-gold">вакансии</span>
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job, idx) => (
              <GlassCard key={idx} className="border-white/5 hover:border-gold/20 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant={job.badgeVariant}>{job.department}</Badge>
                    <span className="text-xs text-zinc-500">•</span>
                    <span className="text-xs text-zinc-400 font-light flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </span>
                    <span className="text-xs text-zinc-500">•</span>
                    <span className="text-xs text-zinc-400 font-light flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {job.type}
                    </span>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                    {job.title}
                  </h3>

                  <div className="flex gap-6 text-xs text-zinc-500 font-light">
                    <span>Опыт работы: <strong className="text-zinc-300 font-semibold">{job.experience}</strong></span>
                    <span>Заработная плата: <strong className="text-gold font-semibold">{job.salary}</strong></span>
                  </div>
                </div>

                <Button variant="outline" className="flex items-center justify-center gap-2 group whitespace-nowrap">
                  Откликнуться
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </GlassCard>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
