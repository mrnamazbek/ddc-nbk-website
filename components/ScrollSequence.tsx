"use client";

import { useEffect, useRef, useState } from "react";
import { getScroll, startScrollTracking } from "@/lib/scrollStore";
import { band, lerp, range } from "@/lib/sceneMath";

interface ScrollSequenceProps {
  totalFrames?: number;
  desktopDir?: string;
  mobileDir?: string;
  className?: string;
}

export default function ScrollSequence({
  totalFrames = 300,
  desktopDir = "/sequence/desktop",
  mobileDir = "/sequence/mobile",
  className = "",
}: ScrollSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Ссылки на ассеты
  const shanyrakPngRef = useRef<HTMLImageElement | null>(null);
  const coinPngRef = useRef<HTMLImageElement | null>(null);
  const eaglePngRef = useRef<HTMLImageElement | null>(null);
  const sequenceFramesRef = useRef<HTMLImageElement[]>([]);

  // Определение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Предзагрузка всех ресурсов
  useEffect(() => {
    startScrollTracking();
    const dir = isMobile ? mobileDir : desktopDir;
    const totalAssets = totalFrames + 3; // Кадры + 3 PNG ассета
    let loadedCount = 0;

    const incrementProgress = () => {
      loadedCount++;
      setLoadingProgress(Math.round((loadedCount / totalAssets) * 100));
      if (loadedCount === totalAssets) {
        setIsLoaded(true);
      }
    };

    // Загрузка PNG ассетов
    const shanyrakPng = new Image();
    shanyrakPng.src = "/images/3d/shanyrak-gold.png";
    shanyrakPng.onload = incrementProgress;
    shanyrakPng.onerror = incrementProgress;
    shanyrakPngRef.current = shanyrakPng;

    const coinPng = new Image();
    coinPng.src = "/images/3d/tenge-coin-gold.png";
    coinPng.onload = incrementProgress;
    coinPng.onerror = incrementProgress;
    coinPngRef.current = coinPng;

    const eaglePng = new Image();
    eaglePng.src = "/images/3d/burkit-eagle-gold.png";
    eaglePng.onload = incrementProgress;
    eaglePng.onerror = incrementProgress;
    eaglePngRef.current = eaglePng;

    // Загрузка кадров последовательности
    const loadedFrames: HTMLImageElement[] = [];
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(4, "0");
      img.src = `${dir}/frame_${frameNum}.webp`;
      img.onload = incrementProgress;
      img.onerror = incrementProgress;
      loadedFrames.push(img);
    }
    sequenceFramesRef.current = loadedFrames;

    return () => {
      shanyrakPng.src = "";
      coinPng.src = "";
      eaglePng.src = "";
      loadedFrames.forEach((img) => (img.src = ""));
    };
  }, [isMobile, totalFrames, desktopDir, mobileDir]);

  // Запуск rAF цикла отрисовки
  useEffect(() => {
    if (!isLoaded) return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      // 1. Очистка холста
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Рисуем фоновый глубокий зеленый градиент
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        10,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) * 0.8
      );
      gradient.addColorStop(0, "#0E2419");
      gradient.addColorStop(1, "#0A0A0A");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Получаем сглаженный скролл
      const p = getScroll().smooth;
      const t = performance.now() / 1000;

      // Расчет видимости (presence) каждого ассета на основе таймлайна (Acts)
      const shanyrakPresence = band(p, -0.05, 0.26, 0.05) + band(p, 0.95, 1.05, 0.02);
      const coinPresence = band(p, 0.25, 0.62, 0.05);
      const eaglePresence = band(p, 0.72, 0.90, 0.05);

      const centerImage = (img: HTMLImageElement, opacity: number, scale: number, rotation = 0, offsetX = 0, offsetY = 0) => {
        if (!img.complete || opacity <= 0.005) return;

        ctx.save();
        ctx.globalAlpha = opacity;

        // Центрирование с масштабированием
        const imgRatio = img.width / img.height;
        const canvasRatio = canvas.width / canvas.height;
        
        let drawWidth = canvas.width;
        let drawHeight = canvas.height;

        if (canvasRatio > imgRatio) {
          drawWidth = canvas.height * imgRatio;
        } else {
          drawHeight = canvas.width / imgRatio;
        }

        // Применяем масштаб
        drawWidth *= scale;
        drawHeight *= scale;

        const cx = canvas.width / 2 + offsetX;
        const cy = canvas.height / 2 + offsetY;

        ctx.translate(cx, cy);
        if (rotation !== 0) {
          ctx.rotate(rotation);
        }

        // Добавляем эффект свечения через композицию Additive
        ctx.globalCompositeOperation = "screen";

        ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        ctx.restore();
      };

      // 2. Рендеринг Шанырака (Кадры последовательности)
      if (shanyrakPresence > 0) {
        // Определяем индекс кадра на основе скролла
        let frameIndex = 0;
        if (p < 0.3) {
          // Начальный скролл: маппинг progress 0..0.25 в кадры 0..299
          frameIndex = Math.floor(range(p, 0, 0.25) * (totalFrames - 1));
        } else {
          // Финальный скролл: вращение продолжается со временем
          frameIndex = Math.floor((t * 15) % totalFrames);
        }
        
        frameIndex = Math.max(0, Math.min(totalFrames - 1, frameIndex));
        const frameImg = sequenceFramesRef.current[frameIndex];
        
        if (frameImg) {
          let scale = 0.5;
          if (p < 0.25) {
            scale = lerp(0.38, 0.52, range(p, 0, 0.25));
          } else if (p > 0.88) {
            scale = lerp(0.42, 0.58, range(p, 0.88, 1.0));
          }
          // Дыхание
          scale *= (1 + Math.sin(t * 1.2) * 0.015);
          centerImage(frameImg, shanyrakPresence, scale);
        }
      }

      // 3. Рендеринг монеты Тенге (Coin PNG)
      if (coinPresence > 0) {
        const coinImg = coinPngRef.current;
        if (coinImg) {
          const coinScale = lerp(0.3, 0.46, range(p, 0.25, 0.45)) * (1 + Math.sin(t * 1.5) * 0.015);
          const rotation = t * 0.4 + p * 6; // Вращение монеты от времени и скролла
          centerImage(coinImg, coinPresence, coinScale, rotation);
        }
      }

      // 4. Рендеринг Беркута (Eagle PNG)
      if (eaglePresence > 0) {
        const eagleImg = eaglePngRef.current;
        if (eagleImg) {
          const cross = range(p, 0.72, 0.88);
          // Полет слева направо
          const offsetX = lerp(-canvas.width * 0.6, canvas.width * 0.6, cross);
          const offsetY = -canvas.height * 0.1 + Math.sin(cross * Math.PI) * canvas.height * 0.15;
          
          const eagleScale = 0.42 * (1 + Math.sin(t * 2.2) * 0.02);
          const bank = Math.sin(t * 1.5) * 0.05 + (cross - 0.5) * 0.15;
          centerImage(eagleImg, eaglePresence, eagleScale, bank, offsetX, offsetY);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isLoaded, totalFrames]);

  // Адаптивный размер холста
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-full h-screen pointer-events-none overflow-hidden z-0 bg-transparent ${className}`}
    >
      {/* Прогресс-бар загрузки кадров */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-[#0A0A0A] z-50 transition-opacity duration-500">
          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gold transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            Загрузка сцены • {loadingProgress}%
          </span>
        </div>
      )}

      {/* Сам холст для отрисовки */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-cover transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
