"use client";

import { useScroll, useTransform, useInView, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { CometCard } from "./comet-card";
import { ENTRANCE_EASE, ENTRANCE_DURATION } from "@/components/motion/ScrollReveal";

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

function TimelineItem({ item, index }: { item: TimelineEntry; index: number }) {
  const itemRef = useRef<HTMLDivElement>(null);
  // "Active" = this milestone's dot sits near the vertical center of the
  // viewport — the current chapter of the story. Past milestones dim.
  const isActive = useInView(itemRef, { margin: "-45% 0px -45% 0px" });
  const fromSide = index % 2 === 0 ? -40 : 40;

  return (
    <div ref={itemRef} className="flex justify-start pt-10 md:pt-32 md:gap-10">
      {/* Year dot and sticky label */}
      <motion.div
        className="sticky flex flex-col md:flex-row z-30 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full"
        animate={{ opacity: isActive ? 1 : 0.4 }}
        transition={{ duration: 0.5, ease: ENTRANCE_EASE }}
      >
        <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-background flex items-center justify-center border border-glass-border shadow-[0_0_10px_rgba(232,200,122,0.15)]">
          <motion.div
            className="h-3 w-3 rounded-full bg-gold border border-gold-light"
            animate={isActive ? { scale: [1, 1.35, 1], opacity: [0.75, 1, 0.75] } : { scale: 1, opacity: 0.6 }}
            transition={isActive ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.4 }}
          />
        </div>
        <motion.h3
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: ENTRANCE_DURATION.label, ease: ENTRANCE_EASE }}
          className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-gradient-gold"
        >
          {item.title}
        </motion.h3>
      </motion.div>

      {/* Content box */}
      <div className="relative pl-20 pr-4 md:pl-4 w-full">
        <motion.h3
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: ENTRANCE_DURATION.label, ease: ENTRANCE_EASE }}
          className="md:hidden block text-2xl mb-4 text-left font-bold text-gradient-gold"
        >
          {item.title}
        </motion.h3>
        <motion.div
          initial={{ opacity: 0, x: fromSide, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: ENTRANCE_DURATION.card, ease: ENTRANCE_EASE }}
        >
          <CometCard className="p-6 md:p-8 text-left">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: ENTRANCE_DURATION.subtitle, delay: 0.15, ease: ENTRANCE_EASE }}
            >
              {item.content}
            </motion.div>
          </CometCard>
        </motion.div>
      </div>
    </div>
  );
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (rectRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerHeight(entry.target.getBoundingClientRect().height);
        }
      });
      resizeObserver.observe(rectRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [data]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 70%"],
  });

  // Grow vertical line height on scroll
  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, containerHeight]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full font-sans bg-transparent"
      ref={containerRef}
    >
      <div ref={rectRef} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <TimelineItem key={index} item={item} index={index} />
        ))}

        {/* Animated vertical track line */}
        <div
          style={{
            height: containerHeight + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-gradient-to-b from-transparent via-zinc-800 to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-b from-forest-light via-gold to-gold-light rounded-full shadow-[0_0_8px_rgba(232,200,122,0.5)]"
          />
        </div>
      </div>
    </div>
  );
};

export default Timeline;
