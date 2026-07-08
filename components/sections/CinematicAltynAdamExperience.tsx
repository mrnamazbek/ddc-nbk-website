"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useProgress } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import AltynAdam from "@/components/three/AltynAdam";
import Icon, { IconName } from "@/components/ui/Icon";
import { BubbleText } from "@/components/ui/BubbleText";
import ThreeModelLoadingOverlay from "@/components/ui/ThreeModelLoadingOverlay";
import { useA11y } from "@/components/theme/AccessibilityProvider";
import { cn } from "@/lib/utils";

export interface CinematicChapter {
  id: number | string;
  icon?: IconName;
  eyebrow: string;
  title: string;
  description: string;
  features?: string[];
  meta?: string;
}

interface CinematicAltynAdamExperienceProps {
  overline: string;
  title: string;
  accent: string;
  trailingTitle?: string;
  subtitle: string;
  chapters: CinematicChapter[];
  finalEyebrow: string;
  finalTitle: string;
  finalAccent: string;
  finalDescription: string;
  scrollLengthClass?: string;
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;

  varying float vAlpha;
  varying vec3 vColor;

  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 41.7);
    return fract(p.x * p.y);
  }

  void main() {
    vec3 pos = position;
    float intro = smoothstep(0.04, 0.22, uProgress);
    float depth = smoothstep(0.24, 0.72, uProgress);
    float finale = smoothstep(0.82, 0.98, uProgress);

    pos.x += sin(pos.y * 0.55 + uTime * 0.22) * 0.16;
    pos.y += cos(pos.x * 0.42 + uTime * 0.18) * 0.14;
    pos.z += sin(pos.x * 0.26 + pos.y * 0.18 + uTime * 0.16) * 0.22;

    pos.x += depth * sin(position.z * 0.7 + uTime * 0.18) * 0.45;
    pos.z += depth * cos(position.x * 0.42 + uTime * 0.16) * 0.62;
    pos.y += finale * 0.45;

    // Parallax: the dust drifts the same direction the cards sweep
    // (right to left) but far slower — the depth-separation cue the
    // reference gets from its layered dust planes.
    pos.x -= depth * 1.15;
    pos.y += depth * 0.22;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (7.2 * (1.0 + hash(position.xy) * 1.2)) / -mvPosition.z;

    float fadeZ = smoothstep(-18.0, -2.0, mvPosition.z) * (1.0 - smoothstep(-1.2, 0.5, mvPosition.z));
    float edge = 1.0 - smoothstep(0.88, 1.0, uProgress) * 0.55;
    vAlpha = fadeZ * intro * edge * 0.52;

    vec3 forest = vec3(0.07, 0.38, 0.23);
    vec3 emerald = vec3(0.23, 0.68, 0.48);
    vec3 gold = vec3(0.89, 0.70, 0.27);
    float m = hash(position.xz);
    vColor = mix(mix(forest, emerald, smoothstep(0.18, 0.82, m)), gold, smoothstep(0.66, 1.0, m));
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.22, d);
    gl_FragColor = vec4(vColor, soft * vAlpha);
  }
`;

function generateDiagonalField(count: number) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const u = (i / Math.max(1, count - 1)) * 2 - 1;
    const ribbon = Math.sin(u * Math.PI * 2.2);
    const scatter = Math.random() - 0.5;
    const scatter2 = Math.random() - 0.5;

    positions[i * 3] = u * 8.6 + scatter * 1.9;
    positions[i * 3 + 1] = -u * 2.8 + ribbon * 0.7 + scatter2 * 1.2;
    positions[i * 3 + 2] = -1.9 + Math.cos(u * Math.PI * 1.8) * 1.05 + (Math.random() - 0.5) * 2.6;
  }

  return positions;
}

function ParticleRibbon({ scrollRef }: { scrollRef: RefObject<number> }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const positions = useMemo(() => generateDiagonalField(5200), []);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uProgress.value = THREE.MathUtils.damp(
      materialRef.current.uniforms.uProgress.value,
      scrollRef.current,
      4.5,
      delta,
    );
  });

  return (
    <points frustumCulled={false} position={[0.15, -0.05, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

function AltynAdamAnchor({ scrollRef }: { scrollRef: RefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);

  // Reference behaviour: the central object is a STABLE anchor the cards move
  // around — it settles in once, then holds, rather than continuing to grow
  // or spin in step with scroll distance. (AltynAdam already has its own
  // gentle idle rotation in AltynAdamInner; this group intentionally does not
  // add a second, scroll-driven rotation on top of that — the two were
  // compounding into a busier motion than the reference's calm column.)
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const p = scrollRef.current;
    const enter = THREE.MathUtils.smoothstep(p, 0.06, 0.24);
    const scale = THREE.MathUtils.lerp(0.78, 1, enter);
    groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, scale, 3.2, delta));
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, THREE.MathUtils.lerp(-0.55, -0.18, enter), 3.2, delta);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, THREE.MathUtils.lerp(-1.35, -0.85, enter), 3.2, delta);
  });

  return (
    <group ref={groupRef} position={[0, -0.55, -1.35]} scale={0.78}>
      <AltynAdam scale={1} targetHeight={3.7} withEnvironment={false} />
    </group>
  );
}

// Shared mapping from overall section progress (0..1) to the chapters'
// own local progress (0..1) — the middle act between the intro and finale.
// Defined once so the burst particles, the cards, and the active-chapter
// index all agree on exactly the same window.
const CHAPTER_ZONE_START = 0.28;
const CHAPTER_ZONE_WIDTH = 0.5;

function generateBurstField(count: number) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const radius = 0.15 + Math.random() * 0.85;
    const angle = Math.random() * Math.PI * 2;
    arr[i * 3] = Math.cos(angle) * radius;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 1.1;
    arr[i * 3 + 2] = Math.sin(angle) * radius * 0.6;
  }
  return arr;
}

function ConnectionBurst({ scrollRef, totalChapters }: { scrollRef: RefObject<number>; totalChapters: number }) {
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => generateBurstField(900), []);
  // Plain PointsMaterial draws hard SQUARE points — the reference dust is
  // soft and round. A tiny radial-gradient sprite as the map fixes it for
  // the cost of one 64px canvas texture.
  const spriteMap = useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.45, "rgba(255,255,255,0.55)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  useFrame((_, delta) => {
    if (!materialRef.current || !pointsRef.current) return;
    const p = scrollRef.current;
    // Echoes the reference's particle flare where each card "connects" to
    // the central column: calm through a chapter's hold, briefly bright at
    // every handoff between chapters.
    const virtualIndex = THREE.MathUtils.clamp((p - CHAPTER_ZONE_START) / CHAPTER_ZONE_WIDTH, 0, 1) * totalChapters;
    const distToBoundary = Math.abs(virtualIndex - Math.round(virtualIndex));
    const burst = 1 - THREE.MathUtils.smoothstep(distToBoundary, 0, 0.3);
    const sectionActive = THREE.MathUtils.smoothstep(p, 0.2, 0.3) * (1 - THREE.MathUtils.smoothstep(p, 0.8, 0.9));

    materialRef.current.opacity = THREE.MathUtils.damp(materialRef.current.opacity, (0.1 + burst * 0.65) * sectionActive, 5, delta);
    materialRef.current.size = THREE.MathUtils.damp(materialRef.current.size, 0.045 + burst * 0.05, 5, delta);
    pointsRef.current.rotation.y += delta * 0.06;
  });

  return (
    <points ref={pointsRef} position={[0, -0.05, -0.55]} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color="#E8C87A"
        size={0.045}
        map={spriteMap}
        alphaMap={spriteMap}
        transparent
        opacity={0}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function Scene({ scrollRef, totalChapters }: { scrollRef: RefObject<number>; totalChapters: number }) {
  return (
    <>
      <ambientLight intensity={0.42} />
      <directionalLight position={[3, 6, 4]} intensity={1.55} color="#d6ffdf" />
      <spotLight position={[0, 2.2, 6]} intensity={4.2} angle={Math.PI / 8} penumbra={0.7} color="#E8C87A" />
      <Environment frames={1} resolution={256}>
        <Lightformer form="rect" intensity={2.2} color="#FFF1C9" position={[0, 3, 5]} scale={[12, 10, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#52B788" position={[-5, 0, 3]} scale={[6, 10, 1]} />
        <Lightformer form="ring" intensity={1.2} color="#C9A84C" position={[0, 0, -4]} scale={[8, 8, 1]} />
      </Environment>
      <ParticleRibbon scrollRef={scrollRef} />
      <AltynAdamAnchor scrollRef={scrollRef} />
      <ConnectionBurst scrollRef={scrollRef} totalChapters={totalChapters} />
    </>
  );
}

/**
 * A floating "glass" card for one chapter, positioned with CSS 3D transforms
 * (not WebGL meshes — cheaper, keeps chapter text in the real DOM for
 * readability/accessibility, and is exactly the technique the rest of this
 * component already uses for its HTML overlays).
 *
 * MOTION MODEL — a HELIX around the central column, not a flat sweep.
 * (Reverse-engineered from the reference: cards RISE along the world Y axis
 * while ORBITING the column in the X/Z plane — a spiral staircase of cards.
 * The card whose orbit angle brings it to the FRONT of the column at eye
 * level is the active one.)
 *
 * Every card i owns one segment of scroll; `u` is its signed distance from
 * its own segment center, measured in segments. All motion derives from u:
 *
 *   orbit angle   φ(u) = u · ORBIT_STEP     (φ = 0 → front of column)
 *   world coords  x = sin φ · R,  z = cos φ · R,  y = u · RISE
 *
 * Projected to the screen:
 *   - screen X:   −sin φ · radius  → upcoming card (u<0) waits on the RIGHT
 *                 of the orbit, crosses the front at u=0, retreats LEFT
 *   - screen Y:   −u · rise        → it ENTERS from BELOW, is at eye level
 *                 exactly at the front, and keeps CLIMBING as it parks —
 *                 scroll literally screws the whole helix upward
 *   - depth cue:  front = (cos φ + 1)/2 → scale, haze (opacity), blur and
 *                 z-index all follow it, so the far side of the orbit reads
 *                 as distance instead of a hard cut
 *   - yaw:        the card stays tangent to its orbit — facing the camera
 *                 only at the front, angled toward the column on the sides
 *
 * The reference uses an RGB-glitch for materialization; that's Active
 * Theory's own signature and wrong for this brand, so the same beat is a
 * soft blur/desaturate here.
 */
const ORBIT_STEP = THREE.MathUtils.degToRad(64); // angular distance between neighbours on the orbit
const ORBIT_RADIUS_VW = 36; // orbit radius, projected to screen X
const RISE_VH = 30; // vertical climb per segment — the helix pitch
const CARD_SPREAD = 1.8; // how many segments away a card stays mounted

function ChapterCard({ chapter, index, total, progress }: { chapter: CinematicChapter; index: number; total: number; progress: number }) {
  const span = CHAPTER_ZONE_WIDTH / total;
  const center = CHAPTER_ZONE_START + (index + 0.5) * span;
  const u = THREE.MathUtils.clamp((progress - center) / span, -CARD_SPREAD, CARD_SPREAD);
  if (Math.abs(u) >= CARD_SPREAD - 0.01) return null;

  const phi = u * ORBIT_STEP;
  const front = (Math.cos(phi) + 1) / 2; // 1 at the front of the orbit, 0 behind the column

  const xVw = -Math.sin(phi) * ORBIT_RADIUS_VW;
  const yVh = -u * RISE_VH;
  const cardScale = THREE.MathUtils.lerp(0.42, 1, Math.pow(front, 1.15));
  const rotateY = THREE.MathUtils.radToDeg(phi) * 0.55; // tangent to the orbit: faces camera only at front
  const haze = Math.pow(front, 1.4);
  const opacity =
    THREE.MathUtils.lerp(0.12, 1, haze) *
    (1 - THREE.MathUtils.smoothstep(Math.abs(u), CARD_SPREAD - 0.5, CARD_SPREAD));
  const blurPx = (1 - haze) * 9;
  const held = Math.abs(u) < 0.45;

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center px-6"
      style={{ opacity, zIndex: 50 + Math.round(front * 40) }}
    >
      <article
        className={cn(
          "w-[min(40rem,80vw)] rounded-[28px] border p-7 shadow-[0_28px_90px_rgba(0,0,0,0.5)] transition-colors duration-500",
          held
            ? "pointer-events-auto border-gold/25 bg-[linear-gradient(145deg,rgba(8,30,22,0.94),rgba(2,8,5,0.9))] backdrop-blur-2xl"
            : "border-white/12 bg-[linear-gradient(145deg,rgba(8,30,22,0.7),rgba(2,8,5,0.65))]",
        )}
        style={{
          transform: `perspective(1400px) translate3d(${xVw.toFixed(2)}vw, ${yVh.toFixed(2)}vh, 0) rotateY(${rotateY.toFixed(2)}deg) scale(${cardScale.toFixed(3)})`,
          filter: `blur(${blurPx.toFixed(2)}px) saturate(${THREE.MathUtils.lerp(55, 100, haze).toFixed(0)}%)`,
        }}
      >
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/25 bg-gold/10 text-gold-light">
            {chapter.icon ? <Icon name={chapter.icon} size={20} /> : <span className="h-2 w-2 rounded-full bg-gold" />}
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold-light/80">{chapter.eyebrow}</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white"><BubbleText text={chapter.title} /></h2>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-white/76"><BubbleText text={chapter.description} /></p>
        {chapter.features?.length ? (
          <ul className="mt-5 grid gap-2">
            {chapter.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-xs leading-relaxed text-white/70">
                <Icon name="check-circle" size={14} className="mt-0.5 shrink-0 text-forest-light" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {chapter.meta ? (
          <div className="mt-5 border-t border-white/10 pt-4">
            <code className="rounded-full border border-gold/20 bg-gold/[0.06] px-3 py-1.5 font-mono text-[10px] text-gold-light">{chapter.meta}</code>
          </div>
        ) : null}
      </article>
    </div>
  );
}

/**
 * Motion-free fallback: the same content as a plain readable page — no
 * canvas, no sticky scroll hijack, no scroll-driven transforms. Served when
 * the visitor prefers reduced motion or has the site's accessibility mode
 * on, matching the static experience used across reduced-motion paths.
 */
function StaticExperience({
  overline,
  title,
  accent,
  trailingTitle,
  subtitle,
  chapters,
}: Pick<
  CinematicAltynAdamExperienceProps,
  "overline" | "title" | "accent" | "trailingTitle" | "subtitle" | "chapters"
>) {
  return (
    <section className="relative w-full bg-[#040c08] px-6 py-24 text-white">
      <div className="mx-auto max-w-5xl text-center">
        <span className="mb-5 inline-block rounded-full border border-gold/20 bg-white/[0.035] px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.38em] text-gold-light">
          {overline}
        </span>
        <h1 className="font-display text-4xl font-normal leading-tight tracking-tight sm:text-6xl">
          <BubbleText text={title} /> <BubbleText text={accent} activeClassName="text-gold font-black" />
          {trailingTitle ? <span className="block text-white/90"><BubbleText text={trailingTitle} /></span> : null}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/64 sm:text-base"><BubbleText text={subtitle} /></p>
      </div>
      <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2">
        {chapters.map((chapter) => (
          <article key={chapter.id} className="rounded-[28px] border border-gold/20 bg-[#071b13]/70 p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold-light/80">{chapter.eyebrow}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white"><BubbleText text={chapter.title} /></h2>
            <p className="mt-3 text-sm leading-relaxed text-white/76"><BubbleText text={chapter.description} /></p>
            {chapter.features?.length ? (
              <ul className="mt-4 grid gap-2">
                {chapter.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-xs leading-relaxed text-white/70">
                    <Icon name="check-circle" size={14} className="mt-0.5 shrink-0 text-forest-light" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {chapter.meta ? (
              <p className="mt-4 font-mono text-[10px] tracking-[0.08em] text-gold-light/80">{chapter.meta}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

export default function CinematicAltynAdamExperience({
  overline,
  title,
  accent,
  trailingTitle,
  subtitle,
  chapters,
  finalEyebrow,
  finalTitle,
  finalAccent,
  finalDescription,
  scrollLengthClass = "min-h-[430vh]",
}: CinematicAltynAdamExperienceProps) {
  const { enabled: a11yEnabled, prefersReducedMotion } = useA11y();
  const reduced = a11yEnabled || prefersReducedMotion;
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const lastStateRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [lowPowerMode, setLowPowerMode] = useState<boolean | null>(null);
  const [sessionDisabled3d, setSessionDisabled3d] = useState(false);
  const { active: assetsLoading, progress: assetProgress } = useProgress();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSessionDisabled3d(window.sessionStorage.getItem("ddc_services_disable_3d") === "true");
    }
  }, []);

  useEffect(() => {
    const updateQuality = () => {
      const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const noHover = window.matchMedia("(hover: none)").matches;
      setLowPowerMode(coarsePointer || noHover || window.innerWidth < 1024);
    };

    updateQuality();
    window.addEventListener("resize", updateQuality);
    return () => window.removeEventListener("resize", updateQuality);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.01 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const updateTarget = () => {
      const element = containerRef.current;
      if (!element) return;
      const start = element.getBoundingClientRect().top + window.scrollY;
      const max = Math.max(1, element.offsetHeight - window.innerHeight);
      targetRef.current = THREE.MathUtils.clamp((window.scrollY - start) / max, 0, 1);
    };

    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);
    updateTarget();

    let mounted = true;
    const tick = () => {
      if (!mounted) return;
      const diff = targetRef.current - currentRef.current;
      currentRef.current += diff * 0.075;
      scrollRef.current = currentRef.current;

      if (Math.abs(currentRef.current - lastStateRef.current) > 0.006) {
        lastStateRef.current = currentRef.current;
        setProgress(currentRef.current);
      }

      requestAnimationFrame(tick);
    };
    tick();

    return () => {
      mounted = false;
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
    };
  }, [reduced]);

  const chapterProgress = THREE.MathUtils.clamp((progress - CHAPTER_ZONE_START) / CHAPTER_ZONE_WIDTH, 0, 0.999);
  const activeIndex = Math.min(chapters.length - 1, Math.floor(chapterProgress * chapters.length));
  const introOpacity = 1 - THREE.MathUtils.smoothstep(progress, 0.16, 0.31);
  // Fully faded (not just fading) comfortably before progress hits 1 — the
  // sticky frame's own CSS release lags a beat behind this JS-driven
  // progress reaching its end, so finishing the fade early avoids a faint
  // residual ghost during that last stretch of natural scroll-release.
  const detailsOpacity = THREE.MathUtils.smoothstep(progress, 0.26, 0.42) * (1 - THREE.MathUtils.smoothstep(progress, 0.78, 0.88));
  const finaleOpacity = THREE.MathUtils.smoothstep(progress, 0.84, 0.98);
  const showAssetLoader = visible && assetsLoading && assetProgress > 1 && assetProgress < 99;

  const scrollToChapter = (index: number) => {
    const element = containerRef.current;
    if (!element || chapters.length < 2) return;
    const start = element.getBoundingClientRect().top + window.scrollY;
    const max = Math.max(1, element.offsetHeight - window.innerHeight);
    // Land exactly on the chapter's hold point (virtualIndex = index + 0.5),
    // using the same zone constants the cards/burst animate from — the
    // previous hand-tuned mapping drifted enough that the last chapter
    // landed on its exit edge, already half blurred.
    const target = CHAPTER_ZONE_START + ((index + 0.5) / chapters.length) * CHAPTER_ZONE_WIDTH;
    window.scrollTo({ top: start + target * max, behavior: "smooth" });
  };

  if (reduced || lowPowerMode !== false || sessionDisabled3d) {
    return (
      <StaticExperience
        overline={overline}
        title={title}
        accent={accent}
        trailingTitle={trailingTitle}
        subtitle={subtitle}
        chapters={chapters}
      />
    );
  }

  return (
    <section ref={containerRef} className={cn("relative w-full bg-[#040c08] text-white", scrollLengthClass)}>
      <div className="sticky top-0 h-screen overflow-hidden bg-[#040c08]">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,#031009,#071b13_48%,#020806)]" />
        <div className="absolute inset-0 opacity-[0.28] bg-[radial-gradient(rgba(232,200,122,0.18)_1px,transparent_1px)] bg-[size:22px_22px]" />

        <div className="absolute inset-0 z-0">
          {visible ? (
            <Canvas
              camera={{ position: [0, 0, 6.4], fov: 46 }}
              dpr={[1, 1.45]}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              frameloop={visible ? "always" : "never"}
            >
              <Scene scrollRef={scrollRef} totalChapters={chapters.length} />
            </Canvas>
          ) : null}
        </div>

        <ThreeModelLoadingOverlay
          mode="absolute"
          visible={showAssetLoader}
          progress={assetProgress}
          label="Loading 3D model"
          className="z-30"
        />

        <motion.div
          style={{
            opacity: introOpacity,
            y: -progress * 110,
            scale: 1 - progress * 0.06,
            // The reference title doesn't just fade — it erodes. Their
            // slice-glitch shred is Active Theory's own signature, so this
            // adapts the beat as a soft defocus dissolve: same reading
            // (text "loses cohesion" as the scene takes over), calmer craft.
            filter: `blur(${(THREE.MathUtils.smoothstep(progress, 0.14, 0.32) * 14).toFixed(2)}px)`,
          }}
          className="pointer-events-none absolute inset-x-0 top-[16vh] z-10 mx-auto flex max-w-6xl flex-col items-center px-6 text-center"
        >
          <span className="mb-5 rounded-full border border-gold/20 bg-white/[0.035] px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.38em] text-gold-light backdrop-blur-md">
            {overline}
          </span>
          <h1 className="font-display text-[clamp(3.4rem,8vw,8.5rem)] font-normal leading-[0.9] tracking-[-0.045em] text-white">
            {title} <span className="text-gradient-gold font-medium">{accent}</span>
            {trailingTitle ? <span className="block text-white/90">{trailingTitle}</span> : null}
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/64 sm:text-base">
            {subtitle}
          </p>
          <span className="mt-10 font-mono text-[10px] uppercase tracking-[0.32em] text-white/40">
            Scroll to begin
          </span>
        </motion.div>

        {/* Floating chapter cards — the reference's "conveyor of glass cards
            travelling through depth around a stable central object". Each
            card owns its own enter/hold/exit math (see ChapterCard) and
            unmounts entirely outside its window; this wrapper's opacity is
            just an extra safety net so nothing can render past the section's
            own bounds. */}
        <div style={{ opacity: detailsOpacity }} className="pointer-events-none absolute inset-0 z-10">
          {chapters.map((chapter, index) => (
            <ChapterCard key={chapter.id} chapter={chapter} index={index} total={chapters.length} progress={progress} />
          ))}
        </div>

        <div
          style={{ opacity: detailsOpacity }}
          className="pointer-events-none absolute inset-x-6 bottom-6 z-10 hidden rounded-[28px] border border-gold/15 bg-[#031009]/58 p-4 shadow-[0_18px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:left-auto sm:right-8 sm:w-64 lg:block"
        >
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-gold-light/80">Scene map</p>
          <div className="pointer-events-auto space-y-1.5">
            {chapters.map((chapter, index) => {
              const active = activeIndex === index;
              return (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => scrollToChapter(index)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition-all duration-500",
                    active ? "bg-gold/14 text-white" : "text-white/45 hover:bg-white/[0.04] hover:text-white",
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-gold" : "bg-white/25")} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em]">{chapter.eyebrow}</span>
                </button>
              );
            })}
          </div>
        </div>

        <motion.div
          style={{ opacity: finaleOpacity }}
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6 text-center"
        >
          <div className="max-w-3xl">
            <span className="mb-4 block font-mono text-[10px] uppercase tracking-[0.34em] text-gold-light">
              {finalEyebrow}
            </span>
            <h2 className="font-display text-4xl font-normal leading-tight tracking-tight text-white sm:text-6xl">
              <BubbleText text={finalTitle} /> <BubbleText text={finalAccent} activeClassName="text-gold font-black" />
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/64 sm:text-base">
              <BubbleText text={finalDescription} />
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
