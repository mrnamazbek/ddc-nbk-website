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
      <div className="absolute inset-0 bg-radial-[at_50%_50%] from-[#0F251A] via-[#0A0A0A] to-[#0A0A0A] opacity-70" />
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="w-full h-full"
      >
        <color attach="background" args={["#0A0A0A"]} />
        
        {/* Освещение для реалистичного преломления стекла */}
        <ambientLight intensity={0.4} />
        
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          color="#E8C87A" // Золотистый оттенок света
          castShadow
        />
        
        <directionalLight
          position={[-5, -5, 2]}
          intensity={0.8}
          color="#52B788" // Изумрудный оттенок заполняющего света
        />

        <pointLight position={[0, 0, 10]} intensity={1.5} color="#FFFFFF" />

        <Suspense fallback={null}>
          <ParticleField />
          <SakaGeometry />
        </Suspense>

        {/* Отключаем интерактивное вращение камеры пользователем, так как сцена реагирует на мышь автоматически */}
        <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
      </Canvas>

      {/* Мягкие кинематографичные виньетки для глубины */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A] opacity-85 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-[#0A0A0A] opacity-60 pointer-events-none" />
    </div>
  );
}
