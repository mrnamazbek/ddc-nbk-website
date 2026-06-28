"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Variant C background — the restored "wallpaper" dot-grid preset (diamond dots,
 * bronze → gold on cursor), recovered from the pre-f825ce1 InteractiveDotGrid.
 *
 * Unlike the original (which faded OUT past the hero), this layer fades IN as the
 * user scrolls: at the top the hero looks exactly like Variant A (this layer is
 * fully transparent and the global background shows through); on scroll a deep
 * forest veil + the diamond wallpaper smoothly appear — mirroring the reference
 * site's light→dark scroll transition, in DDC colors.
 *
 * Self-contained: drives its own scroll progress and honours prefers-reduced-motion.
 */
// Theme-aware palettes. Dark: bronze→gold dots over a deep-forest veil. Light:
// forest-green→antique-gold dots over a barely-there warm tint (NOT a dark veil) —
// forest-led and readable on the cream surface.
const DARK_THEME = {
  rest: { r: 189, g: 149, b: 91, a: 0.4 }, // bronze
  active: { r: 232, g: 200, b: 122, a: 0.95 }, // gold
  veil: "radial-gradient(120% 90% at 50% 30%, rgba(14,36,25,0.65) 0%, rgba(4,12,8,0.92) 60%, rgba(2,6,4,0.98) 100%)",
  veilMul: 0.9,
};
const LIGHT_THEME = {
  rest: { r: 26, g: 61, b: 43, a: 0.34 }, // deep forest
  active: { r: 111, g: 86, b: 29, a: 0.82 }, // antique gold (WCAG-safe on cream)
  veil: "radial-gradient(120% 90% at 50% 30%, rgba(26,61,43,0.05) 0%, rgba(26,61,43,0.09) 60%, rgba(15,36,26,0.12) 100%)",
  veilMul: 0.5,
};

export default function VariantCWallpaper() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const veilRef = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef({ x: -10000, y: -10000 });
  const scrollAppearRef = useRef(0); // 0 at hero → 1 once scrolled into the page
  const themeRef = useRef(DARK_THEME);
  const [reduced, setReduced] = useState(false);

  // Detect reduced-motion once on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Track the active theme (html.light) and repaint the veil accordingly.
  useEffect(() => {
    const apply = () => {
      const light = document.documentElement.classList.contains("light");
      themeRef.current = light ? LIGHT_THEME : DARK_THEME;
      if (veilRef.current) veilRef.current.style.background = themeRef.current.veil;
    };
    apply();
    const obs = new MutationObserver(apply);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // Scroll → "appear" factor. Fades the whole layer in across the first viewport.
  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight || 1;
      const t = Math.max(0, Math.min(1, window.scrollY / (vh * 0.9)));
      // ease-out so it settles gently
      scrollAppearRef.current = 1 - Math.pow(1 - t, 2);
      if (veilRef.current) {
        veilRef.current.style.opacity = String(scrollAppearRef.current * themeRef.current.veilMul);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Diamond dot-grid canvas (skipped entirely under reduced-motion).
  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // wallpaper preset (from the original InteractiveDotGrid)
    const SPACING = 30;
    const DOT = 1.5;
    const MAX_DOT = 3.2;
    const RADIUS = 140;
    const STRENGTH = 20;

    let dpr = 1;
    let raf = 0;
    let dots: Array<{ ox: number; oy: number; cx: number; cy: number; vx: number; vy: number }> = [];

    const init = (w: number, h: number) => {
      const cols = Math.ceil(w / SPACING) + 1;
      const rows = Math.ceil(h / SPACING) + 1;
      dots = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * SPACING;
          const y = r * SPACING;
          dots.push({ ox: x, oy: y, cx: x, cy: y, vx: 0, vy: 0 });
        }
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init(w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      mousePos.current = { x: -10000, y: -10000 };
    };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    const animate = () => {
      const appear = scrollAppearRef.current;
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      if (appear > 0.01) {
        const mx = mousePos.current.x;
        const my = mousePos.current.y;
        const { rest: REST, active: ACTIVE } = themeRef.current;
        for (let i = 0; i < dots.length; i++) {
          const dot = dots[i];
          const dx = mx - dot.ox;
          const dy = my - dot.oy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let tx = dot.ox;
          let ty = dot.oy;
          let force = 0;
          if (dist < RADIUS) {
            const n = dist / RADIUS;
            force = Math.sqrt(1 - n * n);
            const angle = Math.atan2(dot.oy - my, dot.ox - mx);
            tx = dot.ox + Math.cos(angle) * force * STRENGTH;
            ty = dot.oy + Math.sin(angle) * force * STRENGTH;
          }

          // spring
          const ax = (tx - dot.cx) * 0.06;
          const ay = (ty - dot.cy) * 0.06;
          dot.vx = (dot.vx + ax) * 0.82;
          dot.vy = (dot.vy + ay) * 0.82;
          dot.cx += dot.vx;
          dot.cy += dot.vy;

          const r = Math.round(REST.r + (ACTIVE.r - REST.r) * force);
          const g = Math.round(REST.g + (ACTIVE.g - REST.g) * force);
          const b = Math.round(REST.b + (ACTIVE.b - REST.b) * force);
          const a = (REST.a + (ACTIVE.a - REST.a) * force) * appear;

          const size = Math.max(0.5, DOT + (MAX_DOT - DOT) * force);
          const radius = size * 1.5;

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
          ctx.beginPath();
          ctx.moveTo(dot.cx, dot.cy - radius);
          ctx.lineTo(dot.cx + radius, dot.cy);
          ctx.lineTo(dot.cx, dot.cy + radius);
          ctx.lineTo(dot.cx - radius, dot.cy);
          ctx.closePath();
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      {/* Deep forest veil that darkens the page on scroll (transparent at hero). */}
      <div
        ref={veilRef}
        className="absolute inset-0"
        style={{
          opacity: 0,
          background:
            "radial-gradient(120% 90% at 50% 30%, rgba(14,36,25,0.65) 0%, rgba(4,12,8,0.92) 60%, rgba(2,6,4,0.98) 100%)",
          transition: "opacity 120ms linear",
        }}
      />
      {/* Diamond wallpaper dot-grid (bronze → gold on cursor). */}
      {!reduced && <canvas ref={canvasRef} className="absolute inset-0 block h-screen w-full" />}
    </div>
  );
}
