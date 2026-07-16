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
      {/* Preload-линки шрифтов убраны: Chrome на каждой загрузке предупреждал
          «preloaded but not used within a few seconds» — т.е. критическому
          пути они не помогали; @font-face в globals.css грузит их сам. */}
      <body className="min-h-full flex flex-col text-white">{children}</body>
    </html>
  );
}
