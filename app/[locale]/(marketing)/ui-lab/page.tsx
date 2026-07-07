"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";
import Icon, { type IconName } from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";
import { KazakhstanMap } from "@/components/ui/kazakhstan-map";
import { cn } from "@/lib/utils";
import BezierText from "@/components/ui/BezierText";

const easeOut = [0.16, 1, 0.3, 1] as const;

type LabSource = {
  name: string;
  server: string;
  status: "Live now" | "Restart Codex" | "Research input";
  icon: IconName;
  use: string;
};

type PreviewItem = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  tags: string[];
  icon: IconName;
};

type Pattern = {
  title: string;
  category: string;
  icon: IconName;
  rationale: string;
  evidence: string;
};

type TechLogo = {
  name: string;
  icon: IconName;
  role: string;
};

const labSources: LabSource[] = [
  {
    name: "Lazyweb",
    server: "lazyweb",
    status: "Live now",
    icon: "eye",
    use: "Reference mining for nav previews, bento dashboards, dark fintech pages and office maps.",
  },
  {
    name: "Playwright",
    server: "playwright",
    status: "Live now",
    icon: "check-circle",
    use: "Visual QA, console checks, responsive screenshots and interaction testing.",
  },
  {
    name: "Shaders",
    server: "shaders.com/mcp",
    status: "Restart Codex",
    icon: "palette",
    use: "Cursor-reactive dot fields, shader presets and motion backgrounds.",
  },
  {
    name: "shadcn/ui",
    server: "shadcn mcp",
    status: "Restart Codex",
    icon: "layers",
    use: "Navigation menu, hover card, command palette, tabs, drawer and dialog components.",
  },
  {
    name: "Motion",
    server: "motion.so/mcp",
    status: "Restart Codex",
    icon: "zap",
    use: "Scroll reveals, layout morphs, SVG path drawing and reduced-motion variants.",
  },
  {
    name: "21st.dev Magic",
    server: "@21st-dev/magic",
    status: "Restart Codex",
    icon: "development",
    use: "Premium block inspiration and production-ready component candidates.",
  },
  {
    name: "Figma",
    server: "mcp.figma.com",
    status: "Restart Codex",
    icon: "compass",
    use: "Design system extraction, variable sync and implementation comparison.",
  },
  {
    name: "SVGL",
    server: "web/API reference",
    status: "Research input",
    icon: "github",
    use: "Official SVG technology marks for stack pages and animated logo strips.",
  },
];

const previewItems: PreviewItem[] = [
  {
    id: "mcp-sources",
    label: "MCP Sources",
    eyebrow: "Inventory",
    title: "All creative servers in one testing bench",
    description: "Compare what each server contributes before promoting a pattern into the production site.",
    href: "#mcp-sources",
    tags: ["Shaders", "Motion", "21st.dev"],
    icon: "server",
  },
  {
    id: "preview-nav",
    label: "Preview Nav",
    eyebrow: "Navigation",
    title: "Hover cards that explain the section before click",
    description: "The card appears near the section origin, stays clickable, and preserves the premium glass language.",
    href: "#preview-nav",
    tags: ["Hover", "Intent", "A11y"],
    icon: "compass",
  },
  {
    id: "office-map",
    label: "Office Map",
    eyebrow: "Kazakhstan",
    title: "Gold-lit Kazakhstan border with real office pins",
    description: "Astana and Almaty previews open Google Maps or 2GIS in a new tab.",
    href: "#office-map",
    tags: ["Astana", "Almaty", "2GIS"],
    icon: "map-pin",
  },
  {
    id: "motion-system",
    label: "Motion System",
    eyebrow: "Animation",
    title: "Scroll and pointer motion without losing trust",
    description: "Enterprise motion should feel precise: small delays, clear exits, and reduced-motion support.",
    href: "#motion-system",
    tags: ["Scroll", "SVG", "Cursor"],
    icon: "zap",
  },
  {
    id: "tech-logos",
    label: "Tech Logos",
    eyebrow: "SVGL",
    title: "Animated stack marks for the services pages",
    description: "Official-style logos can be pulled from SVGL, then animated with stroke, pulse and orbit states.",
    href: "#tech-logos",
    tags: ["Stack", "SVG", "Trust"],
    icon: "kubernetes",
  },
  {
    id: "bezier-text",
    label: "Bezier Text",
    eyebrow: "Bezier Curve",
    title: "Interactive text path editing",
    description: "Bezier curve editor that draws SVG path on-the-fly and lets text float along the path.",
    href: "#bezier-text",
    tags: ["Bezier", "SVG", "Editor"],
    icon: "layers",
  },
];

const patterns: Pattern[] = [
  {
    title: "Premium hover preview navbar",
    category: "Navigation",
    icon: "compass",
    rationale: "Useful for a public institution site because users can preview complex sections without committing to a click.",
    evidence: "Lazyweb references favored structured preview cards and persistent navigation for dense fintech pages.",
  },
  {
    title: "Dark bento command center",
    category: "Dashboard",
    icon: "database",
    rationale: "Turns services, systems and contact-center numbers into scannable operational intelligence.",
    evidence: "Analytics/security dashboards use metric cards, small charts and clear status labels for trust.",
  },
  {
    title: "Kazakhstan-first map layer",
    category: "Offices",
    icon: "map-pin",
    rationale: "Replaces generic global network visuals with a national, location-aware story.",
    evidence: "Office-location pages perform best when pins, address previews and map links are visible together.",
  },
  {
    title: "Cursor-reactive dot shader",
    category: "Background",
    icon: "palette",
    rationale: "Gives the Secured Finance particle feeling without copying its colors or financial message.",
    evidence: "Shader and particle backgrounds should sit behind legible text, with opacity and reduced-motion controls.",
  },
  {
    title: "Scroll-safe object morphs",
    category: "3D Motion",
    icon: "globe",
    rationale: "The 3D element should stay anchored while its points, scale and mask morph across scroll ranges.",
    evidence: "The strongest scroll sites separate camera transforms from content reveals so the object never feels lost.",
  },
  {
    title: "Animated SVG stack strip",
    category: "Technology",
    icon: "zap",
    rationale: "Official tech marks add credibility, but animation must be subtle enough for a National Bank context.",
    evidence: "Logo strips work best as ambient proof points, not as oversized decorations.",
  },
];

const techLogos: TechLogo[] = [
  { name: "Java", icon: "java", role: "Core platforms" },
  { name: "PostgreSQL", icon: "postgresql", role: "Operational data" },
  { name: "Kafka", icon: "kafka", role: "Event streams" },
  { name: "Kubernetes", icon: "kubernetes", role: "Platform runtime" },
  { name: "Docker", icon: "docker", role: "Delivery" },
  { name: "Python", icon: "python", role: "Automation" },
  { name: "Prometheus", icon: "prometheus", role: "Monitoring" },
  { name: "GitLab", icon: "gitlab", role: "DevSecOps" },
  { name: "Terraform", icon: "terraform", role: "Infrastructure" },
  { name: "Redis", icon: "redis", role: "Fast state" },
  { name: "ClickHouse", icon: "clickhouse", role: "Analytics" },
  { name: "Airflow", icon: "airflow", role: "Data flows" },
];

const metrics = [
  { value: "50 / 24", label: "Information systems", detail: "Built / operating today" },
  { value: "1477", label: "Contact center", detail: "Toll-free support number" },
  { value: "2020", label: "Procurement portal", detail: "Unified state portal launched" },
  { value: "2", label: "Office hubs", detail: "Astana and Almaty" },
];

function CursorDotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let frame = 0;
    let raf = 0;
    let width = 0;
    let height = 0;
    const pointer = { x: -9999, y: -9999 };
    const dots: { x: number; y: number; ox: number; oy: number; phase: number; radius: number }[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots.length = 0;

      const gap = width < 760 ? 32 : 24;
      for (let y = -gap; y < height + gap; y += gap) {
        for (let x = -gap; x < width + gap; x += gap) {
          const wave = Math.sin(x * 0.015) * 28 + Math.cos(y * 0.012) * 18;
          const ox = x + wave;
          const oy = y + Math.sin((x + y) * 0.01) * 18;
          dots.push({
            x: ox,
            y: oy,
            ox,
            oy,
            phase: (x + y) * 0.02,
            radius: 0.75 + ((x + y) % 5) * 0.12,
          });
        }
      }
    };

    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };

    const leave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const draw = () => {
      frame += reduceMotion ? 0 : 0.012;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (const dot of dots) {
        const dx = dot.ox - pointer.x;
        const dy = dot.oy - pointer.y;
        const dist = Math.max(1, Math.hypot(dx, dy));
        const force = Math.max(0, 1 - dist / 190);
        const drift = reduceMotion ? 0 : Math.sin(frame + dot.phase) * 7;
        dot.x += (dot.ox + (dx / dist) * force * 28 + drift - dot.x) * 0.08;
        dot.y += (dot.oy + (dy / dist) * force * 22 + Math.cos(frame + dot.phase) * 4 - dot.y) * 0.08;

        const alpha = 0.14 + force * 0.5 + Math.sin(frame + dot.phase) * 0.04;
        ctx.beginPath();
        ctx.fillStyle = `rgba(232, 200, 122, ${alpha})`;
        ctx.arc(dot.x, dot.y, dot.radius + force * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">{eyebrow}</span>
      <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl">{title}</h2>
      <p className="mx-auto mt-4 text-sm leading-7 text-white/68 sm:text-base">{children}</p>
    </div>
  );
}

function PreviewNavigation({ items }: { items: PreviewItem[] }) {
  const [active, setActive] = useState(items[0]);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <GlassCard hoverAccent="gold" variant="liquid-strong" className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1.5">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onMouseEnter={() => setActive(item)}
              onFocus={() => setActive(item)}
              className={cn(
                "group relative rounded-full px-4 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                active.id === item.id ? "text-black" : "text-white/72 hover:text-white"
              )}
            >
              {active.id === item.id && (
                <motion.span
                  layoutId="ui-lab-nav-pill"
                  className="absolute inset-0 rounded-full bg-gold"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </a>
          ))}
        </div>

        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 16, rotateX: -8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.35, ease: easeOut }}
          className="mt-5 overflow-hidden rounded-lg border border-gold/25 bg-[#050807]/95 p-5 text-left shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-gold/25 bg-gold/10 text-gold">
              <Icon name={active.icon} size={21} animate={false} />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold">{active.eyebrow}</p>
              <h3 className="text-lg font-semibold text-white">{active.title}</h3>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/66">{active.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {active.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/68">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-xs font-semibold text-gold">
            Click opens the section
            <Icon name="arrow-right" size={14} animate={false} />
          </div>
        </motion.div>
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.slice(1).map((item, index) => (
          <motion.a
            key={item.id}
            href={item.href}
            onMouseEnter={() => setActive(item)}
            onFocus={() => setActive(item)}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.35, delay: index * 0.05, ease: easeOut }}
            className="group rounded-lg border border-white/10 bg-white/[0.035] p-5 text-left transition-colors hover:border-gold/35 hover:bg-gold/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <Icon name={item.icon} size={22} className="text-gold" animate={false} />
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.22em] text-white/42">{item.eyebrow}</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{item.label}</h3>
            <p className="mt-2 text-sm leading-6 text-white/58">{item.description}</p>
          </motion.a>
        ))}
      </div>
    </div>
  );
}

export default function UiLabPage() {
  const locale = useLocale();
  const localizedHome = `/${locale}`;
  const restartCount = labSources.filter((source) => source.status === "Restart Codex").length;
  const liveCount = labSources.filter((source) => source.status === "Live now").length;

  const sourceGroups = useMemo(
    () => ({
      live: labSources.filter((source) => source.status === "Live now"),
      restart: labSources.filter((source) => source.status === "Restart Codex"),
      research: labSources.filter((source) => source.status === "Research input"),
    }),
    []
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020705] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(180deg,#020705_0%,#06100c_48%,#020705_100%)]" />

      <section className="relative min-h-[92svh] overflow-hidden pt-36 sm:pt-40">
        <CursorDotField />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#020705] via-[#020705]/40 to-transparent" />
        <div className="pointer-events-none absolute left-1/2 top-[56%] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full border border-gold/15 bg-forest-dark/15" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-5 text-center sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="rounded-full border border-gold/25 bg-gold/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gold"
          >
            DDC MCP UI Lab
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: easeOut }}
            className="mt-8 max-w-5xl text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.02em] text-white sm:text-7xl lg:text-8xl"
          >
            Test every serious frontend idea before it enters production.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: easeOut }}
            className="mx-auto mt-7 max-w-3xl text-base leading-8 text-white/68 sm:text-lg"
          >
            This page is a controlled playground for the DDC brand: MCP server ideas, hover previews, shader-like cursor motion,
            Kazakhstan office mapping, animated SVG stack logos and motion patterns that can be promoted into the main site.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18, ease: easeOut }}
            className="mt-9 flex flex-wrap justify-center gap-3"
          >
            <a
              href="#mcp-sources"
              className="rounded-full bg-gold px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Start testing
            </a>
            <a
              href={localizedHome}
              className="rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white/78 transition-colors hover:border-gold/40 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Back to site
            </a>
          </motion.div>

          <div className="mt-12 grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-left backdrop-blur-xl">
                <div className="text-2xl font-semibold text-gold">{metric.value}</div>
                <div className="mt-1 text-sm font-semibold text-white">{metric.label}</div>
                <div className="mt-1 text-xs text-white/48">{metric.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="mcp-sources" className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading eyebrow="01 / MCP inventory" title="A practical bench for every connected creative source">
          The new Gemini MCP entries are now in Codex config, but this running session must be restarted before those new servers appear as callable tools. This lab still shows exactly how each source should be tested.
        </SectionHeading>

        <div className="grid items-start gap-5 lg:grid-cols-3">
          <GlassCard hoverAccent="forest" className="self-start p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold">Callable now</p>
            <div className="mt-4 text-5xl font-semibold text-white">{liveCount}</div>
            <p className="mt-3 text-sm leading-6 text-white/58">Used in this pass for reference evidence and browser QA.</p>
            <div className="mt-6 space-y-3">
              {sourceGroups.live.map((source) => (
                <div key={source.name} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-3">
                  <Icon name={source.icon} size={18} className="text-gold" animate={false} />
                  <div>
                    <p className="text-sm font-semibold text-white">{source.name}</p>
                    <p className="text-xs text-white/45">{source.server}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-2">
            {labSources.map((source, index) => (
              <motion.div
                key={source.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.35, delay: index * 0.035, ease: easeOut }}
                className="rounded-lg border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition-colors hover:border-gold/35 hover:bg-gold/[0.05]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/20 bg-gold/10 text-gold">
                    <Icon name={source.icon} size={20} animate={false} />
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]",
                      source.status === "Live now" && "border border-forest-light/30 bg-forest-light/10 text-forest-light",
                      source.status === "Restart Codex" && "border border-gold/30 bg-gold/10 text-gold",
                      source.status === "Research input" && "border border-white/15 bg-white/[0.05] text-white/62"
                    )}
                  >
                    {source.status}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{source.name}</h3>
                <p className="mt-1 text-xs text-white/42">{source.server}</p>
                <p className="mt-4 text-sm leading-6 text-white/62">{source.use}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-gold/20 bg-gold/[0.06] p-4 text-sm leading-6 text-gold-light">
          Restart note: {restartCount} configured MCP servers need a Codex restart before I can call their tools directly in this thread.
        </div>
      </section>

      <section id="preview-nav" className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading eyebrow="02 / Navbar preview" title="Hover preview that behaves like a product surface">
          Move across the nav chips below. The preview updates on hover and focus, then each item clicks into the matching section. This is the interaction model I would promote into the production header after QA.
        </SectionHeading>
        <PreviewNavigation items={previewItems} />
      </section>

      <section id="patterns" className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading eyebrow="03 / Pattern matrix" title="A/B candidates worth testing on the real site">
          These are the strongest patterns from the current research pass and the local UI/UX skill index. They are intentionally framed as testable design hypotheses.
        </SectionHeading>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {patterns.map((pattern, index) => (
            <motion.article
              key={pattern.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.38, delay: index * 0.045, ease: easeOut }}
              className="group rounded-lg border border-white/10 bg-white/[0.035] p-6 transition-colors hover:border-gold/35 hover:bg-white/[0.06]"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
                  {pattern.category}
                </span>
                <Icon name={pattern.icon} size={22} className="text-gold" animate={false} />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{pattern.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/62">{pattern.rationale}</p>
              <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-white/42">{pattern.evidence}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="bezier-text" className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading eyebrow="04 / Bezier Text Path" title="Interactive Bezier curve with flowing text path">
          This component renders a dynamic SVG path built from customizable Bezier curves. You can toggle path editing and drag the anchors directly to shape the text flow.
        </SectionHeading>
        <BezierText />
      </section>

      <section id="office-map" className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading eyebrow="04 / Kazakhstan map" title="Replace the generic global network with national presence">
          This uses the existing production-grade Kazakhstan SVG map component: gold border draw, Astana and Almaty pins, hover previews, Google Maps links and 2GIS links.
        </SectionHeading>
        <KazakhstanMap />
      </section>

      <section id="motion-system" className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading eyebrow="05 / Motion system" title="Scroll, hover and shader motion as a governed system">
          The goal is not more animation everywhere. The goal is motion that explains information hierarchy, keeps the 3D object stable and respects reduced-motion users.
        </SectionHeading>

        <div className="grid gap-5 lg:grid-cols-3">
          {[
            ["Pinned 3D object", "Keep the particle model fixed in a viewport layer; change its point targets, scale and mask by scroll progress.", "globe" as IconName],
            ["Content reveal lanes", "Text should move in from the side that matches the object direction, with opacity changes separated from position changes.", "layers" as IconName],
            ["Cursor dot shader", "Dots react locally to pointer pressure, then settle back into a calm grid-wave field behind content.", "palette" as IconName],
          ].map(([title, copy, icon], index) => (
            <GlassCard key={title} hoverAccent={index === 1 ? "forest" : "gold"} className="p-6">
              <Icon name={icon as IconName} size={26} className="text-gold" animate={false} />
              <h3 className="mt-5 text-2xl font-semibold text-white">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/62">{copy}</p>
              <motion.div
                className="mt-7 h-2 overflow-hidden rounded-full bg-white/10"
                initial={false}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-gold via-forest-light to-gold"
                  initial={{ width: "12%" }}
                  whileInView={{ width: `${68 + index * 10}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: index * 0.12, ease: easeOut }}
                />
              </motion.div>
            </GlassCard>
          ))}
        </div>
      </section>

      <section id="tech-logos" className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading eyebrow="06 / SVG tech logos" title="Official-looking stack marks with restrained motion">
          The repo already contains many local SVG technology icons. Once the SVGL source pass is approved, these can be checked against official SVGs and animated with stroke draw, pulse and orbit states.
        </SectionHeading>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {techLogos.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.32, delay: index * 0.03, ease: easeOut }}
              whileHover={{ y: -4 }}
              className="group flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-4 transition-colors hover:border-gold/35 hover:bg-gold/[0.055]"
            >
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/30">
                <span className="absolute inset-0 rounded-lg bg-gold/10 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
                <Icon name={tech.icon} size={26} animate={false} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{tech.name}</p>
                <p className="truncate text-xs text-white/44">{tech.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
