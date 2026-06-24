"use client";

import React, { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const { size } = useThree();
  const reduce = useReducedMotion();

  // Slow rotation and hover bobbing (disabled if reduced motion is preferred)
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.y = reduce ? 0.3 : t * 0.12;
      groupRef.current.position.y = reduce ? 0 : Math.sin(t * 0.4) * 0.08;
    }
  });

  // Calculate geometric center of the loaded model
  const { center, scaleVal } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const centerVec = new THREE.Vector3();
    box.getCenter(centerVec);
    
    // Scale responsive to viewport size
    const isMobile = size.width < 500;
    const isTablet = size.width >= 500 && size.width < 1024;
    const scaleVal = isMobile ? 1.15 : isTablet ? 1.45 : 1.75;
    
    return { center: centerVec, scaleVal };
  }, [scene, size.width]);

  // Apply premium gold and forest-green styling
  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Color nodes and core structures with forest green, base structures with metallic gold
      const nameLower = mesh.name.toLowerCase();
      const isCore = nameLower.includes("core") || nameLower.includes("inner") || nameLower.includes("emblem");

      mesh.material = new THREE.MeshPhysicalMaterial({
        color: isCore ? "#163A28" : "#E8C87A", // Forest green or gold
        metalness: isCore ? 0.25 : 0.95,
        roughness: isCore ? 0.15 : 0.24,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        envMapIntensity: 2.2,
      });
    }
  });

  return (
    <group ref={groupRef} scale={scaleVal}>
      <primitive object={scene} position={[-center.x, -center.y, -center.z]} />
    </group>
  );
}

export default function BaseModelViewer() {
  return (
    <div className="w-full h-full min-h-[350px] relative select-none cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
        }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} color="#FFE9C0" />
        <directionalLight position={[-5, -4, 2]} intensity={0.8} color="#9FE0C0" />

        <Suspense fallback={null}>
          <Model url="/base.glb" />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.8}
          />
          <Environment frames={1} resolution={128}>
            <Lightformer intensity={2.5} color="#E8C87A" position={[0, 4, -6]} scale={[10, 6, 1]} />
            <Lightformer intensity={1.2} color="#52B788" position={[-6, 0, 2]} scale={[6, 6, 1]} />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}
