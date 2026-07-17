"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type ServiceVisualId = 1 | 2 | 3 | 4 | 5;

const colors = {
  deep: "var(--brandbook-deep)",
  forest: "var(--brandbook-forest)",
  teal: "var(--brandbook-teal)",
  gold: "var(--brandbook-gold)",
  amber: "var(--brandbook-amber)",
  white: "var(--brandbook-white)",
};

function DrawPath({
  d,
  delay = 0,
  className,
  stroke = colors.teal,
  strokeWidth = 3,
}: {
  d: string;
  delay?: number;
  className?: string;
  stroke?: string;
  strokeWidth?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.path
      d={d}
      fill="none"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.9, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    />
  );
}

function PulseDot({ cx, cy, delay = 0, gold = false }: { cx: number; cy: number; delay?: number; gold?: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r="7"
      fill={gold ? colors.gold : colors.teal}
      animate={reduceMotion ? undefined : { opacity: [0.35, 1, 0.35], scale: [0.8, 1.25, 0.8] }}
      transition={{ duration: 2.2, delay, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
    />
  );
}

function SceneGrid() {
  return (
    <g opacity="0.2" stroke={colors.teal} strokeWidth="1">
      {[120, 200, 280, 360, 440, 520].map((x) => <line key={`x-${x}`} x1={x} y1="70" x2={x} y2="550" />)}
      {[110, 190, 270, 350, 430, 510].map((y) => <line key={`y-${y}`} x1="80" y1={y} x2="600" y2={y} />)}
    </g>
  );
}

function ContactCenterScene() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <SceneGrid />
      <motion.rect
        x="210" y="145" width="290" height="330" rx="18"
        fill={colors.deep} stroke={colors.teal} strokeWidth="2"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <motion.circle cx="355" cy="265" r="58" fill={colors.gold} initial={reduceMotion ? false : { scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 130, damping: 15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
      <path d="M280 445c12-78 45-118 75-118s63 40 75 118" fill={colors.forest} />
      <DrawPath d="M292 273c0-53 25-86 63-86s63 33 63 86" delay={0.25} stroke={colors.white} strokeWidth={8} />
      <DrawPath d="M293 270v50M417 270v50M417 318c0 36-23 53-55 53" delay={0.48} stroke={colors.white} strokeWidth={8} />
      <motion.rect x="275" y="272" width="28" height="66" rx="12" fill={colors.teal} initial={reduceMotion ? false : { x: -22, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.45, duration: 0.55 }} />
      <motion.rect x="407" y="272" width="28" height="66" rx="12" fill={colors.teal} initial={reduceMotion ? false : { x: 22, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.45, duration: 0.55 }} />
      {[0, 1, 2].map((index) => (
        <motion.path
          key={index}
          d={`M${170 - index * 24} ${250 - index * 14}c-${32 + index * 8} 28-${32 + index * 8} 74 0 102`}
          fill="none" stroke={index === 2 ? colors.gold : colors.teal} strokeWidth="4" strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.35 + index * 0.12, duration: reduceMotion ? 0 : 0.75 }}
        />
      ))}
      <motion.g initial={reduceMotion ? false : { x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.35, duration: 0.7 }}>
        <rect x="510" y="170" width="118" height="72" rx="12" fill={colors.white} />
        <path d="M535 198h68M535 218h42" stroke={colors.forest} strokeWidth="5" strokeLinecap="round" />
        <path d="M535 242l-14 18 35-18" fill={colors.white} />
      </motion.g>
      <PulseDot cx={570} cy={360} gold />
      <PulseDot cx={610} cy={404} delay={0.35} />
      <DrawPath d="M438 390C500 390 508 360 563 360M577 365l27 34" delay={0.7} stroke={colors.gold} />
    </>
  );
}

function ProcurementScene() {
  const reduceMotion = useReducedMotion();
  const nodes = [[130, 160], [330, 105], [545, 175], [175, 430], [365, 500], [565, 410]];

  return (
    <>
      <SceneGrid />
      <DrawPath d="M130 160C220 160 240 105 330 105S455 175 545 175M545 175C545 280 565 305 565 410M565 410C480 410 450 500 365 500S260 430 175 430M175 430C175 320 130 280 130 160" delay={0.1} stroke={colors.teal} strokeWidth={4} />
      {nodes.map(([cx, cy], index) => (
        <motion.g key={`${cx}-${cy}`} initial={reduceMotion ? false : { opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18 + index * 0.08, type: "spring", stiffness: 150, damping: 14 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <circle cx={cx} cy={cy} r="27" fill={index % 3 === 0 ? colors.gold : colors.forest} stroke={colors.white} strokeWidth="2" />
          <circle cx={cx} cy={cy} r="7" fill={colors.white} />
        </motion.g>
      ))}
      <motion.g initial={reduceMotion ? false : { opacity: 0, y: 35, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <path d="M250 245h218l-24 150H278z" fill={colors.deep} stroke={colors.gold} strokeWidth="5" strokeLinejoin="round" />
        <path d="M298 245c0-58 25-92 61-92s61 34 61 92" fill="none" stroke={colors.white} strokeWidth="8" strokeLinecap="round" />
        <path d="M302 290h140M302 328h140M302 366h92" stroke={colors.teal} strokeWidth="7" strokeLinecap="round" />
        <circle cx="419" cy="366" r="17" fill={colors.gold} />
        <DrawPath d="M411 366l7 8 13-18" delay={0.85} stroke={colors.deep} strokeWidth={4} />
      </motion.g>
      <motion.path d="M104 300h76l-18-18m18 18l-18 18" fill="none" stroke={colors.gold} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" animate={reduceMotion ? undefined : { x: [0, 18, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} />
      <motion.path d="M520 300h76l-18-18m18 18l-18 18" fill="none" stroke={colors.gold} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" animate={reduceMotion ? undefined : { x: [0, 18, 0] }} transition={{ duration: 2.4, delay: 0.5, repeat: Infinity, ease: "easeInOut" }} />
    </>
  );
}

function DataProcessingScene() {
  const reduceMotion = useReducedMotion();
  const packetRoutes = [
    {
      path: "M330 287C420 287 430 180 520 180",
      color: colors.gold,
      restingX: 420,
      restingY: 236,
      duration: 2.8,
      delay: 0,
    },
    {
      path: "M330 335H500",
      color: colors.teal,
      restingX: 415,
      restingY: 335,
      duration: 2.3,
      delay: -0.75,
    },
    {
      path: "M330 380C430 380 420 470 520 470",
      color: colors.gold,
      restingX: 420,
      restingY: 425,
      duration: 3,
      delay: -1.4,
    },
  ];

  return (
    <>
      <SceneGrid />
      <motion.g initial={reduceMotion ? false : { opacity: 0, x: -45 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}>
        {[0, 1, 2].map((index) => (
          <g key={index} transform={`translate(0 ${index * 92})`}>
            <ellipse cx="210" cy="198" rx="105" ry="35" fill={index === 0 ? colors.gold : colors.teal} />
            <path d="M105 198v58c0 20 47 36 105 36s105-16 105-36v-58" fill={colors.deep} stroke={colors.teal} strokeWidth="3" />
            <path d="M105 198c0 20 47 36 105 36s105-16 105-36" fill="none" stroke={colors.white} strokeOpacity="0.7" strokeWidth="3" />
          </g>
        ))}
      </motion.g>
      <DrawPath d="M330 287C420 287 430 180 520 180M330 380C430 380 420 470 520 470M330 335h170" delay={0.35} stroke={colors.gold} strokeWidth={4} />
      <motion.g initial={reduceMotion ? false : { opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.8 }}>
        <rect x="500" y="115" width="130" height="130" rx="18" fill={colors.forest} stroke={colors.teal} strokeWidth="3" />
        <rect x="500" y="405" width="130" height="130" rx="18" fill={colors.forest} stroke={colors.teal} strokeWidth="3" />
        <path d="M530 150h70M530 180h48M530 210h85M530 440h70M530 470h85M530 500h52" stroke={colors.white} strokeWidth="7" strokeLinecap="round" />
      </motion.g>
      {packetRoutes.map((route) => (
        <rect
          key={route.path}
          x={reduceMotion ? route.restingX - 9 : -9}
          y={reduceMotion ? route.restingY - 9 : -9}
          width="18"
          height="18"
          rx="3"
          fill={route.color}
        >
          {!reduceMotion && (
            <animateMotion
              path={route.path}
              dur={`${route.duration}s`}
              begin={`${route.delay}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;1"
              keySplines="0.4 0 0.2 1"
            />
          )}
          {!reduceMotion && (
            <animate
              attributeName="opacity"
              values="0.45;1;0.45"
              dur={`${route.duration}s`}
              begin={`${route.delay}s`}
              repeatCount="indefinite"
            />
          )}
        </rect>
      ))}
      <PulseDot cx={330} cy={335} gold />
      <PulseDot cx={500} cy={335} delay={0.4} />
    </>
  );
}

function InfrastructureScene() {
  const reduceMotion = useReducedMotion();
  const racks = [165, 305, 445];

  return (
    <>
      <SceneGrid />
      <DrawPath d="M100 500h500M165 500V190M305 500V125M445 500V215M165 155C230 80 382 75 445 180" delay={0.1} stroke={colors.teal} strokeWidth={4} />
      {racks.map((x, rackIndex) => (
        <motion.g key={x} initial={reduceMotion ? false : { opacity: 0, y: 70 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 + rackIndex * 0.12, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}>
          <rect x={x - 55} y={240 - rackIndex * 20} width="110" height={260 + rackIndex * 20} rx="12" fill={colors.deep} stroke={rackIndex === 1 ? colors.gold : colors.teal} strokeWidth="4" />
          {[0, 1, 2, 3].map((row) => (
            <g key={row}>
              <rect x={x - 37} y={270 - rackIndex * 20 + row * 49} width="74" height="28" rx="5" fill={row === rackIndex ? colors.forest : colors.white} fillOpacity={row === rackIndex ? 1 : 0.88} />
              <circle cx={x + 23} cy={284 - rackIndex * 20 + row * 49} r="4" fill={row === rackIndex ? colors.gold : colors.teal} />
            </g>
          ))}
        </motion.g>
      ))}
      <motion.g initial={reduceMotion ? false : { opacity: 0, scale: 0.72 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: "spring", stiffness: 130, damping: 15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <path d="M246 145c5-42 38-69 79-60 20-38 86-24 89 24 44 0 57 62 17 79H270c-44-8-52-40-24-43z" fill={colors.forest} stroke={colors.white} strokeWidth="4" />
        <path d="M305 142h72M341 112v60" stroke={colors.gold} strokeWidth="6" strokeLinecap="round" />
      </motion.g>
      {racks.map((x, index) => <PulseDot key={x} cx={x} cy={520} delay={index * 0.35} gold={index === 1} />)}
    </>
  );
}

function FraudScene() {
  const reduceMotion = useReducedMotion();
  const nodes = [[115, 180], [105, 430], [580, 150], [595, 440], [350, 82], [350, 548]];

  return (
    <>
      <SceneGrid />
      <circle cx="350" cy="315" r="218" fill="none" stroke={colors.teal} strokeOpacity="0.28" strokeWidth="2" />
      <circle cx="350" cy="315" r="156" fill="none" stroke={colors.teal} strokeOpacity="0.42" strokeWidth="2" />
      <path
        d="M350 315L350 96A219 219 0 0 1 540 425z"
        fill={colors.teal}
        fillOpacity="0.1"
      >
        {!reduceMotion && (
          <animate
            attributeName="fill-opacity"
            values="0.05;0.16;0.05"
            dur="3.4s"
            repeatCount="indefinite"
          />
        )}
      </path>
      {nodes.map(([x, y], index) => (
        <g key={`${x}-${y}`}>
          <DrawPath d={`M350 315L${x} ${y}`} delay={0.12 + index * 0.06} stroke={index === 3 ? colors.gold : colors.teal} strokeWidth={2} />
          <PulseDot cx={x} cy={y} delay={index * 0.22} gold={index === 3} />
        </g>
      ))}
      <motion.g initial={reduceMotion ? false : { opacity: 0, scale: 0.72 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 125, damping: 14 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <path d="M350 145l128 52v95c0 91-52 166-128 198-76-32-128-107-128-198v-95z" fill={colors.deep} stroke={colors.gold} strokeWidth="6" strokeLinejoin="round" />
        <path d="M296 306l35 37 78-91" fill="none" stroke={colors.white} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
      <motion.g
        initial={reduceMotion ? false : { opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.75, duration: 0.55 }}
      >
        <circle cx="595" cy="440" r="34" fill={colors.gold} />
        <path d="M595 423v22M595 457v2" stroke={colors.deep} strokeWidth="8" strokeLinecap="round" />
      </motion.g>
    </>
  );
}

export function ServiceSelectorIcon({ id, active, className }: { id: ServiceVisualId; active: boolean; className?: string }) {
  const reduceMotion = useReducedMotion();
  const common = {
    initial: false as const,
    animate: { pathLength: active ? 1 : 0.62, opacity: active ? 1 : 0.72 },
    transition: { duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <motion.svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("size-6 overflow-visible", className)}
      animate={reduceMotion ? undefined : { scale: active ? 1.08 : 1 }}
      transition={{ duration: 0.35 }}
    >
      {id === 1 && <><motion.path {...common} d="M7 17v-2a9 9 0 0118 0v2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><motion.path {...common} d="M7 17v7h4v-8H8m17 1v5c0 4-3 6-7 6h-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>}
      {id === 2 && <><motion.path {...common} d="M6 8h4l2 13h12l2-9H11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><motion.circle cx="14" cy="26" r="1.8" fill="currentColor" /><motion.circle cx="23" cy="26" r="1.8" fill="currentColor" /></>}
      {id === 3 && <><motion.ellipse {...common} cx="16" cy="8" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="2" /><motion.path {...common} d="M6 8v8c0 2 4 4 10 4s10-2 10-4V8m-20 8v8c0 2 4 4 10 4s10-2 10-4v-8" fill="none" stroke="currentColor" strokeWidth="2" /></>}
      {id === 4 && <><motion.rect {...common} x="6" y="5" width="20" height="22" rx="3" fill="none" stroke="currentColor" strokeWidth="2" /><motion.path {...common} d="M10 11h12M10 17h12M10 23h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>}
      {id === 5 && <><motion.path {...common} d="M16 4l10 4v7c0 7-4 12-10 14C10 27 6 22 6 15V8z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><motion.path {...common} d="M11 16l3 3 7-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></>}
    </motion.svg>
  );
}

export default function ServiceAnimatedScene({ id, className }: { id: ServiceVisualId; className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn("relative aspect-[7/6] w-full max-w-[720px]", className)}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg viewBox="0 0 700 620" className="h-full w-full overflow-visible" aria-hidden="true">
        {id === 1 && <ContactCenterScene />}
        {id === 2 && <ProcurementScene />}
        {id === 3 && <DataProcessingScene />}
        {id === 4 && <InfrastructureScene />}
        {id === 5 && <FraudScene />}
      </svg>
    </motion.div>
  );
}
