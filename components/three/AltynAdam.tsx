"use client";

import { Component, Suspense, useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_SRC = "/models/altyn_adam.glb";

// useGLTF's suspense loader re-throws a failed fetch (e.g. a missing/404'd
// asset) as a render-time error, which Suspense cannot catch — only a real
// error boundary can. Without this, a single missing .glb takes down the
// whole page (and, via the WebGL context it was rendering into, can crash
// the tab outright) instead of just skipping this one model.
class ModelErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error("AltynAdam model failed to load:", error);
  }
  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

function AltynAdamInner({
  scale = 1,
  targetHeight = 3.2,
}: {
  scale?: number;
  targetHeight?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_SRC);

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#D8A93E",
        metalness: 1,
        roughness: 0.28,
        clearcoat: 0.72,
        clearcoatRoughness: 0.18,
        envMapIntensity: 1.85,
        iridescence: 0.45,
        iridescenceIOR: 1.25,
        iridescenceThicknessRange: [180, 520],
        emissive: "#133824",
        emissiveIntensity: 0.025,
      }),
    [],
  );

  const { model, normalizedScale, center } = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = material;
        child.castShadow = true;
        child.receiveShadow = true;
        child.geometry.computeVertexNormals();
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const centerPoint = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(centerPoint);

    return {
      model: clone,
      normalizedScale: size.y > 0 ? targetHeight / size.y : 1,
      center: centerPoint,
    };
  }, [material, scene, targetHeight]);

  useFrame((state, dt) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const targetY = Math.sin(t * 0.34) * 0.24 + state.pointer.x * 0.22;
    const targetX = -0.08 + Math.sin(t * 0.22) * 0.05 - state.pointer.y * 0.12;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 4, dt);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 4, dt);
  });

  return (
    <group ref={group} scale={scale}>
      <primitive
        object={model}
        scale={normalizedScale}
        position={[-center.x * normalizedScale, -center.y * normalizedScale, -center.z * normalizedScale]}
      />
    </group>
  );
}

export default function AltynAdam({
  scale = 1,
  targetHeight = 3.2,
  withEnvironment = true,
}: {
  scale?: number;
  targetHeight?: number;
  withEnvironment?: boolean;
}) {
  return (
    <ModelErrorBoundary>
      <Suspense fallback={null}>
        {withEnvironment && (
          <Environment frames={1} resolution={256}>
            <Lightformer form="rect" intensity={2.5} color="#FFF1C9" position={[0, 3, 5]} scale={[12, 12, 1]} />
            <Lightformer form="rect" intensity={1.35} color="#D8A93E" position={[0, -3, 4]} scale={[10, 8, 1]} />
            <Lightformer form="rect" intensity={1.05} color="#8ED0A8" position={[-5, 0, 3]} scale={[6, 11, 1]} />
            <Lightformer form="rect" intensity={1.15} color="#ffffff" position={[5, 1, 3]} scale={[6, 11, 1]} />
            <Lightformer form="ring" intensity={1.5} color="#FFE8A6" position={[0, 0, -4]} scale={[10, 10, 1]} />
          </Environment>
        )}
        <AltynAdamInner scale={scale} targetHeight={targetHeight} />
      </Suspense>
    </ModelErrorBoundary>
  );
}

useGLTF.preload(MODEL_SRC);
