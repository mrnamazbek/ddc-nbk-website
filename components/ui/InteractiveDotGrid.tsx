"use client";

import React, { useEffect, useRef } from "react";

const DOT_RADIUS = 1.5;
const DOT_SPACING = 30;
const INTERACTION_RADIUS = 150;
const COLOR_DEFAULT = "#103522"; // Dark forest green
const COLOR_HOVER = "#E8C87A"; // Gold

export default function InteractiveDotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let mouseX = -1000;
    let mouseY = -1000;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const cols = Math.floor(width / DOT_SPACING);
      const rows = Math.floor(height / DOT_SPACING);
      
      const offsetX = (width - cols * DOT_SPACING) / 2;
      const offsetY = (height - rows * DOT_SPACING) / 2;

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = offsetX + i * DOT_SPACING;
          const y = offsetY + j * DOT_SPACING;

          const dx = mouseX - x;
          const dy = mouseY - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let currentRadius = DOT_RADIUS;
          let currentColor = COLOR_DEFAULT;
          let opacity = 0.4;

          if (dist < INTERACTION_RADIUS) {
            const ratio = 1 - dist / INTERACTION_RADIUS;
            currentRadius = DOT_RADIUS + ratio * 2;
            opacity = 0.4 + ratio * 0.6;
            
            // Interpolate color from forest green to gold
            currentColor = COLOR_HOVER;
          }

          ctx.beginPath();
          ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
          ctx.fillStyle = currentColor;
          ctx.globalAlpha = opacity;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-1] pointer-events-none"
      style={{ background: "black" }}
    />
  );
}
