"use client";

import React from "react";
import { useTranslations } from "next-intl";
import GlassCard from "@/components/ui/GlassCard";
import Icon, { IconName } from "@/components/ui/Icon";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { useA11y } from "@/components/theme/AccessibilityProvider";
import { cn } from "@/lib/utils";

interface TechItem {
  name: IconName;
  label: string;
}

export default function Technologies() {
  const t = useTranslations("Technologies");
  const { enabled: a11yEnabled } = useA11y();

  const pmTools: TechItem[] = [
    { name: "jira", label: "Jira" },
    { name: "confluence", label: "Confluence" },
    { name: "git", label: "Git" },
    { name: "github", label: "GitHub" },
    { name: "gitlab", label: "GitLab" },
  ];

  const devopsTools: TechItem[] = [
    { name: "kubernetes", label: "Kubernetes" },
    { name: "docker", label: "Docker" },
    { name: "terraform", label: "Terraform" },
    { name: "ansible", label: "Ansible" },
    { name: "nginx", label: "Nginx" },
    { name: "prometheus", label: "Prometheus" },
    { name: "helm", label: "Helm" },
    { name: "grafana", label: "Grafana" },
    { name: "jenkins", label: "Jenkins" },
    { name: "githubactions", label: "GitHub Actions" },
  ];

  const devTools: TechItem[] = [
    { name: "dotnet", label: ".NET Core" },
    { name: "html5", label: "HTML5" },
    { name: "css3", label: "CSS3" },
    { name: "redis", label: "Redis" },
    { name: "grpc", label: "gRPC" },
    { name: "angular", label: "Angular" },
    { name: "nodejs", label: "Node.js" },
    { name: "csharp", label: "C#" },
    { name: "postgresql", label: "PostgreSQL" },
    { name: "javascript", label: "JavaScript" },
    { name: "java", label: "Java" },
    { name: "python", label: "Python" },
    { name: "nats", label: "NATS" },
    { name: "nestjs", label: "NestJS" },
    { name: "typescript", label: "TypeScript" },
    { name: "spring", label: "Spring Boot" },
    { name: "oracle", label: "Oracle" },
    { name: "golang", label: "Go" },
    { name: "graphql", label: "GraphQL" },
    { name: "express", label: "Express" },
  ].map(item => item as TechItem); // Type safety check

  const bottomHighlights = [
    {
      key: "openSource",
      title: t("openSourceTitle"),
      desc: t("openSourceDesc"),
      icon: "code",
    },
    {
      key: "bigData",
      title: t("bigDataTitle"),
      desc: t("bigDataDesc"),
      icon: "database",
    },
    {
      key: "ai",
      title: t("aiTitle"),
      desc: t("aiDesc"),
      icon: "cpu",
    },
  ] satisfies Array<{
    key: string;
    title: string;
    desc: string;
    icon: IconName;
  }>;

  return (
    <section className="relative w-full py-24 bg-transparent overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">

        {/* Header */}
        <div className="max-w-3xl mb-16 text-left">
          <h2 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-white mb-6">
            {t("title")}
          </h2>
          <div className="h-[2px] w-20 bg-gradient-to-r from-forest to-gold" />
        </div>

        {/* Top grids: Project Management & DevOps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Project Management */}
          <GlassCard
            hoverAccent="gold"
            variant="liquid"
            className="lg:col-span-5 p-8 border-glass-border flex flex-col text-left lg:min-h-[280px]"
          >
            <div>
              <h3 className="text-xl font-bold text-white mb-4 tracking-wide">
                {t("pmTitle")}
              </h3>
              <p className="text-sm text-zinc-300 font-light leading-relaxed mb-8">
                {t("pmDesc")}
              </p>
            </div>

            <AnimatedGroup preset="blur-slide" className="flex flex-wrap gap-2 sm:gap-4 items-center">
              {pmTools.map((tech) => (
                <div
                  key={tech.name}
                  className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-charcoal/40 border border-white/5 hover:border-gold-light/25 hover:bg-gold/5 transition-all duration-300 cursor-help"
                  title={tech.label}
                >
                  <Icon name={tech.name} size={28} />
                  <span className="absolute -bottom-8 scale-0 group-hover:scale-100 transition-all duration-200 bg-black/80 text-[10px] text-zinc-200 px-2 py-0.5 rounded border border-white/10 z-20 whitespace-nowrap">
                    {tech.label}
                  </span>
                </div>
              ))}
            </AnimatedGroup>
          </GlassCard>

          {/* DevOps */}
          <GlassCard
            hoverAccent="forest"
            variant="liquid"
            className="lg:col-span-7 p-8 border-glass-border flex flex-col text-left lg:min-h-[280px]"
          >
            <div>
              <h3 className="text-xl font-bold text-white mb-4 tracking-wide">
                {t("devopsTitle")}
              </h3>
              <p className="text-sm text-zinc-300 font-light leading-relaxed mb-8">
                {t("devopsDesc")}
              </p>
            </div>

            <AnimatedGroup preset="blur-slide" className="flex flex-wrap gap-2 sm:gap-4 items-center">
              {devopsTools.map((tech) => (
                <div
                  key={tech.name}
                  className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-charcoal/40 border border-white/5 hover:border-forest-light/25 hover:bg-forest/5 transition-all duration-300 cursor-help"
                  title={tech.label}
                >
                  <Icon name={tech.name} size={28} />
                  <span className="absolute -bottom-8 scale-0 group-hover:scale-100 transition-all duration-200 bg-black/80 text-[10px] text-zinc-200 px-2 py-0.5 rounded border border-white/10 z-20 whitespace-nowrap">
                    {tech.label}
                  </span>
                </div>
              ))}
            </AnimatedGroup>
          </GlassCard>
        </div>

        {/* Development Stack Card (Full Width) */}
        <GlassCard
          hoverAccent="forest"
          variant="liquid-strong"
          className="w-full p-8 sm:p-12 border-glass-border text-left mb-8"
        >
          <div className="max-w-3xl mb-8">
            <h3 className="text-xl font-bold text-white mb-4 tracking-wide">
              {t("devTitle")}
            </h3>
            <p className="text-sm text-zinc-300 font-light leading-relaxed">
              {t("devDesc")}
            </p>
          </div>

          <AnimatedGroup
            preset="scale"
            className={cn(
              a11yEnabled
                ? "flex flex-wrap gap-4 items-stretch justify-start"
                : "grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-4"
            )}
          >
            {devTools.map((tech) => (
              <div
                key={tech.name}
                className={cn(
                  "group relative flex flex-col items-center justify-center p-1.5 sm:p-4 rounded-xl",
                  a11yEnabled
                    ? "flex-grow flex-shrink-0 min-w-[110px] max-w-[150px] bg-white border-2 border-black"
                    : "bg-charcoal/40 border border-white/5 hover:border-forest-light/20 hover:bg-forest/5 hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-help"
                )}
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mb-1 sm:mb-2">
                  <Icon name={tech.name} size={24} />
                </div>
                <span
                  className={cn(
                    "text-center font-medium",
                    a11yEnabled
                      ? "text-xs text-black leading-tight break-words whitespace-normal w-full mt-1"
                      : "text-[9px] sm:text-[10px] leading-tight text-zinc-400 group-hover:text-zinc-200 transition-colors duration-200 break-words w-full"
                  )}
                >
                  {tech.label}
                </span>
              </div>
            ))}
          </AnimatedGroup>
        </GlassCard>

        {/* Bottom highlights (Open Source, Big Data, AI) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {bottomHighlights.map((hl) => (
            <GlassCard
              key={hl.key}
              hoverAccent={hl.key === "bigData" ? "gold" : "forest"}
              variant="liquid"
              className="p-8 text-left border-glass-border flex flex-col items-start"
            >
              <div className="w-10 h-10 rounded-lg bg-forest/20 border border-forest-light/10 flex items-center justify-center text-gold mb-6">
                <Icon name={hl.icon} size={20} />
              </div>
              <h4 className="text-base font-bold text-white mb-3 tracking-wide">
                {hl.title}
              </h4>
              <p className="text-xs text-zinc-300 font-light leading-relaxed">
                {hl.desc}
              </p>
            </GlassCard>
          ))}
        </div>

      </div>
    </section>
  );
}
