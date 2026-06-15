"use client";

import { motion } from "framer-motion";
import Icon, { IconName } from "@/components/ui/Icon";
import { useTranslations } from "next-intl";

interface ServiceDetail {
  icon: IconName;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  techStack: string;
}

export default function ServicesPage() {
  const t = useTranslations("ServicesPage");

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const services: ServiceDetail[] = [
    {
      icon: "coins",
      title: t("s1.title"),
      subtitle: t("s1.subtitle"),
      description: t("s1.description"),
      features: [
        t("s1.f1"),
        t("s1.f2"),
        t("s1.f3"),
      ],
      techStack: "Hyperledger Fabric, Solidity, Go, HSM Modules",
    },
    {
      icon: "zap",
      title: t("s2.title"),
      subtitle: t("s2.subtitle"),
      description: t("s2.description"),
      features: [
        t("s2.f1"),
        t("s2.f2"),
        t("s2.f3"),
      ],
      techStack: "Java, Spring Boot, Kafka, PostgreSQL, ISO 20022",
    },
    {
      icon: "bank",
      title: t("s3.title"),
      subtitle: t("s3.subtitle"),
      description: t("s3.description"),
      features: [
        t("s3.f1"),
        t("s3.f2"),
        t("s3.f3"),
      ],
      techStack: "C++, Python, Oracle DB, IBM WebSphere MQ",
    },
    {
      icon: "shield-check",
      title: t("s4.title"),
      subtitle: t("s4.subtitle"),
      description: t("s4.description"),
      features: [
        t("s4.f1"),
        t("s4.f2"),
        t("s4.f3"),
      ],
      techStack: "Fortinet, HSM, Linux, Hardware Crypto Units",
    },
    {
      icon: "share",
      title: t("s5.title"),
      subtitle: t("s5.subtitle"),
      description: t("s5.description"),
      features: [
        t("s5.f1"),
        t("s5.f2"),
        t("s5.f3"),
      ],
      techStack: "Node.js, Express, OAuth2, GraphQL, Kong API Gateway",
    },
    {
      icon: "chart",
      title: t("s6.title"),
      subtitle: t("s6.subtitle"),
      description: t("s6.description"),
      features: [
        t("s6.f1"),
        t("s6.f2"),
        t("s6.f3"),
      ],
      techStack: "Hadoop, Spark, ClickHouse, Python (PyTorch), Tableau",
    },
  ];

  return (
    <div className="relative w-full bg-black overflow-hidden min-h-screen pt-32 pb-24 font-sans">
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
            {t("overline")}
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-white mb-6">
            {t("titleLine1")} <br />
            <span className="text-gradient-gold font-medium">{t("titleAccent")}</span>
          </h1>
          <p className="text-lg text-zinc-400 font-light leading-relaxed">
            {t("subtitle")}
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
                      <Icon name={service.icon} size={24} />
                    </div>
                    <span className="text-xs text-gold/80 font-medium tracking-widest uppercase block mb-2">
                      {service.subtitle}
                    </span>
                    <h3 className="text-2xl font-bold text-white tracking-wide">
                      {service.title}
                    </h3>
                    
                    {/* Технологический стек */}
                    <div className="mt-6 pt-6 border-t border-white/5">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-2">{t("techStackLabel")}</span>
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
                    
                    <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">{t("keyFeaturesLabel")}</h4>
                    <ul className="space-y-3">
                      {service.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3 text-sm text-zinc-400 font-light leading-relaxed">
                          <Icon name="check-circle" size={16} className="text-forest-light shrink-0 mt-0.5" />
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
