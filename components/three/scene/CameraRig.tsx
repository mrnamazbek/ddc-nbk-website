"use client";

import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import { getScroll } from "@/lib/scrollStore";
import { clamp01, smoothstep } from "@/lib/sceneMath";

/**
 * The cinematic camera path. Keyframes are placed at act boundaries; the camera
 * position and look-at target are interpolated between adjacent keyframes with a
 * smoothstep ease, then damped for buttery motion. A small cursor parallax keeps
 * the frame feeling alive without breaking the scripted journey.
 */

interface Key {
  at: number;
  pos: [number, number, number];
  look: [number, number, number];
}

// pos = camera position, look = target. Tuned to the 7 acts.
const KEYS: Key[] = [
  { at: 0.0, pos: [0, 0, 7.6], look: [0, 0, 0] }, // A1: substantial crown, gentle push-in
  { at: 0.1, pos: [0, 0, 6.2], look: [0, 0, 0] }, // A1 end: pushed in on shanyrak
  { at: 0.25, pos: [4.2, 0.6, 6], look: [0, 0, 0] }, // A2: orbit ~35° on the network
  { at: 0.45, pos: [0, 0, 5.5], look: [0, 0, 0] }, // A3: centered, tracking the coin
  { at: 0.6, pos: [0, 1.2, 9], look: [0, 0, 0] }, // A4: pulled back, vault in the hall
  { at: 0.75, pos: [0, 0, 1.5], look: [0, 0, -6] }, // A5: diving through the data stream
  { at: 0.86, pos: [0, 1.5, 9], look: [0, -0.9, -6] }, // A6: low, gazing at steppe horizon
  { at: 0.92, pos: [0, 0.6, 8.4], look: [0, -0.2, -2] }, // A6→A7: lifting back toward the crown
  { at: 0.96, pos: [0, 0.1, 7.3], look: [0, 0, 0] }, // A7: shanyrak centered behind the CTA
  { at: 1.0, pos: [0, 0, 6.6], look: [0, 0, 0] }, // A7: settled — full glory
];

export default function CameraRig() {
  const { camera } = useThree();
  const pos = useMemo(() => new THREE.Vector3(0, 0, 11), []);
  const look = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const targetLook = useMemo(() => new THREE.Vector3(), []);
  const initialized = useRef(false);

  useFrame((three, dt) => {
    const p = clamp01(getScroll().smooth);

    // Find the segment [a,b] containing p.
    let a = KEYS[0];
    let b = KEYS[KEYS.length - 1];
    for (let i = 0; i < KEYS.length - 1; i++) {
      if (p >= KEYS[i].at && p <= KEYS[i + 1].at) {
        a = KEYS[i];
        b = KEYS[i + 1];
        break;
      }
    }
    const span = b.at - a.at || 1e-6;
    const t = smoothstep((p - a.at) / span);

    targetPos.set(
      THREE.MathUtils.lerp(a.pos[0], b.pos[0], t),
      THREE.MathUtils.lerp(a.pos[1], b.pos[1], t),
      THREE.MathUtils.lerp(a.pos[2], b.pos[2], t)
    );
    targetLook.set(
      THREE.MathUtils.lerp(a.look[0], b.look[0], t),
      THREE.MathUtils.lerp(a.look[1], b.look[1], t),
      THREE.MathUtils.lerp(a.look[2], b.look[2], t)
    );

    // Subtle cursor parallax (kept small so it doesn't fight the path).
    targetPos.x += three.pointer.x * 0.4;
    targetPos.y += three.pointer.y * 0.3;

    if (!initialized.current) {
      pos.copy(targetPos);
      look.copy(targetLook);
      initialized.current = true;
    } else {
      pos.x = THREE.MathUtils.damp(pos.x, targetPos.x, 4, dt);
      pos.y = THREE.MathUtils.damp(pos.y, targetPos.y, 4, dt);
      pos.z = THREE.MathUtils.damp(pos.z, targetPos.z, 4, dt);
      look.x = THREE.MathUtils.damp(look.x, targetLook.x, 5, dt);
      look.y = THREE.MathUtils.damp(look.y, targetLook.y, 5, dt);
      look.z = THREE.MathUtils.damp(look.z, targetLook.z, 5, dt);
    }

    camera.position.copy(pos);
    camera.lookAt(look);
  });

  return null;
}
