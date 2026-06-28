"use client";

import React, { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";

// Set localized Draco decoder path to avoid fetching from external Google CDN
useGLTF.setDecoderPath("/draco/");

function Model({ url, isLight }: { url: string; isLight: boolean }) {
  const { scene } = useGLTF(url, true);
  const groupRef = useRef<THREE.Group>(null);
  const { size } = useThree();
  const reduce = useReducedMotion();

  // Reference to uniforms to dynamically toggle light/dark shader styles without recompiling
  const uniformsRef = useRef({
    uIsLight: { value: isLight ? 1.0 : 0.0 }
  });

  const rotationY = useRef(0.3);

  // Smooth auto-rotation and gentle bobbing (disabled if reduced motion is preferred)
  useFrame((state, delta) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      // Use delta-time accumulation for sub-pixel rotation smoothness
      if (!reduce) {
        const safeDelta = Math.min(delta, 0.1);
        // Auto-rotation tuned 8% slower for calmer reading beside mission copy.
        rotationY.current += safeDelta * 0.684;
        // Smoothly interpolate current rotation to the target rotation to eliminate frame jitter
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotationY.current, 0.12);
      } else {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0.3, 0.12);
      }
      groupRef.current.position.y = reduce ? 0 : Math.sin(t * 0.5) * 0.04; // Reduced bobbing to prevent vertical clipping
    }
  });

  // Calculate geometric center of the loaded model
  const { center, scaleVal } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const centerVec = new THREE.Vector3();
    box.getCenter(centerVec);
    
    // Scale responsive to viewport size (optimized for fov: 35 and Z: 7.2)
    const isMobile = size.width < 500;
    const isTablet = size.width >= 500 && size.width < 1024;
    const scaleVal = isMobile ? 1.48 : isTablet ? 1.72 : 1.98;
    
    return { center: centerVec, scaleVal };
  }, [scene, size.width]);

  // Create physical material once to prevent WebGL recompiling shaders on every component render/resize
  const material = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: "#E8C87A",
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      envMapIntensity: isLight ? 1.2 : 2.8,
    });

    mat.onBeforeCompile = (shader) => {
      // Pass the uIsLight uniform object to the shader
      shader.uniforms.uIsLight = uniformsRef.current.uIsLight;

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

      // Внедряем vLocalZ и uIsLight во fragment shader
      shader.fragmentShader = `
        uniform float uIsLight;
        varying float vLocalZ;
        ${shader.fragmentShader}
      `;

      // Перекрашиваем пиксели на основе высоты рельефа и активной темы (избегая пересветов в Light теме)
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <color_fragment>",
        `
        #include <color_fragment>
        float absZ = abs(vLocalZ);
        
        // Цвета для Темной темы:
        vec3 darkGreen = vec3(10.0 / 255.0, 48.0 / 255.0, 30.0 / 255.0);
        vec3 darkGold = vec3(235.0 / 255.0, 195.0 / 255.0, 105.0 / 255.0);
        
        // Цвета для Светлой темы (на основе ddc_logo_light_theme.png):
        vec3 lightGreen = vec3(26.0 / 255.0, 61.0 / 255.0, 43.0 / 255.0); // Глубокий лесной зеленый
        vec3 lightWhite = vec3(245.0 / 255.0, 245.0 / 255.0, 242.0 / 255.0); // Благородный матово-белый оффвайт
        
        vec3 greenPaint = mix(darkGreen, lightGreen, uIsLight);
        vec3 ornamentPaint = mix(darkGold, lightWhite, uIsLight);
        
        // Порог 0.088 - 0.096 для идеального разделения основания и рельефа
        float mixFactor = smoothstep(0.088, 0.096, absZ);
        
        diffuseColor.rgb = mix(greenPaint, ornamentPaint, mixFactor);
        `
      );

      // Модифицируем roughness и metalness с учетом uIsLight (уменьшаем блеск в светлой теме для читаемости)
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <roughnessmap_fragment>",
        `
        #include <roughnessmap_fragment>
        float darkRoughness = mix(0.22, 0.12, mixFactor);
        float lightRoughness = mix(0.35, 0.25, mixFactor);
        roughnessFactor = mix(darkRoughness, lightRoughness, uIsLight);
        `
      ).replace(
        "#include <metalnessmap_fragment>",
        `
        #include <metalnessmap_fragment>
        float darkMetalness = mix(0.05, 0.95, mixFactor);
        float lightMetalness = mix(0.05, 0.15, mixFactor);
        metalnessFactor = mix(darkMetalness, lightMetalness, uIsLight);
        `
      );
    };

    return mat;
  }, [isLight]);

  // Traverse the scene and assign materials only once when the scene or material changes
  useMemo(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.material = material;
      }
    });
  }, [scene, material]);

  // Dynamically update uniforms and material properties when theme changes
  useEffect(() => {
    uniformsRef.current.uIsLight.value = isLight ? 1.0 : 0.0;
    material.envMapIntensity = isLight ? 1.2 : 2.8;
    material.needsUpdate = true;
  }, [isLight, material]);

  // Clean up materials from GPU memory on unmount
  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  return (
    <group ref={groupRef} scale={scaleVal}>
      <primitive object={scene} position={[-center.x, -center.y, -center.z]} />
    </group>
  );
}

export default function BaseModelViewer() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div className="relative h-full w-full cursor-grab select-none overflow-hidden rounded-[var(--radius-card)] active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 35 }} // Moved camera back from 6.5 to 7.2 to prevent vertical clipping/cutting
        dpr={[1, 2]} // Limit DPR to 2 for performance optimization on Retina screens
        gl={{ 
          antialias: true, 
          powerPreference: "high-performance",
          stencil: false, // Save memory and bandwidth by disabling stencil buffer
          depth: true
        }}
        style={{ display: "block", height: "100%", width: "100%" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
        }}
      >
        <ambientLight intensity={isLight ? 0.6 : 0.4} />
        <directionalLight position={[5, 8, 5]} intensity={isLight ? 1.0 : 1.8} color={isLight ? "#FFFFFF" : "#FFE9C0"} />
        <directionalLight position={[-5, -4, 2]} intensity={isLight ? 0.4 : 0.8} color={isLight ? "#E0F5EB" : "#9FE0C0"} />

        <Suspense fallback={null}>
          <Model url="/base.glb" isLight={isLight} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            enableDamping={true} // Premium smooth drag interactions
            dampingFactor={0.05}
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
