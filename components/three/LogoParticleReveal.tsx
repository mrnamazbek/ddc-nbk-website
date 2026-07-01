"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

/**
 * Variant A/C centerpiece — a scroll-driven GPU particle field that starts as
 * the restored DDC green/gold flowing dot shader. Variant A holds that brand
 * terrain; Variant C continues into a SecuredFi-like diagonal ribbon and then
 * morphs into the DDC emblem while the four key stats reveal.
 *
 * Technique (matches the reference's architecture, rebuilt from scratch):
 *   - one THREE.Points cloud; each vertex carries a flowing wave target (aWheel)
 *     and a logo target (aLogo) generated from the exact DDC SVG geometry
 *   - a scroll-derived, lerp-smoothed uProgress mixes wheel→logo with a simplex-noise
 *     "burst" that peaks mid-morph, so particles explode then reassemble
 *   - the wave floats slowly for a beat, then eases into the logo silhouette
 *
 * Slow + cinematic by design: a tall scroll track + a low lerp factor.
 * Honours prefers-reduced-motion with a static fallback.
 */

const VERT = /* glsl */ `
  uniform float uProgress;   // 0 wheel → 1 logo
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uRibbonMode;
  uniform float uLogoMode;

  attribute vec3 aWheel;
  attribute vec3 aRibbon;
  attribute vec3 aLogo;
  attribute float aRand;
  attribute float aScale;

  varying float vMix;
  varying float vRibbon;
  varying float vRand;

  // --- Ashima simplex noise (snoise) ---
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+1.0*C.xxx;
    vec3 x2=x0-i2+2.0*C.xxx;
    vec3 x3=x0-1.0+3.0*C.xxx;
    i=mod(i,289.0);
    vec4 p=permute(permute(permute(
      i.z+vec4(0.0,i1.z,i2.z,1.0))
      +i.y+vec4(0.0,i1.y,i2.y,1.0))
      +i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=1.0/7.0;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main(){
    // Stage 1: old DDC green/gold terrain. Stage 2: SecuredFi-like diagonal
    // ribbon. Stage 3 (Variant C only): precise DDC logo formation.
    float ribbon = smoothstep(0.16, 0.42, uProgress) * uRibbonMode;
    float form = smoothstep(0.58, 0.86, uProgress) * uLogoMode;
    vMix = form;
    vRibbon = ribbon * (1.0 - form);
    vRand = aRand;

    vec3 flowPos = mix(aWheel, aRibbon, ribbon);
    vec3 pos = mix(flowPos, aLogo, form);

    // Slow floating motion while the diagonal ribbon is still visible.
    float hold = 1.0 - form;
    pos.x += sin(uTime * 0.2 + aRand * 20.0) * 0.035 * hold;
    pos.y += cos(uTime * 0.18 + aRand * 17.0) * 0.032 * hold;
    pos.z += sin(uTime * 0.14 + aRand * 11.0) * 0.08 * hold;

    // Soft reassembly energy that peaks during logo morph, deliberately restrained.
    float burst = sin(clamp((uProgress - 0.58) / 0.28, 0.0, 1.0) * 3.14159265) * uLogoMode;
    float n = snoise(pos * 0.9 + vec3(uTime * 0.08, uTime * 0.05, aRand * 10.0));
    vec3 dir = normalize(pos + vec3(0.0001));
    pos += dir * n * burst * 0.24;
    pos.z += snoise(pos * 1.4 + uTime * 0.1) * burst * 0.2;

    // gentle idle drift once formed
    pos += dir * snoise(pos * 0.6 + uTime * 0.15) * 0.028 * form;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float sizeTaper = mix(1.12, 0.82, form);
    gl_PointSize = uSize * sizeTaper * aScale * uPixelRatio * (150.0 / -mv.z);
    float maxPoint = mix(3.65, 2.1, form) * uPixelRatio;
    gl_PointSize = clamp(gl_PointSize, 0.65, maxPoint);
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uColorA;  // forest
  uniform vec3 uColorB;  // gold
  uniform vec3 uRibbonA;
  uniform vec3 uRibbonB;
  uniform float uOpacity;

  varying float vMix;
  varying float vRibbon;
  varying float vRand;

  void main(){
    // soft round point
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float alpha = smoothstep(0.5, 0.08, d);
    if (alpha < 0.01) discard;

    // Gold/green for DDC terrain and logo, cyan/blue only during the ribbon stage.
    float t = clamp(0.22 + vMix * 0.58 + vRand * 0.5, 0.0, 1.0);
    vec3 brandCol = mix(uColorA, uColorB, t);
    vec3 ribbonCol = mix(uRibbonA, uRibbonB, clamp(0.25 + vRand * 0.75, 0.0, 1.0));
    vec3 col = mix(brandCol, ribbonCol, vRibbon);
    gl_FragColor = vec4(col, alpha * uOpacity);
  }
`;

/**
 * Sample the emblem's opaque pixels (the logo mask rasterized to a transparent canvas)
 * and auto-fit them so the emblem fills a consistent frame regardless of padding.
 */
function seeded(seed: number) {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function inRoundedRect(x: number, y: number, r: { x: number; y: number; w: number; h: number; rx?: number }) {
  const rx = r.rx ?? 0;
  if (x < r.x || x > r.x + r.w || y < r.y || y > r.y + r.h) return false;
  if (rx <= 0) return true;

  const cx = x < r.x + rx ? r.x + rx : x > r.x + r.w - rx ? r.x + r.w - rx : x;
  const cy = y < r.y + rx ? r.y + rx : y > r.y + r.h - rx ? r.y + r.h - rx : y;
  return (x - cx) ** 2 + (y - cy) ** 2 <= rx ** 2;
}

function inDiamond(x: number, y: number, cx: number, cy: number, radius: number) {
  return Math.abs(x - cx) + Math.abs(y - cy) <= radius;
}

function inShape(x: number, y: number) {
  const bars = [
    { x: 80.5, y: 38, w: 17, h: 124, rx: 7 },
    { x: 102.5, y: 38, w: 17, h: 124, rx: 7 },
    { x: 60.5, y: 42, w: 17, h: 116, rx: 7 },
    { x: 122.5, y: 42, w: 17, h: 116, rx: 7 },
    { x: 40.5, y: 50, w: 17, h: 100, rx: 7 },
    { x: 142.5, y: 50, w: 17, h: 100, rx: 7 },
    { x: 20.5, y: 62, w: 17, h: 76, rx: 7 },
    { x: 162.5, y: 62, w: 17, h: 76, rx: 7 },
  ];

  if (bars.some((bar) => inRoundedRect(x, y, bar))) return true;

  const diamonds = [
    [100, 54, 7],
    [100, 146, 7],
    [69, 70, 7],
    [131, 70, 7],
    [49, 100, 7],
    [151, 100, 7],
    [69, 130, 7],
    [131, 130, 7],
  ] as const;
  if (diamonds.some(([cx, cy, radius]) => inDiamond(x, y, cx, cy, radius))) return true;

  const core = [
    { x: 80, y: 96.5, w: 40, h: 7, rx: 3 },
    { x: 86, y: 86, w: 6, h: 28, rx: 2 },
    { x: 108, y: 86, w: 6, h: 28, rx: 2 },
    { x: 86, y: 86, w: 28, h: 6, rx: 2 },
    { x: 86, y: 108, w: 28, h: 6, rx: 2 },
    { x: 96.5, y: 96.5, w: 7, h: 7, rx: 0 },
  ];
  if (core.some((part) => inRoundedRect(x, y, part))) return true;

  // Top/bottom arc connectors from the SVG, approximated as narrow bands so the
  // particle target keeps the emblem's round silhouette even if image sampling fails.
  const dx = x - 100;
  const dy = y - 100;
  const dist = Math.hypot(dx, dy);
  if (dist > 63 && dist < 66 && y < 48 && x > 27 && x < 173) return true;
  if (dist > 63 && dist < 66 && y > 152 && x > 27 && x < 173) return true;

  return false;
}

function sampleProceduralLogo(want: number): Float32Array {
  const candidates: Array<[number, number]> = [];
  const step = 1.1;
  for (let y = 34; y <= 166; y += step) {
    for (let x = 18; x <= 182; x += step) {
      if (inShape(x, y)) candidates.push([x, y]);
    }
  }
  if (candidates.length === 0) {
    candidates.push([100, 100]);
  }

  const out = new Float32Array(want * 3);
  const TARGET = 2.45;
  for (let k = 0; k < want; k++) {
    const [x, y] = candidates[Math.min(candidates.length - 1, Math.floor(seeded(k * 89 + 21) * candidates.length))];
    out[k * 3] = ((x - 100) / 150) * TARGET + (seeded(k * 97 + 2) - 0.5) * 0.014;
    out[k * 3 + 1] = -((y - 100) / 150) * TARGET + (seeded(k * 101 + 5) - 0.5) * 0.014;
    out[k * 3 + 2] = (seeded(k * 103 + 8) - 0.5) * 0.09;
  }
  return out;
}

function sampleLogoMask(img: HTMLImageElement, want: number): Float32Array {
  const S = 512;
  const cv = document.createElement("canvas");
  cv.width = S;
  cv.height = S;
  const ctx = cv.getContext("2d")!;
  ctx.clearRect(0, 0, S, S);
  ctx.drawImage(img, 0, 0, S, S);
  const data = ctx.getImageData(0, 0, S, S).data;

  const px: number[] = [];
  const py: number[] = [];
  let minX = S;
  let minY = S;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const alpha = data[(y * S + x) * 4 + 3];
      if (alpha > 36) {
        px.push(x);
        py.push(y);
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (px.length === 0) return sampleProceduralLogo(want);

  const out = new Float32Array(want * 3);
  const target = 2.55;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const span = Math.max(maxX - minX, maxY - minY) || S;
  const scale = target / span;

  for (let k = 0; k < want; k++) {
    const j = Math.floor(seeded(k * 131 + 17) * px.length);
    out[k * 3] = (px[j] - cx) * scale + (seeded(k * 137 + 3) - 0.5) * 0.012;
    out[k * 3 + 1] = -(py[j] - cy) * scale + (seeded(k * 139 + 9) - 0.5) * 0.012;
    out[k * 3 + 2] = (seeded(k * 149 + 5) - 0.5) * 0.08;
  }
  return out;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Unable to load ${src}`));
    img.src = src;
  });
}

type RevealMode = "terrain" | "logo";

function ParticleCanvas({ mode }: { mode: RevealMode }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const smooth = useRef(0);
  const logoMode = mode === "logo";

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const section = wrap.closest("section"); // the tall scroll track

    // Self-contained scroll progress (0..1) across the section — robust to the
    // page's Lenis smooth-scroll, since it reads layout position each frame.
    const readProgress = () => {
      if (!section) return 0;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      return total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
    };

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const COUNT = isMobile ? 6200 : 13000;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);
    wrap.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const viewHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) * 0.5) * camera.position.z;
    const viewWidth = viewHeight * (window.innerWidth / Math.max(1, window.innerHeight));

    // attributes
    const wheel = new Float32Array(COUNT * 3);
    const ribbon = new Float32Array(COUNT * 3);
    const rand = new Float32Array(COUNT);
    const scaleArr = new Float32Array(COUNT);
    const ribbonCols = Math.max(96, Math.floor(Math.sqrt(COUNT) * 1.45));
    for (let i = 0; i < COUNT; i++) {
      // Restored flowing shader: a wide green/gold particle
      // terrain across the lower screen, not a diagonal ribbon.
      const u = seeded(i * 17 + 1);
      const v = seeded(i * 31 + 4);
      const layer = seeded(i * 37 + 8);
      const x = (u - 0.5) * viewWidth * 1.45;
      const depth = (v - 0.5) * 4.8;
      const waveA = Math.sin(u * Math.PI * 5.2 + depth * 0.55);
      const waveB = Math.cos(u * Math.PI * 2.1 - depth * 0.42);
      const ridge = (waveA * 0.58 + waveB * 0.42) * viewHeight * 0.07;
      const lowerFalloff = Math.pow(v, 1.4) * viewHeight * 0.36;
      const y = -viewHeight * 0.2 + ridge - lowerFalloff + (layer - 0.5) * viewHeight * 0.035;

      wheel[i * 3] = x + (seeded(i * 43 + 12) - 0.5) * viewWidth * 0.035;
      wheel[i * 3 + 1] = y;
      wheel[i * 3 + 2] = depth + (seeded(i * 47 + 6) - 0.5) * 0.55;

      // Wide diagonal particle ribbon inspired by the reference, sized beyond
      // the viewport so it reads as a full-screen background form rather than a
      // small strip. Kept static in orientation; no counter-clockwise rotation.
      const col = i % ribbonCols;
      const row = Math.floor(i / ribbonCols);
      const ru = col / Math.max(1, ribbonCols - 1);
      const rv = seeded(i * 73 + 19) - 0.5;
      const strand = ((row % 46) / 45) - 0.5;
      const curve = Math.sin(ru * Math.PI * 2.25 + 0.35);
      const bend = Math.sin(ru * Math.PI * 4.2 - 0.8) * 0.09;
      const centerX = (ru - 0.5) * viewWidth * 1.72;
      const centerY = viewHeight * 0.42 - ru * viewHeight * 0.88 + curve * viewHeight * 0.16;
      const thickness = viewHeight * (0.19 + Math.sin(ru * Math.PI) * 0.17);
      ribbon[i * 3] = centerX + rv * viewWidth * 0.1 + strand * viewWidth * 0.026;
      ribbon[i * 3 + 1] = centerY + (strand + rv * 0.5 + bend) * thickness;
      ribbon[i * 3 + 2] = depth * 0.22 + Math.sin(ru * Math.PI * 3.0 + strand * 3.2) * 0.5;

      rand[i] = seeded(i * 61 + 13);
      scaleArr[i] = 0.65 + seeded(i * 67 + 14) * 0.85;
    }

    const geo = new THREE.BufferGeometry();
    const logoFallback = sampleProceduralLogo(COUNT);

    geo.setAttribute("position", new THREE.BufferAttribute(wheel.slice(), 3));
    geo.setAttribute("aWheel", new THREE.BufferAttribute(wheel, 3));
    geo.setAttribute("aRibbon", new THREE.BufferAttribute(ribbon, 3));
    geo.setAttribute("aLogo", new THREE.BufferAttribute(logoFallback, 3));
    geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scaleArr, 1));

    // Theme-aware palette (color theory: brand-led, readable on BOTH surfaces).
    //  Dark  → bright emerald + gold glow on the deep-forest background.
    //  Light → deep forest + antique gold particles on warm cream (dark-on-light,
    //          forest-led, WCAG-readable) — CSS can't reach WebGL, so we do it here.
    // Light mode draws dark-on-cream, which reads thinner — so bump size + opacity
    // there to keep the emblem bold and forest-led.
    const palette = (light: boolean) =>
      light
        ? { a: "#1A3D2B", b: "#6F561D", mul: 1.0, size: 1.35 }
        : { a: "#1E9A56", b: "#C9A84C", mul: 0.95, size: 1.0 };
    let theme = palette(document.documentElement.classList.contains("light"));
    const baseSize = isMobile ? 2.45 : 2.62;

    const uniforms = {
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: baseSize * theme.size },
      uPixelRatio: { value: pixelRatio },
      uRibbonMode: { value: logoMode ? 1 : 0 },
      uLogoMode: { value: logoMode ? 1 : 0 },
      uColorA: { value: new THREE.Color(theme.a) },
      uColorB: { value: new THREE.Color(theme.b) },
      uRibbonA: { value: new THREE.Color("#00B7D8") },
      uRibbonB: { value: new THREE.Color("#4A58D4") },
      uOpacity: { value: 0 },
    };

    // React to live theme toggles (next-themes flips html.light without a reload).
    const themeObserver = new MutationObserver(() => {
      theme = palette(document.documentElement.classList.contains("light"));
      uniforms.uColorA.value.set(theme.a);
      uniforms.uColorB.value.set(theme.b);
      uniforms.uSize.value = baseSize * theme.size;
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const points = new THREE.Points(geo, material);
    points.position.y = 0;
    points.scale.setScalar(1);
    scene.add(points);

    loadImage("/textures/ddc-logo-particle-mask.png")
      .then((img) => {
        const logo = sampleLogoMask(img, COUNT);
        const attr = geo.getAttribute("aLogo") as THREE.BufferAttribute;
        attr.copyArray(logo);
        attr.needsUpdate = true;
      })
      .catch(() => {
        /* keep procedural SVG fallback */
      });

    const resize = () => {
      const w = wrap.clientWidth || window.innerWidth;
      const h = wrap.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let last = performance.now();
    const clock = { t: 0 };

    const loop = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock.t += dt;

      // slow lerp toward scroll target = cinematic
      smooth.current += (readProgress() - smooth.current) * 0.075;
      const p = smooth.current;
      const form = logoMode ? THREE.MathUtils.smoothstep(p, 0.58, 0.86) : 0;

      uniforms.uProgress.value = p;
      uniforms.uTime.value = clock.t;
      // fade in at the start, fade out near the very end
      uniforms.uOpacity.value =
        theme.mul * THREE.MathUtils.smoothstep(p, 0.0, 0.14) * (1.0 - THREE.MathUtils.smoothstep(p, 0.98, 1.0));

      // Keep orientation locked. The reference ribbon was captured mid-rotation,
      // but this build intentionally avoids counter-clockwise spin.
      points.rotation.set(0, 0, 0);
      points.position.y = THREE.MathUtils.lerp(0, -0.22, form);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      themeObserver.disconnect();
      geo.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [logoMode]);

  return <div ref={wrapRef} className="absolute inset-0" aria-hidden="true" />;
}

function Stat({
  value,
  label,
  desc,
  align,
}: {
  value: string;
  label: string;
  desc: string;
  align: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "relative z-30 text-left md:text-right" : "relative z-30 text-left"}>
      <div className="font-numbers text-4xl sm:text-5xl font-bold tracking-tight text-gold-light drop-shadow-[0_6px_22px_rgba(232,200,122,0.22)]">
        {value}
      </div>
      <div className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-foreground/95">
        {label}
      </div>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-foreground/70 md:max-w-[18rem]">
        {desc}
      </p>
    </div>
  );
}

export default function LogoParticleReveal({ mode = "logo" }: { mode?: RevealMode }) {
  const t = useTranslations("Stats");
  const reduce = useReducedMotion();
  const logoMode = mode === "logo";
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });


  // text timings keyed to the same scroll the canvas uses
  const headOpacity = useTransform(scrollYProgress, [0.0, 0.08, 0.96, 1], [0, 1, 1, 0]);
  const headY = useTransform(scrollYProgress, [0.0, 0.08], [30, 0]);
  const leftOpacity = useTransform(scrollYProgress, [0.76, 0.9], [0, 1]);
  const leftX = useTransform(scrollYProgress, [0.76, 0.9], [-60, 0]);
  const rightOpacity = useTransform(scrollYProgress, [0.79, 0.93], [0, 1]);
  const rightX = useTransform(scrollYProgress, [0.79, 0.93], [60, 0]);

  // Reduced-motion: a static, readable stats panel over the still emblem.
  if (reduce) {
    return (
      <section className="relative w-full bg-background py-24 px-6">
        <div className="mx-auto max-w-5xl text-center">
          <span className="block text-xs uppercase tracking-[0.25em] text-gold font-mono">{t("overline")}</span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl text-foreground">
            {t("title")} <span className="text-gradient-forest">{t("titleAccent")}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">{t("subtitle")}</p>
          {logoMode && (
            <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
              {(["s1", "s2", "s3", "s4"] as const).map((k) => (
                <Stat key={k} align="left" value={t(`${k}.value`)} label={t(`${k}.label`)} desc={t(`${k}.desc`)} />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative w-full bg-background" style={{ height: logoMode ? "430vh" : "190vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-56 bg-gradient-to-b from-background/28 via-forest/8 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-56 bg-gradient-to-t from-background/28 via-forest/8 to-transparent" />
        {/* particle field */}
        {mounted && <ParticleCanvas mode={mode} />}

        {/* heading */}
        <motion.div
          style={{ opacity: headOpacity, y: headY }}
          className="pointer-events-none absolute inset-x-0 top-[18vh] z-20 flex flex-col items-center px-6 text-center sm:top-[11vh]"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-mono font-medium">
            {t("overline")}
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-foreground">
            {t("title")} <span className="text-gradient-forest font-medium">{t("titleAccent")}</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-muted">
            {t("subtitle")}
          </p>
        </motion.div>

        {logoMode && (
          <>
            {/* left stats */}
            <motion.div
              style={{ opacity: leftOpacity, x: leftX }}
              className="pointer-events-none absolute top-1/2 left-6 z-30 hidden -translate-y-1/2 flex-col gap-10 md:flex lg:left-20"
            >
              <Stat align="left" value={t("s1.value")} label={t("s1.label")} desc={t("s1.desc")} />
              <Stat align="left" value={t("s2.value")} label={t("s2.label")} desc={t("s2.desc")} />
            </motion.div>

            {/* right stats */}
            <motion.div
              style={{ opacity: rightOpacity, x: rightX }}
              className="pointer-events-none absolute top-1/2 right-6 z-30 hidden -translate-y-1/2 flex-col items-end gap-10 md:flex lg:right-20"
            >
              <Stat align="right" value={t("s3.value")} label={t("s3.label")} desc={t("s3.desc")} />
              <Stat align="right" value={t("s4.value")} label={t("s4.label")} desc={t("s4.desc")} />
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
