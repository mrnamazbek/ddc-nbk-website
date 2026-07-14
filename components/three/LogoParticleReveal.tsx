"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

/**
 * Production centerpiece — a scroll-driven GPU particle field that starts as
 * the restored DDC green/gold flowing dot shader, then continues into a
 * brand-color diagonal ribbon and morphs into the DDC emblem while the four key
 * stats reveal.
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
  uniform vec2 uMouse;          // cursor position in the particles' local space
  uniform float uMouseActive;   // 0..1, fades in/out as the pointer enters/leaves
  uniform float uProximityRadius;
  uniform float uBulgeStrength;

  attribute vec3 aWheel;
  attribute vec3 aRibbon;
  attribute vec3 aLogo;
  attribute vec3 aCore;
  attribute vec3 aService;
  attribute float aRand;
  attribute float aScale;

  varying float vMix;
  varying float vRibbon;
  varying float vCore;
  varying float vService;
  varying float vRand;
  varying float vProximity;

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
    // A single pinned narrative:
    // flowing field -> diagonal field -> DDC logo -> digital core -> service constellation.
    float ribbon = smoothstep(0.08, 0.30, uProgress) * uRibbonMode;
    float form = smoothstep(0.36, 0.56, uProgress) * uLogoMode;
    float core = smoothstep(0.64, 0.78, uProgress) * uLogoMode;
    float service = smoothstep(0.84, 0.97, uProgress) * uLogoMode;
    vMix = max(form, max(core, service));
    vRibbon = ribbon * (1.0 - form);
    vCore = core * (1.0 - service);
    vService = service;
    vRand = aRand;

    vec3 flowPos = mix(aWheel, aRibbon, ribbon);
    vec3 pos = mix(flowPos, aLogo, form);

    // Smooth object travel between scenes. The target arrays already include
    // their final screen positions; these arcs add cinematic path curvature.
    float coreArc = sin(clamp((uProgress - 0.64) / 0.14, 0.0, 1.0) * 3.14159265) * uLogoMode;
    float serviceArc = sin(clamp((uProgress - 0.84) / 0.13, 0.0, 1.0) * 3.14159265) * uLogoMode;
    pos = mix(pos, aCore, core);
    pos += vec3(0.28, -0.14, 0.28) * coreArc;
    pos = mix(pos, aService, service);
    pos += vec3(-0.24, 0.18, 0.32) * serviceArc;

    // A coherent traveling wave — every particle's offset is driven by its OWN
    // position, not an independent random phase, so the whole field ripples
    // together like flowing water/fabric (matching the reference site). This is
    // deliberately NOT a rigid-body transform: no points.rotation is touched, the
    // silhouette stays anchored in place, only its surface undulates over time.
    float hold = 1.0 - vMix;
    float wavePhase = pos.x * 0.55 + pos.z * 0.9 - uTime * 0.35;
    float wave = sin(wavePhase) * 0.16 + sin(wavePhase * 1.8 + 1.7) * 0.07;
    float crossPhase = pos.x * 0.28 - uTime * 0.22;
    pos.y += wave * hold;
    pos.z += sin(crossPhase) * 0.1 * hold;

    // Small residual per-particle shimmer for organic sparkle (kept subtle so the
    // traveling wave above reads as the dominant motion, not this).
    pos.x += sin(uTime * 0.2 + aRand * 20.0) * 0.018 * hold;

    // Soft reassembly energy that peaks during logo morph, deliberately restrained.
    float logoBurst = sin(clamp((uProgress - 0.36) / 0.20, 0.0, 1.0) * 3.14159265);
    float coreBurst = sin(clamp((uProgress - 0.64) / 0.14, 0.0, 1.0) * 3.14159265);
    float serviceBurst = sin(clamp((uProgress - 0.84) / 0.13, 0.0, 1.0) * 3.14159265);
    float burst = (logoBurst * 0.68 + coreBurst * 0.36 + serviceBurst * 0.34) * uLogoMode;
    float n = snoise(pos * 0.9 + vec3(uTime * 0.08, uTime * 0.05, aRand * 10.0));
    vec3 dir = normalize(pos + vec3(0.0001));
    pos += dir * n * burst * 0.18;
    pos.z += snoise(pos * 1.4 + uTime * 0.1) * burst * 0.14;

    // gentle idle drift once an object is formed
    pos += dir * snoise(pos * 0.6 + uTime * 0.15) * 0.026 * vMix;

    // Cursor proximity glow — how close this particle sits to the pointer,
    // faded in/out with uMouseActive so it never activates on touch devices
    // (no persistent hover position, so uMouseActive simply stays at 0).
    float distToMouse = distance(pos.xy, uMouse);
    float proximityT = 1.0 - smoothstep(0.0, uProximityRadius, distToMouse);
    vProximity = proximityT * uMouseActive;

    // Cursor bulge — once a particle has actually formed part of an SVG
    // silhouette (vMix: the logo, the digital core, the service constellation),
    // it physically pushes away from the pointer instead of only glowing, so
    // those shapes feel touchable. Gating by vMix keeps the ambient flowing
    // flowing field (vMix == 0, no SVG behind it) from ever displacing — it still
    // gets the glow above, just not the shove.
    vec2 awayFromMouse = normalize(pos.xy - uMouse + vec2(1e-4, 0.0));
    float bulge = proximityT * proximityT * uMouseActive * uBulgeStrength * vMix;
    pos.xy += awayFromMouse * bulge;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float laterObject = max(vCore, vService);
    float sizeTaper = mix(1.06, 0.9, vMix) * mix(1.0, 0.92, laterObject);
    gl_PointSize = uSize * sizeTaper * aScale * uPixelRatio * (150.0 / -mv.z);
    float maxPoint = mix(mix(3.35, 2.18, vMix), 2.0, laterObject) * uPixelRatio;
    gl_PointSize = clamp(gl_PointSize, 0.65, maxPoint);
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uColorA;  // forest
  uniform vec3 uColorB;  // gold
  uniform vec3 uRibbonA;
  uniform vec3 uRibbonB;
  uniform vec3 uHotColor; // cursor proximity highlight
  uniform float uOpacity;

  varying float vMix;
  varying float vRibbon;
  varying float vCore;
  varying float vService;
  varying float vRand;
  varying float vProximity;

  void main(){
    // soft round point
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float alpha = smoothstep(0.5, 0.08, d);
    if (alpha < 0.01) discard;

    // Gold/green throughout. As the logo forms, bias particles toward warm
    // yellow-gold so the emblem reads brighter and more premium.
    float t = clamp(0.44 + vMix * 0.62 + vRand * 0.2, 0.0, 1.0);
    vec3 brandCol = mix(uColorA, uColorB, t);
    vec3 ribbonCol = mix(uRibbonA, uRibbonB, clamp(0.18 + vRand * 0.5, 0.0, 1.0));
    ribbonCol = mix(ribbonCol, uColorB, 0.64);
    vec3 col = mix(brandCol, ribbonCol, vRibbon);
    col = mix(col, uColorB, vMix * 0.72);
    col = mix(col, mix(uColorB, uColorA, 0.14), vCore * 0.24);
    col = mix(col, mix(uColorB, uColorA, 0.1), vService * 0.2);

    // Cursor proximity glow: nearby particles brighten toward a hot highlight
    // and read very slightly more opaque, like embers catching the pointer.
    col = mix(col, uHotColor, vProximity * 0.62);
    float objectSoftness = mix(1.0, 0.96, max(vCore, vService));
    float glowAlpha = alpha * uOpacity * objectSoftness * mix(1.0, 1.14, vProximity);
    gl_FragColor = vec4(col, glowAlpha);
  }
`;

const MICROSERVICES_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 50 50">
  <path fill="#fff" d="M 25 0 L 18 4.0703125 L 25 8.1191406 L 32 4.0703125 L 25 0 z M 17 5.8007812 L 17 8.5605469 L 20.529297 10.619141 L 21.519531 11.199219 L 21.519531 14.929688 L 24.039062 13.619141 C 24.009062 13.539141 24 13.459141 24 13.369141 L 24 9.8496094 L 17 5.8007812 z M 33 5.8007812 L 26 9.8496094 L 26 13.369141 C 26 13.459141 25.990938 13.539141 25.960938 13.619141 L 28.480469 14.929688 L 28.480469 11.199219 L 29.470703 10.619141 L 33 8.5605469 L 33 5.8007812 z M 11.460938 7.640625 L 3.9902344 12 L 11.009766 16.150391 L 18.529297 11.759766 L 11.460938 7.640625 z M 38.539062 7.640625 L 31.470703 11.759766 L 38.990234 16.150391 L 46.009766 12 L 38.539062 7.640625 z M 19.519531 13.5 L 12 17.890625 L 12 26.759766 L 14 25.589844 L 14 18.830078 L 15.080078 18.269531 L 19.519531 15.970703 L 19.519531 13.5 z M 30.480469 13.5 L 30.480469 15.970703 L 34.919922 18.269531 L 36 18.830078 L 36 25.589844 L 38 26.759766 L 38 17.890625 L 30.480469 13.5 z M 3 13.740234 L 3 22.669922 L 10 26.759766 L 10 17.880859 L 3 13.740234 z M 47 13.740234 L 40 17.880859 L 40 26.759766 L 47 22.669922 L 47 13.740234 z M 25 15.369141 L 17.060547 19.5 L 25 24.089844 L 32.939453 19.5 L 25 15.369141 z M 16 21.199219 L 16 30.089844 L 24 34.759766 L 24 25.820312 L 16 21.199219 z M 34 21.199219 L 26 25.820312 L 26 34.759766 L 34 30.089844 L 34 21.199219 z M 5.7109375 26.570312 L 4 27.570312 L 11 31.660156 L 14 29.910156 L 14 27.910156 L 12.009766 29.070312 L 11 29.660156 L 9.9902344 29.070312 L 5.7109375 26.570312 z M 44.289062 26.570312 L 40.009766 29.070312 L 39 29.660156 L 37.990234 29.070312 L 36 27.910156 L 36 29.910156 L 39 31.660156 L 46 27.570312 L 44.289062 26.570312 z M 3 29.300781 L 3 37.910156 L 10 42 L 10 33.390625 L 3 29.300781 z M 47 29.300781 L 40 33.390625 L 40 42 L 47 37.910156 L 47 29.300781 z M 14.839844 31.730469 L 12 33.390625 L 12 42 L 14 40.849609 L 14 34.410156 L 14.990234 33.839844 L 16.720703 32.830078 L 14.990234 31.820312 L 14.839844 31.730469 z M 35.160156 31.730469 L 35.009766 31.820312 L 33.279297 32.830078 L 35.009766 33.839844 L 36 34.410156 L 36 40.849609 L 38 42 L 38 33.390625 L 35.160156 31.730469 z M 18.699219 33.990234 L 16.990234 34.990234 L 25 39.660156 L 33.009766 34.990234 L 31.300781 33.990234 L 26.009766 37.070312 L 25 37.660156 L 23.990234 37.070312 L 18.699219 33.990234 z M 16 36.720703 L 16 45.330078 L 24 50 L 24 41.390625 L 16 36.720703 z M 34 36.720703 L 26 41.390625 L 26 50 L 34 45.330078 L 34 36.720703 z"/>
</svg>`;

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

type MaskTargetOptions = {
  target?: number;
  offsetX?: number;
  offsetY?: number;
  depth?: number;
  jitterAmount?: number;
  squashY?: number;
  fallback?: () => Float32Array;
};

function sampleImageMask(img: HTMLImageElement, want: number, options: MaskTargetOptions = {}): Float32Array {
  const S = 512;
  const cv = document.createElement("canvas");
  cv.width = S;
  cv.height = S;
  const ctx = cv.getContext("2d")!;
  ctx.clearRect(0, 0, S, S);

  const iw = img.naturalWidth || img.width || S;
  const ih = img.naturalHeight || img.height || S;
  const drawScale = Math.min(S / iw, S / ih);
  const dw = iw * drawScale;
  const dh = ih * drawScale;
  const dx = (S - dw) / 2;
  const dy = (S - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);

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

  if (px.length === 0) return options.fallback ? options.fallback() : sampleProceduralLogo(want);

  const out = new Float32Array(want * 3);
  const target = options.target ?? 2.55;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const span = Math.max(maxX - minX, maxY - minY) || S;
  const scale = target / span;
  const offsetX = options.offsetX ?? 0;
  const offsetY = options.offsetY ?? 0;
  const depth = options.depth ?? 0.08;
  const jitterAmount = options.jitterAmount ?? 0.012;
  const squashY = options.squashY ?? 1;

  for (let k = 0; k < want; k++) {
    const j = Math.floor(seeded(k * 131 + 17) * px.length);
    out[k * 3] = offsetX + (px[j] - cx) * scale + (seeded(k * 137 + 3) - 0.5) * jitterAmount;
    out[k * 3 + 1] = offsetY - (py[j] - cy) * scale * squashY + (seeded(k * 139 + 9) - 0.5) * jitterAmount;
    out[k * 3 + 2] = (seeded(k * 149 + 5) - 0.5) * depth;
  }
  return out;
}

function sampleLogoMask(img: HTMLImageElement, want: number): Float32Array {
  return sampleImageMask(img, want, {
    target: 2.55,
    depth: 0.08,
    jitterAmount: 0.012,
    fallback: () => sampleProceduralLogo(want),
  });
}

function sampleSceneMaskTarget(
  img: HTMLImageElement,
  want: number,
  viewHeight: number,
  scene: "core" | "service",
) {
  const sceneObjectX = Math.min(viewHeight * 0.38, 1.72);
  const sceneObjectSize = Math.min(viewHeight * 0.42, 1.94);

  if (scene === "core") {
    return sampleImageMask(img, want, {
      target: sceneObjectSize,
      offsetX: sceneObjectX,
      offsetY: -Math.min(viewHeight * 0.01, 0.04),
      depth: 0.22,
      jitterAmount: 0.016,
      squashY: 0.94,
      fallback: () => sampleDigitalCoreTarget(want, viewHeight),
    });
  }

  return sampleImageMask(img, want, {
    target: sceneObjectSize,
    offsetX: -sceneObjectX,
    offsetY: -Math.min(viewHeight * 0.015, 0.06),
    depth: 0.18,
    jitterAmount: 0.014,
    fallback: () => sampleServiceConstellationTarget(want, viewHeight),
  });
}

function svgDataUrl(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}

function jitter(seedBase: number, amount: number) {
  return (seeded(seedBase) - 0.5) * amount;
}

function sampleDigitalCoreTarget(want: number, viewHeight: number): Float32Array {
  const out = new Float32Array(want * 3);
  const cx = Math.min(viewHeight * 0.38, 1.72);
  const cy = -Math.min(viewHeight * 0.01, 0.04);
  const size = Math.min(viewHeight * 0.28, 1.32);
  const ringRadii = [0.24, 0.45, 0.66] as const;

  for (let i = 0; i < want; i++) {
    const pick = seeded(i * 179 + 31);
    let x = 0;
    let y = 0;

    if (pick < 0.5) {
      // concentric circuit rings: a symbolic, readable digital core.
      const radius = ringRadii[Math.floor(seeded(i * 181 + 5) * ringRadii.length)] * size;
      const angle = seeded(i * 191 + 7) * Math.PI * 2;
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius;
    } else if (pick < 0.78) {
      // radial data lanes between the rings
      const lane = Math.floor(seeded(i * 193 + 11) * 12);
      const angle = -Math.PI / 2 + lane * (Math.PI / 6);
      const length = (0.12 + seeded(i * 197 + 13) * 0.56) * size;
      x = Math.cos(angle) * length;
      y = Math.sin(angle) * length;
    } else {
      // bright operator nodes on the outer system ring
      const node = Math.floor(seeded(i * 199 + 17) * 10);
      const nodeAngle = -Math.PI / 2 + node * (Math.PI * 2 / 10);
      const nodeCx = Math.cos(nodeAngle) * 0.55 * size;
      const nodeCy = Math.sin(nodeAngle) * 0.55 * size;
      const angle = seeded(i * 211 + 19) * Math.PI * 2;
      const radius = 0.07 * size;
      x = nodeCx + Math.cos(angle) * radius;
      y = nodeCy + Math.sin(angle) * radius;
    }

    out[i * 3] = cx + x + jitter(i * 229 + 31, 0.018);
    out[i * 3 + 1] = cy + y + jitter(i * 233 + 37, 0.018);
    out[i * 3 + 2] = jitter(i * 239 + 41, 0.18);
  }

  return out;
}

function sampleServiceConstellationTarget(want: number, viewHeight: number): Float32Array {
  const out = new Float32Array(want * 3);
  const cx = -Math.min(viewHeight * 0.38, 1.72);
  const cy = -Math.min(viewHeight * 0.015, 0.06);
  const size = Math.min(viewHeight * 0.34, 1.58);
  const ring = 0.62 * size;

  for (let i = 0; i < want; i++) {
    const pick = seeded(i * 251 + 43);
    let x = 0;
    let y = 0;

    if (pick < 0.3) {
      // six service spokes from the center
      const node = Math.floor(seeded(i * 257 + 47) * 6);
      const t = seeded(i * 263 + 53);
      const angle = -Math.PI / 2 + node * (Math.PI / 3);
      x = Math.cos(angle) * ring * t;
      y = Math.sin(angle) * ring * t;
    } else if (pick < 0.68) {
      // six service modules
      const node = Math.floor(seeded(i * 269 + 59) * 6);
      const angle = -Math.PI / 2 + node * (Math.PI / 3);
      const local = seeded(i * 271 + 61) * Math.PI * 2;
      const nodeRadius = 0.105 * size;
      x = Math.cos(angle) * ring + Math.cos(local) * nodeRadius;
      y = Math.sin(angle) * ring + Math.sin(local) * nodeRadius;
    } else if (pick < 0.86) {
      // central operator hub
      const angle = seeded(i * 277 + 67) * Math.PI * 2;
      const radius = (0.11 + seeded(i * 281 + 71) * 0.11) * size;
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius;
    } else {
      // faint orbital guide
      const angle = seeded(i * 283 + 73) * Math.PI * 2;
      const radius = (0.77 + jitter(i * 293 + 79, 0.04)) * size;
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius;
    }

    out[i * 3] = cx + x + jitter(i * 307 + 83, 0.016);
    out[i * 3 + 1] = cy + y + jitter(i * 311 + 89, 0.016);
    out[i * 3 + 2] = jitter(i * 313 + 97, 0.2);
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

function ParticleCanvas() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const smooth = useRef(0);

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

    // antialias отключён на мобиле: MSAA-буферы удваивают память кадрового
    // буфера, а на мелком экране с pixelRatio 1.5 разница практически не видна.
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
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
      // Restored flowing shader: a wide green/gold particle field across the
      // lower screen before it becomes the diagonal ribbon.
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
    const coreTarget = sampleDigitalCoreTarget(COUNT, viewHeight);
    const serviceTarget = sampleServiceConstellationTarget(COUNT, viewHeight);

    geo.setAttribute("position", new THREE.BufferAttribute(wheel.slice(), 3));
    geo.setAttribute("aWheel", new THREE.BufferAttribute(wheel, 3));
    geo.setAttribute("aRibbon", new THREE.BufferAttribute(ribbon, 3));
    geo.setAttribute("aLogo", new THREE.BufferAttribute(logoFallback, 3));
    geo.setAttribute("aCore", new THREE.BufferAttribute(coreTarget, 3));
    geo.setAttribute("aService", new THREE.BufferAttribute(serviceTarget, 3));
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
        ? { a: "#173826", b: "#B9891D", mul: 1.08, size: 1.26 }
        : { a: "#3AA76D", b: "#F4C84E", mul: 1.28, size: 1.08 };
    let theme = palette(document.documentElement.classList.contains("light"));
    const baseSize = isMobile ? 2.45 : 2.62;

    const uniforms = {
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: baseSize * theme.size },
      uPixelRatio: { value: pixelRatio },
      uRibbonMode: { value: 1 },
      uLogoMode: { value: 1 },
      uColorA: { value: new THREE.Color(theme.a) },
      uColorB: { value: new THREE.Color(theme.b) },
      uRibbonA: { value: new THREE.Color("#FFD66E") },
      uRibbonB: { value: new THREE.Color("#3AA76D") },
      uHotColor: { value: new THREE.Color("#FFE68A") },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseActive: { value: 0 },
      uProximityRadius: { value: 1.1 },
      uBulgeStrength: { value: 0.22 },
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

    let disposed = false;
    const updateTargetAttribute = (name: "aLogo" | "aCore" | "aService", data: Float32Array) => {
      if (disposed) return;
      const attr = geo.getAttribute(name) as THREE.BufferAttribute;
      attr.copyArray(data);
      attr.needsUpdate = true;
    };

    loadImage("/textures/ddc-logo-particle-mask.png")
      .then((img) => {
        updateTargetAttribute("aLogo", sampleLogoMask(img, COUNT));
      })
      .catch(() => {
        /* keep procedural SVG fallback */
      });

    loadImage("/images/particle-targets/icons8-database.svg")
      .then((img) => {
        updateTargetAttribute("aCore", sampleSceneMaskTarget(img, COUNT, viewHeight, "core"));
      })
      .catch(() => {
        /* keep procedural core fallback */
      });

    loadImage(svgDataUrl(MICROSERVICES_SVG))
      .then((img) => {
        updateTargetAttribute("aService", sampleSceneMaskTarget(img, COUNT, viewHeight, "service"));
      })
      .catch(() => {
        /* keep procedural service fallback */
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

    // Cursor proximity glow — tracked on window (not the canvas wrap) since
    // higher z-index siblings (heading, stats, story panels) sit visually on
    // top of the canvas and would otherwise swallow the pointer events before
    // they reach it. `inside` drives a smoothed fade so touch input (which
    // never fires a resting hover position) simply never activates the glow.
    const pointer = { ndcX: 0, ndcY: 0, inside: 0 };
    const onPointerMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      const inside = localX >= 0 && localX <= rect.width && localY >= 0 && localY <= rect.height;
      pointer.inside = inside ? 1 : 0;
      if (inside) {
        pointer.ndcX = (localX / rect.width) * 2 - 1;
        pointer.ndcY = -((localY / rect.height) * 2 - 1);
      }
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let raf = 0;
    let last = performance.now();
    const clock = { t: 0 };
    const mouseActiveSmooth = { value: 0 };
    const mouseWorld = { x: 0, y: 0 };

    const loop = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock.t += dt;

      // slow lerp toward scroll target = cinematic
      smooth.current += (readProgress() - smooth.current) * 0.058;
      const p = smooth.current;
      const objectSettled = THREE.MathUtils.smoothstep(p, 0.36, 0.56);

      uniforms.uProgress.value = p;
      uniforms.uTime.value = clock.t;
      // fade in at the start, fade out near the very end
      uniforms.uOpacity.value =
        theme.mul * THREE.MathUtils.smoothstep(p, 0.0, 0.18) * (1.0 - THREE.MathUtils.smoothstep(p, 0.98, 1.0));

      // Keep orientation locked. The reference ribbon was captured mid-rotation,
      // but this build intentionally avoids counter-clockwise spin.
      points.rotation.set(0, 0, 0);
      points.position.y = THREE.MathUtils.lerp(0, -0.04, objectSettled);

      // Ease the cursor glow toward the pointer's current position/activity
      // rather than snapping, matching the site's soft-follow feel elsewhere.
      mouseActiveSmooth.value += (pointer.inside - mouseActiveSmooth.value) * 0.12;
      const targetMouseX = pointer.ndcX * (viewWidth / 2);
      const targetMouseY = pointer.ndcY * (viewHeight / 2) - points.position.y;
      mouseWorld.x += (targetMouseX - mouseWorld.x) * 0.2;
      mouseWorld.y += (targetMouseY - mouseWorld.y) * 0.2;
      uniforms.uMouse.value.set(mouseWorld.x, mouseWorld.y);
      uniforms.uMouseActive.value = mouseActiveSmooth.value;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };

    // Рендерим ТОЛЬКО когда секция реально на экране и вкладка активна.
    // Раньше цикл крутился всё время, пока компонент смонтирован: на мобильном
    // GPU это непрерывная нагрузка даже далеко за пределами секции, вплоть до
    // потери WebGL-контекста и падения вкладки.
    let onScreen = false;
    const isRunning = () => raf !== 0;
    const start = () => {
      if (disposed || isRunning() || !onScreen || document.hidden) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (!isRunning()) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        onScreen ? start() : stop();
      },
      { rootMargin: "200px 0px" },
    );
    if (section) io.observe(section);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    // Без preventDefault() браузер не пытается восстановить потерянный контекст,
    // и канвас остаётся мёртвым до перезагрузки страницы.
    const canvas = renderer.domElement;
    const onContextLost = (event: Event) => {
      event.preventDefault();
      stop();
      console.warn("LogoParticleReveal: WebGL-контекст потерян, ждём восстановления.");
    };
    const onContextRestored = () => {
      console.warn("LogoParticleReveal: WebGL-контекст восстановлен.");
      start();
    };
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    return () => {
      disposed = true;
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      themeObserver.disconnect();
      geo.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

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

function StoryPanel({
  overline,
  title,
  desc,
  align = "left",
}: {
  overline: string;
  title: string;
  desc: string;
  align?: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-left md:text-right" : "text-left"}>
      <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-gold/20 bg-background/55 px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-gold-light shadow-[0_0_24px_rgba(201,168,76,0.1)] backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_12px_rgba(232,200,122,0.55)]" />
        {overline}
      </div>
      <h3 className="font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h3>
      <p className={align === "right" ? "mt-5 max-w-lg text-sm leading-relaxed text-foreground/72 sm:text-base md:ml-auto" : "mt-5 max-w-lg text-sm leading-relaxed text-foreground/72 sm:text-base"}>
        {desc}
      </p>
    </div>
  );
}

export default function LogoParticleReveal() {
  const t = useTranslations("Stats");
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });


  // text timings keyed to the same scroll the canvas uses
  const headOpacity = useTransform(scrollYProgress, [0.0, 0.08, 0.58, 0.66], [0, 1, 1, 0]);
  const headY = useTransform(scrollYProgress, [0.0, 0.1], [30, 0]);
  const leftOpacity = useTransform(scrollYProgress, [0.42, 0.52, 0.62, 0.7], [0, 1, 1, 0]);
  const leftX = useTransform(scrollYProgress, [0.42, 0.52, 0.62, 0.7], [-60, 0, 0, -44]);
  const rightOpacity = useTransform(scrollYProgress, [0.44, 0.54, 0.64, 0.72], [0, 1, 1, 0]);
  const rightX = useTransform(scrollYProgress, [0.44, 0.54, 0.64, 0.72], [60, 0, 0, 44]);
  const scene2Opacity = useTransform(scrollYProgress, [0.66, 0.74, 0.8, 0.86], [0, 1, 1, 0]);
  const scene2X = useTransform(scrollYProgress, [0.66, 0.74, 0.86], [-70, 0, -26]);
  const scene2Y = useTransform(scrollYProgress, [0.66, 0.74, 0.86], [26, 0, -14]);
  const scene3Opacity = useTransform(scrollYProgress, [0.86, 0.93, 1], [0, 1, 1]);
  const scene3X = useTransform(scrollYProgress, [0.86, 0.93], [70, 0]);
  const scene3Y = useTransform(scrollYProgress, [0.86, 0.93], [28, 0]);

  // Reduced-motion: a static, readable stats panel over the still emblem.
  if (reduce) {
    return (
      <section className="relative w-full bg-transparent py-24 px-6">
        <div className="mx-auto max-w-5xl text-center">
          <span className="block text-xs uppercase tracking-[0.25em] text-gold font-mono">{t("overline")}</span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl text-foreground">
            {t("title")} <span className="text-gradient-forest">{t("titleAccent")}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">{t("subtitle")}</p>
          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            {(["s1", "s2", "s3", "s4"] as const).map((k) => (
              <Stat key={k} align="left" value={t(`${k}.value`)} label={t(`${k}.label`)} desc={t(`${k}.desc`)} />
            ))}
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <StoryPanel overline={t("scene2.overline")} title={t("scene2.title")} desc={t("scene2.desc")} />
            <StoryPanel overline={t("scene3.overline")} title={t("scene3.title")} desc={t("scene3.desc")} align="right" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative w-full bg-transparent" style={{ height: "720vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* particle field */}
        {mounted && <ParticleCanvas />}

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

        {/* Scene 2: logo becomes the National Bank digital core */}
        <motion.div
          style={{ opacity: scene2Opacity, x: scene2X, y: scene2Y }}
          className="pointer-events-none absolute inset-x-6 bottom-[12vh] z-30 md:inset-x-auto md:left-[9vw] md:top-1/2 md:bottom-auto md:w-[min(34rem,38vw)] md:-translate-y-1/2"
        >
          <StoryPanel overline={t("scene2.overline")} title={t("scene2.title")} desc={t("scene2.desc")} />
        </motion.div>

        {/* Scene 3: the core opens into operational service modules */}
        <motion.div
          style={{ opacity: scene3Opacity, x: scene3X, y: scene3Y }}
          className="pointer-events-none absolute inset-x-6 bottom-[12vh] z-30 md:inset-x-auto md:right-[9vw] md:top-1/2 md:bottom-auto md:w-[min(34rem,38vw)] md:-translate-y-1/2"
        >
          <StoryPanel overline={t("scene3.overline")} title={t("scene3.title")} desc={t("scene3.desc")} align="right" />
        </motion.div>
      </div>
    </section>
  );
}
