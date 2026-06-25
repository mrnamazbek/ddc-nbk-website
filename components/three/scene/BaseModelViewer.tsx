"use client";

import React, { Suspense, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";
import DdcCoin from "../DdcCoin";

function ResponsiveCoin() {
  const { size } = useThree();
  const reduce = useReducedMotion() ?? false;

  // Scale relative to screen size (enlarged for better impact)
  const scaleVal = useMemo(() => {
    const isMobile = size.width < 500;
    const isTablet = size.width >= 500 && size.width < 1024;
    return isMobile ? 0.95 : isTablet ? 1.15 : 1.38;
  }, [size.width]);

  return <DdcCoin scale={scaleVal} withEnvironment={true} reduceMotion={reduce} />;
}

export default function BaseModelViewer() {
  return (
    <div className="w-full h-full min-h-[380px] relative select-none">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.15;
        }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} color="#FFE9C0" />
        <directionalLight position={[-5, -4, 2]} intensity={0.8} color="#9FE0C0" />

        <Suspense fallback={null}>
          <ResponsiveCoin />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.8}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
