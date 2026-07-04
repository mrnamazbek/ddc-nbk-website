"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";

export interface TypewriterWord {
  text: string;
  className?: string;
}

// Constant reveal rate (seconds per character) so a short line and a long
// line still read as "typed at the same speed" \u2014 a single fixed duration
// per line (like the reference demo's hard-coded `duration: 2`) makes short
// lines look sluggish and long ones rushed.
const CHAR_DURATION = 0.045;
const MIN_LINE_DURATION = 0.4;

function lineDuration(line: TypewriterWord[]) {
  const chars = line.reduce((sum, word) => sum + word.text.length, 0);
  return Math.max(MIN_LINE_DURATION, chars * CHAR_DURATION);
}

/**
 * Typewriter reveal \u2014 the actual mechanism from Aceternity's
 * `TypewriterEffectSmooth` reference (an overflow-hidden box whose width
 * grows from 0 to fit-content, `ease: "linear"`): the text itself never
 * moves or fades, a clip edge just slides away from in front of it. That
 * single continuous transform is what reads as smooth; the previous version
 * of this component instead faded/translated each CHARACTER in on its own
 * staggered timer, which is a fundamentally choppier motion and also left
 * the cursor parked at the end of the whole title from frame one instead of
 * riding the reveal.
 *
 * The reference's own demo is one `whiteSpace: nowrap` line \u2014 correct for a
 * short landing-page tagline, but this component drives real, longer,
 * trilingual headlines that need to break across 2\u20133 lines. So the unit
 * here is `lines` (each an array of words), not one flat word list: each
 * line gets its OWN clip-reveal box and finishes before the next one
 * starts, and the caret is a flex sibling of the currently-active line's
 * box \u2014 as that box's width grows, flexbox reflows the caret right along
 * with it every frame, so it genuinely rides the leading edge instead of
 * sitting fixed at the end.
 */
export const TypewriterEffect = ({
  lines,
  className,
  lineClassName,
  cursorClassName,
}: {
  lines: TypewriterWord[][];
  className?: string;
  lineClassName?: string;
  cursorClassName?: string;
}) => {
  const reduce = useReducedMotion();
  const [activeLine, setActiveLine] = useState(0);
  const fullText = lines.map((line) => line.map((w) => w.text).join(" ")).join(" ");

  return (
    <div className={cn("text-left", className)}>
      <span className="sr-only">{fullText}</span>
      <div aria-hidden="true">
        {lines.map((line, lineIdx) => {
          const isLastLine = lineIdx === lines.length - 1;
          const started = reduce || activeLine >= lineIdx;
          const isActive = !reduce && activeLine === lineIdx;
          const isFinished = reduce || activeLine > lineIdx;

          return (
            <div key={`line-${lineIdx}`} className={cn("flex items-center", lineClassName)}>
              <motion.div
                className="overflow-hidden"
                initial={{ width: reduce ? "fit-content" : "0%" }}
                animate={{ width: started ? "fit-content" : "0%" }}
                transition={{ duration: lineDuration(line), ease: "linear" }}
                onAnimationComplete={() => {
                  if (isActive) setActiveLine((i) => i + 1);
                }}
              >
                <span className="inline-flex whitespace-nowrap">
                  {line.map((word, wordIdx) => (
                    <span key={wordIdx} className={cn("text-foreground", word.className)}>
                      {word.text}
                      {wordIdx < line.length - 1 ? "\u00a0" : ""}
                    </span>
                  ))}
                </span>
              </motion.div>
              {(isActive || (isFinished && isLastLine)) && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className={cn(
                    "ml-1 inline-block shrink-0 rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-gold",
                    cursorClassName
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
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
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });
  const renderWords = () => {
    return (
      <div>
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <span
                  key={`char-${index}`}
                  className={cn(`text-foreground `, word.className)}
                >
                  {char}
                </span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </div>
    );
  };

  const fullText = words.map(w => w.text).join(" ");
  return (
    <div className={cn("flex space-x-1 my-6", className)}>
      <span className="sr-only">{fullText}</span>
      <div aria-hidden="true" className="flex space-x-1">
        <motion.div
          className="overflow-hidden pb-2"
          initial={{
            width: "0%",
          }}
          whileInView={{
            width: "fit-content",
          }}
          transition={{
            duration: 2,
            ease: "linear",
            delay: 1,
          }}
        >
          <div
            className="text-xs sm:text-base md:text-xl lg:text:3xl xl:text-5xl font-bold"
            style={{
              whiteSpace: "nowrap",
            }}
          >
            {renderWords()}{" "}
          </div>{" "}
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
        ></motion.span>
      </div>
    </div>
  );
};
