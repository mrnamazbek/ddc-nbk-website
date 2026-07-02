"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useProgress } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import AltynAdam from "@/components/three/AltynAdam";
import Icon, { IconName } from "@/components/ui/Icon";
import ThreeModelLoadingOverlay from "@/components/ui/ThreeModelLoadingOverlay";
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
  const innerRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const p = scrollRef.current;
    const enter = THREE.MathUtils.smoothstep(p, 0.16, 0.38);
    const focus = THREE.MathUtils.smoothstep(p, 0.42, 0.76);
    const finale = THREE.MathUtils.smoothstep(p, 0.82, 0.98);

    const scale = THREE.MathUtils.lerp(0.16, THREE.MathUtils.lerp(0.84, 1.08, focus), enter);
    groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, scale, 4.0, delta));
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, THREE.MathUtils.lerp(-0.35, -0.02, enter) + finale * 0.1, 4.0, delta);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, THREE.MathUtils.lerp(-2.65, -0.35, enter) + finale * 0.35, 4.0, delta);

    if (innerRef.current) {
      const targetY = 0.12 + p * 0.22 + Math.sin(state.clock.elapsedTime * 0.18) * 0.05;
      const targetX = -0.08 + Math.cos(state.clock.elapsedTime * 0.14) * 0.025;
      innerRef.current.rotation.y = THREE.MathUtils.damp(innerRef.current.rotation.y, targetY, 2.6, delta);
      innerRef.current.rotation.x = THREE.MathUtils.damp(innerRef.current.rotation.x, targetX, 2.6, delta);
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.35, -2.65]} scale={0.16}>
      <group ref={innerRef}>
        <AltynAdam scale={1} targetHeight={4.65} withEnvironment={false} />
      </group>
    </group>
  );
}

function Scene({ scrollRef }: { scrollRef: RefObject<number> }) {
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
    </>
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
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const lastStateRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const { active: assetsLoading, progress: assetProgress } = useProgress();

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.01 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
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
  }, []);

  const chapterProgress = THREE.MathUtils.clamp((progress - 0.28) / 0.5, 0, 0.999);
  const activeIndex = Math.min(chapters.length - 1, Math.floor(chapterProgress * chapters.length));
  const activeChapter = chapters[activeIndex] ?? chapters[0];
  const introOpacity = 1 - THREE.MathUtils.smoothstep(progress, 0.16, 0.31);
  const detailsOpacity = THREE.MathUtils.smoothstep(progress, 0.26, 0.42) * (1 - THREE.MathUtils.smoothstep(progress, 0.82, 0.94));
  const finaleOpacity = THREE.MathUtils.smoothstep(progress, 0.84, 0.98);
  const showAssetLoader = visible && assetsLoading && assetProgress > 1 && assetProgress < 99;

  const scrollToChapter = (index: number) => {
    const element = containerRef.current;
    if (!element || chapters.length < 2) return;
    const start = element.getBoundingClientRect().top + window.scrollY;
    const max = Math.max(1, element.offsetHeight - window.innerHeight);
    const target = 0.3 + (index / (chapters.length - 1)) * 0.47;
    window.scrollTo({ top: start + target * max, behavior: "smooth" });
  };

  return (
    <section ref={containerRef} className={cn("relative w-full bg-[#040c08] text-white", scrollLengthClass)}>
      <div className="sticky top-0 h-screen overflow-hidden bg-[#040c08]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(82,183,136,0.18),transparent_30%),radial-gradient(circle_at_70%_72%,rgba(201,168,76,0.12),transparent_34%),linear-gradient(120deg,#031009,#071b13_48%,#020806)]" />
        <div className="absolute inset-0 opacity-[0.28] bg-[radial-gradient(rgba(232,200,122,0.18)_1px,transparent_1px)] bg-[size:22px_22px]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background via-background/35 to-transparent" />

        <div className="absolute inset-0 z-0">
          {visible ? (
            <Canvas
              camera={{ position: [0, 0, 6.4], fov: 46 }}
              dpr={[1, 1.45]}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              frameloop={visible ? "always" : "never"}
            >
              <Scene scrollRef={scrollRef} />
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

        <div
          style={{ opacity: detailsOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-8 z-10 mx-auto hidden max-w-7xl grid-cols-[minmax(13rem,18rem)_minmax(22rem,34rem)] items-end justify-between gap-8 px-6 sm:px-10 lg:grid lg:px-16"
        >
          <div className="pointer-events-auto rounded-[28px] border border-gold/15 bg-[#031009]/58 p-4 shadow-[0_18px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-gold-light/80">Scene map</p>
            <div className="space-y-1.5">
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

          <div className="pointer-events-auto">
            <AnimatePresence mode="wait">
              <motion.article
                key={activeChapter.id}
                initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-[32px] border border-gold/25 bg-[linear-gradient(145deg,rgba(8,30,22,0.96),rgba(2,8,5,0.92))] p-7 shadow-[0_28px_90px_rgba(0,0,0,0.56),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl"
              >
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/25 bg-gold/10 text-gold-light">
                    {activeChapter.icon ? <Icon name={activeChapter.icon} size={20} /> : <span className="h-2 w-2 rounded-full bg-gold" />}
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold-light/80">{activeChapter.eyebrow}</p>
                    <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">{activeChapter.title}</h2>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-white/76">{activeChapter.description}</p>
                {activeChapter.features?.length ? (
                  <ul className="mt-5 grid gap-2">
                    {activeChapter.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-xs leading-relaxed text-white/70">
                        <Icon name="check-circle" size={14} className="mt-0.5 shrink-0 text-forest-light" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {activeChapter.meta ? (
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <code className="rounded-full border border-gold/20 bg-gold/[0.06] px-3 py-1.5 font-mono text-[10px] text-gold-light">
                      {activeChapter.meta}
                    </code>
                  </div>
                ) : null}
              </motion.article>
            </AnimatePresence>
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
              {finalTitle} <span className="text-gradient-gold font-medium">{finalAccent}</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/64 sm:text-base">
              {finalDescription}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
