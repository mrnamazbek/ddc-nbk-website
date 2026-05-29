"use client";

import React from "react";

interface PartnerMarqueeProps {
  items: string[];
  direction?: "left" | "right";
  speed?: "slow" | "medium" | "fast";
  className?: string;
}

export default function PartnerMarquee({
  items,
  direction = "left",
  speed = "medium",
  className = "",
}: PartnerMarqueeProps) {
  const speedClass = {
    slow: "animate-marquee-slow",
    medium: "animate-marquee-medium",
    fast: "animate-marquee-fast",
  };

  const directionClass = direction === "right" ? "reverse" : "";

  // Клонируем элементы для бесшовного зацикливания прокрутки
  const marqueeItems = [...items, ...items, ...items, ...items];

  return (
    <div className={`relative flex w-full overflow-hidden py-4 select-none [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] ${className}`}>
      <div 
        className={`flex min-w-full shrink-0 items-center justify-around gap-6 ${speedClass[speed]} ${
          directionClass ? "[animation-direction:reverse]" : ""
        }`}
      >
        {marqueeItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center px-6 py-3 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md text-white/60 font-mono text-sm tracking-widest hover:text-white hover:border-brand-blue-light/30 hover:bg-brand-blue/5 transition-all duration-300"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
