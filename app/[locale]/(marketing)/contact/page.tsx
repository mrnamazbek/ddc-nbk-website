"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Icon from "@/components/ui/Icon";
import { BubbleText } from "@/components/ui/BubbleText";
import { useTranslations } from "next-intl";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Button from "@/components/ui/Button";
import { KazakhstanMap } from "@/components/ui/kazakhstan-map";
import { cn } from "@/lib/utils";
import { createMailtoDraft } from "@/lib/mailto";
import ScrollReveal, { ENTRANCE_DURATION, STAGGER } from "@/components/motion/ScrollReveal";
import { RevealWords } from "@/components/motion/RevealWords";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

export default function ContactPage() {
  const t = useTranslations("ContactPage");
  const tA11y = useTranslations("A11y");

  // Validation schema for quality inbound messages (created dynamically for localization)
  const contactSchema = z.object({
    name: z.string().trim().min(2, { message: t("errors.name") }).max(200, { message: t("errors.name") }),
    email: z.string().trim().email({ message: t("errors.email") }).max(254, { message: t("errors.email") }),
    organization: z.string().trim().min(2, { message: t("errors.organization") }).max(200, { message: t("errors.organization") }),
    message: z.string().trim().min(10, { message: t("errors.message") }).max(5000, { message: t("errors.message") }),
  });

  type ContactFormValues = z.infer<typeof contactSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormValues) => {
    const href = createMailtoDraft({
      to: "info@ddc.nationalbank.kz",
      subject: t("emailSubject"),
      lines: [
        `${t("fieldName")}: ${data.name}`,
        `${t("fieldEmail")}: ${data.email}`,
        `${t("fieldOrg")}: ${data.organization}`,
        "",
        data.message,
      ],
    });

    window.location.assign(href);
  };

  return (
    <div className="relative w-full bg-transparent overflow-hidden min-h-screen pt-32 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">

        {/* Title Heading */}
        <div className="max-w-3xl mb-20">
          <ScrollReveal blur={10} duration={ENTRANCE_DURATION.label}>
            <span className="text-xs uppercase tracking-[0.25em] text-gold-light font-medium mb-4 block">
              {t("overline")}
            </span>
          </ScrollReveal>
          <h1 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-white mb-6">
            <RevealWords text={t("titleLine1")} delay={0.08} useBubbleText />{" "}
            <br />
            <RevealWords
              text={t("titleAccent")}
              delay={0.3}
              useBubbleText
              bubbleActiveClassName="text-gold font-black"
            />
          </h1>
          <ScrollReveal blur={10} duration={ENTRANCE_DURATION.subtitle} delay={0.2}>
            <p className="text-lg text-zinc-300 font-light leading-relaxed">
              <BubbleText text={t("subtitle")} />
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <ScrollReveal blur={10} duration={ENTRANCE_DURATION.label}>
                <h2 className="text-xl font-bold text-white mb-6 tracking-wide"><BubbleText text={t("officeTitle")} /></h2>
              </ScrollReveal>

              <StaggerGroup stagger={STAGGER.base} className="space-y-6">
                <StaggerItem duration={ENTRANCE_DURATION.subtitle} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-forest/20 border border-forest-light/10 flex items-center justify-center text-gold-light shrink-0">
                    <Icon name="map-pin" size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs text-gold-light uppercase tracking-wider font-semibold mb-1">{t("labelAddress")}</h5>
                    <p className="text-sm text-zinc-300 font-light leading-relaxed">
                      <BubbleText text={t("addressVal")} />
                    </p>
                  </div>
                </StaggerItem>

                <StaggerItem duration={ENTRANCE_DURATION.subtitle} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-forest/20 border border-forest-light/10 flex items-center justify-center text-gold-light shrink-0">
                    <Icon name="phone" size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs text-gold-light uppercase tracking-wider font-semibold mb-1">{t("labelPhone")}</h5>
                    <p className="text-sm text-zinc-300 font-light font-mono leading-relaxed">
                      <BubbleText text="+7 (727) 330-24-00" />
                    </p>
                  </div>
                </StaggerItem>

                <StaggerItem duration={ENTRANCE_DURATION.subtitle} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-forest/20 border border-forest-light/10 flex items-center justify-center text-gold-light shrink-0">
                    <Icon name="mail" size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs text-gold-light uppercase tracking-wider font-semibold mb-1">{t("labelEmail")}</h5>
                    <p className="text-sm text-zinc-300 font-light font-mono leading-relaxed">
                      <BubbleText text="info@ddc.nationalbank.kz" />
                    </p>
                  </div>
                </StaggerItem>

                <StaggerItem duration={ENTRANCE_DURATION.subtitle} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-forest/20 border border-forest-light/10 flex items-center justify-center text-gold-light shrink-0">
                    <Icon name="clock" size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs text-gold-light uppercase tracking-wider font-semibold mb-1">{t("labelClock")}</h5>
                    <p className="text-sm text-zinc-300 font-light leading-relaxed">
                      <BubbleText text={t("clockVal")} />
                    </p>
                  </div>
                </StaggerItem>
              </StaggerGroup>
            </div>

            {/* Status Plate */}
            <ScrollReveal duration={ENTRANCE_DURATION.card} delay={0.3} className="p-6 rounded-2xl bg-charcoal/30 border border-white/5">
              <span className="text-[10px] uppercase text-gold-light font-semibold tracking-wider block mb-2">{t("statusTitle")}</span>
              <p className="text-xs text-zinc-300 font-light leading-relaxed">
                {t("statusDesc")}
              </p>
            </ScrollReveal>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7 bg-charcoal/20 border border-white/5 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            <StaggerGroup stagger={STAGGER.base}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pointer-events-auto">
                <StaggerItem duration={ENTRANCE_DURATION.subtitle} className="flex flex-col space-y-6 sm:space-y-0 sm:flex-row sm:space-x-6">
                  <LabelInputContainer>
                    <Label htmlFor="name">{t("fieldName")}</Label>
                    <Input
                      id="name"
                      type="text"
                      {...register("name")}
                      aria-label={t("fieldName")}
                      placeholder={t("placeholderName")}
                      className={errors.name ? "ring-1 ring-red-500" : ""}
                      aria-invalid={errors.name ? "true" : "false"}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="text-xs text-red-500 mt-1 font-semibold flex items-center gap-1" role="alert">
                        <span className="sr-only">{tA11y("errorPrefix")}: </span>⚠️ {errors.name.message}
                      </p>
                    )}
                  </LabelInputContainer>

                  <LabelInputContainer>
                    <Label htmlFor="email">{t("fieldEmail")}</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      aria-label={t("fieldEmail")}
                      placeholder={t("placeholderEmail")}
                      className={errors.email ? "ring-1 ring-red-500" : ""}
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="text-xs text-red-500 mt-1 font-semibold flex items-center gap-1" role="alert">
                        <span className="sr-only">{tA11y("errorPrefix")}: </span>⚠️ {errors.email.message}
                      </p>
                    )}
                  </LabelInputContainer>
                </StaggerItem>

                <StaggerItem duration={ENTRANCE_DURATION.subtitle}>
                  <LabelInputContainer>
                    <Label htmlFor="organization">{t("fieldOrg")}</Label>
                    <Input
                      id="organization"
                      type="text"
                      {...register("organization")}
                      aria-label={t("fieldOrg")}
                      placeholder={t("placeholderOrg")}
                      className={errors.organization ? "ring-1 ring-red-500" : ""}
                      aria-invalid={errors.organization ? "true" : "false"}
                      aria-describedby={errors.organization ? "organization-error" : undefined}
                    />
                    {errors.organization && (
                      <p id="organization-error" className="text-xs text-red-500 mt-1 font-semibold flex items-center gap-1" role="alert">
                        <span className="sr-only">{tA11y("errorPrefix")}: </span>⚠️ {errors.organization.message}
                      </p>
                    )}
                  </LabelInputContainer>
                </StaggerItem>

                <StaggerItem duration={ENTRANCE_DURATION.subtitle}>
                  <LabelInputContainer>
                    <Label htmlFor="message">{t("fieldMsg")}</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      {...register("message")}
                      aria-label={t("fieldMsg")}
                      placeholder={t("placeholderMsg")}
                      className={errors.message ? "ring-1 ring-red-500" : ""}
                      aria-invalid={errors.message ? "true" : "false"}
                      aria-describedby={errors.message ? "message-error" : undefined}
                    />
                    {errors.message && (
                      <p id="message-error" className="text-xs text-red-500 mt-1 font-semibold flex items-center gap-1" role="alert">
                        <span className="sr-only">{tA11y("errorPrefix")}: </span>⚠️ {errors.message.message}
                      </p>
                    )}
                  </LabelInputContainer>
                </StaggerItem>

                <StaggerItem duration={ENTRANCE_DURATION.button}>
                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    className="w-full"
                  >
                    {t("btnSubmit")}
                    <Icon name="send" size={16} animate={false} />
                  </Button>
                </StaggerItem>
              </form>
            </StaggerGroup>
          </div>

        </div>

        {/* Наши офисы — dotted Kazakhstan map with animated arc */}
        <section aria-labelledby="offices-heading" className="mt-28 sm:mt-36">
          <div className="max-w-3xl mb-12">
            <ScrollReveal blur={10} duration={ENTRANCE_DURATION.label}>
              <span className="text-xs uppercase tracking-[0.25em] text-gold-light font-medium mb-4 block">
                {t("officesOverline")}
              </span>
            </ScrollReveal>
            <ScrollReveal blur={10} duration={ENTRANCE_DURATION.title} delay={0.1}>
              <h2 id="offices-heading" className="font-display text-3xl sm:text-5xl font-normal tracking-tight text-white mb-6">
                {t("officesTitle")}
              </h2>
            </ScrollReveal>
            <ScrollReveal blur={10} duration={ENTRANCE_DURATION.subtitle} delay={0.2}>
              <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
                {t("officesSubtitle")}
              </p>
            </ScrollReveal>
          </div>

            {/* Container for Maps */}
            <div className="relative overflow-visible bg-transparent p-0 min-h-[480px] flex items-center justify-center">
              <div className="w-full">
                <KazakhstanMap />
              </div>
            </div>
        </section>

      </div>
    </div>
  );
}
