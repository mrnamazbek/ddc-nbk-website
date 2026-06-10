"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

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
