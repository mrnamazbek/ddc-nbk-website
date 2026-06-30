"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, useReducedMotion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { KazakhstanMap } from "@/components/ui/kazakhstan-map";
import { cn } from "@/lib/utils";

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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const reduce = useReducedMotion();

  // Validation schema for quality inbound messages (created dynamically for localization)
  const contactSchema = z.object({
    name: z.string().min(2, { message: t("errors.name") }),
    email: z.string().email({ message: t("errors.email") }),
    organization: z.string().min(2, { message: t("errors.organization") }),
    message: z.string().min(10, { message: t("errors.message") }),
  });

  type ContactFormValues = z.infer<typeof contactSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    // Simulate server request
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Form Submitted:", data);
    setIsSubmitted(true);
    reset();
  };

  return (
    <div className="relative w-full bg-background overflow-hidden min-h-screen pt-32 pb-24 font-sans">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-forest/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* Title Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-20"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-gold-light font-medium mb-4 block">
            {t("overline")}
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-white mb-6">
            {t("titleLine1")} <br />
            <span className="text-gradient-gold font-medium">{t("titleAccent")}</span>
          </h1>
          <p className="text-lg text-zinc-300 font-light leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <h2 className="text-xl font-bold text-white mb-6 tracking-wide">{t("officeTitle")}</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-forest/20 border border-forest-light/10 flex items-center justify-center text-gold-light shrink-0">
                    <Icon name="map-pin" size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs text-gold-light uppercase tracking-wider font-semibold mb-1">{t("labelAddress")}</h5>
                    <p className="text-sm text-zinc-300 font-light leading-relaxed">
                      {t("addressVal")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-forest/20 border border-forest-light/10 flex items-center justify-center text-gold-light shrink-0">
                    <Icon name="phone" size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs text-gold-light uppercase tracking-wider font-semibold mb-1">{t("labelPhone")}</h5>
                    <p className="text-sm text-zinc-300 font-light font-mono leading-relaxed">
                      +7 (727) 330-24-00
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-forest/20 border border-forest-light/10 flex items-center justify-center text-gold-light shrink-0">
                    <Icon name="mail" size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs text-gold-light uppercase tracking-wider font-semibold mb-1">{t("labelEmail")}</h5>
                    <p className="text-sm text-zinc-300 font-light font-mono leading-relaxed">
                      info@ddc.nationalbank.kz
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-forest/20 border border-forest-light/10 flex items-center justify-center text-gold-light shrink-0">
                    <Icon name="clock" size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs text-gold-light uppercase tracking-wider font-semibold mb-1">{t("labelClock")}</h5>
                    <p className="text-sm text-zinc-300 font-light leading-relaxed">
                      {t("clockVal")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Plate */}
            <div className="p-6 rounded-2xl bg-charcoal/30 border border-white/5">
              <span className="text-[10px] uppercase text-gold-light font-semibold tracking-wider block mb-2">{t("statusTitle")}</span>
              <p className="text-xs text-zinc-300 font-light leading-relaxed">
                {t("statusDesc")}
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7 bg-charcoal/20 border border-white/5 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 flex flex-col items-center justify-center pointer-events-auto"
              >
                {/* Checkmark: spring pop-in + a subtle one-shot gold sparkle burst */}
                <div className="relative mb-6">
                  {!reduce &&
                    Array.from({ length: 8 }).map((_, i) => {
                      const ang = (i / 8) * Math.PI * 2;
                      return (
                        <motion.span
                          key={i}
                          aria-hidden
                          className="absolute left-1/2 top-1/2 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-gold"
                          initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                          animate={{ x: Math.cos(ang) * 46, y: Math.sin(ang) * 46, scale: [0, 1, 0], opacity: [0, 1, 0] }}
                          transition={{ duration: 0.7, delay: 0.18 + i * 0.02, ease: "easeOut" }}
                        />
                      );
                    })}
                  <motion.div
                    initial={{ scale: 0, rotate: -18 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 340, damping: 15, delay: 0.05 }}
                    className="w-16 h-16 rounded-full bg-forest/30 border border-forest-light/25 flex items-center justify-center text-gold-light"
                  >
                    <Icon name="check-circle" size={32} animate={false} />
                  </motion.div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4 tracking-wide">{t("formSubmittedTitle")}</h2>
                <p className="text-sm text-zinc-300 font-light leading-relaxed max-w-md mx-auto mb-8">
                  {t("formSubmittedDesc")}
                </p>
                <LiquidButton variant="default" size="lg" className="h-10 text-gold-light bg-transparent" onClick={() => setIsSubmitted(false)}>
                  {t("sendAnotherBtn")}
                </LiquidButton>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pointer-events-auto">
                <div className="flex flex-col space-y-6 sm:space-y-0 sm:flex-row sm:space-x-6">
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
                </div>

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

                <LiquidButton
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full justify-center flex items-center gap-2 py-4 h-12 text-gold-light font-medium bg-transparent hover:scale-[1.02] transition duration-300"
                >
                  {isSubmitting ? (
                    <>
                      {t("btnSubmitting")}
                      <Icon name="refresh" size={16} animate={false} className="animate-spin" />
                    </>
                  ) : (
                    <>
                      {t("btnSubmit")}
                      <Icon name="send" size={16} animate={false} />
                    </>
                  )}
                </LiquidButton>
              </form>
            )}
          </div>

        </div>

        {/* Наши офисы — dotted Kazakhstan map with animated arc */}
        <section aria-labelledby="offices-heading" className="mt-28 sm:mt-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mb-12"
          >
            <span className="text-xs uppercase tracking-[0.25em] text-gold-light font-medium mb-4 block">
              {t("officesOverline")}
            </span>
            <h2 id="offices-heading" className="font-display text-3xl sm:text-5xl font-normal tracking-tight text-white mb-6">
              {t("officesTitle")}
            </h2>
            <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
              {t("officesSubtitle")}
            </p>
          </motion.div>

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
