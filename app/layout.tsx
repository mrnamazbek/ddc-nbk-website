import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="h-full antialiased dark" suppressHydrationWarning>
      <head>
        <Script id="ddc-color-variant" strategy="beforeInteractive">
          {`try {
            document.documentElement.dataset.colorVariant = localStorage.getItem("ddc-color-variant") === "brand" ? "brand" : "current";
          } catch {
            document.documentElement.dataset.colorVariant = "current";
          }`}
        </Script>
        <link rel="preload" href="/fonts/nohemi/Nohemi-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/nohemi/Nohemi-SemiBold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col text-white">{children}</body>
    </html>
  );
}
