"use client";

import { motion } from "framer-motion";
import { Coins, Zap, ShieldCheck, Share2, BarChart3, Landmark, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";

interface ServiceDetail {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  techStack: string;
}

export default function ServicesPage() {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const services: ServiceDetail[] = [
    {
      icon: Coins,
      title: "Платформа Цифрового Тенге (CBDC)",
      subtitle: "Национальная цифровая валюта",
      description: "Создание гибридной архитектуры, объединяющей преимущества распределенных реестров и классической высокопроизводительной банковской структуры.",
      features: [
        "Программируемость через смарт-контракты для контроля целевого расходования",
        "Двухуровневые оффлайн-транзакции без доступа к сотовым сетям",
        "Интеграция с существующей безналичной инфраструктурой коммерческих банков",
      ],
      techStack: "Hyperledger Fabric, Solidity, Go, HSM Modules",
    },
    {
      icon: Zap,
      title: "Система Мгновенных Платежей (СМП)",
      subtitle: "Клиринг и транзакции 24/7/365",
      description: "Обеспечение проведения мгновенных межбанковских платежей для физических и юридических лиц по номеру телефона или QR-коду.",
      features: [
        "Скорость обработки платежа менее 2 секунд",
        "Подключение всех коммерческих банков Казахстана через единый шлюз",
        "Соответствие международному стандарту сообщений ISO 20022",
      ],
      techStack: "Java, Spring Boot, Kafka, PostgreSQL, ISO 20022",
    },
    {
      icon: Landmark,
      title: "Межбанковский Клиринг и Расчеты",
      subtitle: "Стабильность финансового ядра",
      description: "Поддержка и модернизация систем межбанковского клиринга, обеспечивающих гарантированное проведение крупных финансовых расчетов.",
      features: [
        "Многосторонний неттинг и клиринг по расписанию",
        "Высокая отказоустойчивость инфраструктуры уровня 99.999% SLA",
        "Интеграция с системами валовых расчетов в реальном времени (RTGS)",
      ],
      techStack: "C++, Python, Oracle DB, IBM WebSphere MQ",
    },
    {
      icon: ShieldCheck,
      title: "Кибербезопасность Инфраструктуры",
      subtitle: "Государственный класс защиты",
      description: "Проектирование и сопровождение комплексной защиты финансовой сети Национального Банка от внешних кибератак и утечек.",
      features: [
        "Внедрение государственных криптографических стандартов (СТ РК)",
        "Защита каналов связи с использованием аппаратного шифрования",
        "Аудит и тестирование систем на проникновение (Red Teaming)",
      ],
      techStack: "Fortinet, HSM, Linux, Hardware Crypto Units",
    },
    {
      icon: Share2,
      title: "Инфраструктура Open API / Open Banking",
      subtitle: "Финтех-экосистема",
      description: "Стандартизация и развитие единого шлюза открытых API для создания бесшовного взаимодействия между банками и финтех-компаниями.",
      features: [
        "Единый портал спецификаций API для разработчиков",
        "Безопасная аутентификация через OAuth 2.0 / OpenID Connect",
        "Снижение барьеров для выхода новых финтех-продуктов на рынок",
      ],
      techStack: "Node.js, Express, OAuth2, GraphQL, Kong API Gateway",
    },
    {
      icon: BarChart3,
      title: "Финансовая Аналитика и Big Data",
      subtitle: "Интеллектуальный анализ рынка",
      description: "Обработка и анализ больших объемов неперсонализированных финансовых транзакций для макроэкономического прогнозирования.",
      features: [
        "Мониторинг транзакционной активности в масштабе страны",
        "Построение прогнозных моделей инфляции и ликвидности",
        "Автоматическое выявление аномалий и подозрительных операций",
      ],
      techStack: "Hadoop, Spark, ClickHouse, Python (PyTorch), Tableau",
    },
  ];

  return (
    <div className="relative w-full bg-[#0A0A0A] overflow-hidden min-h-screen pt-32 pb-24 font-sans">
      {/* Декоративный бэкграунд */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-forest/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-20"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-4 block">
            РЕШЕНИЯ И ТЕХНОЛОГИИ
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-white mb-6">
            Государственные <br />
            <span className="text-gradient-gold font-medium">платформы и сервисы</span>
          </h1>
          <p className="text-lg text-zinc-400 font-light leading-relaxed">
            DDC проектирует, создает и поддерживает технологическое ядро финансового сектора Республики Казахстан. Наш портфель включает решения от цифровой валюты до высоконагруженных клиринговых систем.
          </p>
        </motion.div>

        {/* Список услуг */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-12"
        >
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="glass-panel border-white/5 p-8 sm:p-12 rounded-3xl relative overflow-hidden transition-all duration-500 hover:border-gold/25 hover:shadow-gold hover:shadow-sm"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
                  
                  {/* Иконка и заголовки */}
                  <div className="lg:col-span-4">
                    <div className="w-14 h-14 rounded-2xl bg-forest/30 border border-forest-light/20 flex items-center justify-center text-gold mb-6">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs text-gold/80 font-medium tracking-widest uppercase block mb-2">
                      {service.subtitle}
                    </span>
                    <h3 className="text-2xl font-bold text-white tracking-wide">
                      {service.title}
                    </h3>
                    
                    {/* Технологический стек */}
                    <div className="mt-6 pt-6 border-t border-white/5">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-2">Стек технологий:</span>
                      <code className="text-xs text-gold font-mono bg-charcoal/30 px-3 py-1.5 rounded border border-white/5 inline-block">
                        {service.techStack}
                      </code>
                    </div>
                  </div>

                  {/* Описание и преимущества */}
                  <div className="lg:col-span-8">
                    <p className="text-base text-zinc-300 font-light leading-relaxed mb-6">
                      {service.description}
                    </p>
                    
                    <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Ключевые возможности:</h4>
                    <ul className="space-y-3">
                      {service.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3 text-sm text-zinc-400 font-light leading-relaxed">
                          <CheckCircle2 className="w-4.5 h-4.5 text-forest-light shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </div>
  );
}
