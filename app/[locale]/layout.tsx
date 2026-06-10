import type { Metadata } from "next";
import { Cormorant_Garamond, JetBrains_Mono, Comfortaa } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import PageTransitionProvider from "@/components/motion/PageTransition";
import ThemeProvider from "@/components/theme/ThemeProvider";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-mono",
  display: "swap",
});

const comfortaa = Comfortaa({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-comfortaa",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DDC — Центр цифрового развития Национального Банка Казахстана",
  description: "Официальный веб-сайт Центра цифрового развития Национального Банка РК. Разработка передовых финансовых платформ, интеграция Цифрового Тенге и обеспечение государственной кибербезопасности.",
  keywords: "Национальный Банк Казахстана, DDC, Цифровой Тенге, финтех Казахстан, Центральный Банк, базы данных, Data Engineering",
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${jetbrains.variable} ${comfortaa.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Google Fonts (Instrument Serif / Barlow / JetBrains Mono) used by the
            design tokens. Loaded via <link> rather than CSS @import because
            Tailwind v4 + Lightning CSS rejects url() @import. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Barlow:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col text-white">
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            {/* Faint grain overlay (opacity 0.03) for organic texture */}
            <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('/images/textures/bg-texture-noise.png')] bg-repeat" />
            <PageTransitionProvider>{children}</PageTransitionProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}