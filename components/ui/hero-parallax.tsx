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
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.6], [-450, 50]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="h-[180vh] py-20 overflow-hidden  antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
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
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row  mb-20 space-x-20 ">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
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
      className="group/product h-96 w-[30rem] relative shrink-0 rounded-[24px] overflow-hidden border border-glass-border shadow-[0_8px_30px_rgba(0,0,0,0.25)] bg-[#0c0e0d] transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
    >
      <Link
        href={product.link}
        className="block h-full w-full"
      >
        <Image
          src={product.thumbnail}
          height="600"
          width="600"
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