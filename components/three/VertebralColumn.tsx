"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface VertebralColumnProps {
  scrollRef?: React.RefObject<number>;
  scale?: number;
  position?: [number, number, number];
  variant?: "services" | "mission";
}

export default function VertebralColumn({
  scrollRef,
  scale = 1,
  position = [0, 0, 0],
  variant = "services",
}: VertebralColumnProps) {
  const groupRef = useRef<THREE.Group>(null);

  const vertebrae = useMemo(
    () =>
      Array.from({ length: 8 }, (_, index) => ({
        y: (index - 3.5) * 0.43,
        twist: (index - 3.5) * 0.18,
        width: 0.92 - Math.abs(index - 3.5) * 0.035,
        depth: 0.46 + Math.sin(index * 1.7) * 0.05,
        tilt: Math.sin(index * 0.9) * 0.11,
      })),
    [],
  );

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: variant === "mission" ? "#354642" : "#303F3D",
        metalness: 0.48,
        roughness: 0.34,
        clearcoat: 0.78,
        clearcoatRoughness: 0.16,
        envMapIntensity: 2.15,
        iridescence: 0.82,
        iridescenceIOR: 1.18,
        iridescenceThicknessRange: [220, 760],
        emissive: variant === "mission" ? "#06191A" : "#07170F",
        emissiveIntensity: 0.045,
      }),
    [variant],
  );

  const jointMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#0E221A",
        metalness: 0.72,
        roughness: 0.24,
        clearcoat: 0.9,
        envMapIntensity: 2.4,
        emissive: "#52B788",
        emissiveIntensity: 0.025,
      }),
    [],
  );

  const coreGeometry = useMemo(() => new THREE.SphereGeometry(0.38, 30, 18), []);
  const wingGeometry = useMemo(() => new THREE.CapsuleGeometry(0.09, 0.6, 8, 16), []);
  const processGeometry = useMemo(() => new THREE.CapsuleGeometry(0.075, 0.72, 8, 16), []);
  const jointGeometry = useMemo(() => new THREE.SphereGeometry(0.08, 16, 10), []);

  useFrame((state, dt) => {
    if (!groupRef.current) return;

    const scroll = scrollRef?.current ?? 0;
    const climax = scroll > 0.78 ? (scroll - 0.78) / 0.22 : 0;
    const t = state.clock.elapsedTime;

    const targetY = -0.02 + Math.sin(t * 0.34) * 0.04 - climax * 0.28;
    const targetZ = position[2] - climax * 0.18;
    const targetScale = scale * THREE.MathUtils.lerp(1, 1.16, climax);

    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, position[1] + targetY, 4, dt);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetZ, 4, dt);
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      Math.sin(t * 0.18) * 0.16 + state.pointer.x * 0.22 + scroll * 0.36,
      4,
      dt,
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      -0.08 + state.pointer.y * 0.08,
      4,
      dt,
    );
    groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 4, dt));
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {vertebrae.map((bone, index) => (
        <group
          key={index}
          position={[Math.sin(index * 0.72) * 0.05, bone.y, 0]}
          rotation={[bone.tilt, bone.twist, Math.sin(index * 0.53) * 0.06]}
        >
          <mesh geometry={coreGeometry} material={material} scale={[bone.width, 0.48, bone.depth]} castShadow receiveShadow />
          <mesh
            geometry={wingGeometry}
            material={material}
            position={[-0.38, 0.01, 0.02]}
            rotation={[0.18, 0.1, Math.PI / 2]}
            scale={[1.08, 1, 0.82]}
            castShadow
          />
          <mesh
            geometry={wingGeometry}
            material={material}
            position={[0.38, 0.01, 0.02]}
            rotation={[-0.18, -0.1, -Math.PI / 2]}
            scale={[1.08, 1, 0.82]}
            castShadow
          />
          <mesh
            geometry={processGeometry}
            material={material}
            position={[0, -0.02, -0.38]}
            rotation={[Math.PI / 2 + bone.tilt, 0, 0]}
            scale={[0.9, 0.9, 1]}
            castShadow
          />
          <mesh geometry={jointGeometry} material={jointMaterial} position={[0, 0.19, 0.25]} />
        </group>
      ))}
    </group>
  );
}
