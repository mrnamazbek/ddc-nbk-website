"use client";

import { useEffect, useRef } from "react";

/**
 * Premium "Matrix" binary trail that follows the cursor — gold 0/1 glyphs that
 * spawn near the pointer, drift downward and fade to forest green. Deliberately
 * low-opacity and capped so it reads as atmosphere, not noise. Disabled on
 * touch/low-power devices and under prefers-reduced-motion.
 */
interface Glyph {
  x: number;
  y: number;
  char: string;
  life: number;
  vy: number;
  size: number;
}

const GOLD = { r: 201, g: 168, b: 76 }; // #C9A84C
const FOREST = { r: 26, g: 61, b: 43 }; // #1A3D2B
const MAX = 320;

export default function MatrixCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const glyphs: Glyph[] = [];
    let lastX = 0;
    let lastY = 0;
    let lastSpawn = 0;

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      // Spawn proportionally to movement, but throttled.
      if (now - lastSpawn < 22 && dist < 40) return;
      lastSpawn = now;
      lastX = e.clientX;
      lastY = e.clientY;
      const n = dist > 120 ? 3 : 2;
      for (let i = 0; i < n && glyphs.length < MAX; i++) {
        glyphs.push({
          x: e.clientX + (Math.random() - 0.5) * 56,
          y: e.clientY + (Math.random() - 0.5) * 56,
          char: Math.random() > 0.5 ? "0" : "1",
          life: 1,
          vy: 0.4 + Math.random() * 1.6,
          size: 12 + Math.random() * 4,
        });
      }
    };

    let raf = 0;
    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = glyphs.length - 1; i >= 0; i--) {
        const gph = glyphs[i];
        gph.y += gph.vy;
        gph.life -= 0.016;
        if (gph.life <= 0) {
          glyphs.splice(i, 1);
          continue;
        }
        // gold → forest as it ages
        const tmix = 1 - gph.life;
        const r = Math.round(GOLD.r + (FOREST.r - GOLD.r) * tmix);
        const g = Math.round(GOLD.g + (FOREST.g - GOLD.g) * tmix);
        const b = Math.round(GOLD.b + (FOREST.b - GOLD.b) * tmix);
        ctx.font = `${gph.size}px "JetBrains Mono", ui-monospace, monospace`;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${gph.life * 0.38})`;
        ctx.fillText(gph.char, gph.x, gph.y);
      }
      raf = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40"
    />
  );
}
