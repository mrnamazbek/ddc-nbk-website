"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// Silence benign React 19 warning about next-themes injecting inline script tags for hydration.
// We patch console.error at module level so it is active during rendering (which occurs before useEffect).
if (typeof console !== "undefined" && console.error) {
  const isPatched = (console.error as any).__react19ThemesPatched;
  if (!isPatched) {
    const originalConsoleError = console.error;
    const patched = (...args: unknown[]) => {
      const first = args[0];
      const msg = typeof first === "string" ? first : first instanceof Error ? first.message : "";
      if (msg.includes("Encountered a script tag while rendering React component")) {
        return;
      }
      originalConsoleError.apply(console, args as Parameters<typeof console.error>);
    };
    (patched as any).__react19ThemesPatched = true;
    console.error = patched;
  }
}

/**
 * Обёртка next-themes. Сайт спроектирован тёмным по умолчанию (defaultTheme="dark"),
 * поэтому продакшн-вид не меняется. Переключатель темы (cinematic-theme-switcher)
 * переключает класс `dark`/`light` на <html>; светлая палитра задаётся в globals.css.
 */
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
