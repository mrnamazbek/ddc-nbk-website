"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function SakaGeometry() {
  const torusRef = useRef<THREE.Mesh>(null);
  const icoRef = useRef<THREE.Mesh>(null);
  const dodecaRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Величественное вращение и парение Тора (символ бесконечной стабильности и циркуляции капитала)
    if (torusRef.current) {
      torusRef.current.rotation.x = time * 0.08;
      torusRef.current.rotation.y = time * 0.12;
      torusRef.current.position.y = Math.sin(time * 0.7) * 0.3 + 1.2;
      
      // Мягкое следование за мышью с задержкой (lerp)
      torusRef.current.position.x = THREE.MathUtils.lerp(
        torusRef.current.position.x,
        mouse.x * 2.5 - 3,
        0.03
      );
    }

    // 2. Икосаэдр (кристалл безопасности, сапфирово-синий цвет)
    if (icoRef.current) {
      icoRef.current.rotation.x = -time * 0.15;
      icoRef.current.rotation.z = time * 0.08;
      icoRef.current.position.y = Math.cos(time * 0.6) * 0.4 - 1.5;
      
      icoRef.current.position.x = THREE.MathUtils.lerp(
        icoRef.current.position.x,
        mouse.x * 3 + 3,
        0.03
      );
    }

    // 3. Центральный золотой додекаэдр (ядро цифровых технологий DDC)
    if (dodecaRef.current) {
      dodecaRef.current.rotation.y = -time * 0.1;
      dodecaRef.current.rotation.z = -time * 0.05;
      dodecaRef.current.position.y = Math.sin(time * 1.1) * 0.2;
      
      dodecaRef.current.position.x = THREE.MathUtils.lerp(
        dodecaRef.current.position.x,
        mouse.x * 1.5,
        0.04
      );
    }
  });

  return (
    <>
      {/* Floating Torus (gold glass) */}
      <mesh ref={torusRef} position={[-3, 1.2, 0]}>
        <torusGeometry args={[1.2, 0.3, 24, 48]} />
        <meshPhysicalMaterial
          color="#C9A84C"
          emissive="#E8C87A"
          emissiveIntensity={0.25}
          roughness={0.01}
          metalness={0.25}
          transmission={0.95} // Glass effect
          thickness={2.2}    // Refraction thickness
          ior={1.65}          // IOR
          clearcoat={1.0}
          clearcoatRoughness={0.02}
        />
      </mesh>

      {/* Floating Icosahedron (emerald glass) */}
      <mesh ref={icoRef} position={[3, -1.5, 0]}>
        <icosahedronGeometry args={[1.3, 0]} />
        <meshPhysicalMaterial
          color="#2D6A4F"
          emissive="#52B788"
          emissiveIntensity={0.35}
          roughness={0.01}
          metalness={0.3}
          transmission={0.96}
          thickness={2.8}
          ior={1.8}
          clearcoat={1.0}
          clearcoatRoughness={0.01}
        />
      </mesh>

      {/* Small central gold dodecahedron */}
      <mesh ref={dodecaRef} position={[0, 0, -2.5]}>
        <dodecahedronGeometry args={[0.7, 0]} />
        <meshPhysicalMaterial
          color="#E8C87A"
          emissive="#C9A84C"
          emissiveIntensity={0.3}
          roughness={0.12}
          metalness={0.95}
          transmission={0.0}
          thickness={0.0}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
        />
      </mesh>
    </>
  );
}
