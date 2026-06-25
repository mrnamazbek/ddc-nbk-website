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
    
    // Scale responsive to viewport size (optimized for fov: 35 and Z: 6.5)
    const isMobile = size.width < 500;
    const isTablet = size.width >= 500 && size.width < 1024;
    const scaleVal = isMobile ? 1.6 : isTablet ? 1.85 : 2.15;
    
    return { center: centerVec, scaleVal };
  }, [scene, size.width]);

  // Apply premium gold and forest-green styling
  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const material = new THREE.MeshPhysicalMaterial({
        color: "#E8C87A",
        metalness: 0.9,
        roughness: 0.15,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        envMapIntensity: 2.8,
      });

      material.onBeforeCompile = (shader) => {
        // Внедряем vLocalZ во vertex shader
        shader.vertexShader = `
          varying float vLocalZ;
          ${shader.vertexShader}
        `.replace(
          "#include <begin_vertex>",
          `
          #include <begin_vertex>
          vLocalZ = position.z;
          `
        );

        // Внедряем vLocalZ во fragment shader
        shader.fragmentShader = `
          varying float vLocalZ;
          ${shader.fragmentShader}
        `;

        // Перекрашиваем пиксели на основе высоты рельефа
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <color_fragment>",
          `
          #include <color_fragment>
          float absZ = abs(vLocalZ);
          
          // Глубокий темно-зеленый лак
          vec3 greenPaint = vec3(10.0 / 255.0, 48.0 / 255.0, 30.0 / 255.0);
          
          // Благородное золото с плавными переливами
          vec3 goldPaint = vec3(235.0 / 255.0, 195.0 / 255.0, 105.0 / 255.0);
          
          // Порог 0.088 - 0.096 для идеального разделения основания и рельефа
          float mixFactor = smoothstep(0.088, 0.096, absZ);
          
          diffuseColor.rgb = mix(greenPaint, goldPaint, mixFactor);
          `
        );

        // Модифицируем roughness и metalness
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <roughnessmap_fragment>",
          `
          #include <roughnessmap_fragment>
          roughnessFactor = mix(0.22, 0.12, mixFactor);
          `
        ).replace(
          "#include <metalnessmap_fragment>",
          `
          #include <metalnessmap_fragment>
          metalnessFactor = mix(0.05, 0.95, mixFactor);
          `
        );
      };

      mesh.material = material;
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
    <div className="w-full h-full relative select-none cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 35 }}
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
