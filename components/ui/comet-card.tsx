"use client";

import React from "react";
import { motion } from "framer-motion";

interface CometCardProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function CometCard({
  children,
  className = "",
  containerClassName = "",
}: CometCardProps) {
  return (
    <div
      className={`relative p-[1.5px] overflow-hidden rounded-[20px] bg-zinc-900/40 backdrop-blur-md border border-white/10 ${containerClassName}`}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {/* Dynamic Comet rotating border effect */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] origin-center bg-[conic-gradient(from_0deg,transparent_30%,#C9A84C_50%,#52B788_70%,transparent_90%)] opacity-80 pointer-events-none"
        />
      </div>

      {/* Inner premium liquid glass card panel */}
      <div className={`relative z-10 w-full h-full rounded-[19px] bg-[#0A0C0B]/90 backdrop-blur-xl transition-all duration-300 ${className}`}>
        {children}
      </div>
    </div>
  );
}

export default CometCard;
