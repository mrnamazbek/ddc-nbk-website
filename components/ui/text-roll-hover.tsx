"use client";

import React, { useMemo, useState, type ElementType, type CSSProperties } from "react";

export interface TextRollHoverProps {
  text: string;
  as?: ElementType;
  href?: string;
  target?: string;
  className?: string;
  style?: CSSProperties;
  fontSize?: string;
  staggerDelay?: number;
  duration?: number;
  easing?: string;
  color?: string;
  hoverColor?: string;
  direction?: "up" | "down";
  onClick?: (e: React.MouseEvent) => void;
  hovered?: boolean; // Возможность контролировать состояние наведения извне
}

const TextRollHover = React.memo(function TextRollHover({
  text,
  as: ComponentProp = "span",
  href,
  target,
  className = "",
  style,
  fontSize,
  staggerDelay = 15,
  duration = 200,
  easing = "ease-in-out",
  color = "inherit",
  hoverColor = "#C9A84C",
  direction = "up",
  onClick,
  hovered: externalHovered,
}: TextRollHoverProps) {
  const Component: ElementType = ComponentProp;
  const [localHovered, setLocalHovered] = useState(false);
  const isHovered = externalHovered !== undefined ? externalHovered : localHovered;

  const chars = useMemo(() => {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
      return Array.from(segmenter.segment(text), (s) => s.segment);
    }
    return [...text];
  }, [text]);

  const sign = direction === "up" ? 1 : -1;

  const rootProps: React.HTMLAttributes<HTMLElement> & {
    href?: string;
    target?: string;
    rel?: string;
  } = {
    className: `inline-block relative no-underline overflow-hidden select-none ${className}`.trim(),
    style: {
      fontSize,
      ...(color !== "inherit" && { color: isHovered ? hoverColor : color }),
      transition: "color 0.35s ease",
      padding: "0",
      lineHeight: 1,
      ...style,
    },
    onMouseEnter: () => setLocalHovered(true),
    onMouseLeave: () => setLocalHovered(false),
    onClick,
    "aria-label": text,
  };

  if (Component === "a") {
    rootProps.href = href ?? "#";
    if (target) rootProps.target = target;
    if (target === "_blank") rootProps.rel = "noopener noreferrer";
  }

  const content = (
    <span
      className="inline-flex overflow-hidden relative"
      style={{ height: "1em" }}
      aria-hidden="true"
    >
      {chars.map((char, i) => (
        <span
          key={i}
          className="inline-block relative will-change-transform"
          style={{
            textShadow: `0 ${sign}em currentColor`,
            transition: `transform ${duration}ms ${easing}`,
            transitionDelay: `${i * staggerDelay}ms`,
            transform: isHovered ? `translateY(${-sign}em)` : "translateY(0)",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );

  return React.createElement(Component, rootProps, content);
});

TextRollHover.displayName = "TextRollHover";
export { TextRollHover };
