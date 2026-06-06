"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
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
    let dotX = 0;
    let dotY = 0;
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
      // Разная степень сглаживания (lerp) для создания красивого эффекта отставания внешнего кольца
      const easeOuter = 0.08; 
      const easeInner = 0.35; 
      
      cursorX += (mouseX - cursorX) * easeOuter;
      cursorY += (mouseY - cursorY) * easeOuter;
      
      dotX += (mouseX - dotX) * easeInner;
      dotY += (mouseY - dotY) * easeInner;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      }
      
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
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
    <>
      {/* Точка-указатель (без задержки для мгновенного отклика) */}
      <div
        ref={dotRef}
        className={`custom-cursor-dot ${
          hoverState === "default" ? "hovered" : ""
        } ${hoverState === "gold" ? "hovered-gold" : ""}`}
        style={{
          opacity: isVisible ? 1 : 0,
          display: isVisible ? "block" : "none",
          transition: "background-color 0.3s ease, scale 0.3s ease, opacity 0.2s ease"
        }}
      />
      {/* Внешний интерактивный Шанырак (с плавным шлейфом/задержкой) */}
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
      >
        <svg width="100%" height="100%" viewBox="0 0 40 40" className="shanyrak-cursor-svg">
          {/* Внешний круг шанырака */}
          <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" fill="none" />
          {/* Вертикальная и горизонтальная направляющие */}
          <path d="M 20 2 L 20 38" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.4" />
          <path d="M 2 20 L 38 20" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.4" />
          {/* Скрещенные изогнутые спицы шанырака (кульдреуши) */}
          <path d="M 7.27 7.27 C 12 12, 12 28, 7.27 32.73" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.35" />
          <path d="M 32.73 7.27 C 28 12, 28 28, 32.73 32.73" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.35" />
          <path d="M 7.27 7.27 C 12 12, 28 12, 32.73 7.27" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.35" />
          <path d="M 7.27 32.73 C 12 28, 28 28, 32.73 32.73" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.35" />
        </svg>
      </div>
    </>
  );
}
