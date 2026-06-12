"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useMotionTemplate, useMotionValue, motion } from "framer-motion";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const radius = 100; // radius of the glow effect
    const [visible, setVisible] = React.useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: any) {
      const { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    return (
      <motion.div
        style={{
          background: useMotionTemplate`
            radial-gradient(
              ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
              var(--color-forest-light, #52B788),
              transparent 80%
            )
          `,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="p-[1px] rounded-[var(--radius-input)] transition-all duration-300 group/input bg-charcoal border border-border focus-within:border-gold/50 focus-within:shadow-[0_0_12px_rgba(201,168,76,0.15)]"
      >
        <input
          type={type}
          className={cn(
            `flex h-11 w-full border-none bg-background text-foreground shadow-input rounded-[calc(var(--radius-input)-1px)] px-3 py-2 text-sm 
            file:border-0 file:bg-transparent file:text-sm file:font-medium 
            placeholder:text-foreground/40 focus-visible:outline-none focus-visible:ring-0
            disabled:cursor-not-allowed disabled:opacity-50 transition duration-300`,
            className
          )}
          ref={ref}
          {...props}
        />
      </motion.div>
    );
  }
);
Input.displayName = "Input";

export { Input };
