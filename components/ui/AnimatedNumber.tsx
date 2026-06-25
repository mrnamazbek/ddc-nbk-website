"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSpring, useMotionValue, useInView } from "framer-motion";

interface AnimatedNumberProps {
  value: string;
  className?: string;
}

export default function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  // Parse the number and suffixes/prefixes from the string.
  const { number, prefix, suffix, decimals } = React.useMemo(() => {
    // Regex matches optional non-digits at the start, followed by the decimal number, followed by the rest
    const match = value.match(/^([^0-9\.\-]*)([0-9\.\-]+)(.*)$/);
    if (!match) {
      return { number: 0, prefix: "", suffix: value, decimals: 0 };
    }
    const pre = match[1] || "";
    const numStr = match[2];
    const suf = match[3] || "";
    const num = parseFloat(numStr);
    const dec = numStr.includes(".") ? numStr.split(".")[1].length : 0;
    return { number: isNaN(num) ? 0 : num, prefix: pre, suffix: suf, decimals: dec };
  }, [value]);

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    mass: 1,
    stiffness: 60,
    damping: 15,
  });

  const [displayValue, setDisplayValue] = useState(value);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (inView && !hasStarted) {
      setHasStarted(true);
      motionValue.set(number);
    }
  }, [inView, number, motionValue, hasStarted]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      const formatted = latest.toFixed(decimals);
      let displayNum = formatted;

      if (decimals === 0 && !isNaN(latest)) {
        const val = Math.floor(latest);
        // Avoid formatting years like 1996 with space grouping
        if (val >= 1900 && val <= 2100) {
          displayNum = val.toString();
        } else {
          displayNum = val.toLocaleString("ru-RU");
        }
      }

      setDisplayValue(prefix + displayNum + suffix);
    });
  }, [springValue, prefix, suffix, decimals]);

  // Set the initial visual state before the animation begins to avoid layout shifts
  return (
    <span ref={ref} className={className}>
      {hasStarted ? displayValue : value}
    </span>
  );
}
