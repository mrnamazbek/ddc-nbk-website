"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface InteractiveDotGridProps {
  dotSize?: number;
  maxDotSize?: number;
  dotSpacing?: number;
  distortionRadius?: number;
  distortionStrength?: number;
  animationSpeed?: number;
  backgroundColor?: string;
}

export default function InteractiveDotGrid({
  dotSize = 1.0,
  maxDotSize = 2.3,
  dotSpacing = 26,
  distortionRadius = 150,
  distortionStrength = 30,
  animationSpeed = 0.08,
  backgroundColor = "#000000",
}: InteractiveDotGridProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  // Фон и базовый цвет точек зависят от темы: тёмная → чёрный фон + средне-зелёные
  // точки; светлая → офф-уайт фон + насыщенные тёмно-зелёные точки.
  const bg = isLight ? "#f5f5f0" : backgroundColor;
  const restDotColor = isLight ? "rgba(26, 61, 43, 0.55)" : "rgba(40, 110, 70, 0.45)";

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef({ x: -10000, y: -10000 });
  const dotsRef = useRef<
    Array<{
      originalX: number;
      originalY: number;
      currentX: number;
      currentY: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
    }>
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = 1;
    
    const initializeDots = (width: number, height: number) => {
      const cols = Math.ceil(width / dotSpacing) + 1;
      const rows = Math.ceil(height / dotSpacing) + 1;
      const dots = [];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * dotSpacing;
          const y = row * dotSpacing;
          dots.push({
            originalX: x,
            originalY: y,
            currentX: x,
            currentY: y,
            vx: 0,
            vy: 0,
            color: restDotColor,
            size: dotSize,
          });
        }
      }
      dotsRef.current = dots;
    };

    const resizeCanvas = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initializeDots(width, height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mousePos.current = { x: -10000, y: -10000 };
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const GREEN = isLight
      ? { r: 26, g: 61, b: 43, a: 0.55 } // тёмно-зелёный для светлого фона
      : { r: 40, g: 110, b: 70, a: 0.35 }; // Forest Green
    const GOLD = { r: 232, g: 200, b: 122, a: 0.95 }; // Gold

    let animationFrameId: number;

    const animate = () => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      const dots = dotsRef.current;
      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      if (mx !== -10000 && my !== -10000) {
        const glowGrad = ctx.createRadialGradient(mx, my, 2, mx, my, distortionRadius * 1.3);
        glowGrad.addColorStop(0, "rgba(26, 80, 46, 0.28)");
        glowGrad.addColorStop(0.3, "rgba(232, 200, 122, 0.08)");
        glowGrad.addColorStop(0.6, "rgba(26, 80, 46, 0.02)");
        glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        ctx.save();
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(mx, my, distortionRadius * 1.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        const dx = mx - dot.originalX;
        const dy = my - dot.originalY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let targetX = dot.originalX;
        let targetY = dot.originalY;
        let force = 0;

        if (distance < distortionRadius) {
          const normDist = distance / distortionRadius;
          force = Math.sqrt(1 - normDist * normDist);
          
          const angle = Math.atan2(dot.originalY - my, dot.originalX - mx);

          targetX = dot.originalX + Math.cos(angle) * force * distortionStrength;
          targetY = dot.originalY + Math.sin(angle) * force * distortionStrength;
        }

        const springK = 0.06;
        const damping = 0.82;
        
        const ax = (targetX - dot.currentX) * springK;
        const ay = (targetY - dot.currentY) * springK;
        
        dot.vx = (dot.vx + ax) * damping;
        dot.vy = (dot.vy + ay) * damping;
        
        dot.currentX += dot.vx;
        dot.currentY += dot.vy;

        const r = Math.round(GREEN.r + (GOLD.r - GREEN.r) * force);
        const g = Math.round(GREEN.g + (GOLD.g - GREEN.g) * force);
        const b = Math.round(GREEN.b + (GOLD.b - GREEN.b) * force);
        const a = GREEN.a + (GOLD.a - GREEN.a) * force;
        
        const size = dotSize + (maxDotSize - dotSize) * force;

        if (force > 0.02) {
          ctx.beginPath();
          ctx.arc(dot.currentX, dot.currentY, size * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a * 0.12 * force})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(dot.currentX, dot.currentY, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [dotSize, maxDotSize, dotSpacing, distortionRadius, distortionStrength, animationSpeed, bg, restDotColor]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-screen -z-10 block pointer-events-none"
      style={{ background: bg }}
    />
  );
}