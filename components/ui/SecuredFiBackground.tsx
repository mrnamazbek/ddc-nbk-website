"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import * as THREE from "three";

import { useA11y } from "../theme/AccessibilityProvider";
import { getScroll, startScrollTracking } from "@/lib/scrollStore";

const LOGO_SRC = "/images/logo/ddc-emblem.svg";

const vertexShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uPr;
  uniform float uSize;
  uniform float uAmplitude;
  uniform float uSpeed;
  uniform float uPixelRatio;
  uniform float uReveal;
  uniform vec2 uViewport;

  attribute vec3 aSpherePos;
  attribute vec3 aLogoPos;
  attribute float aRandom;
  attribute float aIndex;
  attribute float aColor;

  varying vec3 vPos;
  varying float vPhase;
  varying float vColor;
  varying float vAlphaSeed;
  varying float vReveal;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 10.0) * x); }

  float snoise2d(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float sat(float v) {
    return clamp(v, 0.0, 1.0);
  }

  float ease(float v) {
    return smoothstep(0.0, 1.0, sat(v));
  }

  void main() {
    float t = mod(uTime, 100.0) * uSpeed;
    float stagger = (aIndex - 0.5) * 0.68;
    float orbit = aIndex * 205.39816 + aRandom * 6.28318;
    float ringRadius = 0.18 + fract(aIndex * 89.37) * 1.05;
    float ringPulse = snoise2d(vec2(aIndex * 18.0, t * 0.42)) * 0.18;

    // First scroll beat: a small premium wheel appears near the lower screen.
    vec3 wheel = vec3(
      cos(orbit + t * 0.28) * (ringRadius + ringPulse),
      sin(orbit + t * 0.28) * (ringRadius + ringPulse) - 2.55,
      (aRandom - 0.5) * 0.54
    );
    wheel.xy *= vec2(1.14, 0.82);
    wheel.z += sin(orbit * 0.7 + t) * 0.16;

    // Second beat: the wheel resolves into the company emblem.
    vec3 logo = aLogoPos * vec3(0.92, 0.92, 1.0);
    logo.y -= 0.82;
    logo.z += sin((aLogoPos.x + aLogoPos.y) * 4.4 + t * 0.72) * 0.12;

    // Final beat: hold the logo, breathe it, and leave room for left/right text.
    vec3 settledLogo = aLogoPos * vec3(1.04, 1.04, 1.0);
    settledLogo.y -= 0.68;
    settledLogo.z += sin((aLogoPos.x - aLogoPos.y) * 5.0 + t * 0.55) * 0.08;

    float pLogo = ease((uPr - 0.72 - stagger * 0.34) / 1.55);
    float pSettle = ease((uPr - 2.28 + stagger * 0.16) / 1.28);

    vec3 pos = mix(wheel, logo, pLogo);
    pos = mix(pos, settledLogo, pSettle);

    pos.x += sin(uTime * 0.10 + aRandom * 6.28318) * 0.028;
    pos.y += cos(uTime * 0.09 + aRandom * 6.28318) * 0.022;
    pos.y -= (1.0 - uReveal) * 0.46;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float perspectiveSize = uSize / max(0.001, length(mvPosition.xyz));
    float phaseSize = mix(0.86, 0.62, pSettle);
    gl_PointSize = perspectiveSize * phaseSize * uPixelRatio * max(0.01, uReveal);

    vPos = pos;
    vPhase = max(pLogo, pSettle);
    vColor = aColor;
    vAlphaSeed = aRandom;
    vReveal = uReveal;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uEmerald;
  uniform vec3 uGold;
  uniform vec3 uTeal;
  uniform float uAlpha;
  uniform float uTime;
  uniform float uThemeLight;

  varying vec3 vPos;
  varying float vPhase;
  varying float vColor;
  varying float vAlphaSeed;
  varying float vReveal;

  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 10.0) * x); }

  float snoise2d(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5)) * 2.0;
    if (d > 1.0) discard;

    float core = smoothstep(1.0, 0.58, d);
    float rim = smoothstep(0.92, 0.34, d);
    float luminance = clamp(vPos.y * 0.16 + vColor, 0.0, 1.0);
    vec3 color = mix(uEmerald, uGold, luminance);
    color = mix(color, uTeal, smoothstep(0.25, 1.0, vPhase) * (1.0 - vColor) * 0.62);

    float grain = (snoise2d(vPos.xz * 0.36 + uTime * 0.08) + 1.22) * 0.28;
    float alpha = uAlpha * vReveal * core * (0.62 + rim * 0.38 + vAlphaSeed * 0.18);
    alpha -= grain * mix(0.18, 0.08, vPhase);

    if (uThemeLight > 0.5) {
      color = mix(color * 0.54, vec3(0.12, 0.20, 0.16), 0.22);
      alpha *= 0.78;
    }

    if (alpha <= 0.001) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

function seededRandom(seed: number) {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function makeFallbackLogoTargets(count: number): Float32Array<ArrayBufferLike> {
  const data = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const band = i % 10;
    const lane = Math.floor(band / 2);
    const side = band % 2 === 0 ? -1 : 1;
    const y = (seededRandom(i * 7 + 11) - 0.5) * 4.6;
    const x = side * (0.38 + lane * 0.38) + (seededRandom(i * 3 + 2) - 0.5) * 0.10;
    data[i * 3] = x;
    data[i * 3 + 1] = y;
    data[i * 3 + 2] = (seededRandom(i * 5 + 4) - 0.5) * 0.36;
  }
  return data;
}

async function sampleLogoTargets(
  count: number,
  fallback: Float32Array<ArrayBufferLike>
): Promise<Float32Array<ArrayBufferLike>> {
  const img = new Image();
  img.decoding = "async";
  img.src = LOGO_SRC;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Unable to load DDC logo target"));
  });

  const canvas = document.createElement("canvas");
  const size = 520;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return fallback;

  ctx.clearRect(0, 0, size, size);
  const pad = 34;
  ctx.drawImage(img, pad, pad, size - pad * 2, size - pad * 2);
  const pixels = ctx.getImageData(0, 0, size, size).data;
  const candidates: { x: number; y: number; alpha: number }[] = [];

  for (let y = 0; y < size; y += 2) {
    for (let x = 0; x < size; x += 2) {
      const alpha = pixels[(y * size + x) * 4 + 3];
      if (alpha > 42) candidates.push({ x, y, alpha });
    }
  }

  if (candidates.length < 32) return fallback;

  const data = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const pick = candidates[Math.floor(seededRandom(i * 13 + 17) * candidates.length)];
    const jitterX = (seededRandom(i * 19 + 3) - 0.5) * 0.025;
    const jitterY = (seededRandom(i * 23 + 9) - 0.5) * 0.025;
    data[i * 3] = ((pick.x / size) - 0.5) * 4.85 + jitterX;
    data[i * 3 + 1] = (0.5 - pick.y / size) * 4.85 + jitterY;
    data[i * 3 + 2] = (seededRandom(i * 29 + 5) - 0.5) * (0.24 + (pick.alpha / 255) * 0.28);
  }

  return data;
}

interface ShaderParticlesProps {
  isLight: boolean;
}

function ShaderParticles({ isLight }: ShaderParticlesProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const prRef = useRef(0);
  const { size, viewport, gl } = useThree();

  const particleCount = size.width < 700 ? 12000 : size.width < 1180 ? 24000 : 48000;

  const [positions, spherePositions, fallbackLogoPositions, randoms, indexes, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const sphere = new Float32Array(particleCount * 3);
    const rands = new Float32Array(particleCount);
    const index = new Float32Array(particleCount);
    const color = new Float32Array(particleCount);
    const fallback = makeFallbackLogoTargets(particleCount);

    const cols = Math.ceil(Math.sqrt(particleCount * 1.78));
    const rows = Math.ceil(particleCount / cols);
    const radius = size.width < 700 ? 2.55 : 3.35;

    for (let i = 0; i < particleCount; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = (col / Math.max(1, cols - 1)) * 28 - 14;
      const z = (row / Math.max(1, rows - 1)) * 14.4 - 7.2;

      pos[i * 3] = x;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = z;

      const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      sphere[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      sphere[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
      sphere[i * 3 + 2] = Math.cos(phi) * radius;

      const rnd = seededRandom(i * 31 + 1);
      rands[i] = rnd;
      index[i] = i / Math.max(1, particleCount - 1);
      color[i] = (index[i] < 0.38 || index[i] > 0.72) && rnd > 0.22 ? 1 : 0;
    }

    return [pos, sphere, fallback, rands, index, color] as const;
  }, [particleCount, size.width]);

  const [logoPositions, setLogoPositions] = useState<Float32Array<ArrayBufferLike>>(fallbackLogoPositions);

  useEffect(() => {
    let active = true;
    setLogoPositions(fallbackLogoPositions);
    sampleLogoTargets(particleCount, fallbackLogoPositions)
      .then((sampled) => {
        if (active) setLogoPositions(sampled);
      })
      .catch(() => {
        if (active) setLogoPositions(fallbackLogoPositions);
      });
    return () => {
      active = false;
    };
  }, [fallbackLogoPositions, particleCount]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPr: { value: 0 },
      uSize: { value: size.width < 700 ? 18 : 24 },
      uAmplitude: { value: size.width < 700 ? 0.75 : 1.12 },
      uSpeed: { value: 1 },
      uPixelRatio: { value: 1 },
      uReveal: { value: 0 },
      uViewport: { value: new THREE.Vector2(size.width, size.height) },
      uEmerald: { value: new THREE.Color("#1E6B4A") },
      uGold: { value: new THREE.Color("#D9B45E") },
      uTeal: { value: new THREE.Color("#18C6B8") },
      uAlpha: { value: isLight ? 0.66 : 0.88 },
      uThemeLight: { value: isLight ? 1 : 0 },
    }),
    [] // Uniform objects are mutated in the render loop.
  );

  useFrame((state, dt) => {
    const material = matRef.current;
    const points = pointsRef.current;
    if (!material || !points) return;

    const scroll = getScroll().smooth;
    const story = THREE.MathUtils.clamp((scroll - 0.05) / 0.45, 0, 1);
    const targetPr = story * 3.7;
    prRef.current += (targetPr - prRef.current) * (1 - Math.exp(-2.35 * dt));

    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uPr.value = prRef.current;
    material.uniforms.uThemeLight.value = isLight ? 1 : 0;
    material.uniforms.uAlpha.value = isLight ? 0.66 : 0.88;
    material.uniforms.uReveal.value = THREE.MathUtils.smoothstep(story, 0.01, 0.15);
    material.uniforms.uPixelRatio.value = Math.min(1.65, gl.getPixelRatio());
    material.uniforms.uViewport.value.set(size.width, size.height);

    const pr = prRef.current;
    const wheel = THREE.MathUtils.smoothstep(pr, 0.05, 1.3);
    const logo = THREE.MathUtils.smoothstep(pr, 1.0, 2.55);
    const settle = THREE.MathUtils.smoothstep(pr, 2.2, 3.7);

    points.rotation.y = THREE.MathUtils.damp(points.rotation.y, wheel * 0.18 - settle * 0.08, 2.6, dt);
    points.rotation.x = THREE.MathUtils.damp(points.rotation.x, -0.04 + logo * 0.08 - settle * 0.05, 2.6, dt);
    points.rotation.z = THREE.MathUtils.damp(points.rotation.z, -0.05 + wheel * 0.34 - settle * 0.16, 2.6, dt);

    const camX = THREE.MathUtils.mapLinear(
      THREE.MathUtils.clamp(pr, 0.0, 3.7),
      0.0,
      3.7,
      viewport.width * 0.02,
      0
    );
    const camY =
      -0.55 +
      THREE.MathUtils.smoothstep(pr, 0.4, 1.7) * 0.25 +
      settle * 0.34;
    const camZ =
      8.4 -
      THREE.MathUtils.smoothstep(pr, 0.5, 2.2) * 1.2 +
      settle * 1.05;

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, camX, 2.8, dt);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, camY, 2.8, dt);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, camZ, 2.8, dt);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSpherePos" args={[spherePositions, 3]} />
        <bufferAttribute attach="attributes-aLogoPos" args={[logoPositions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
        <bufferAttribute attach="attributes-aIndex" args={[indexes, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest
        depthWrite={false}
        transparent
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function SecuredFiBackground() {
  const { enabled: a11yEnabled, prefersReducedMotion } = useA11y();
  const { resolvedTheme } = useTheme();
  const t = useTranslations("Stats");
  const isLight = resolvedTheme === "light";
  const [visible, setVisible] = useState(true);
  const [storyProgress, setStoryProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const storyProgressRef = useRef(0);

  useEffect(() => {
    if (a11yEnabled || prefersReducedMotion) return;

    startScrollTracking();

    const handleVisibility = () => setVisible(document.visibilityState === "visible");
    const updateStoryProgress = () => {
      const smooth = getScroll().smooth;
      const next = Math.min(1, Math.max(0, (smooth - 0.05) / 0.45));
      if (Math.abs(next - storyProgressRef.current) > 0.003) {
        storyProgressRef.current = next;
        setStoryProgress(next);
      }
    };
    let raf = 0;
    const tick = () => {
      updateStoryProgress();
      raf = window.requestAnimationFrame(tick);
    };

    document.addEventListener("visibilitychange", handleVisibility);
    handleVisibility();
    tick();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.cancelAnimationFrame(raf);
    };
  }, [a11yEnabled, prefersReducedMotion]);

  if (a11yEnabled || prefersReducedMotion) {
    return null;
  }

  const textReveal = Math.min(1, Math.max(0, (storyProgress - 0.58) / 0.34));
  const canvasOpacity = Math.min(1, Math.max(0, storyProgress / 0.16));
  const stats = ["s1", "s2", "s3", "s4"];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[12] block h-screen w-full overflow-hidden pointer-events-none"
    >
      {visible && (
        <div
          className="absolute inset-0"
          style={{
            opacity: canvasOpacity,
            transition: "opacity 900ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <Canvas
            gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
            dpr={[1, 1.5]}
            camera={{ position: [0, -0.55, 8.4], fov: 52, near: 0.1, far: 80 }}
            style={{ width: "100%", height: "100%" }}
            frameloop="always"
          >
            <ShaderParticles isLight={isLight} />
          </Canvas>
        </div>
      )}

      <div
        className="absolute inset-0 hidden lg:flex items-center justify-between px-16 xl:px-24"
        style={{
          opacity: textReveal,
          transform: `translateY(${(1 - textReveal) * 32}px)`,
          transition: "opacity 900ms cubic-bezier(0.16, 1, 0.3, 1), transform 900ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="max-w-[360px] pt-28">
          <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.28em] text-gold-light/85">
            {t("overline")}
          </div>
          <p className="font-display text-[34px] leading-tight text-white/90 drop-shadow-[0_8px_32px_rgba(0,0,0,0.55)]">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid w-[420px] grid-cols-2 gap-4 pt-24">
          {stats.map((key, index) => (
            <div
              key={key}
              className="rounded-2xl border border-gold/18 bg-[#07150e]/58 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl"
              style={{
                opacity: textReveal,
                transform: `translateX(${(1 - textReveal) * (index % 2 === 0 ? 24 : -24)}px)`,
                transition: `opacity 850ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 80}ms, transform 850ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 80}ms`,
              }}
            >
              <div className="mb-2 font-numbers text-4xl font-semibold tracking-tight text-gold-light">
                {t(`${key}.value`)}
              </div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/86">
                {t(`${key}.label`)}
              </div>
              <p className="text-sm leading-relaxed text-white/58">{t(`${key}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
