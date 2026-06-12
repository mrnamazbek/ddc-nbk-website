"use client";

import React, { useEffect, useRef } from "react";
import { useMotionValue, useSpring, useTransform, useInView } from "framer-motion";

interface NumberTickerProps {
  value: number;
  className?: string;
  delay?: number;
  prefix?: string;
  suffix?: string;
}

export default function NumberTicker({
  value,
  className,
  delay = 0,
  prefix = "",
  suffix = "",
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 70,
    damping: 15,
  });

  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(value);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, value, motionValue, delay]);

  const formattedValue = useTransform(springValue, (latest) => {
    // Округляем до целого или до одного знака после запятой, если есть дробная часть
    const rounded = Math.round(latest * 10) / 10;
    return `${prefix}${rounded.toLocaleString("ru-RU")}${suffix}`;
  });

  useEffect(() => {
    return formattedValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = latest;
      }
    });
  }, [formattedValue]);

  return (
    <span
      ref={ref}
      className={className}
    >
      {prefix}0{suffix}
    </span>
  );
}
