"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ImagesBadge } from "@/components/ui/images-badge";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import Icon, { IconName } from "../ui/Icon";
import DDCLogo from "../ui/DDCLogo";

type FooterLink = {
  name: string;
  href: string;
  external?: boolean;
  icon?: IconName;
};

const footerSections: { title: string; links: FooterLink[] }[] = [
  {
    title: "Pages",
    links: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Services", href: "/services" },
      { name: "Mission", href: "/mission" },
      { name: "News", href: "/news" },
      { name: "Contacts", href: "/contact" },
    ],
  },
  {
    title: "Socials",
    links: [
      {
        name: "LinkedIn",
        href: "https://www.linkedin.com/company/bank-service-bureau/posts/?feedView=all",
        external: true,
        icon: "linkedin",
      },
      {
        name: "Instagram",
        href: "https://www.instagram.com/ddc.kz",
        external: true,
        icon: "instagram",
      },
      { name: "GitHub", href: "https://github.com/mrnamazbek", external: true },
      { name: "National Bank", href: "https://nationalbank.kz", external: true },
      { name: "Procurement portal", href: "/services#procurement" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy policy", href: "/security" },
      { name: "Terms of use", href: "/security" },
      { name: "Information security", href: "/security" },
      { name: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Contacts",
    links: [
      { name: "1477 Contact Center", href: "tel:1477", external: true },
      { name: "Astana office", href: "/contact#astana" },
      { name: "Almaty hub", href: "/contact#almaty" },
      { name: "Write to DDC", href: "mailto:info@ddc-nbk.kz", external: true },
    ],
  },
];

const proofSignals = [
  {
    name: "Data Factory",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7385921757829808128",
    category: "Data platform",
    source: "LinkedIn",
    description:
      "Industrial data processing capability for National Bank infrastructure, built around governed pipelines and reliable data products.",
    images: [
      "/images/linkedin/post_15_data_factory.jpg",
      "/images/linkedin/post_9_it_architecture.jpg",
      "/images/nbk_architecture.png",
    ],
  },
  {
    name: "Key National Bank Projects",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7384573685673840640",
    category: "Core systems",
    source: "LinkedIn",
    description: "A public proof point for the Center's role in complex, high-stakes systems across the financial regulator's ecosystem.",
    images: [
      "/images/linkedin/post_16_key_projects.jpg",
      "/images/linkedin/post_1_digital_services.jpg",
      "/images/linkedin/post_13_kfgd_automation.jpg",
    ],
  },
  {
    name: "AI Platform Discussions",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7473705322331791361",
    category: "AI adoption",
    source: "LinkedIn",
    description: "Internal AI capability building and practical adoption of generative technologies for public-sector digital work.",
    images: [
      "/images/linkedin/post_0_ai_platform.jpg",
      "/images/linkedin/post_11_llm_learning.jpg",
      "/images/linkedin/post_6_nfactorial_llm.jpg",
    ],
  },
  {
    name: "KFGD Automation",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7392499128875941889",
    category: "Automation",
    source: "LinkedIn",
    description: "Digital automation work connected to government-financial data exchange and operational reliability.",
    images: [
      "/images/linkedin/post_13_kfgd_automation.jpg",
      "/images/linkedin/post_15_data_factory.jpg",
      "/images/linkedin/post_16_key_projects.jpg",
    ],
  },
  {
    name: "Strategic Dialogue",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7380833625589637120",
    category: "Leadership",
    source: "LinkedIn",
    description: "Leadership and stakeholder meetings that reinforce DDC's connection to the National Bank's digital agenda.",
    images: [
      "/images/linkedin/post_17_suleimenov_meeting.jpg",
      "/images/linkedin/post_10_binur_meeting.jpg",
      "/images/showcase/news-2.jpeg",
    ],
  },
];

const marqueeImages = [
  "/images/showcase/site-preview.jpg",
  "/images/showcase/news-1.jpeg",
  "/images/showcase/news-2.jpeg",
  "/images/showcase/Zhalenov.jpg",
  "/images/showcase/Arinova.jpg",
  "/images/linkedin/post_0_ai_platform.jpg",
  "/images/linkedin/post_1_digital_services.jpg",
  "/images/linkedin/post_9_it_architecture.jpg",
  "/images/linkedin/post_10_binur_meeting.jpg",
  "/images/linkedin/post_11_llm_learning.jpg",
  "/images/linkedin/post_13_kfgd_automation.jpg",
  "/images/linkedin/post_15_data_factory.jpg",
  "/images/linkedin/post_16_key_projects.jpg",
  "/images/linkedin/post_17_suleimenov_meeting.jpg",
  "/images/3d/tenge-coin-gold.webp",
  "/images/3d/shanyrak-gold.webp",
  "/images/saka_core_render.png",
  "/images/backgrounds/liquid_glass_flow.png",
];

function FooterAnchor({ link }: { link: FooterLink }) {
  const className =
    "group/link inline-flex min-h-12 items-center gap-2 py-1 text-[15px] font-medium text-zinc-400 transition-colors duration-300 hover:text-white";

  if (link.external) {
    return (
      <a href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={className}>
        {link.icon && <Icon name={link.icon} size={17} className="text-gold/90" animate={false} />}
        {link.name}
        <Icon
          name="arrow-up-right"
          size={14}
          className="opacity-0 -translate-x-1 translate-y-1 text-gold transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:translate-y-0 group-hover/link:opacity-100"
        />
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.icon && <Icon name={link.icon} size={17} className="text-gold/90" animate={false} />}
      {link.name}
      <Icon
        name="arrow-up-right"
        size={14}
        className="opacity-0 -translate-x-1 translate-y-1 text-gold transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:translate-y-0 group-hover/link:opacity-100"
      />
    </Link>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const reduce = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useSpring(useTransform(mouseX, (value) => value - 180), { stiffness: 90, damping: 28 });
  const glowY = useSpring(useTransform(mouseY, (value) => value - 180), { stiffness: 90, damping: 28 });

  return (
    <motion.footer
      className="site-footer relative overflow-hidden border-t border-transparent bg-[#030504] px-[clamp(18px,5vw,84px)] py-20 text-white"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        mouseX.set(event.clientX - rect.left);
        mouseY.set(event.clientY - rect.top);
      }}
      initial={false}
      whileInView={reduce ? undefined : { opacity: 1 }}
      viewport={{ once: true, margin: "-120px" }}
    >
      <motion.div
        className="site-footer-glow pointer-events-none absolute z-0 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(216,169,62,0.2),rgba(26,99,71,0.12)_42%,transparent_70%)] blur-2xl"
        style={{ x: glowX, y: glowY }}
      />
      <div className="site-footer-media pointer-events-none absolute inset-0 z-0 opacity-60">
        <ThreeDMarquee images={marqueeImages} />
      </div>
      <div className="site-footer-wash pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_24%_18%,rgba(216,169,62,0.12),transparent_28%),linear-gradient(180deg,rgba(3,5,4,0.76),#030504_66%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/70 via-background/25 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1500px]">
        <motion.div
          className="grid gap-12 border-b border-white/[0.035] pb-16 lg:grid-cols-[1.35fr_2fr]"
          initial={reduce ? false : { opacity: 0, y: 28, filter: "blur(10px)" }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="max-w-xl">
            <Link href="/" className="mb-8 inline-flex items-center gap-4 select-none">
              <span className="site-footer-logo-tile grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white text-[#07100c] shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
                <DDCLogo className="h-7 w-[26px]" />
              </span>
              <span>
                <span className="block text-xl font-bold tracking-tight text-white">DDC</span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.32em] text-gold">
                  Digital Development Center
                </span>
              </span>
            </Link>

            <h2 className="text-balance font-heading text-[clamp(2.3rem,5vw,5.8rem)] font-semibold leading-[0.88] tracking-[-0.045em]">
              The digital core of Kazakhstan&apos;s financial system.
            </h2>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-zinc-400">
              We design, build and maintain the technological platforms behind the National Bank&apos;s digital
              infrastructure, from data systems to public-facing services.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
            {footerSections.map((section, index) => (
              <motion.nav
                key={section.title}
                initial={reduce ? false : { opacity: 0, y: 22 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="mb-5 text-sm font-semibold text-zinc-100">{section.title}</h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <FooterAnchor link={link} />
                    </li>
                  ))}
                </ul>
              </motion.nav>
            ))}
          </div>
        </motion.div>

        <motion.section
          className="relative grid gap-5 border-b border-white/[0.035] py-12 lg:grid-cols-[0.7fr_1.3fr]"
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.34em] text-gold">Company proof</p>
            <h3 className="mt-4 max-w-sm font-heading text-3xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
              Public signals from DDC&apos;s digital delivery work.
            </h3>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {proofSignals.map((signal, index) => (
              <motion.article
                key={signal.name}
                className="site-footer-repo-card group relative min-h-[230px] overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-white/[0.035] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl"
                initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.62, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                whileHover={reduce ? undefined : { y: -6, rotateX: 2, rotateY: index % 2 === 0 ? -2 : 2 }}
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(216,169,62,0.16),transparent_42%)]" />
                </div>
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold/85">{signal.category}</p>
                      <a
                        href={signal.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex min-h-12 items-center gap-2 py-1 text-xl font-semibold tracking-[-0.02em] text-white"
                      >
                        {signal.name}
                        <Icon name="arrow-up-right" size={16} className="text-gold" />
                      </a>
                    </div>
                    <Icon name="linkedin" size={24} className="opacity-70" animate={false} />
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-400">{signal.description}</p>
                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/[0.035] pt-4">
                    <span className="text-xs text-zinc-500">Source: {signal.source}</span>
                    <ImagesBadge
                      text="Preview"
                      href={signal.href}
                      target="_blank"
                      images={signal.images}
                      folderSize={{ width: 30, height: 23 }}
                      teaserImageSize={{ width: 19, height: 13 }}
                      hoverImageSize={{ width: 52, height: 34 }}
                      hoverTranslateY={-42}
                      hoverSpread={24}
                    />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <div className="relative flex flex-col gap-8 pt-10 md:flex-row md:items-end md:justify-between">
          <div className="text-sm text-zinc-500">
            <p>© {currentYear} АО «Центр цифрового развития Национального Банка РК».</p>
            <p className="mt-2 text-xs text-zinc-600">
              Официальный технологический центр Национального Банка Республики Казахстан.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {["Data", "Platforms", "Security", "Public Services"].map((item) => (
              <span key={item} className="site-footer-token rounded-full border border-white/[0.08] bg-white/[0.035] px-4 py-2 text-xs text-zinc-400">
                {item}
              </span>
            ))}
          </div>
        </div>

        <motion.div
          className="site-footer-watermark pointer-events-none -mb-16 mt-8 select-none text-center font-heading text-[clamp(5rem,18vw,19rem)] font-black leading-none tracking-[-0.08em] text-white/[0.035]"
          initial={reduce ? false : { opacity: 0, y: 50 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          DDC
        </motion.div>
      </div>
    </motion.footer>
  );
}
