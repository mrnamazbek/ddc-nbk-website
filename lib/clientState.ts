"use client";

import { useRef, useSyncExternalStore } from "react";

/**
 * Канонические замены паттерна «useEffect + setState для клиентских
 * значений», на который ругается react-hooks/set-state-in-effect
 * (setState синхронно в эффекте => каскадный ре-рендер). Все три хука
 * построены на useSyncExternalStore: сервер отдаёт серверный снапшот,
 * клиент сразу после гидрации — клиентский, без ошибок гидрации и без
 * лишнего каскада.
 */

const emptySubscribe = () => () => {};

/** true после гидрации на клиенте, false в SSR-разметке. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

/** Реактивный matchMedia: подписка на изменения, серверное значение задаётся явно. */
export function useMediaQuery(query: string, serverDefault = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverDefault,
  );
}

/** Реактивный флаг «на <html> есть класс X» (подписка через MutationObserver). */
export function useDocumentClassFlag(className: string, serverDefault = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const observer = new MutationObserver(onChange);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      return () => observer.disconnect();
    },
    () => document.documentElement.classList.contains(className),
    () => serverDefault,
  );
}

/**
 * Одноразовое клиентское чтение (localStorage, URL и т.п.): read()
 * выполняется один раз на клиенте, результат кэшируется на весь жизненный
 * цикл компонента; SSR получает serverDefault.
 */
export function useClientOnce<T>(read: () => T, serverDefault: T): T {
  const cache = useRef<{ value: T } | null>(null);
  return useSyncExternalStore(
    emptySubscribe,
    () => {
      if (cache.current === null) cache.current = { value: read() };
      return cache.current.value;
    },
    () => serverDefault,
  );
}
