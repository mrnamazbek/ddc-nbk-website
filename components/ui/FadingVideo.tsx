"use client";

import { useEffect, useRef, useState } from "react";

interface FadingVideoProps {
  src: string;
  fallbackSrc: string;
  className?: string;
  videoClassName?: string;
  fallbackClassName?: string;
  fadeDuration?: number; // FADE_MS=500
  autoplay?: boolean;
}

export default function FadingVideo({
  src,
  fallbackSrc,
  className = "",
  videoClassName = "",
  fallbackClassName = "",
  fadeDuration = 500,
  autoplay = true,
}: FadingVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoOpacity, setVideoOpacity] = useState(0);
  const [fallbackOpacity, setFallbackOpacity] = useState(1);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  // Intersection Observer для отслеживания видимости видео во viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        root: null, // отслеживаем относительно экрана
        threshold: 0.05, // видео видно хотя бы на 5%
      }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Кроссфейд при первой загрузке видео
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let startTime: number | null = null;

    const startCrossfade = () => {
      setIsVideoReady(true);

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / fadeDuration, 1);

        const easeProgress = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        setVideoOpacity(easeProgress);
        setFallbackOpacity(1 - easeProgress);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setVideoOpacity(1);
          setFallbackOpacity(0);
        }
      };

      // Небольшая задержка перед началом анимации
      setTimeout(() => {
        animationFrameRef.current = requestAnimationFrame(animate);
      }, 550);
    };

    video.addEventListener("canplay", startCrossfade, { once: true });
    video.load();

    return () => {
      video.removeEventListener("canplay", startCrossfade);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [src, fadeDuration]);

  // Воспроизведение только когда видео находится на экране
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoplay) return;

    if (isIntersecting) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isIntersecting, autoplay, src]);

  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundImage: `url(${fallbackSrc})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {/* Изображение-заглушка (Fallback) */}
      {fallbackOpacity > 0 && (
        <img
          src={fallbackSrc}
          alt="Video Fallback"
          className={`absolute inset-0 w-full h-full object-cover z-10 pointer-events-none ${fallbackClassName}`}
          style={{ opacity: fallbackOpacity }}
        />
      )}

      {/* Само видео */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata" // Загружаем только метаданные
        poster={fallbackSrc}
        className={`absolute inset-0 w-full h-full object-cover z-0 ${videoClassName}`}
        style={{ opacity: videoOpacity }}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
