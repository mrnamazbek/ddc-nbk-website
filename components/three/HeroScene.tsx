"use client";

import { useEffect, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ParticleField from "./ParticleField";
import SakaGeometry from "./SakaGeometry";

export default function HeroScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Красивый фоновый градиент-заглушка во время гидратации и загрузки
    return (
      <div className="absolute inset-0 bg-radial-[at_50%_50%] from-[#002d62] via-[#08080a] to-[#08080a] opacity-70" />
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="w-full h-full"
      >
        <color attach="background" args={["#08080a"]} />
        
        {/* Real-time glass lighting */}
        <ambientLight intensity={0.4} />
        
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          color="#E8C87A" // Gold light tint
          castShadow
        />
        
        <directionalLight
          position={[-5, -5, 2]}
          intensity={0.8}
          color="#52B788" // Forest green light tint
        />

        <pointLight position={[0, 0, 10]} intensity={1.5} color="#FFFFFF" />

        <Suspense fallback={null}>
          <ParticleField />
          <SakaGeometry />
        </Suspense>

        {/* Camera control disabled for mouse tracking */}
        <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
      </Canvas>

      {/* Cinematic vignette for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A] opacity-85 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-[#0A0A0A] opacity-60 pointer-events-none" />
    </div>
  );
}
