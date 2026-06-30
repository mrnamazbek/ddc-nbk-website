"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import Image, { type StaticImageData } from "next/image";
import clsx from "clsx";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  type MotionStyle,
  type MotionValue,
  type Variants,
} from "framer-motion";


import { cn } from "@/lib/utils";

type WrapperStyle = MotionStyle & {
  "--x": MotionValue<string>;
  "--y": MotionValue<string>;
};

interface CardProps {
  title: string;
  description: string;
  bgClass?: string;
}

interface ImageSet {
  step1dark1?: StaticImageData | string;
  step1dark2?: StaticImageData | string;
  step1light1: StaticImageData | string;
  step1light2: StaticImageData | string;
  step2dark1?: StaticImageData | string;
  step2dark2?: StaticImageData | string;
  step2light1: StaticImageData | string;
  step2light2: StaticImageData | string;
  step3dark?: StaticImageData | string;
  step3light: StaticImageData | string;
  step4light: StaticImageData | string;
  alt: string;
}

export interface Step {
  id: string;
  name: string;
  title: string;
  description: string;
}

export interface ComponentProps {
  title: string;
  description: string;
  bgClass?: string;
  step1img1Class?: string;
  step1img2Class?: string;
  step2img1Class?: string;
  step2img2Class?: string;
  step3imgClass?: string;
  step4imgClass?: string;
  image: ImageSet;
  steps: readonly Step[];
}

interface StepImageProps {
  src: StaticImageData | string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}

const ANIMATION_PRESETS = {
  fadeInScale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.5,
    },
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.5,
    },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.5,
    },
  },
} as const;

type AnimationPreset = keyof typeof ANIMATION_PRESETS;

interface AnimatedStepImageProps extends StepImageProps {
  preset?: AnimationPreset;
  delay?: number;
  onAnimationComplete?: () => void;
}

function useNumberCycler(
  totalSteps: number,
  interval: number = 5000
) {
  const [currentNumber, setCurrentNumber] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const setupTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setCurrentNumber((prev) => (prev + 1) % totalSteps);
      setupTimer();
    }, interval);
  }, [interval, totalSteps]);

  const increment = useCallback(() => {
    setCurrentNumber((prev) => (prev + 1) % totalSteps);
    setupTimer();
  }, [totalSteps, setupTimer]);

  const setStep = useCallback((index: number) => {
    setCurrentNumber(index);
    setupTimer();
  }, [setupTimer]);

  useEffect(() => {
    setupTimer();
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [setupTimer]);

  return {
    currentNumber,
    increment,
    setStep,
  };
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isSmall = window.matchMedia("(max-width: 768px)").matches;
    const isMobileUserAgent = Boolean(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.exec(
        userAgent
      )
    );
    const isDev = process.env.NODE_ENV !== "production";
    if (isDev) {
      setIsMobile(isSmall || isMobileUserAgent);
    } else {
      setIsMobile(isSmall && isMobileUserAgent);
    }
  }, []);
  return isMobile;
}

function IconCheck({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn("h-4 w-4", className)}
      {...props}
    >
      <path d="m229.66 77.66-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69 218.34 66.34a8 8 0 0 1 11.32 11.32Z" />
    </svg>
  );
}

const stepVariants: Variants = {
  inactive: {
    scale: 0.9,
    opacity: 0.5,
  },
  active: {
    scale: 1,
    opacity: 1,
  },
};

const StepImage = forwardRef<
  HTMLImageElement,
  StepImageProps & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }
>(
  (
    { src, alt, className, style, width = 1200, height = 630, ...props },
    ref
  ) => {
    return (
      <Image
        ref={ref}
        alt={alt}
        className={className}
        src={src}
        width={width}
        height={height}
        style={{
          position: "absolute",
          userSelect: "none",
          maxWidth: "unset",
          ...style,
        }}
        {...props}
      />
    );
  }
);
StepImage.displayName = "StepImage";

const MotionStepImage = motion.create(StepImage);

const AnimatedStepImage = ({
  preset = "fadeInScale",
  delay = 0,
  onAnimationComplete,
  ...props
}: AnimatedStepImageProps) => {
  const presetConfig = ANIMATION_PRESETS[preset];
  return (
    <MotionStepImage
      {...props}
      {...presetConfig}
      transition={{
        ...presetConfig.transition,
        delay,
      }}
      onAnimationComplete={onAnimationComplete}
    />
  );
};

function FeatureCard({
  title,
  description,
  bgClass,
  children,
  step,
  steps,
}: CardProps & {
  children: React.ReactNode;
  step: number;
  steps: readonly Step[];
}) {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isMobile = useIsMobile();

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    if (isMobile) return;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      className="animated-cards relative w-full rounded-[16px] pointer-events-auto"
      onMouseMove={handleMouseMove}
      style={
        {
          "--x": useMotionTemplate`${mouseX}px`,
          "--y": useMotionTemplate`${mouseY}px`,
        } as WrapperStyle
      }
    >
      <div
        className={clsx(
          "group relative w-full overflow-hidden rounded-card border border-glass-border bg-gradient-to-b from-neutral-900/90 to-stone-800 transition duration-300 dark:from-neutral-950/90 dark:to-neutral-800/90",
          "md:hover:border-transparent",
          bgClass
        )}
      >
        <div className="m-6 md:m-10 min-h-[480px] w-full flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              className="flex w-full md:w-4/6 flex-col gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.3,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <motion.h2
                className="text-xl font-bold tracking-tight text-foreground md:text-2xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.1,
                  duration: 0.3,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                {steps[step]?.title}
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.2,
                  duration: 0.3,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                <div className="text-sm leading-relaxed text-neutral-300 sm:text-base dark:text-muted text-pretty">
                  {steps[step]?.description}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
          <div className="relative w-full h-[240px] sm:h-[300px] md:h-[340px] overflow-hidden mt-6">
            {mounted ? children : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Steps({
  steps: stepData,
  current,
  onChange,
}: {
  steps: readonly Step[];
  current: number;
  onChange: (index: number) => void;
}) {
  return (
    <nav aria-label="Progress" className="flex justify-center px-4 w-full">
      <ol
        className="flex w-full flex-wrap items-start justify-start gap-2 sm:justify-center md:divide-y-0"
        role="list"
      >
        {stepData.map((step, stepIdx) => {
          const isCompleted = current > stepIdx;
          const isCurrent = current === stepIdx;
          const isFuture = !isCompleted && !isCurrent;

          return (
            <motion.li
              key={`${step.name}-${stepIdx}`}
              initial="inactive"
              animate={isCurrent ? "active" : "inactive"}
              variants={stepVariants}
              transition={{ duration: 0.3 }}
              className={cn(
                "relative z-50 min-h-11 rounded-full px-3 py-1 transition-all duration-300 ease-in-out md:flex",
                isCompleted ? "bg-neutral-500/20" : "bg-neutral-500/10"
              )}
            >
              <button
                type="button"
                className={cn(
                  "group flex min-h-11 w-full cursor-pointer items-center focus:outline-none focus-visible:ring-2 bg-transparent text-left border-none p-0",
                  isCurrent && "pointer-events-none"
                )}
                onClick={() => onChange(stepIdx)}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span className="flex items-center gap-2 text-xs md:text-sm font-medium">
                  <motion.span
                    initial={false}
                    animate={{
                      scale: isCurrent ? 1.2 : 1,
                    }}
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full duration-300",
                      isCompleted && "bg-forest-light text-foreground",
                      isCurrent && "bg-gold text-black",
                      isFuture && "bg-neutral-500/20"
                    )}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <IconCheck className="h-3 w-3 stroke-white stroke-[3] text-foreground dark:stroke-black" />
                      </motion.div>
                    ) : (
                      <span
                        className={cn(
                          "text-[10px]",
                          isCurrent ? "text-black" : "text-gold"
                        )}
                      >
                        {stepIdx + 1}
                      </span>
                    )}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={clsx(
                      "text-xs md:text-sm font-medium duration-300",
                      isCompleted && "text-muted-foreground",
                      isCurrent && "text-gold",
                      isFuture && "text-neutral-500"
                    )}
                  >
                    {step.name}
                  </motion.span>
                </span>
              </button>
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
}

const defaultClasses = {
  step1img1:
    "pointer-events-none w-[50%] border border-stone-100/10 transition-all duration-500 dark:border-stone-700/50 rounded-card",
  step1img2:
    "pointer-events-none w-[60%] border border-stone-100/10 dark:border-stone-700/50 transition-all duration-500 overflow-hidden rounded-card",
  step2img1:
    "pointer-events-none w-[50%] border border-stone-100/10 transition-all duration-500 dark:border-stone-700 rounded-card overflow-hidden",
  step2img2:
    "pointer-events-none w-[40%] border border-stone-100/10 dark:border-stone-700 transition-all duration-500 rounded-card overflow-hidden",
  step3img:
    "pointer-events-none w-[90%] border border-stone-100/10 dark:border-stone-700 rounded-card transition-all duration-500 overflow-hidden",
  step4img:
    "pointer-events-none w-[90%] border border-stone-100/10 dark:border-stone-700 rounded-card transition-all duration-500 overflow-hidden",
} as const;

export const FeatureCarousel = ({
  image,
  steps,
  step1img1Class = defaultClasses.step1img1,
  step1img2Class = defaultClasses.step1img2,
  step2img1Class = defaultClasses.step2img1,
  step2img2Class = defaultClasses.step2img2,
  step3imgClass = defaultClasses.step3img,
  step4imgClass = defaultClasses.step4img,
  ...props
}: ComponentProps) => {
  const { currentNumber: step, increment, setStep } = useNumberCycler(steps.length, 5000);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleIncrement = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    increment();
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
  };

  const renderStepContent = () => {
    const content = () => {
      switch (step) {
        case 0:
          return (
            <motion.div
              className="relative w-full h-full"
              onAnimationComplete={handleAnimationComplete}
            >
              <AnimatedStepImage
                alt={steps[0]?.title || image.alt}
                className={clsx(step1img1Class)}
                src={image.step1light1}
                preset="slideInLeft"
              />
              <AnimatedStepImage
                alt={steps[0]?.title || image.alt}
                className={clsx(step1img2Class)}
                src={image.step1light2}
                preset="slideInRight"
                delay={0.1}
              />
            </motion.div>
          );
        case 1:
          return (
            <motion.div
              className="relative w-full h-full"
              onAnimationComplete={handleAnimationComplete}
            >
              <AnimatedStepImage
                alt={steps[1]?.title || image.alt}
                className={clsx(step2img1Class, "rounded-card")}
                src={image.step2light1}
                preset="fadeInScale"
              />
              <AnimatedStepImage
                alt={steps[1]?.title || image.alt}
                className={clsx(step2img2Class, "rounded-card")}
                src={image.step2light2}
                preset="fadeInScale"
                delay={0.1}
              />
            </motion.div>
          );
        case 2:
          return (
            <AnimatedStepImage
              alt={steps[2]?.title || image.alt}
              className={clsx(step3imgClass, "rounded-card")}
              src={image.step3light}
              preset="fadeInScale"
              onAnimationComplete={handleAnimationComplete}
            />
          );
        case 3:
          return (
            <AnimatedStepImage
              alt={steps[3]?.title || image.alt}
              className={clsx(step4imgClass, "rounded-card")}
              src={image.step4light}
              preset="fadeInScale"
              onAnimationComplete={handleAnimationComplete}
            />
          );
        default:
          return null;
      }
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          {...ANIMATION_PRESETS.fadeInScale}
          className="w-full h-full absolute"
        >
          {content()}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full relative">
      <FeatureCard {...props} step={step} steps={steps}>
        {renderStepContent()}
      </FeatureCard>
      
      {/* Steps indicators at the bottom */}
      <div className="w-full flex justify-center z-20">
        <Steps current={step} onChange={setStep} steps={steps} />
      </div>

      {/* Invisible overlay for next-step cycler on click */}
      <div
        className="absolute inset-0 z-10 cursor-pointer pointer-events-auto"
        onClick={handleIncrement}
        style={{ height: "calc(100% - 40px)" }} // Leave bottom steps row clickable
      />
    </div>
  );
};

FeatureCarousel.displayName = "FeatureCarousel";
