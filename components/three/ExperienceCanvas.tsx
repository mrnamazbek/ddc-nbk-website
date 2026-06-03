"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, Environment, Lightformer } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

import { startScrollTracking } from "@/lib/scrollStore";
import Shanyrak from "./Shanyrak";
import MorphObjects from "./scene/MorphObjects";
import Steppe from "./scene/Steppe";
import GoldDust from "./scene/GoldDust";
import CameraRig from "./scene/CameraRig";
import CinematicLoader from "./scene/CinematicLoader";

type Quality = "high" | "low" | "off";

function detectQuality(): Quality {
  if (typeof window === "undefined") return "high";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "off";
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 768;
  return coarse || small ? "low" : "high";
}

function SceneContents({ quality }: { quality: Quality }) {
  return (
    <>
      <color attach="background" args={["#0E2419"]} />
      <fog attach="fog" args={["#0E2419", 10, 32]} />

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
      <Shanyrak />
      <MorphObjects />
      <Steppe />
      <GoldDust count={quality === "low" ? 1400 : 4200} />

      {quality === "high" && (
        <EffectComposer>
          <Bloom intensity={1.15} luminanceThreshold={0.55} luminanceSmoothing={0.3} mipmapBlur radius={0.7} />
          <Vignette eskil={false} offset={0.25} darkness={0.85} />
        </EffectComposer>
      )}
    </>
  );
}

export default function ExperienceCanvas() {
  const [quality, setQuality] = useState<Quality>("high");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const q = detectQuality();
    setQuality(q);
    setReady(true);
    if (q !== "off") startScrollTracking();
  }, []);

  if (!ready) {
    return <div className="fixed inset-0 z-0 bg-[#0E2419]" />;
  }

  // Reduced-motion: static gold-on-forest hero, no WebGL, no scroll drive.
  if (quality === "off") {
    return (
      <div className="fixed inset-0 z-0 bg-[#0E2419]">
        <div className="absolute left-1/2 top-1/3 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.28),transparent_65%)]" />
      </div>
    );
  }

  return (
    <>
      <CinematicLoader />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas
          dpr={quality === "low" ? [1, 1.5] : [1, 2]}
          camera={{ position: [0, 0, 11], fov: 50 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
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
