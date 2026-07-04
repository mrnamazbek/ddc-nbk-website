"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface BubbleTextProps {
  text: string;
  className?: string;
  activeClassName?: string;
  neighborClassName?: string;
  secondNeighborClassName?: string;
}

export const BubbleText: React.FC<BubbleTextProps> = ({
  text,
  className = "",
  activeClassName = "font-black text-white scale-[1.15]",
  neighborClassName = "font-bold text-zinc-200 scale-105",
  secondNeighborClassName = "font-medium text-zinc-300 scale-[1.02]",
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!text) return null;

  // Split text into words to prevent breaking words across lines
  const words = text.split(" ");
  let globalCharIdx = 0;

  return (
    <span
      onMouseLeave={() => setHoveredIndex(null)}
      className={cn("cursor-default select-none transition-all duration-300", className)}
    >
      {words.map((word, wordIdx) => {
        const wordChars = word.split("");

        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap">
            {wordChars.map((char) => {
              const currentIdx = globalCharIdx++;
              const distance = hoveredIndex !== null ? Math.abs(hoveredIndex - currentIdx) : null;

              let classes = "transition-all duration-200 ease-out inline-block origin-bottom transform";

              switch (distance) {
                case 0:
                  classes = cn(classes, activeClassName);
                  break;
                case 1:
                  classes = cn(classes, neighborClassName);
                  break;
                case 2:
                  classes = cn(classes, secondNeighborClassName);
                  break;
                default:
                  // Keep parent font weight and style
                  break;
              }

              return (
                <span
                  key={currentIdx}
                  onMouseEnter={() => setHoveredIndex(currentIdx)}
                  className={classes}
                >
                  {char}
                </span>
              );
            })}
            {/* Add space between words (except the last word) */}
            {wordIdx < words.length - 1 && (
              <span
                className="inline-block"
                onMouseEnter={() => {
                  // Increments the global index for the space character
                  globalCharIdx++;
                }}
              >
                &nbsp;
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
};

export default BubbleText;
