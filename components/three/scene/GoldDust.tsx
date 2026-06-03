"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getScroll } from "@/lib/scrollStore";

/**
 * Volumetric gold-dust field. A single additive Points cloud drifting through
 * the void; density/speed scale with `count` (set lower on mobile). Drift speed
 * reacts to scroll velocity so fast scrolling streaks the motes.
 */
export default function GoldDust({ count = 4000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, geometry } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spherical shell-ish cloud around the origin, biased wide and flat.
      const r = 4 + Math.random() * 22;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 2] = Math.cos(phi) * r - 6;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { positions, geometry };
  }, [count]);

  const sprite = useMemo(() => {
    // Soft round gradient sprite so motes read as glowing dust, not squares.
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,238,190,1)");
    g.addColorStop(0.4, "rgba(201,168,76,0.6)");
    g.addColorStop(1, "rgba(201,168,76,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }, []);

  useFrame((three, dt) => {
    if (!ref.current) return;
    const { smooth, velocity } = getScroll();
    const t = three.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.02 + smooth * 0.8;
    // Stretch the cloud vertically with scroll velocity → motion-streak feel.
    const stretch = 1 + Math.min(Math.abs(velocity) * 0.6, 1.2);
    ref.current.scale.y = THREE.MathUtils.damp(ref.current.scale.y, stretch, 4, dt);
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.13}
        map={sprite}
        sizeAttenuation
        transparent
        depthWrite={false}
        opacity={0.9}
        color="#E8C87A"
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
