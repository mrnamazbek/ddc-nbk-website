"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";

/**
 * Apple-style scroll-driven image sequence. The shanyrak video is pre-rendered
 * to 150 JPG frames; as the user scrolls through this tall section, a pinned
 * canvas scrubs frame-by-frame, so scrolling "rotates" the gold shanyrak. The
 * canvas uses `lighten` blending so the frames' black background drops out over
 * the dark liquid-glass page — no transparency needed.
 */
const FRAME_COUNT = 150;
const frameSrc = (i: number) =>
  `/sequence/shanyrak_${String(i + 1).padStart(3, "0")}.jpg`;

export default function ShanyrakSequence() {
  const container = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      const wrap = container.current;
      if (!canvas || !wrap) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = 1024;
      canvas.height = 1024;

      // Preload every frame.
      const images: HTMLImageElement[] = [];
      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.src = frameSrc(i);
        images.push(img);
      }

      const state = { frame: 0 };
      const render = () => {
        const img = images[Math.round(state.frame)];
        if (!img || !img.complete || img.naturalWidth === 0) return;
        ctx.clearRect(0, 0, 1024, 1024);
        ctx.drawImage(img, 0, 0, 1024, 1024);
      };
      images[0].onload = render;

      // Scrub the frame index across the section's scroll length.
      const tween = gsap.to(state, {
        frame: FRAME_COUNT - 1,
        ease: "none",
        snap: "frame",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
        },
        onUpdate: render,
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      className="relative w-full bg-[#08080a]"
      style={{ height: "300vh" }}
    >
      {/* Pinned stage */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Soft forest glow behind the crown */}
        <div className="absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.10),transparent_60%)] pointer-events-none" />

        <canvas
          ref={canvasRef}
          aria-hidden
          className="relative z-10 h-[78vh] w-auto max-w-full"
          style={{ mixBlendMode: "lighten" }}
        />

        {/* Glass headline overlay */}
        <div className="absolute inset-x-0 bottom-[12vh] z-20 flex flex-col items-center px-6 text-center pointer-events-none">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-md text-[10px] uppercase tracking-[0.25em] text-gold-light font-mono">
            Шаңырақ • Цифровое ядро
          </span>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-light leading-tight text-white max-w-3xl">
            Сердце финансовой <span className="text-gradient-forest font-medium">системы</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
