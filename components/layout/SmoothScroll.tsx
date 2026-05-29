"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "@/lib/gsap";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    // Не запускаем плавный скролл, если пользователь предпочитает уменьшенное движение
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    // Синхронизация ScrollTrigger с прокруткой Lenis
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Настройка GSAP на использование RAF от Lenis
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Отключение дефолтного лага тикера
    gsap.ticker.lagSmoothing(0);

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      gsap.ticker.remove(() => {});
    };
  }, []);

  return <>{children}</>;
}

