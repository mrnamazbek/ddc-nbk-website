"use client";

import { Suspense, useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import * as THREE from "three";

/**
 * Reusable DDC coin: a reeded gold ring + emerald enamel core + the real DDC
 * emblem extruded in gold-iridescent relief. Drop it into any R3F <Canvas> as a
 * central object (Services / Mission carousels). Self-contained: brings its own
 * Suspense (SVG loader) and a soft studio Environment so the metal reads right
 * regardless of the host scene's lights.
 */

const EMBLEM_SRC = "/images/logo/ddc-emblem.svg";
const R = 2;
const T = 0.34;
const BEVEL = 0.05;
const GREEN_FRONT_Z = (T + 0.012) / 2;
const REEDS = 180;
const GOLD = "#EBC069";
const GOLD_DEEP = "#C9A84C";
const GREEN = "#1A6347";

function useBodyGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    const N = 1440;
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * Math.PI * 2;
      const r = R + 0.012 * Math.sin(a * REEDS);
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    const hole = new THREE.Path();
    hole.absarc(0, 0, R * 0.86, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: T,
      bevelEnabled: true,
      bevelThickness: BEVEL,
      bevelSize: BEVEL,
      bevelSegments: 5,
      curveSegments: 4,
    });
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, []);
}

function useEmblemGeometry() {
  const data = useLoader(SVGLoader, EMBLEM_SRC);
  return useMemo(() => {
    const shapes: THREE.Shape[] = [];
    for (const path of data.paths) {
      for (const s of SVGLoader.createShapes(path)) shapes.push(s);
    }
    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 2.0,
      bevelEnabled: true,
      bevelThickness: 0.22,
      bevelSize: 0.16,
      bevelSegments: 1,
    });
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, [data]);
}

function CoinInner({ scale = 1, reduceMotion = false }: { scale?: number; reduceMotion?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const bodyGeo = useBodyGeometry();
  const emblemGeo = useEmblemGeometry();
  const emblemScale = 2.7 / 159;

  const goldMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: GOLD,
        metalness: 1,
        roughness: 0.22,
        envMapIntensity: 1.9,
        clearcoat: 0.5,
        clearcoatRoughness: 0.18,
        iridescence: 1,
        iridescenceIOR: 1.32,
        iridescenceThicknessRange: [220, 620],
      }),
    [],
  );
  const goldDeepMat = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: GOLD_DEEP, metalness: 1, roughness: 0.34, envMapIntensity: 1.3 }),
    [],
  );
  const enamelMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: GREEN,
        metalness: 0,
        roughness: 0.12,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        envMapIntensity: 1.5,
      }),
    [],
  );

  // Mostly face-on (emblem readable) with a gentle sway + pointer parallax.
  useFrame((state) => {
    if (!group.current) return;
    if (reduceMotion) {
      group.current.rotation.y = 0.3;
      group.current.position.y = 0;
      return;
    }
    const t = state.clock.getElapsedTime();
    const targetY = Math.sin(t * 0.4) * 0.35 + state.pointer.x * 0.25;
    const targetX = 0.16 + -state.pointer.y * 0.15;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.06;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.06;
  });

  return (
    <group ref={group} scale={scale}>
      <mesh geometry={bodyGeo} material={goldDeepMat} castShadow receiveShadow />
      <mesh rotation={[Math.PI / 2, 0, 0]} material={enamelMat}>
        <cylinderGeometry args={[R * 0.89, R * 0.89, T + 0.012, 120, 1]} />
      </mesh>
      <mesh
        geometry={emblemGeo}
        material={goldMat}
        position={[0, 0, GREEN_FRONT_Z]}
        scale={[emblemScale, emblemScale, emblemScale]}
      />
    </group>
  );
}

export default function DdcCoin({
  scale = 1,
  withEnvironment = true,
  reduceMotion = false,
}: {
  scale?: number;
  withEnvironment?: boolean;
  reduceMotion?: boolean;
}) {
  return (
    <Suspense fallback={null}>
      {withEnvironment && (
        <Environment frames={1} resolution={256}>
          <Lightformer form="rect" intensity={2.4} color="#FFF4DD" position={[0, 3, 5]} scale={[12, 12, 1]} />
          <Lightformer form="rect" intensity={1.4} color="#FFE9C0" position={[0, -3.5, 4]} scale={[11, 8, 1]} />
          <Lightformer form="rect" intensity={1.0} color="#9FE0C0" position={[-5, 0, 3]} scale={[6, 11, 1]} />
          <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[5, 1, 3]} scale={[6, 11, 1]} />
          <Lightformer form="ring" intensity={1.6} color="#FFE6A8" position={[0, 0, -4]} scale={[10, 10, 1]} />
        </Environment>
      )}
      <CoinInner scale={scale} reduceMotion={reduceMotion} />
    </Suspense>
  );
}
