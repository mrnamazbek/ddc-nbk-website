"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse } = useThree();

  const count = 2500;

  // Генерируем случайные координаты и цвета один раз при монтировании
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorGreen = new THREE.Color("#52B788"); // Brand forest green
    const colorGold = new THREE.Color("#C9A84C"); // Premium gold

    for (let i = 0; i < count; i++) {
      // Spiral distribution
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 12;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      // Mix green and gold
      const mixedColor = Math.random() > 0.4 ? colorGreen : colorGold;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();

    // Slow rotation
    pointsRef.current.rotation.y = time * 0.03;

    const positionsArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const x = positionsArray[idx];
      const z = positionsArray[idx + 2];

      // Add gentle wave on Y axis
      positionsArray[idx + 1] = Math.sin(time * 0.5 + x * 0.2 + z * 0.2) * 1.5;

      // Mouse interactive push
      const targetX = mouse.x * 8;
      const targetY = mouse.y * 5;

      const dx = x - targetX;
      const dy = positionsArray[idx + 1] - targetY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 3) {
        // Push particles away from cursor
        const force = (3 - dist) * 0.05;
        positionsArray[idx + 1] += force;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors={true}
        transparent={true}
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
