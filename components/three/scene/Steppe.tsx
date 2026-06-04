"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { getScroll } from "@/lib/scrollStore";
import { ACTS, band, lerp, range, smoothstep } from "@/lib/sceneMath";

/** A single jagged mountain-ridge silhouette as a thin extruded shape. */
function ridgeGeometry(width: number, peaks: number, height: number, seed: number) {
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, 0);
  const rng = (n: number) => (Math.sin(seed * 99.7 + n * 12.3) * 0.5 + 0.5);
  for (let i = 0; i <= peaks; i++) {
    const x = -width / 2 + (i / peaks) * width;
    const y = i === 0 || i === peaks ? 0 : height * (0.45 + rng(i) * 0.55);
    shape.lineTo(x, y);
  }
  shape.lineTo(width / 2, 0);
  shape.lineTo(-width / 2, 0);
  return new THREE.ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: false });
}

/* ----- The berkut (golden eagle): the AI-rendered gold asset as a luminous
   additive billboard. Black background drops out automatically under additive
   blending, so the eagle reads as a glowing apparition gliding over the steppe. */
function Eagle() {
  const group = useRef<THREE.Group>(null);
  const tex = useTexture("/images/3d/burkit-eagle-gold.png");
  const mat = useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
      opacity: 0,
    });
  }, [tex]);

  useFrame((three) => {
    if (!group.current) return;
    const p = getScroll().smooth;
    const t = three.clock.getElapsedTime();
    // Glides across once during Act 6.
    const cross = range(p, ACTS.steppe[0] + 0.01, ACTS.steppe[1] - 0.01);
    const presence = band(p, ACTS.steppe[0], ACTS.steppe[1], 0.05);
    mat.opacity = presence * 0.95;
    group.current.visible = presence > 0.001;
    group.current.position.set(
      lerp(-10, 10, cross),
      2.4 + Math.sin(cross * Math.PI) * 1.4,
      -3
    );
    // Gentle "soaring" life: slight bank + breathing scale (static image).
    group.current.rotation.z = Math.sin(t * 1.5) * 0.06 + (cross - 0.5) * 0.2;
    const s = 4.4 + Math.sin(t * 2.2) * 0.12;
    group.current.scale.set(s, s, s);
  });

  return (
    <group ref={group} visible={false}>
      <mesh material={mat}>
        <planeGeometry args={[1, 1]} />
      </mesh>
    </group>
  );
}

export default function Steppe() {
  const group = useRef<THREE.Group>(null);

  const ridges = useMemo(
    () => [
      { geo: ridgeGeometry(40, 9, 3.5, 1), z: -16, y: -6.5, color: "#8B7035", op: 0.9 },
      { geo: ridgeGeometry(46, 11, 2.6, 2), z: -11, y: -6.2, color: "#C9A84C", op: 0.85 },
      { geo: ridgeGeometry(52, 13, 1.8, 3), z: -7, y: -6.0, color: "#E8C87A", op: 0.8 },
    ],
    []
  );
  const mats = useMemo(
    () =>
      ridges.map(
        (r) => new THREE.MeshBasicMaterial({ color: r.color, transparent: true, toneMapped: false })
      ),
    [ridges]
  );

  useFrame(() => {
    if (!group.current) return;
    const p = getScroll().smooth;
    const presence = band(p, ACTS.steppe[0] - 0.03, ACTS.steppe[1] + 0.05, 0.06);
    group.current.visible = presence > 0.001;
    mats.forEach((m, i) => (m.opacity = presence * ridges[i].op));
    // Gentle parallax rise as the act plays.
    group.current.position.y = lerp(-1.5, 0, smoothstep(range(p, ACTS.steppe[0], ACTS.steppe[1])));
  });

  return (
    <group ref={group} visible={false}>
      {ridges.map((r, i) => (
        <mesh key={i} geometry={r.geo} material={mats[i]} position={[0, r.y, r.z]} />
      ))}
      <Eagle />
    </group>
  );
}
