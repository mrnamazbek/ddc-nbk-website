import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import PageTransitionProvider from "@/components/motion/PageTransition";
import ThemeProvider from "@/components/theme/ThemeProvider";
import { IconSystemProvider } from "@/components/theme/IconSystemProvider";
import { BgSystemProvider } from "@/components/theme/BgSystemProvider";
import AccessibilityProvider from "@/components/theme/AccessibilityProvider";
import MotionA11yConfig from "@/components/motion/MotionA11yConfig";
import AccessibilityPanel from "@/components/ui/AccessibilityPanel";
import InteractiveDotGrid from "@/components/ui/InteractiveDotGrid";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

/**
 * Per-locale metadata. This was a module-level `metadata` object hardcoded in
 * Russian, so the English and Kazakh pages all shipped a Russian <title>,
 * description and keywords — visible in the browser tab and to search engines.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    icons: {
      icon: [{ url: "/images/logo/ddc-emblem.svg", type: "image/svg+xml" }],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <ThemeProvider>
      <BgSystemProvider>
        <IconSystemProvider>
          <NextIntlClientProvider messages={messages}>
            <AccessibilityProvider>
              <MotionA11yConfig>
                <div lang={locale === "kz" ? "kk" : locale} className="contents">
                  <div data-decorative className="ddc-noise-overlay fixed inset-0 pointer-events-none z-[9999] opacity-[0.03]" />
                  <PageTransitionProvider>{children}</PageTransitionProvider>
                  <AccessibilityPanel />
                  <InteractiveDotGrid />
                </div>
              </MotionA11yConfig>
            </AccessibilityProvider>
          </NextIntlClientProvider>
        </IconSystemProvider>
      </BgSystemProvider>
    </ThemeProvider>
  );
}
