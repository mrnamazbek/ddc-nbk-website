export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className="h-full antialiased dark"
      data-color-variant="brand"
      suppressHydrationWarning
    >
      <head>
        <link rel="preload" href="/fonts/nohemi/Nohemi-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/nohemi/Nohemi-SemiBold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col text-white">{children}</body>
    </html>
  );
}
