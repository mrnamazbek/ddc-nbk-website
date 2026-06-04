"use client";

import { useEffect, useState } from "react";

/**
 * Cinematic loading overlay — a shanyrak-shaped ring fills with gold from 0→100%
 * while the WebGL scene warms up, then fades away. Timed (the scene's assets are
 * procedural, so there's little to truly "load"); the point is the reveal.
 */
export default function CinematicLoader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const DURATION = 1600;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      // ease-out
      setProgress(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 350);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070f0a] transition-opacity duration-700"
      style={{ opacity: done ? 0 : 1, pointerEvents: done ? "none" : "auto" }}
    >
      <div className="relative w-52 h-52">
        {/* The gold shanyrak materialising — brightens + settles as it loads */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/3d/shanyrak-gold.png"
          alt=""
          className="absolute inset-0 w-full h-full object-contain"
          style={{
            // 'screen' blend drops the asset's black background against the
            // near-black loader bg, so only the gold crown shows.
            mixBlendMode: "screen",
            opacity: 0.2 + (progress / 100) * 0.8,
            transform: `scale(${0.82 + (progress / 100) * 0.18}) rotate(${(1 - progress / 100) * -25}deg)`,
            filter: `brightness(${0.85 + (progress / 100) * 0.55}) contrast(1.05)`,
            transition: "opacity 0.1s linear",
          }}
        />
        {/* Progress ring framing the crown */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="#C9A84C"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 48}
            strokeDashoffset={2 * Math.PI * 48 * (1 - progress / 100)}
            style={{ filter: "drop-shadow(0 0 4px rgba(232,200,122,0.9))" }}
          />
        </svg>
      </div>
      <div className="mt-8 flex flex-col items-center gap-2">
        <span className="font-mono text-gold-light text-base tracking-[0.3em] tabular-nums">{progress}%</span>
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold/50">Шаңырақ • Formation</p>
      </div>
    </div>
  );
}
