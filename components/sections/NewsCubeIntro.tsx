"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

type NewsCubeIntroProps = {
  overline: string;
  titleLine1: string;
  titleAccent: string;
  subtitle: string;
  images: string[];
  reduce: boolean;
};

type CubePosition = {
  initial: {
    top: number;
    left: number;
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    z: number;
  };
  final: {
    top: number;
    left: number;
    rotateX: number;
    rotateY: number;
    rotateZ: number;
  };
  endRotation?: number;
};

const CUBE_POSITIONS: CubePosition[] = [
  {
    initial: { top: -55, left: 37.5, rotateX: 360, rotateY: -360, rotateZ: -48, z: -30000 },
    final: { top: 50, left: 15, rotateX: 0, rotateY: 3, rotateZ: 0 },
  },
  {
    initial: { top: -35, left: 32.5, rotateX: -360, rotateY: 360, rotateZ: 90, z: -30000 },
    final: { top: 75, left: 25, rotateX: 1, rotateY: 2, rotateZ: 0 },
    endRotation: 180,
  },
  {
    initial: { top: -65, left: 50, rotateX: -360, rotateY: -360, rotateZ: -180, z: -30000 },
    final: { top: 25, left: 25, rotateX: -1, rotateY: 2, rotateZ: 0 },
  },
  {
    initial: { top: -35, left: 50, rotateX: -360, rotateY: -360, rotateZ: -180, z: -30000 },
    final: { top: 75, left: 75, rotateX: 1, rotateY: -2, rotateZ: 0 },
    endRotation: -180,
  },
  {
    initial: { top: -55, left: 62.5, rotateX: 360, rotateY: 360, rotateZ: -135, z: -30000 },
    final: { top: 25, left: 75, rotateX: -1, rotateY: -2, rotateZ: 0 },
  },
  {
    initial: { top: -35, left: 67.5, rotateX: -180, rotateY: -360, rotateZ: -180, z: -30000 },
    final: { top: 50, left: 85, rotateX: 0, rotateY: -3, rotateZ: 0 },
  },
];

const STATIC_CUBE_POSITIONS: Array<Pick<CubePosition, "final">> = [
  { final: { top: 16, left: 18, rotateX: -1, rotateY: 3, rotateZ: -1 } },
  { final: { top: 16, left: 82, rotateX: 1, rotateY: -3, rotateZ: 1 } },
  { final: { top: 84, left: 18, rotateX: 1, rotateY: 3, rotateZ: 1 } },
  { final: { top: 84, left: 82, rotateX: -1, rotateY: -3, rotateZ: -1 } },
];

const FACE_TRANSFORMS = [
  "translateZ(calc(var(--news-cube-size) / 2))",
  "translateZ(calc(var(--news-cube-size) / -2)) rotateY(180deg)",
  "translateX(calc(var(--news-cube-size) / 2)) rotateY(90deg)",
  "translateX(calc(var(--news-cube-size) / -2)) rotateY(-90deg)",
  "translateY(calc(var(--news-cube-size) / -2)) rotateX(90deg)",
  "translateY(calc(var(--news-cube-size) / 2)) rotateX(-90deg)",
];

const CUBE_STYLE = {
  "--news-cube-size": "clamp(7rem, 15vw, 10.5rem)",
} as CSSProperties;

function CubeFaces({ image }: { image: string }) {
  return (
    <>
      {FACE_TRANSFORMS.map((transform, index) => (
        <div
          key={transform}
          className="absolute h-[var(--news-cube-size)] w-[var(--news-cube-size)] overflow-hidden bg-[var(--surface-elevated)] [backface-visibility:visible]"
          style={{ transform }}
        >
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 168px, 112px"
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}
    </>
  );
}

function AnimatedCube({
  position,
  image,
  progress,
  reduce,
}: {
  position: CubePosition;
  image: string;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const start = reduce ? position.final : position.initial;
  const top = useTransform(progress, [0, 0.5], [`${start.top}%`, `${position.final.top}%`]);
  const left = useTransform(progress, [0, 0.5], [`${start.left}%`, `${position.final.left}%`]);
  const z = useTransform(progress, [0, 0.5], [reduce ? 0 : position.initial.z, 0]);
  const rotateX = useTransform(progress, [0, 0.5], [start.rotateX, position.final.rotateX]);
  const rotateY = useTransform(
    progress,
    [0, 0.5, 1],
    [start.rotateY, position.final.rotateY, position.final.rotateY + (reduce ? 0 : position.endRotation ?? 0)],
  );
  const rotateZ = useTransform(progress, [0, 0.5], [start.rotateZ, position.final.rotateZ]);
  const opacity = useTransform(progress, [0, 0.12], reduce ? [1, 1] : [0, 1]);

  return (
    <motion.div
      aria-hidden="true"
      data-news-cube
      className="absolute h-[var(--news-cube-size)] w-[var(--news-cube-size)] [transform-style:preserve-3d] will-change-transform"
      style={{ ...CUBE_STYLE, top, left, z, x: "-50%", y: "-50%", rotateX, rotateY, rotateZ, opacity }}
    >
      <CubeFaces image={image} />
    </motion.div>
  );
}

function StaticCube({ position, image }: { position: Pick<CubePosition, "final">; image: string }) {
  return (
    <div
      aria-hidden="true"
      data-news-cube
      className="absolute h-[var(--news-cube-size)] w-[var(--news-cube-size)] [transform-style:preserve-3d]"
      style={{
        ...CUBE_STYLE,
        top: `${position.final.top}%`,
        left: `${position.final.left}%`,
        transform: `translate3d(-50%, -50%, 0) rotateX(${position.final.rotateX}deg) rotateY(${position.final.rotateY}deg) rotateZ(${position.final.rotateZ}deg)`,
      }}
    >
      <CubeFaces image={image} />
    </div>
  );
}

function IntroCopy({
  overline,
  titleLine1,
  titleAccent,
  subtitle,
  className,
  ariaHidden = false,
}: Omit<NewsCubeIntroProps, "images" | "reduce"> & { className?: string; ariaHidden?: boolean }) {
  return (
    <div aria-hidden={ariaHidden || undefined} className={className}>
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">{overline}</p>
      <h1 className="font-display text-4xl leading-[0.96] text-[var(--text-primary)] sm:text-6xl lg:text-7xl">
        {titleLine1} <span className="text-[var(--color-gold)]">{titleAccent}</span>
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg">{subtitle}</p>
    </div>
  );
}

function StaticIntro({ overline, titleLine1, titleAccent, subtitle, images }: Omit<NewsCubeIntroProps, "reduce">) {
  return (
    <section className="relative isolate flex min-h-[42rem] items-center overflow-hidden bg-[var(--background)] px-6 py-24 sm:px-12 lg:px-16">
      <div className="absolute inset-0 [perspective:1100px]">
        {STATIC_CUBE_POSITIONS.map((position, index) => (
          <StaticCube key={index} position={position} image={images[index % images.length]} />
        ))}
      </div>
      <IntroCopy
        overline={overline}
        titleLine1={titleLine1}
        titleAccent={titleAccent}
        subtitle={subtitle}
        className="relative z-10 mx-auto w-full max-w-3xl text-center"
      />
    </section>
  );
}

function AnimatedIntro(props: NewsCubeIntroProps) {
  const container = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });
  const openingOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const openingScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.15]);
  const openingBlur = useTransform(scrollYProgress, [0, 0.2], ["blur(0px)", "blur(12px)"]);
  const closingOpacity = useTransform(scrollYProgress, [0.48, 0.72], [0, 1]);
  const closingScale = useTransform(scrollYProgress, [0.48, 0.72], [0.9, 1]);
  const closingBlur = useTransform(scrollYProgress, [0.48, 0.72], ["blur(10px)", "blur(0px)"]);

  return (
    <section ref={container} className="relative h-[300svh] bg-[var(--background)]">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden [perspective:1100px]">
        <div className="absolute inset-0 [transform-style:preserve-3d]">
          {CUBE_POSITIONS.map((position, index) => (
            <AnimatedCube
              key={index}
              position={position}
              image={props.images[index % props.images.length]}
              progress={scrollYProgress}
              reduce={props.reduce}
            />
          ))}
        </div>

        <motion.div
          data-news-intro="opening"
          className="relative z-10 mx-auto w-full max-w-3xl px-6 text-center sm:px-12 lg:px-16"
          style={{ opacity: openingOpacity, scale: openingScale, filter: openingBlur }}
        >
          <IntroCopy {...props} />
        </motion.div>

        <motion.div
          aria-hidden="true"
          data-news-intro="closing"
          className="absolute z-10 mx-auto w-full max-w-3xl px-6 text-center sm:px-12 lg:px-16"
          style={{ opacity: closingOpacity, scale: closingScale, filter: closingBlur }}
        >
          <IntroCopy {...props} ariaHidden />
        </motion.div>
      </div>
    </section>
  );
}

/** Scroll-driven newsroom opening adapted from the supplied cube reference. */
export default function NewsCubeIntro(props: NewsCubeIntroProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (props.reduce || !mounted) {
    return <StaticIntro {...props} />;
  }

  return <AnimatedIntro {...props} />;
}
