"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useBgSystem } from "../theme/BgSystemProvider";
import { useA11y } from "../theme/AccessibilityProvider";

// WebGL/R3F shader background — lazy-loaded (only when the Shader preset is on).
const ShaderBackground = dynamic(() => import("./ShaderBackground"), { ssr: false });

type PresetName = "default" | "triangles" | "treeline" | "wallpaper" | "shader";

interface PresetConfig {
  shape: "circle" | "triangle" | "diamond";
  dotSpacingX: number;
  dotSpacingY: number;
  dotSize: number;
  maxDotSize: number;
  distortionRadius: number;
  distortionStrength: number;
  colorRest: { r: number; g: number; b: number; a: number };
  colorActive: { r: number; g: number; b: number; a: number };
  randomSizeRange?: number;
}

export default function InteractiveDotGrid() {
  const { enabled: a11yEnabled, prefersReducedMotion } = useA11y();
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const { bgSystem } = useBgSystem();

  const [activePreset, setActivePreset] = useState<PresetName>("default");

  
  // Конфигурации пресетов в стиле Shaders.com
  const presets: Record<PresetName, PresetConfig> = {
    default: {
      shape: "circle",
      dotSpacingX: 26,
      dotSpacingY: 26,
      dotSize: 1.0,
      maxDotSize: 2.3,
      distortionRadius: 150,
      distortionStrength: 30,
      colorRest: isLight ? { r: 26, g: 61, b: 43, a: 0.55 } : { r: 40, g: 110, b: 70, a: 0.35 },
      colorActive: { r: 232, g: 200, b: 122, a: 0.95 }, // Gold
    },
    triangles: {
      shape: "triangle",
      dotSpacingX: 32,
      dotSpacingY: 32,
      dotSize: 2.5,
      maxDotSize: 4.5,
      distortionRadius: 160,
      distortionStrength: 25,
      colorRest: isLight ? { r: 100, g: 100, b: 100, a: 0.4 } : { r: 130, g: 130, b: 130, a: 0.35 },
      colorActive: isLight ? { r: 0, g: 0, b: 0, a: 0.85 } : { r: 255, g: 255, b: 255, a: 0.9 }, // Серый в белый/черный
    },
    treeline: {
      shape: "circle",
      dotSpacingX: 18,
      dotSpacingY: 70, // Сближены по горизонтали, отдалены по вертикали
      dotSize: 1.2,
      maxDotSize: 3.5,
      distortionRadius: 180,
      distortionStrength: 40,
      colorRest: isLight ? { r: 15, g: 46, b: 25, a: 0.6 } : { r: 34, g: 197, b: 94, a: 0.3 }, // Лесной зеленый
      colorActive: { r: 163, g: 230, b: 53, a: 0.9 }, // Лайм
      randomSizeRange: 1.5, // Разброс размеров
    },
    wallpaper: {
      shape: "diamond",
      dotSpacingX: 30,
      dotSpacingY: 30,
      dotSize: 1.5,
      maxDotSize: 3.2,
      distortionRadius: 140,
      distortionStrength: 20,
      colorRest: isLight ? { r: 139, g: 92, b: 26, a: 0.5 } : { r: 189, g: 149, b: 91, a: 0.4 }, // Бронза
      colorActive: { r: 232, g: 200, b: 122, a: 0.95 }, // Золото
    },
    // Placeholder — the Shader preset renders a WebGL canvas instead of the 2D
    // grid, so this config is never used (kept to satisfy the Record type).
    shader: {
      shape: "circle",
      dotSpacingX: 26,
      dotSpacingY: 26,
      dotSize: 1.0,
      maxDotSize: 2.3,
      distortionRadius: 150,
      distortionStrength: 30,
      colorRest: { r: 40, g: 110, b: 70, a: 0.35 },
      colorActive: { r: 232, g: 200, b: 122, a: 0.95 },
    },
  };

  const currentConfig = presets[activePreset];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgWrapRef = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef({ x: -10000, y: -10000 });

  const scrollOpacityRef = useRef(1);

  // Плавно гасим фон-эффект при прокрутке вниз: к концу первого экрана он почти
  // исчезает, оставляя ровный тёмно-зелёный фон.
  useEffect(() => {
    if (a11yEnabled || prefersReducedMotion) return;
    const handleScroll = () => {
      const vh = window.innerHeight || 1;
      scrollOpacityRef.current = Math.max(0, Math.min(1, 1 - window.scrollY / (vh * 1.05)));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [a11yEnabled, prefersReducedMotion]);
  const dotsRef = useRef<
    Array<{
      originalX: number;
      originalY: number;
      currentX: number;
      currentY: number;
      vx: number;
      vy: number;
      sizeOffset: number;
    }>
  >([]);

  // Инициализация точек при изменении размера экрана или пресета
  useEffect(() => {
    if (a11yEnabled || prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = 1;
    let animationFrameId: number;

    const initializeDots = (width: number, height: number) => {
      const cols = Math.ceil(width / currentConfig.dotSpacingX) + 1;
      const rows = Math.ceil(height / currentConfig.dotSpacingY) + 1;
      const dots = [];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * currentConfig.dotSpacingX;
          const y = row * currentConfig.dotSpacingY;
          // Добавляем случайный разброс размера для лесного пресета
          const sizeOffset = currentConfig.randomSizeRange
            ? (Math.random() - 0.5) * currentConfig.randomSizeRange
            : 0;

          dots.push({
            originalX: x,
            originalY: y,
            currentX: x,
            currentY: y,
            vx: 0,
            vy: 0,
            sizeOffset,
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

    const bg = isLight
      ? "#f5f5f0"
      : (bgSystem === "bg-forest" ? "#10534C" : "#013B3F");

    const animate = () => {
      // Очищаем канвас (делаем его прозрачным, чтобы просвечивал стабильный фон body)
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      const dots = dotsRef.current;
      const mx = mousePos.current.x;
      const my = mousePos.current.y;
      const scrollOpacity = scrollOpacityRef.current;

      // Отрисовка интерактивного свечения (Glow) под курсором с учетом scrollOpacity
      if (mx !== -10000 && my !== -10000 && scrollOpacity > 0.01) {
        const glowGrad = ctx.createRadialGradient(
          mx,
          my,
          2,
          mx,
          my,
          currentConfig.distortionRadius * 1.3
        );
        glowGrad.addColorStop(
          0,
          isLight 
            ? `rgba(26, 61, 43, ${0.15 * scrollOpacity})` 
            : `rgba(40, 110, 70, ${0.22 * scrollOpacity})`
        );
        glowGrad.addColorStop(
          0.4,
          isLight 
            ? `rgba(232, 200, 122, ${0.05 * scrollOpacity})` 
            : `rgba(232, 200, 122, ${0.07 * scrollOpacity})`
        );
        glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        ctx.save();
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(mx, my, currentConfig.distortionRadius * 1.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (scrollOpacity > 0.005) {
        // Отрисовка точек
        for (let i = 0; i < dots.length; i++) {
          const dot = dots[i];
          const dx = mx - dot.originalX;
          const dy = my - dot.originalY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          let targetX = dot.originalX;
          let targetY = dot.originalY;
          let force = 0;

          // Физика отталкивания от мыши
          if (distance < currentConfig.distortionRadius) {
            const normDist = distance / currentConfig.distortionRadius;
            force = Math.sqrt(1 - normDist * normDist);
            
            const angle = Math.atan2(dot.originalY - my, dot.originalX - mx);

            targetX = dot.originalX + Math.cos(angle) * force * currentConfig.distortionStrength;
            targetY = dot.originalY + Math.sin(angle) * force * currentConfig.distortionStrength;
          }

          // Пружинный эффект
          const springK = 0.06;
          const damping = 0.82;
          
          const ax = (targetX - dot.currentX) * springK;
          const ay = (targetY - dot.currentY) * springK;
          
          dot.vx = (dot.vx + ax) * damping;
          dot.vy = (dot.vy + ay) * damping;
          
          dot.currentX += dot.vx;
          dot.currentY += dot.vy;

          // Расчет цвета (смешивание базового и активного) и умножение альфы на scrollOpacity
          const rest = currentConfig.colorRest;
          const active = currentConfig.colorActive;
          const r = Math.round(rest.r + (active.r - rest.r) * force);
          const g = Math.round(rest.g + (active.g - rest.g) * force);
          const b = Math.round(rest.b + (active.b - rest.b) * force);
          const a = (rest.a + (active.a - rest.a) * force) * scrollOpacity;
          
          const baseSize = currentConfig.dotSize + dot.sizeOffset;
          const size = Math.max(0.5, baseSize + (currentConfig.maxDotSize - baseSize) * force);

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;

          // Отрисовка фигуры в зависимости от выбранной формы пресета
          if (currentConfig.shape === "circle") {
            // Рисуем мягкое свечение вокруг активных кругов
            if (force > 0.02) {
              ctx.beginPath();
              ctx.arc(dot.currentX, dot.currentY, size * 2.8, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a * 0.12 * force})`;
              ctx.fill();
              ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
            }
            ctx.beginPath();
            ctx.arc(dot.currentX, dot.currentY, size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (currentConfig.shape === "triangle") {
            ctx.beginPath();
            const side = size * 2.0;
            const h = (Math.sqrt(3) / 2) * side;
            ctx.moveTo(dot.currentX, dot.currentY - h / 2);
            ctx.lineTo(dot.currentX - side / 2, dot.currentY + h / 2);
            ctx.lineTo(dot.currentX + side / 2, dot.currentY + h / 2);
            ctx.closePath();
            ctx.fill();
          } else if (currentConfig.shape === "diamond") {
            ctx.beginPath();
            const radius = size * 1.5;
            ctx.moveTo(dot.currentX, dot.currentY - radius);
            ctx.lineTo(dot.currentX + radius, dot.currentY);
            ctx.lineTo(dot.currentX, dot.currentY + radius);
            ctx.lineTo(dot.currentX - radius, dot.currentY);
            ctx.closePath();
            ctx.fill();
          }
        }
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
  }, [activePreset, isLight, bgSystem]);

  if (a11yEnabled || prefersReducedMotion) {
    return null;
  }

  return (
    <>
      {/* Wrapper fades the whole background effect out as the user scrolls past
          the first viewport (opacity driven by the scroll effect above). */}
      <div ref={bgWrapRef}>
        {activePreset === "shader" ? (
          <ShaderBackground isLight={isLight} />
        ) : (
          <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-screen -z-10 block pointer-events-none"
          />
        )}
      </div>
    </>
  );
}