import type { Metadata } from "next";
import { Source_Serif_4, Golos_Text, Lora, IBM_Plex_Sans, Manrope, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import PageTransitionProvider from "@/components/motion/PageTransition";
import ThemeProvider from "@/components/theme/ThemeProvider";
import { IconSystemProvider } from "@/components/theme/IconSystemProvider";
import { FontSystemProvider } from "@/components/theme/FontSystemProvider";
import { BgSystemProvider } from "@/components/theme/BgSystemProvider";
import AccessibilityProvider from "@/components/theme/AccessibilityProvider";
import AccessibilityPanel from "@/components/ui/AccessibilityPanel";
import FontFloatingSwitcher from "@/components/ui/FontFloatingSwitcher";

const sourceSerif = Source_Serif_4({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-source-serif",
  display: "swap",
});

const golosText = Golos_Text({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-golos",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-lora",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex",
  display: "swap",
});

// Styrene-like grotesque for the "Anthropic" pair (Cyrillic-capable; Kazakh
// glyphs Manrope may lack are caught by the Golos fallback in the CSS stack).
const manrope = Manrope({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-manrope",
  display: "swap",
});

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
    icon: [
      {
        url: "/images/logo/ddc_logo_light_theme.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/images/logo/ddc_logo_for_dark_theme.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
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
      className={`${sourceSerif.variable} ${golosText.variable} ${lora.variable} ${ibmPlexSans.variable} ${manrope.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head />
      <body className="min-h-full flex flex-col text-white">
        <ThemeProvider>
          <BgSystemProvider>
            <FontSystemProvider>
              <IconSystemProvider>
                <NextIntlClientProvider messages={messages}>
                  <AccessibilityProvider>
                    {/* Faint grain overlay (opacity 0.03) for organic texture */}
                    <div data-decorative className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('/images/textures/bg-texture-noise.png')] bg-repeat" />
                    <PageTransitionProvider>{children}</PageTransitionProvider>
                    <AccessibilityPanel />
                    <FontFloatingSwitcher />
                  </AccessibilityProvider>
                </NextIntlClientProvider>
              </IconSystemProvider>
            </FontSystemProvider>
          </BgSystemProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}