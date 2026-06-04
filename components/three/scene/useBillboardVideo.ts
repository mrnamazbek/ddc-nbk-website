"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";

/**
 * Loads an MP4 as a looping THREE.VideoTexture for the additive gold billboards.
 * Returns null until the clip can play (so the caller falls back to the PNG),
 * and stays null under prefers-reduced-motion. Handles autoplay quirks and
 * disposes cleanly on unmount.
 */
export function useBillboardVideo(src: string): THREE.VideoTexture | null {
  const [videoTex, setVideoTex] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const video = document.createElement("video");
    video.src = src;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;
    video.setAttribute("webkit-playsinline", "true");
    video.crossOrigin = "anonymous";

    let tex: THREE.VideoTexture | null = null;
    const onReady = () => {
      tex = new THREE.VideoTexture(video);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      setVideoTex(tex);
    };

    video.addEventListener("canplay", onReady, { once: true });
    video.load();
    video.play().catch(() => {});

    return () => {
      video.removeEventListener("canplay", onReady);
      video.pause();
      video.removeAttribute("src");
      video.load();
      tex?.dispose();
      setVideoTex(null);
    };
  }, [src]);

  return videoTex;
}
