"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, useReducedMotion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { cn } from "@/lib/utils";

// Validation schema for quality inbound messages
const contactSchema = z.object({
  name: z.string().min(2, { message: "Пожалуйста, введите ваше имя (минимум 2 символа)" }),
  email: z.string().email({ message: "Некорректный адрес электронной почты" }),
  organization: z.string().min(2, { message: "Пожалуйста, укажите название вашей организации" }),
  message: z.string().min(10, { message: "Сообщение должно содержать минимум 10 символов" }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const reduce = useReducedMotion();

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
    <div className="relative w-full bg-black overflow-hidden min-h-screen pt-32 pb-24 font-sans">
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
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-4 block">
            СВЯЗАТЬСЯ С НАМИ
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-white mb-6">
            Контакты DDC <br />
            <span className="text-gradient-gold font-medium">и обратная связь</span>
          </h1>
          <p className="text-lg text-zinc-400 font-light leading-relaxed">
            Мы всегда готовы к сотрудничеству с партнерами, прессой и будущими коллегами. Оставьте обращение, и наши специалисты свяжутся с вами в ближайшее время.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <h3 className="text-xl font-bold text-white mb-6 tracking-wide">Главный офис в Алматы</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-forest/20 border border-forest-light/10 flex items-center justify-center text-gold shrink-0">
                    <Icon name="map-pin" size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs text-gold uppercase tracking-wider font-semibold mb-1">Адрес</h5>
                    <p className="text-sm text-zinc-400 font-light leading-relaxed">
                      Республика Казахстан, 050040, г. Алматы, <br />
                      проспект Аль-Фараби, д. 21 (БЦ «Al-Farabi»)
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-forest/20 border border-forest-light/10 flex items-center justify-center text-gold shrink-0">
                    <Icon name="phone" size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs text-gold uppercase tracking-wider font-semibold mb-1">Телефон приемной</h5>
                    <p className="text-sm text-zinc-400 font-light font-mono leading-relaxed">
                      +7 (727) 330-24-00
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-forest/20 border border-forest-light/10 flex items-center justify-center text-gold shrink-0">
                    <Icon name="mail" size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs text-gold uppercase tracking-wider font-semibold mb-1">Электронная почта</h5>
                    <p className="text-sm text-zinc-400 font-light font-mono leading-relaxed">
                      info@ddc.nationalbank.kz
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-forest/20 border border-forest-light/10 flex items-center justify-center text-gold shrink-0">
                    <Icon name="clock" size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs text-gold uppercase tracking-wider font-semibold mb-1">Режим работы</h5>
                    <p className="text-sm text-zinc-400 font-light leading-relaxed">
                      Понедельник — Пятница: 09:00 - 18:30 <br />
                      Обед: 13:00 - 14:30
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Plate */}
            <div className="p-6 rounded-2xl bg-charcoal/30 border border-white/5">
              <span className="text-[10px] uppercase text-gold font-semibold tracking-wider block mb-2">Статус обращения</span>
              <p className="text-xs text-zinc-500 font-light leading-relaxed">
                Все обращения, направленные через форму, фиксируются в Единой системе документооборота Национального Банка РК и рассматриваются в установленные законодательством сроки.
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
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 340, damping: 15, delay: 0.05 }}
                    className="w-16 h-16 rounded-full bg-forest/30 border border-forest-light/20 flex items-center justify-center text-gold"
                  >
                    <Icon name="check-circle" size={32} animate={false} />
                  </motion.div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">Обращение отправлено</h3>
                <p className="text-sm text-zinc-400 font-light leading-relaxed max-w-md mx-auto mb-8">
                  Спасибо! Ваше обращение успешно зарегистрировано. Мы свяжемся с вами в течение 2 рабочих дней.
                </p>
                <LiquidButton variant="default" size="lg" className="h-10 text-gold bg-transparent" onClick={() => setIsSubmitted(false)}>
                  Отправить еще одно сообщение
                </LiquidButton>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pointer-events-auto">
                <div className="flex flex-col space-y-6 sm:space-y-0 sm:flex-row sm:space-x-6">
                  <LabelInputContainer>
                    <Label htmlFor="name">Имя и фамилия</Label>
                    <Input
                      id="name"
                      type="text"
                      {...register("name")}
                      placeholder="Иван Иванов"
                      className={errors.name ? "ring-1 ring-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1 font-light">{errors.name.message}</p>
                    )}
                  </LabelInputContainer>

                  <LabelInputContainer>
                    <Label htmlFor="email">Электронная почта</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="example@mail.com"
                      className={errors.email ? "ring-1 ring-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1 font-light">{errors.email.message}</p>
                    )}
                  </LabelInputContainer>
                </div>

                <LabelInputContainer>
                  <Label htmlFor="organization">Организация</Label>
                  <Input
                    id="organization"
                    type="text"
                    {...register("organization")}
                    placeholder="АО 'Банк Казахстана'"
                    className={errors.organization ? "ring-1 ring-red-500" : ""}
                  />
                  {errors.organization && (
                    <p className="text-xs text-red-500 mt-1 font-light">{errors.organization.message}</p>
                  )}
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="message">Текст обращения</Label>
                  <Textarea
                    id="message"
                    rows={6}
                    {...register("message")}
                    placeholder="Опишите цель вашего обращения или предложение о сотрудничестве..."
                    className={errors.message ? "ring-1 ring-red-500" : ""}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500 mt-1 font-light">{errors.message.message}</p>
                  )}
                </LabelInputContainer>

                <LiquidButton
                  type="submit"
                  variant="default"
                  disabled={isSubmitting}
                  className="w-full justify-center flex items-center gap-2 py-4 h-12 text-gold font-medium bg-transparent hover:scale-[1.02] transition duration-300"
                >
                  {isSubmitting ? (
                    <>
                      Отправка…
                      <Icon name="refresh" size={16} animate={false} className="animate-spin" />
                    </>
                  ) : (
                    <>
                      Отправить обращение
                      <Icon name="send" size={16} animate={false} />
                    </>
                  )}
                </LiquidButton>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
