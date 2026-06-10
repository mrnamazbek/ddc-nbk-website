"use client";

import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { useEffect } from "react";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  // split text into words of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          display: "inline-block",
          opacity: 1,
          width: "auto",
        },
        {
          duration: 0.3,
          delay: stagger(0.06),
          ease: "easeInOut",
        }
      );
    }
  }, [isInView, animate]);

  const renderWords = () => {
    return (
      <motion.span ref={scope} className="inline">
        {wordsArray.map((word, idx) => {
          return (
            <span key={`word-${idx}`} className="inline-block whitespace-nowrap">
              {word.text.map((char, index) => (
                <motion.span
                  initial={{
                    opacity: 0,
                  }}
                  key={`char-${index}`}
                  className={cn(
                    `text-white opacity-0`,
                    word.className
                  )}
                >
                  {char}
                </motion.span>
              ))}
              &nbsp;
            </span>
          );
        })}
      </motion.span>
    );
  };
  return (
    <span
      className={cn(
        "text-base sm:text-xl md:text-3xl lg:text-5xl font-bold",
        className
      )}
    >
      {renderWords()}
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "inline-block rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-gold translate-y-1 ml-0.5",
          cursorClassName
        )}
      />
    </span>
  );
};

export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  // split text into words of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  const renderWords = () => {
    return (
      <span className="inline">
        {wordsArray.map((word, idx) => {
          return (
            <span key={`word-${idx}`} className="inline-block whitespace-nowrap">
              {word.text.map((char, index) => (
                <span
                  key={`char-${index}`}
                  className={cn(`text-white `, word.className)}
                >
                  {char}
                </span>
              ))}
              &nbsp;
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <div className={cn("flex space-x-1 my-6 items-center justify-center", className)}>
      <motion.div
        className="overflow-hidden pb-1"
        initial={{
          width: "0%",
        }}
        whileInView={{
          width: "fit-content",
        }}
        viewport={{ once: true }}
        transition={{
          duration: 2,
          ease: "linear",
          delay: 0.5,
        }}
      >
        <span
          className="text-xs sm:text-base md:text-xl lg:text-3xl xl:text-5xl font-bold"
          style={{
            whiteSpace: "nowrap",
          }}
        >
          {renderWords()}{" "}
        </span>{" "}
      </motion.div>
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "block rounded-sm w-[4px] h-4 sm:h-6 xl:h-12 bg-gold",
          cursorClassName
        )}
      />
    </div>
  );
};
