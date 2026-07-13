"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, Environment, Lightformer } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

import { startScrollTracking } from "@/lib/scrollStore";
import { useA11y } from "@/components/theme/AccessibilityProvider";
import ShanyrakBillboard from "./scene/ShanyrakBillboard";
import CoinBillboard from "./scene/CoinBillboard";
import MorphObjects from "./scene/MorphObjects";
import Steppe from "./scene/Steppe";
import CameraRig from "./scene/CameraRig";
import CinematicLoader from "./scene/CinematicLoader";
import Timeline3D from "./scene/Timeline3D";

import ScrollSequence from "@/components/ScrollSequence";

type Quality = "high" | "low" | "off";

function detectQuality(a11yEnabled: boolean, prefersReducedMotion: boolean): Quality {
  if (typeof window === "undefined") return "high";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || a11yEnabled || prefersReducedMotion) return "off";
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 768;
  return coarse || small ? "low" : "high";
}

function SceneContents({ quality }: { quality: Quality }) {
  return (
    <>
      <fog attach="fog" args={["#000000", 10, 32]} />

      {/* Lighting rig: warm gold key, cool forest fill, rim. */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 6, 5]} intensity={2.2} color="#E8C87A" />
      <directionalLight position={[-6, -2, 3]} intensity={0.8} color="#52B788" />
      <pointLight position={[0, 0, 6]} intensity={1.4} color="#ffffff" />

      {/* Inline environment for molten-metal reflections — no external HDR. */}
      <Environment frames={1} resolution={128}>
        <Lightformer intensity={2.5} color="#E8C87A" position={[0, 4, -6]} scale={[10, 6, 1]} />
        <Lightformer intensity={1.2} color="#52B788" position={[-6, 0, 2]} scale={[6, 6, 1]} />
        <Lightformer intensity={1.6} color="#ffffff" position={[5, -3, 4]} scale={[5, 5, 1]} />
      </Environment>

      <CameraRig />
      <ShanyrakBillboard />
      <CoinBillboard />
      <MorphObjects />
      <Steppe />
      <Timeline3D />

      <EffectComposer>
        <Bloom intensity={1.15} luminanceThreshold={0.55} luminanceSmoothing={0.3} mipmapBlur radius={0.7} />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
      </EffectComposer>
    </>
  );
}

export default function ExperienceCanvas() {
  const { enabled: a11yEnabled, prefersReducedMotion } = useA11y();
  const [quality, setQuality] = useState<Quality>("high");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const q = detectQuality(a11yEnabled, prefersReducedMotion);
    setQuality(q);
    setReady(true);
    if (q !== "off" && !a11yEnabled && !prefersReducedMotion) startScrollTracking();
  }, [a11yEnabled, prefersReducedMotion]);

  if (!ready) {
    return <div className="fixed inset-0 z-0 bg-background" />;
  }

  // В режиме слабовидящих или при отключенном движении полностью гасим Canvas и анимации скролла
  if (a11yEnabled || prefersReducedMotion || quality === "off") {
    return null;
  }

  if (quality === "low") {
    return <ScrollSequence />;
  }

  return (
    <>
      <CinematicLoader />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 11], fov: 50 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
            const canvas = gl.domElement;
            canvas.addEventListener("webglcontextlost", (event) => {
              event.preventDefault();
              console.warn("ExperienceCanvas: WebGL context lost — awaiting restore.");
            });
            canvas.addEventListener("webglcontextrestored", () => {
              console.warn("ExperienceCanvas: WebGL context restored.");
            });
          }}
        >
          <Suspense fallback={null}>
            <SceneContents quality={quality} />
          </Suspense>
          <AdaptiveDpr pixelated />
        </Canvas>
      </div>
    </>
  );
}