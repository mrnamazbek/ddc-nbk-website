"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hoverState, setHoverState] = useState<"none" | "default" | "gold">("none");
  const [isVisible, setIsVisible] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    // 1. Проверяем режим низкого энергопотребления или слабые мобильные устройства
    const checkLowPower = () => {
      const isMobile = window.innerWidth <= 1024 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
      
      if (isMobile || hasCoarsePointer) {
        setIsLowPower(true);
      }
    };

    checkLowPower();
    window.addEventListener("resize", checkLowPower);

    if (isLowPower) return;

    // Координаты мыши (текущие и сглаженные для эффекта лерпа/затухания)
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    // Глобальное отслеживание ховера на ссылки и кнопки для изменения размера курсора
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactiveEl = target.closest("a, button, select, input, [role='button'], .hover-target");
      
      if (interactiveEl) {
        // Проверяем, имеет ли элемент золотой акцент или специальный класс
        if (
          interactiveEl.classList.contains("text-gold") ||
          interactiveEl.classList.contains("border-gold") ||
          interactiveEl.classList.contains("bg-gold") ||
          interactiveEl.getAttribute("data-hover") === "gold"
        ) {
          setHoverState("gold");
        } else {
          setHoverState("default");
        }
      } else {
        setHoverState("none");
      }
    };

    // requestAnimationFrame цикл для ультра-плавного движения
    const render = () => {
      // Формула сглаживания (lerp): плавно подтягиваем курсор к мыши
      const ease = 0.12; 
      cursorX += (mouseX - cursorX) * ease;
      cursorY += (mouseY - cursorY) * ease;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("mouseover", onMouseOver);

    // Запускаем цикл рендеринга
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("resize", checkLowPower);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible, isLowPower]);

  if (isLowPower) return null;

  return (
    <div
      ref={cursorRef}
      id="custom-cursor"
      className={`
        ${hoverState === "default" ? "hovered" : ""}
        ${hoverState === "gold" ? "hovered-gold" : ""}
      `}
      style={{
        opacity: isVisible ? 1 : 0,
        display: isVisible ? "block" : "none",
        transition: "width 0.3s ease, height 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, opacity 0.2s ease"
      }}
    />
  );
}
