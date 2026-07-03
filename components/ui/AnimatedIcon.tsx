'use client'; // Строго обязательно для Next.js App Router

import React from 'react';
import { motion, type Transition } from 'framer-motion';

interface AnimatedIconProps {
  children: React.ReactNode;
  animationType?: 'scale' | 'rotate' | 'bounce' | 'pulse';
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({ 
  children, 
  animationType = 'scale' 
}) => {
  const transition: Transition =
    animationType === 'pulse'
      ? { duration: 2, ease: "easeInOut", repeat: Infinity }
      : { type: 'spring' as const, stiffness: 300, damping: 18 };

  const variants = {
    scale: { whileHover: { scale: 1.12 }, whileTap: { scale: 0.92 } },
    rotate: { whileHover: { rotate: 15, scale: 1.05 } },
    bounce: { whileHover: { y: -3 } },
    pulse: { 
      animate: { scale: [1, 1.04, 1] },
    }
  };

  return (
    <motion.div
      className="inline-block cursor-pointer"
      {...variants[animationType]}
      transition={transition}
    >
      {children}
    </motion.div>
  );
};
