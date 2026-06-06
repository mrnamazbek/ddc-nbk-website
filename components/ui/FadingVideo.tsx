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
  fadeDuration = 500, // FADE_MS = 500
  autoplay = true,
}: FadingVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoOpacity, setVideoOpacity] = useState(0);
  const [fallbackOpacity, setFallbackOpacity] = useState(1);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let startTime: number | null = null;

    const startCrossfade = () => {
      setIsVideoReady(true);
      
      // Начинаем воспроизведение видео с упреждением (lead ~0.55s / 550ms)
      video.play().catch(() => {});

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / fadeDuration, 1);

        // Используем плавную функцию сглаживания (ease-in-out)
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

      // Задержка перед началом анимации фейда (lead = 0.55s)
      setTimeout(() => {
        animationFrameRef.current = requestAnimationFrame(animate);
      }, 550);
    };

    video.addEventListener("canplay", startCrossfade, { once: true });
    video.load();

    return () => {
      if (video) {
        video.removeEventListener("canplay", startCrossfade);
        video.pause();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [src, fadeDuration]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
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
        className={`absolute inset-0 w-full h-full object-cover z-0 ${videoClassName}`}
        style={{ opacity: videoOpacity }}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
