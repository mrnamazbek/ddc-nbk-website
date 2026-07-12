"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * The site is dark by default. Theme errors and browser warnings are deliberately
 * not intercepted here: production telemetry and QA need the browser console to
 * reflect the application's actual behavior.
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
