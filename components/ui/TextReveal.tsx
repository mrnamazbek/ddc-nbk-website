"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";

interface TextRevealProps {
  text: string;
  className?: string;
}

export default function TextReveal({ text, className = "" }: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  wordsRef.current = [];

  const addToRefs = (el: HTMLSpanElement | null) => {
    if (el && !wordsRef.current.includes(el)) {
      wordsRef.current.push(el);
    }
  };

  const words = text.split(" ");

  useGSAP(
    () => {
      if (wordsRef.current.length === 0) return;

      gsap.fromTo(
        wordsRef.current,
        { opacity: 0.5 },
        {
          opacity: 1,
          stagger: 0.15,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 55%",
            scrub: true,
            markers: false,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={`relative z-10 py-4 ${className}`}>
      <span className="sr-only">{text}</span>
      <p aria-hidden="true" className="flex flex-wrap gap-x-2 gap-y-1 font-display text-2xl md:text-3xl lg:text-4xl font-light text-foreground leading-relaxed">
        {words.map((word, idx) => (
          <span
            key={idx}
            ref={addToRefs}
            className="inline-block transition-opacity duration-300"
          >
            {word}
          </span>
        ))}
      </p>
    </div>
  );
}
