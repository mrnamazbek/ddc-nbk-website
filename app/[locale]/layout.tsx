import type { Metadata } from "next";
import { Lato, Nunito, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import PageTransitionProvider from "@/components/motion/PageTransition";
import ThemeProvider from "@/components/theme/ThemeProvider";
import { IconSystemProvider } from "@/components/theme/IconSystemProvider";
import IconSystemSwitcher from "@/components/ui/IconSystemSwitcher";

const lato = Lato({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-mono",
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
      className={`${lato.variable} ${nunito.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preload"
          href="https://prod.spline.design/B6sU8aK49uDPNzXL/scene.splinecode"
          as="fetch"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col text-white">
        <ThemeProvider>
          <IconSystemProvider>
            <NextIntlClientProvider messages={messages}>
              {/* Faint grain overlay (opacity 0.03) for organic texture */}
              <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('/images/textures/bg-texture-noise.png')] bg-repeat" />
              <PageTransitionProvider>{children}</PageTransitionProvider>
              <IconSystemSwitcher />
            </NextIntlClientProvider>
          </IconSystemProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}