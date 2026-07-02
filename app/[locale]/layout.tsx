import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import PageTransitionProvider from "@/components/motion/PageTransition";
import ThemeProvider from "@/components/theme/ThemeProvider";
import { IconSystemProvider } from "@/components/theme/IconSystemProvider";
import { BgSystemProvider } from "@/components/theme/BgSystemProvider";
import AccessibilityProvider from "@/components/theme/AccessibilityProvider";
import AccessibilityPanel from "@/components/ui/AccessibilityPanel";
import InteractiveDotGrid from "@/components/ui/InteractiveDotGrid";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DDC — Центр цифрового развития Национального Банка Казахстана",
  description: "Официальный веб-сайт Центра цифрового развития Национального Банка РК. Разработка передовых финансовых платформ, интеграция Цифрового Тенге и обеспечение государственной кибербезопасности.",
  keywords: "Национальный Банк Казахстана, DDC, Цифровой Тенге, финтех Казахстан, Центральный Банк, базы данных, Data Engineering",
  icons: {
    icon: [{ url: "/images/logo/ddc-emblem.svg", type: "image/svg+xml" }],
  },
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
      lang={locale === "kz" ? "kk" : locale}
      className={`${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preload" href="/fonts/nohemi/Nohemi-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/nohemi/Nohemi-SemiBold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col text-white">
        <ThemeProvider>
          <BgSystemProvider>
            <IconSystemProvider>
              <NextIntlClientProvider messages={messages}>
                <AccessibilityProvider>
                  {/* Faint grain overlay (opacity 0.03) for organic texture */}
                  <div data-decorative className="ddc-noise-overlay fixed inset-0 pointer-events-none z-[9999] opacity-[0.03]" />
                  <PageTransitionProvider>{children}</PageTransitionProvider>
                  <AccessibilityPanel />
                  <InteractiveDotGrid />
                </AccessibilityProvider>
              </NextIntlClientProvider>
            </IconSystemProvider>
          </BgSystemProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
