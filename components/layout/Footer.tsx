"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import { TextRollHover } from "@/components/ui/text-roll-hover";
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
        href: "https://www.instagram.com/ddc_nbk/",
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

// No real faces here on purpose — this marquee is ambient background texture
// behind the whole footer, not a "meet the team" moment, so it sticks to
// screenshots and abstract/brand renders instead of photos of people.
const marqueeImages = [
  "/images/showcase/site-preview.jpg",
  "/images/3d/tenge-coin-gold.webp",
  "/images/linkedin/post_1_digital_services.jpg",
  "/images/3d/shanyrak-gold.webp",
  "/images/linkedin/post_9_it_architecture.jpg",
  "/images/3d/burkit-eagle-gold.webp",
  "/images/linkedin/post_11_llm_learning.jpg",
  "/images/saka_core_render.png",
  "/images/linkedin/post_13_kfgd_automation.jpg",
  "/images/saka_refractive_glass.png",
  "/images/linkedin/post_15_data_factory.jpg",
  "/images/medallion-poster.png",
  "/images/linkedin/post_16_key_projects.jpg",
  "/images/nbk_architecture.png",
  "/images/backgrounds/liquid_glass_flow.png",
  "/images/backgrounds/steppe-horizon-abstract.png",
  "/images/textures/ornament-divider-gold.png",
];

function FooterAnchor({ link }: { link: FooterLink }) {
  const [hovered, setHovered] = useState(false);
  const className =
    "group/link inline-flex min-h-12 items-center gap-2 py-1 text-[15px] font-medium text-zinc-400 transition-colors duration-300 hover:text-white";

  if (link.external) {
    return (
      <a
        href={link.href}
        target={link.href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className={className}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {link.icon && <Icon name={link.icon} size={17} className="text-gold/90" animate={false} />}
        <TextRollHover
          text={link.name}
          as="span"
          fontSize="15px"
          hovered={hovered}
          hoverColor="#ffffff"
          color="currentColor"
        />
        <Icon
          name="arrow-up-right"
          size={14}
          className="opacity-0 -translate-x-1 translate-y-1 text-gold transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:translate-y-0 group-hover/link:opacity-100"
        />
      </a>
    );
  }

  return (
    <Link
      href={link.href}
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {link.icon && <Icon name={link.icon} size={17} className="text-gold/90" animate={false} />}
      <TextRollHover
        text={link.name}
        as="span"
        fontSize="15px"
        hovered={hovered}
        hoverColor="#ffffff"
        color="currentColor"
      />
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
  const t = useTranslations("Footer");

  return (
    <motion.footer
      className="site-footer relative overflow-hidden border-t border-transparent bg-[#030504] px-[clamp(18px,5vw,84px)] py-14 sm:py-20 text-white"
      initial={false}
      whileInView={reduce ? undefined : { opacity: 1 }}
      viewport={{ once: true, margin: "-120px" }}
    >
      <div className="site-footer-media pointer-events-none absolute inset-0 z-0 opacity-60">
        <ThreeDMarquee images={marqueeImages} />
      </div>
      <div className="site-footer-wash pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(3,5,4,0.78),#030504_66%)]" />

      <div className="relative z-10 mx-auto max-w-[1500px]">
        <motion.div
          className="grid gap-10 sm:gap-12 border-b border-white/[0.035] pb-10 sm:pb-16 lg:grid-cols-[1.35fr_2fr]"
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

        <motion.div
          className="relative flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.035] py-6"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.34em] text-gold">Built by Namazbek</p>
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/mrnamazbek"
              target="_blank"
              rel="noopener noreferrer"
              className="group/credit inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-zinc-400 transition-colors duration-300 hover:text-white"
            >
              <Icon name="github" size={16} className="text-gold/90" animate={false} />
              GitHub
              <Icon
                name="arrow-up-right"
                size={12}
                className="opacity-0 -translate-x-1 translate-y-1 text-gold transition-all duration-300 group-hover/credit:translate-x-0 group-hover/credit:translate-y-0 group-hover/credit:opacity-100"
              />
            </a>
            <a
              href="https://www.linkedin.com/feed/update/urn:li:activity:7385921757829808128"
              target="_blank"
              rel="noopener noreferrer"
              className="group/credit inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-zinc-400 transition-colors duration-300 hover:text-white"
            >
              <Icon name="linkedin" size={16} className="text-gold/90" animate={false} />
              See the work
              <Icon
                name="arrow-up-right"
                size={12}
                className="opacity-0 -translate-x-1 translate-y-1 text-gold transition-all duration-300 group-hover/credit:translate-x-0 group-hover/credit:translate-y-0 group-hover/credit:opacity-100"
              />
            </a>
          </div>
        </motion.div>

        <div className="relative flex flex-col gap-8 pt-8 sm:pt-10 md:flex-row md:items-end md:justify-between">
          <div className="text-sm text-zinc-500">
            <p>{t("copyright", { year: currentYear })}</p>
            <p className="mt-2 text-xs text-zinc-600">
              {t("legalLine")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {[t("tagData"), t("tagPlatforms"), t("tagSecurity"), t("tagPublicServices")].map((item) => (
              <span key={item} className="site-footer-token whitespace-nowrap rounded-full border border-white/[0.08] bg-white/[0.035] px-4 py-2 text-xs text-zinc-400">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Watermark wrapper with controlled height to prevent empty space under footer */}
        <div className="site-footer-watermark-wrap relative w-full h-[clamp(3.5rem,8vw,7rem)] overflow-hidden mt-6 pointer-events-none select-none">
          <motion.div
            className="site-footer-watermark pointer-events-none absolute inset-x-0 top-0 text-center font-heading text-[clamp(5rem,18vw,19rem)] font-black leading-none tracking-[-0.08em] text-white/[0.035]"
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            DDC
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
}
