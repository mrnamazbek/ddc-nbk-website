"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import DottedMap from "dotted-map";
import { useTheme } from "next-themes";
import Icon from "@/components/ui/Icon";

export interface MapOffice {
  /** Latitude in decimal degrees */
  lat: number;
  /** Longitude in decimal degrees */
  lng: number;
  /** Display label (city) — pass an already-localized string */
  label: string;
}

export interface MapConnection {
  /** index into `offices` */
  from: number;
  /** index into `offices` */
  to: number;
}

interface KazakhstanMapProps {
  offices: MapOffice[];
  /** Optional animated arcs between offices (by index). */
  connections?: MapConnection[];
  /** Arc + marker accent color. Defaults to brand gold. */
  lineColor?: string;
  className?: string;
}

/**
 * «Наши офисы» — a dotted map of Kazakhstan (rendered from `dotted-map`,
 * `countries: ["KAZ"]`) with brand-styled office markers and animated arcs,
 * in the spirit of the Aceternity world-map but scoped to KZ and themed to DDC.
 *
 * Design notes:
 *  - The dotted silhouette is injected as inline SVG (aria-hidden) so it inherits
 *    the theme without tripping axe; the office data drives everything.
 *  - The arc lives in an overlay SVG with the SAME viewBox and uses
 *    `vector-effect: non-scaling-stroke` so its width stays crisp at any size.
 *  - Markers + labels are positioned HTML (percent of the map box) so the text
 *    stays legible and trilingual instead of shrinking with the viewBox.
 *  - A `mounted` guard avoids an SSR/client theme hydration mismatch.
 */
export function KazakhstanMap({
  offices,
  connections = [],
  lineColor = "#C9A84C",
  className = "",
}: KazakhstanMapProps) {
  const { resolvedTheme } = useTheme();
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && resolvedTheme === "light";

  // Build the real Kazakhstan dotted silhouette; recolor when the theme flips.
  const { svg, width, height, pins } = useMemo(() => {
    const map = new DottedMap({ height: 52, grid: "diagonal", countries: ["KAZ"] });
    const dotColor = isLight ? "#1A3D2B" : "#52B788";
    const svgStr = map.getSVG({
      radius: 0.32,
      color: dotColor,
      shape: "circle",
      backgroundColor: "transparent",
    });
    const { width, height } = map.image;
    const pins = offices.map((o) => {
      const p = map.getPin({ lat: o.lat, lng: o.lng });
      return { ...o, x: p?.x ?? 0, y: p?.y ?? 0 };
    });
    return { svg: svgStr, width, height, pins };
  }, [offices, isLight]);

  // Gentle quadratic arc that bows toward the top of the viewBox.
  const arcPath = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const midX = (a.x + b.x) / 2;
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    const midY = Math.min(a.y, b.y) - dist * 0.32;
    return `M ${a.x} ${a.y} Q ${midX} ${midY} ${b.x} ${b.y}`;
  };

  return (
    <div
      className={`relative w-full ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {/* Dotted Kazakhstan silhouette (decorative) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-70 [&_svg]:h-full [&_svg]:w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />

      {/* Animated connection arcs (decorative) */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="kz-arc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0" />
            <stop offset="50%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        {connections.map((c, i) => {
          const a = pins[c.from];
          const b = pins[c.to];
          if (!a || !b) return null;
          return (
            <motion.path
              key={`arc-${i}`}
              d={arcPath(a, b)}
              fill="none"
              stroke="url(#kz-arc)"
              strokeWidth={1.4}
              strokeLinecap="round"
              style={{ vectorEffect: "non-scaling-stroke" }}
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 1.6, delay: 0.4 + i * 0.3, ease: "easeInOut" }
              }
            />
          );
        })}
      </svg>

      {/* Office markers + labels (positioned HTML, crisp at any scale) */}
      {pins.map((p, i) => (
        <div
          key={p.label}
          className="absolute"
          style={{
            left: `${(p.x / width) * 100}%`,
            top: `${(p.y / height) * 100}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={
              reduce
                ? { duration: 0 }
                : { type: "spring", stiffness: 300, damping: 20, delay: 0.2 + i * 0.15 }
            }
            className="relative flex flex-col items-center"
          >
            {/* Pulsing ring */}
            {mounted && !reduce && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full"
                style={{ backgroundColor: lineColor }}
              >
                <span
                  className="absolute inset-0 animate-ping rounded-full opacity-60"
                  style={{ backgroundColor: lineColor }}
                />
              </span>
            )}
            {/* Pin */}
            <span
              aria-hidden="true"
              className="relative -mb-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
              style={{ color: lineColor }}
            >
              <Icon name="map-pin" size={26} animate={false} />
            </span>
            {/* Label */}
            <span className="mt-1 whitespace-nowrap rounded-md border border-white/10 bg-black/80 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm sm:text-xs">
              {p.label}
            </span>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

export default KazakhstanMap;
