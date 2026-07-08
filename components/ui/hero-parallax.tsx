"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useA11y } from "@/components/theme/AccessibilityProvider";

export const HeroParallax = ({
  products,
  title,
  subtitle,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}) => {
  const { enabled: a11yEnabled } = useA11y();
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, isMobile ? 320 : 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, isMobile ? -320 : -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [isMobile ? 0 : 15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [isMobile ? 0 : 20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.6], [isMobile ? -80 : -450, isMobile ? 20 : 50]),
    springConfig
  );

  if (a11yEnabled) {
    return (
      <div className="w-full py-16 px-6 max-w-7xl mx-auto flex flex-col items-start bg-white text-black font-sans">
        <div className="max-w-3xl mb-12 text-left">
          {title && (
            <h2 className="font-display text-3xl sm:text-5xl text-black font-bold mb-4">
              {title}
            </h2>
          )}
          {subtitle && <p className="text-zinc-700 text-base sm:text-lg">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          {products.map((product) => (
            <div key={product.title} className="group relative rounded-[16px] overflow-hidden border-2 border-black p-4 bg-white">
              <Link href={product.link} className="block w-full">
                <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden mb-4 bg-zinc-100">
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-black underline decoration-2">{product.title}</h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="h-[135vh] min-h-[780px] md:min-h-0 md:h-[180vh] py-10 md:py-20 overflow-hidden antialiased relative z-20 flex flex-col self-auto [perspective:1000px] hero-parallax-wrapper"
    >
      <Header title={title} subtitle={subtitle} />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-8 md:space-x-20 mb-8 md:mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-8 md:mb-20 space-x-8 md:space-x-20">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-8 md:space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = ({
  title,
  subtitle,
}: {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}) => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full  left-0 top-0">
      <h1 className="font-display text-3xl md:text-6xl font-medium tracking-tight text-foreground">
        {title ?? (
          <>
            The Ultimate <br /> development studio
          </>
        )}
      </h1>
      <div className="max-w-2xl text-base md:text-xl mt-8 text-foreground/70 font-light">
        {subtitle}
      </div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-40 w-[14rem] md:h-96 md:w-[30rem] relative z-20 shrink-0 rounded-[24px] overflow-hidden border border-glass-border shadow-[0_8px_30px_rgba(0,0,0,0.25)] bg-[#0c0e0d] transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
    >
      <Link
        href={product.link}
        aria-label={product.title}
        className="block h-full w-full relative"
      >
        <Image
          src={product.thumbnail}
          fill
          sizes="(max-width: 768px) 256px, 480px"
          className="object-cover object-left-top absolute h-full w-full inset-0 rounded-[24px]"
          alt={product.title}
        />
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-background pointer-events-none rounded-[24px]"></div>
      <h2 className="absolute bottom-6 left-6 opacity-0 group-hover/product:opacity-100 text-foreground font-sans text-sm tracking-wider uppercase font-medium">
        {product.title}
      </h2>
    </motion.div>
  );
};
