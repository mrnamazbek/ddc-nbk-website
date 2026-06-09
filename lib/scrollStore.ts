/**
 * Decoupled scroll-progress store driving the cinematic 3D experience.
 *
 * One self-contained rAF loop reads window.scrollY (Lenis writes real scroll,
 * so this stays smooth) and exposes a normalized 0..1 page progress plus an
 * exponentially-damped value and scroll velocity. The R3F scene reads these
 * inside useFrame without triggering any React re-renders.
 */

export interface ScrollState {
  /** Raw normalized scroll progress 0..1 over the full page. */
  raw: number;
  /** Exponentially-damped progress — what the camera/objects follow. */
  smooth: number;
  /** Signed progress velocity (per second), useful for motion blur / chroma. */
  velocity: number;
}

const state: ScrollState = { raw: 0, smooth: 0, velocity: 0 };

let running = false;
let last = 0;

/**
 * Progress range each homepage section maps onto, in 3D-act space. Index order
 * must match the DOM order of #acts children (Hero, Stats, Services, Security,
 * Digital, About, News, CTA). This makes the morph objects sync to whichever
 * section is on screen regardless of section height.
 */
const ACT_RANGES: [number, number][] = [
  [0.0, 0.1], // Hero         → Formation
  [0.1, 0.25], // Stats        → Expansion
  [0.25, 0.45], // Services     → Coin
  [0.45, 0.6], // Digital      → Vault / Data Flow (inverted index)
  [0.6, 0.75], // Security     → Vault / Data Flow (inverted index)
  [0.75, 0.9], // About        → Steppe
  [0.9, 0.93], // Timeline     → Return (rising)
  [0.93, 0.96], // Leadership   → Return (rising)
  [0.96, 1.0], // CTA          → Return (full glory)
];

let sections: { top: number; height: number }[] = [];

function measure() {
  const root = document.getElementById("acts");
  if (!root) {
    sections = [];
    return;
  }
  const sy = window.scrollY;
  sections = Array.from(root.children).map((el) => {
    const r = el.getBoundingClientRect();
    return { top: r.top + sy, height: r.height || 1 };
  });
}

function compute() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  if (max <= 0) {
    state.raw = 0;
    return;
  }
  if (sections.length === 0) measure();

  // No section data → fall back to plain pixel ratio.
  if (sections.length === 0) {
    state.raw = Math.min(1, Math.max(0, window.scrollY / max));
    return;
  }

  // The "reading line" sits a bit below the viewport top so the act flips as a
  // section takes over the screen rather than when it first peeks in.
  const line = window.scrollY + window.innerHeight * 0.42;

  let idx = sections.length - 1;
  for (let i = 0; i < sections.length; i++) {
    if (line < sections[i].top + sections[i].height) {
      idx = i;
      break;
    }
  }
  const s = sections[idx];
  const f = Math.min(1, Math.max(0, (line - s.top) / s.height));
  const [a, b] = ACT_RANGES[Math.min(idx, ACT_RANGES.length - 1)];
  // Snap the extremes so the very top is Act 1 start and the very bottom is 1.
  let prog = a + (b - a) * f;
  if (window.scrollY <= 2) prog = 0;
  if (window.scrollY >= max - 2) prog = 1;
  state.raw = Math.min(1, Math.max(0, prog));
}

function loop(t: number) {
  compute();
  const dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016;
  last = t;

  const prev = state.smooth;
  // Critically-ish damped follow — frame-rate independent.
  const lambda = 5.5;
  state.smooth += (state.raw - state.smooth) * (1 - Math.exp(-lambda * dt));
  state.velocity = (state.smooth - prev) / Math.max(dt, 1e-4);

  requestAnimationFrame(loop);
}

/** Begin tracking scroll. Safe to call multiple times; only starts once. */
export function startScrollTracking() {
  if (running || typeof window === "undefined") return;
  running = true;
  // Measure sections after layout settles, and remeasure on resize.
  const remeasure = () => measure();
  requestAnimationFrame(() => requestAnimationFrame(remeasure));
  window.addEventListener("resize", remeasure);
  window.addEventListener("load", remeasure);
  // Seed an initial value immediately so frame 0 isn't a jump.
  compute();
  state.smooth = state.raw;
  requestAnimationFrame(loop);
}

/** Live scroll state object (mutated in place — read its fields each frame). */
export function getScroll(): ScrollState {
  return state;
}
