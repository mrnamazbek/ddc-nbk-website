"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";

interface Job {
  title: string;
}

interface JobApplicationFormProps {
  jobs: Job[];
}

export default function JobApplicationForm({ jobs }: JobApplicationFormProps) {
  const t = useTranslations("CareersPage.form");
  const tf = useTranslations("JobForm");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vacancy: jobs[0]?.title || "IT Engineer",
    resume: "",
  });

  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number>(0);

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert(tf("fillContacts"));
      return;
    }
    setShowQuiz(true);
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    // Подсчет результатов теста
    let correctCount = 0;
    if (quizAnswers.q1 === "a") correctCount++;
    if (quizAnswers.q2 === "a") correctCount++;
    if (quizAnswers.q3 === "a") correctCount++;

    setScore(correctCount);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <GlassCard className="max-w-3xl mx-auto p-8 border border-white/5 relative overflow-hidden" isTiltEnabled={false}>
      <div className="text-left mb-8 border-b border-white/5 pb-6">
        <h3 className="text-xl sm:text-2xl font-display font-normal text-white mb-2">
          {t("title")}
        </h3>
        <p className="text-sm text-zinc-400 font-light">
          {tf("sendDirect")}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!showQuiz && !isSubmitted && (
          <motion.form
            key="contact-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            onSubmit={handleStartQuiz}
            className="space-y-6 text-left"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ФИО */}
              <div>
                <label htmlFor="fullname" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  {t("nameLabel")}
                </label>
                <input
                  id="fullname"
                  type="text"
                  aria-label={t("nameLabel")}
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-charcoal/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-gold/30 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Вакансия */}
              <div>
                <label htmlFor="vacancy" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  {t("vacancyLabel")}
                </label>
                <select
                  id="vacancy"
                  value={formData.vacancy}
                  onChange={(e) => setFormData((prev) => ({ ...prev, vacancy: e.target.value }))}
                  className="w-full min-h-11 bg-charcoal/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-gold/30 focus:outline-none transition-colors cursor-pointer"
                >
                  {jobs.map((job, idx) => (
                    <option key={idx} value={job.title} className="bg-charcoal text-white text-xs">
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  {t("emailLabel")}
                </label>
                <input
                  id="email"
                  type="email"
                  aria-label={t("emailLabel")}
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-charcoal/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-gold/30 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Телефон */}
              <div>
                <label htmlFor="phone" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  {t("phoneLabel")}
                </label>
                <input
                  id="phone"
                  type="tel"
                  aria-label={t("phoneLabel")}
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-charcoal/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-gold/30 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Ссылка на резюме */}
            <div>
              <label htmlFor="resume" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                {t("resumeLabel")}
              </label>
              <input
                id="resume"
                type="url"
                aria-label={t("resumeLabel")}
                placeholder={tf("resumePlaceholder")}
                value={formData.resume}
                onChange={(e) => setFormData((prev) => ({ ...prev, resume: e.target.value }))}
                className="w-full bg-charcoal/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-gold/30 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Кнопка продолжения */}
            <Button
              type="submit"
              variant="gold"
              className="w-full justify-center py-3.5 font-mono text-xs uppercase"
            >
              <span className="flex items-center gap-2">
                <Icon name="check-circle" className="text-black" size={14} />
                {t("startQuizBtn")}
              </span>
            </Button>
          </motion.form>
        )}

        {showQuiz && !isSubmitted && (
          <motion.form
            key="quiz-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            onSubmit={handleSubmit}
            className="space-y-6 text-left"
          >
            <div className="bg-forest/10 border border-forest-light/20 p-4 rounded-xl mb-4">
              <h4 className="text-sm font-bold text-white mb-2">{t("quiz.title")}</h4>
              <p className="text-xs text-zinc-300 leading-relaxed font-light">
                {t("quiz.desc")}
              </p>
            </div>

            {/* Вопрос 1 */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-white">1. {t("quiz.q1")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleAnswerSelect("q1", "a")}
                  className={`p-3.5 rounded-xl border text-xs font-medium text-left transition-all duration-300 cursor-pointer ${
                    quizAnswers.q1 === "a"
                      ? "bg-forest/30 border-forest-light text-white"
                      : "bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.05]"
                  }`}
                >
                  A) {t("quiz.q1_a")}
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswerSelect("q1", "b")}
                  className={`p-3.5 rounded-xl border text-xs font-medium text-left transition-all duration-300 cursor-pointer ${
                    quizAnswers.q1 === "b"
                      ? "bg-forest/30 border-forest-light text-white"
                      : "bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.05]"
                  }`}
                >
                  B) {t("quiz.q1_b")}
                </button>
              </div>
            </div>

            {/* Вопрос 2 */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-white">2. {t("quiz.q2")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleAnswerSelect("q2", "a")}
                  className={`p-3.5 rounded-xl border text-xs font-medium text-left transition-all duration-300 cursor-pointer ${
                    quizAnswers.q2 === "a"
                      ? "bg-forest/30 border-forest-light text-white"
                      : "bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.05]"
                  }`}
                >
                  A) {t("quiz.q2_a")}
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswerSelect("q2", "b")}
                  className={`p-3.5 rounded-xl border text-xs font-medium text-left transition-all duration-300 cursor-pointer ${
                    quizAnswers.q2 === "b"
                      ? "bg-forest/30 border-forest-light text-white"
                      : "bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.05]"
                  }`}
                >
                  B) {t("quiz.q2_b")}
                </button>
              </div>
            </div>

            {/* Вопрос 3 */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-white">3. {t("quiz.q3")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleAnswerSelect("q3", "a")}
                  className={`p-3.5 rounded-xl border text-xs font-medium text-left transition-all duration-300 cursor-pointer ${
                    quizAnswers.q3 === "a"
                      ? "bg-forest/30 border-forest-light text-white"
                      : "bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.05]"
                  }`}
                >
                  A) {t("quiz.q3_a")}
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswerSelect("q3", "b")}
                  className={`p-3.5 rounded-xl border text-xs font-medium text-left transition-all duration-300 cursor-pointer ${
                    quizAnswers.q3 === "b"
                      ? "bg-forest/30 border-forest-light text-white"
                      : "bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.05]"
                  }`}
                >
                  B) {t("quiz.q3_b")}
                </button>
              </div>
            </div>

            {/* Отправка */}
            <Button
              type="submit"
              variant="forest"
              disabled={isSubmitting || !quizAnswers.q1 || !quizAnswers.q2 || !quizAnswers.q3}
              className="w-full justify-center py-3.5 font-mono text-xs uppercase"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Icon name="refresh" className="animate-spin text-black" size={14} />
                  {tf("registering")}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Icon name="zap" className="text-black" size={14} />
                  {t("submitBtn")}
                </span>
              )}
            </Button>
          </motion.form>
        )}

        {isSubmitted && (
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-xl bg-forest/10 border border-forest-light/20 space-y-4 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-forest/20 border border-forest-light/30 flex items-center justify-center mx-auto text-forest-light mb-4">
              <Icon name="check-circle" size={32} />
            </div>

            <h4 className="text-lg font-bold text-white">
              {t("successTitle")}
            </h4>
            <p className="text-sm text-zinc-300 font-light leading-relaxed max-w-xl mx-auto">
              {t("successDesc")}
            </p>

            <div className="bg-black/40 border border-white/5 rounded-xl p-4 max-w-sm mx-auto text-left font-mono text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500">{tf("candidate")}</span>
                <span className="text-white">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{tf("vacancy")}</span>
                <span className="text-white truncate max-w-[200px]">{formData.vacancy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{tf("itScore")}</span>
                <span className={score === 3 ? "text-forest-light" : "text-gold"}>
                  {score} / 3 {score === 3 ? tf("passed") : ""}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowQuiz(false);
                setIsSubmitted(false);
                setQuizAnswers({});
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  vacancy: jobs[0]?.title || "IT Engineer",
                  resume: "",
                });
              }}
              className="text-xs text-gold hover:text-gold-light underline font-mono cursor-pointer mt-4"
            >
              {tf("sendAnother")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
