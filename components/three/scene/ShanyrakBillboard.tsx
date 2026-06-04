"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { getScroll } from "@/lib/scrollStore";
import { ACTS, band, lerp, range, smoothstep, easeOutExpo } from "@/lib/sceneMath";
import { useBillboardVideo } from "./useBillboardVideo";

const SRC = "/images/3d/shanyrak-gold.png";
useTexture.preload(SRC);

/**
 * The hero shanyrak — the AI-rendered gold asset as a luminous, slowly rotating
 * billboard. Additive blending drops the asset's black background, so it reads
 * as pure molten gold. It is the through-line of the journey: it forms in Act 1,
 * holds through Act 2 while the particle network expands around it, dissolves as
 * the coin takes over (Act 3), then returns low as a "rising sun" (Act 6) and
 * blooms to full glory, pulsing, for the Act 7 finale.
 */
export default function ShanyrakBillboard() {
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Mesh>(null);
  const tex = useTexture(SRC);
  const videoTex = useBillboardVideo("/video/3d/shanyrak-gold.mp4");

  const mat = useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshBasicMaterial({
      map: videoTex || tex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
      opacity: 0,
    });
  }, [tex, videoTex]);

  useFrame((three, dt) => {
    if (!group.current || !spin.current) return;
    const p = getScroll().smooth;
    const t = three.clock.getElapsedTime();

    // Visible Formation→Expansion, gone while it becomes the coin/vault/data,
    // reborn for Steppe (rising sun) and Return.
    const intro = band(p, -0.03, 0.27, 0.06);
    const outro = band(p, 0.72, 1.03, 0.05);
    const presence = Math.max(intro, outro);

    // Act 1 assembly → Act 6/7 rebirth scaling.
    const assemble = easeOutExpo(range(p, 0, ACTS.formation[1]));
    let scale = lerp(0.5, 1, assemble);
    let y = 0;
    if (p > 0.6) {
      const ret = smoothstep(range(p, ACTS.return[0], 1));
      const sun = smoothstep(range(p, 0.72, 0.88));
      scale = lerp(0.8, 1.45, ret);
      y = lerp(-1.3, 0, ret) - (1 - sun) * 0.2;
    }

    // Gentle breathing + pulse on the finale.
    const breathe = 1 + Math.sin(t * 1.1) * 0.02;
    const pulse = p > 0.9 ? 0.82 + Math.sin(t * 1.7) * 0.16 : 0.9;
    mat.opacity = presence * pulse;

    group.current.visible = presence > 0.002;
    group.current.position.set(0, y, 0);
    // The video is letterboxed (object ~56% of the square), so enlarge it to
    // match the PNG's framing; the padding is black → invisible under additive.
    const fill = videoTex ? 1.7 : 1;
    group.current.scale.setScalar(5 * scale * breathe * fill);

    // The video already carries baked 3D rotation; only add the flat in-view
    // spin for the PNG fallback so we don't double up the motion.
    spin.current.rotation.z = videoTex ? 0 : t * 0.05;
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, three.pointer.x * 0.5, 3, dt);
  });

  return (
    <Billboard ref={group}>
      <mesh ref={spin} material={mat}>
        <planeGeometry args={[1, 1]} />
      </mesh>
    </Billboard>
  );
}
