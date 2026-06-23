"use client";

import { motion } from "framer-motion";

export default function SecuredFiServices() {
  const services = [
    {
      num: "01",
      title: "Contact Center 1477",
      desc: "The National Bank's unified contact center. Technical and advisory support for administrative reporting and digital services. Free of charge across Kazakhstan.",
      status: "operational",
    },
    {
      num: "02",
      title: "Procurement Portal Operator",
      desc: "Operator of the procurement portal — a single access point for e-procurement by the National Bank and its organizations. In operation since 2020.",
      status: "operational",
    },
    {
      num: "03",
      title: "Technological Data Operator",
      desc: "Professional processing and management of data: database development and support, storage security, and adoption of modern technologies. Operator status since 2021.",
      status: "operational",
    },
    {
      num: "04",
      title: "Unified IT Services Center",
      desc: "Engineering competence center: preparation, integration, installation and support of the National Bank's equipment and systems — from server stations to workstations.",
      status: "operational",
    },
    {
      num: "05",
      title: "Information Systems Development",
      desc: "Full software product lifecycle. Since inception, 50 information systems have been built, 24 of which are in operation today (Agile, Waterfall).",
      status: "operational",
    },
    {
      num: "06",
      title: "Information Security",
      desc: "Maintenance and management of information security systems since 2022: event monitoring and response, security policy updates, and cyber-awareness training for staff.",
      status: "operational",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <div className="relative min-h-screen w-full py-32 px-6 bg-gradient-to-b from-transparent to-[#091A11]/60">
      <div className="max-w-6xl mx-auto">
        
        {/* Header section with clean minimalist typography */}
        <div className="mb-24 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-xs font-mono text-gold-light tracking-widest uppercase mb-4"
          >
            Digital Development Center • Services
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl md:text-5xl font-serif text-white font-light tracking-tight mb-6"
          >
            Our services & areas
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-xl text-zinc-400 font-sans font-light leading-relaxed text-sm md:text-base"
          >
            Key areas of activity of the Digital Development Center of the National Bank of Kazakhstan.
          </motion.p>
        </div>

        {/* 3-Column Grid for Services */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative flex flex-col p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl hover:border-gold/30 hover:bg-white/[0.04] transition-all duration-500 overflow-hidden"
            >
              {/* Geometric animated background rings representing Secured Finance's 3D shapes */}
              <div className="relative h-16 w-16 mb-8 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform group-hover:rotate-180 transition-transform duration-[4000ms] ease-linear" viewBox="0 0 100 100">
                  {/* Two intersecting thin vector circles */}
                  <circle
                    cx="40"
                    cy="50"
                    r="24"
                    fill="none"
                    stroke="currentColor"
                    className="text-gold/20 group-hover:text-gold/40 transition-colors duration-500"
                    strokeWidth="1"
                  />
                  <circle
                    cx="60"
                    cy="50"
                    r="24"
                    fill="none"
                    stroke="currentColor"
                    className="text-emerald-500/10 group-hover:text-emerald-500/30 transition-colors duration-500"
                    strokeWidth="1"
                  />
                </svg>
                {/* Numeric index in center */}
                <span className="text-xs font-mono text-zinc-500 group-hover:text-gold transition-colors duration-500 z-10">
                  {service.num}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-serif text-white font-light mb-4 group-hover:text-gold-light transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-zinc-500 group-hover:text-zinc-400 transition-colors duration-300 font-sans font-light text-sm leading-relaxed mb-8 flex-grow">
                {service.desc}
              </p>

              {/* Operational Status Tag */}
              <div className="flex items-center gap-2 border-t border-white/5 pt-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-mono tracking-wider uppercase text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">
                  status: {service.status}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
