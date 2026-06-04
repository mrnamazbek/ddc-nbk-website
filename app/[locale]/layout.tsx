import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import CustomCursor from "@/components/ui/CustomCursor";
import MatrixCursorTrail from "@/components/ui/MatrixCursorTrail";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
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
      className={`${cormorant.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col bg-[#08080a] text-white">
        <NextIntlClientProvider messages={messages}>
          <CustomCursor />
          <MatrixCursorTrail />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
