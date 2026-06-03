/** Shared timing + easing helpers for the 7-act scroll choreography. */

/** The seven acts as normalized scroll ranges (matches the homepage sections). */
export const ACTS = {
  formation: [0.0, 0.1] as const,
  expansion: [0.1, 0.25] as const,
  coin: [0.25, 0.45] as const,
  vault: [0.45, 0.6] as const,
  digital: [0.6, 0.75] as const,
  steppe: [0.75, 0.9] as const,
  return: [0.9, 1.0] as const,
};

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Smoothstep ease (C1 continuous) — the workhorse for scroll mapping. */
export const smoothstep = (t: number) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};

/** Premium ease-out-expo, mirrors the CSS --ease-expo token. */
export const easeOutExpo = (t: number) =>
  t >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp01(t));

/** Linear remap of `p` from [inMin,inMax] to [0,1], clamped. */
export const range = (p: number, inMin: number, inMax: number) =>
  clamp01((p - inMin) / (inMax - inMin || 1e-6));

/**
 * Trapezoidal "presence" envelope: ramps 0→1 over `fade` after `start`,
 * holds at 1 until `end-fade`, then ramps back to 0 by `end`.
 * Used to crossfade each act's hero object in/out of its scroll window.
 */
export function band(p: number, start: number, end: number, fade = 0.05) {
  if (p <= start || p >= end) return 0;
  const up = smoothstep(range(p, start, start + fade));
  const down = 1 - smoothstep(range(p, end - fade, end));
  return Math.min(up, down);
}
