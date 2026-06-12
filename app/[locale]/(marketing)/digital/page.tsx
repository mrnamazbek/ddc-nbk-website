"use client";

import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";

export default function DigitalPage() {
  const comparisonData = [
    {
      feature: "Форма выпуска",
      cash: "Физическая (бумага, металл)",
      nonCash: "Электронные записи в банках",
      cbdc: "Уникальный цифровой токен",
    },
    {
      feature: "Эмитент",
      cash: "Национальный Банк РК",
      nonCash: "Коммерческие банки",
      cbdc: "Национальный Банк РК",
    },
    {
      feature: "Режим оффлайн",
      cash: "Да (полный оффлайн)",
      nonCash: "Нет (нужен интернет)",
      cbdc: "Да (двухуровневый оффлайн)",
    },
    {
      feature: "Программируемость",
      cash: "Нет",
      nonCash: "Ограниченно (автоплатежи)",
      cbdc: "Да (через смарт-контракты)",
    },
    {
      feature: "Скорость расчетов",
      cash: "Мгновенно при передаче",
      nonCash: "От нескольких секунд до дней",
      cbdc: "Мгновенно (в реальном времени)",
    },
  ];

  return (
    <div className="relative w-full bg-black overflow-hidden min-h-screen pt-32 pb-24 font-sans">
      {/* Мягкие свечения */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-forest/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-16"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-4 block">
            ЦИФРОВЫЕ ТЕХНОЛОГИИ
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-white mb-6">
            Цифровой Тенге: <br />
            <span className="text-gradient-gold font-medium">Новая Эра Денег</span>
          </h1>
          <p className="text-lg text-zinc-400 font-light leading-relaxed">
            Исследование, прототипирование и запуск третьей формы национальной валюты на базе технологии распределенного реестра (DLT).
          </p>
        </motion.div>

        {/* Секция архитектуры */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          <GlassCard className="border-white/5 hover:border-gold/20 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-forest/30 border border-forest-light/20 flex items-center justify-center text-gold mb-6">
                <Icon name="layers" size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Гибридная DLT архитектура</h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Сочетание приватного блокчейна (Hyperledger Fabric) с традиционными реляционными СУБД сверхвысокой производительности для обеспечения баланса масштабируемости и юридической прозрачности.
              </p>
            </div>
            <div className="text-xs text-gold font-mono mt-6">Hyperledger Fabric, Go, Solidity</div>
          </GlassCard>

          <GlassCard className="border-white/5 hover:border-gold/20 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-forest/30 border border-forest-light/20 flex items-center justify-center text-gold mb-6">
                <Icon name="cpu" size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Смарт-контракты маркирования</h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Программируемые смарт-контракты позволяют автоматически контролировать расходование бюджетных средств. Деньги физически не могут быть потрачены на цели, не предусмотренные контрактом.
              </p>
            </div>
            <div className="text-xs text-gold font-mono mt-6">Ethereum Virtual Machine (EVM)</div>
          </GlassCard>

          <GlassCard className="border-white/5 hover:border-gold/20 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-forest/30 border border-forest-light/20 flex items-center justify-center text-gold mb-6">
                <Icon name="refresh" size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Аппаратный оффлайн-клиринг</h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Специальные чипы безопасности в смарт-картах и мобильных телефонах позволяют хранить криптографические подписи токенов и проводить транзакции напрямую между устройствами без связи.
              </p>
            </div>
            <div className="text-xs text-gold font-mono mt-6">NFC, Secure Element, JavaCard</div>
          </GlassCard>
        </div>

        {/* Секция Сравнения форм денег */}
        <div className="mb-24">
          <h2 className="font-display text-2xl sm:text-4xl text-white mb-8 font-normal tracking-tight">
            Сравнение форм <span className="text-gradient-gold">национальной валюты</span>
          </h2>
          <div className="w-full overflow-x-auto rounded-2xl border border-white/5 bg-charcoal/20 backdrop-blur-md">
            <table className="w-full min-w-[700px] border-collapse text-left text-sm font-sans font-light">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider font-semibold text-gold">
                  <th className="p-5">Характеристика</th>
                  <th className="p-5">Наличные деньги</th>
                  <th className="p-5">Безналичные деньги</th>
                  <th className="p-5 text-white">Цифровой Тенге (CBDC)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {comparisonData.map((row, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors duration-200">
                    <td className="p-5 font-semibold text-white">{row.feature}</td>
                    <td className="p-5">{row.cash}</td>
                    <td className="p-5">{row.nonCash}</td>
                    <td className="p-5 text-white font-medium bg-forest/10 border-x border-forest-light/10">{row.cbdc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Образовательный инсайт для инженеров */}
        <div className="bg-charcoal/30 border border-white/5 rounded-3xl p-8 sm:p-12">
          <div className="flex gap-4 items-start mb-6">
            <Icon name="database" size={32} className="text-gold shrink-0 mt-1" />
            <div>
              <span className="text-xs uppercase text-gold font-semibold tracking-wider">инженерный инсайт</span>
              <h3 className="text-xl font-bold text-white tracking-wide">Почему распределенный реестр (DLT)?</h3>
            </div>
          </div>
          <p className="text-zinc-400 font-light leading-relaxed mb-6">
            В отличие от классических СУБД (например, PostgreSQL или Oracle), где целостность данных контролируется единым центральным администратором, Цифровой Тенге использует распределенный консенсус. Это исключает риски несанкционированного изменения балансов или истории транзакций третьими лицами, создавая математически доказуемое доверие к валюте.
          </p>
          <p className="text-zinc-400 font-light leading-relaxed">
            Тем не менее, для обеспечения пропускной способности в 50 000+ транзакций в секунду, мы спроектировали двухуровневую систему, где данные реестра кэшируются в высокоскоростных базах данных «in-memory» для быстрого чтения, а окончательный расчет (settlement) фиксируется в распределенном реестре.
          </p>
        </div>

      </div>
    </div>
  );
}
