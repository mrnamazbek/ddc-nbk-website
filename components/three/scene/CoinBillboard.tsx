"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { getScroll } from "@/lib/scrollStore";
import { ACTS, band, lerp, range, smoothstep } from "@/lib/sceneMath";

const SRC = "/images/3d/tenge-coin-gold.png";
useTexture.preload(SRC);

/**
 * Act 3 — the golden tenge (₸) coin. The AI asset as an additive billboard that
 * scales up out of the dissolving shanyrak and tumbles slowly. Additive blending
 * drops the asset's dark studio background and makes the gold glow under bloom.
 */
export default function CoinBillboard() {
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Mesh>(null);
  const tex = useTexture(SRC);
  const mat = useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
      opacity: 0,
    });
  }, [tex]);

  useFrame((three) => {
    if (!group.current || !spin.current) return;
    const p = getScroll().smooth;
    const t = three.clock.getElapsedTime();

    const presence = band(p, ACTS.coin[0] - 0.04, ACTS.coin[1] + 0.02, 0.05);
    mat.opacity = presence * 0.95;
    group.current.visible = presence > 0.002;

    const grow = smoothstep(range(p, ACTS.coin[0] - 0.04, ACTS.coin[0] + 0.05));
    const breathe = 1 + Math.sin(t * 1.3) * 0.03;
    group.current.scale.setScalar(lerp(1.2, 4.2, grow) * breathe);

    // Tumble in-plane + a slow scroll-coupled turn so it "reveals" as you read.
    spin.current.rotation.z = t * 0.35 + p * 12;
  });

  return (
    <Billboard ref={group}>
      <mesh ref={spin} material={mat}>
        <planeGeometry args={[1, 1]} />
      </mesh>
    </Billboard>
  );
}
