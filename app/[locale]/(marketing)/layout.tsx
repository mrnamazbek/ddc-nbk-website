import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";
import ScrollProgress from "@/components/motion/ScrollProgress";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <ScrollProgress />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:border-2 focus:border-black focus:bg-white focus:px-4 focus:py-2 focus:text-base focus:font-bold focus:text-black"
      >
        Перейти к содержимому
      </a>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main id="main" className="flex-grow">{children}</main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
