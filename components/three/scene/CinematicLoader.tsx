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
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0E2419] transition-opacity duration-700"
      style={{ opacity: done ? 0 : 1, pointerEvents: done ? "none" : "auto" }}
    >
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="2" />
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="#C9A84C"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 44}
            strokeDashoffset={2 * Math.PI * 44 * (1 - progress / 100)}
            style={{ filter: "drop-shadow(0 0 6px rgba(232,200,122,0.8))" }}
          />
        </svg>
        {/* radial spokes evoking the shanyrak crown */}
        <div className="absolute inset-0 flex items-center justify-center rotate-90">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="absolute w-px h-7 bg-gradient-to-t from-transparent to-gold/60"
              style={{ transform: `rotate(${i * 30}deg) translateY(-46px)`, opacity: progress / 100 }}
            />
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-gold-light text-lg tracking-widest tabular-nums">{progress}%</span>
        </div>
      </div>
      <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.4em] text-gold/50">
        Formation
      </p>
    </div>
  );
}
