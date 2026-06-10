"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface TabProps {
  children: React.ReactNode;
  setPosition: React.Dispatch<React.SetStateAction<{
    left: number;
    width: number;
    opacity: number;
  }>>;
}

export function NavHeader() {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      className="relative mx-auto flex w-fit rounded-full border border-white/10 bg-black/40 backdrop-blur-md p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
    >
      <Tab setPosition={setPosition}>Home</Tab>
      <Tab setPosition={setPosition}>Pricing</Tab>
      <Tab setPosition={setPosition}>About</Tab>
      <Tab setPosition={setPosition}>Services</Tab>
      <Tab setPosition={setPosition}>Contact</Tab>

      <Cursor position={position} />
    </ul>
  );
}

const Tab = ({ children, setPosition }: TabProps) => {
  const ref = useRef<HTMLLIElement>(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      className="relative z-10 block cursor-pointer px-4 py-2 text-xs md:text-sm font-medium tracking-wide text-zinc-300 hover:text-white transition-colors duration-300"
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }: { position: { left: number; width: number; opacity: number } }) => {
  return (
    <motion.li
      animate={position}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="absolute z-0 h-8 rounded-full bg-white/[0.08] border border-gold/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
      style={{
        top: "6px",
      }}
    />
  );
};

export default NavHeader;
