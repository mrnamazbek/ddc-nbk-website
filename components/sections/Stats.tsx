"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";

interface StatItem {
  value: string;
  suffix: string;
  label: string;
  description: string;
  targetNum: number;
}

function Counter({ target, duration = 2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = target;
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 15);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function Stats() {
  const stats: StatItem[] = [
    {
      value: "99.99",
      suffix: "%",
      label: "Доступность систем",
      description: "Обеспечение бесперебойной работы государственных транзакционных платформ и шлюзов.",
      targetNum: 99,
    },
    {
      value: "50",
      suffix: "млн+",
      label: "Операций в сутки",
      description: "Высокопроизводительное ядро обрабатывает миллионы транзакций в реальном времени.",
      targetNum: 50,
    },
    {
      value: "15",
      suffix: "+",
      label: "Интегрированных платформ",
      description: "Объединение государственных сервисов и межбанковских информационных систем.",
      targetNum: 15,
    },
    {
      value: "256",
      suffix: " бит",
      label: "Стандарты шифрования",
      description: "Максимальный класс защиты данных в соответствии с государственными нормативами безопасности.",
      targetNum: 256,
    },
  ];

  return (
    <section id="stats" className="relative w-full py-24 sm:py-32 bg-[#0A0A0A] overflow-hidden border-t border-white/5">
      {/* Декоративная фоновая сетка */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1A3D2B08_1px,transparent_1px),linear-gradient(to_bottom,#1A3D2B08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      {/* Мягкие золотые и изумрудные свечения по краям */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-forest/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlassCard className="h-full flex flex-col justify-between p-8 border-white/5 hover:border-gold/20">
                <div>
                  <div className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-2 flex items-baseline">
                    <span className="text-gradient-gold">
                      {stat.targetNum === 99 ? (
                        <>99.99</>
                      ) : (
                        <Counter target={stat.targetNum} />
                      )}
                    </span>
                    <span className="text-gold text-2xl sm:text-3xl ml-1 font-sans font-light">
                      {stat.suffix}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-sans font-semibold text-white tracking-wide mb-3">
                    {stat.label}
                  </h3>
                </div>
                
                <p className="text-sm font-sans font-light text-zinc-400 leading-relaxed mt-4">
                  {stat.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
