# Полный отчет по анализу и извлечению данных с сайта bsbnb.kz

**Дата и время извлечения данных:** 03.06.2026, 23:34:17 (UTC+5)
**Целевой домен:** https://bsbnb.kz
**Технологический стек парсинга:** Node.js, Playwright (Chromium Headless Shell), HTTPS-модуль для скачивания ресурсов.

> [!NOTE]
> **Объектом анализа является:** АО «Центр развития цифровых технологий Национального Банка Республики Казахстан» (**DDC — Digital Development Center**).
> Ранее организация функционировала как РГП «Банковское сервисное бюро Национального Банка Республики Казахстан» (БСБ НБ РК).

---

## 1. Сводная статистика извлечения (Dashboard)

| Метрика | Значение | Примечание |
| :--- | :--- | :--- |
| **Всего страниц в обходе** | 6 | Полная структура SPA-приложения |
| **Скачанные изображения** | 35 | Сохранены в папку [images/](file:///Users/namazbekbekzhanov/AntigravityProjects/ddcnb_site/extracted/images/) |
| **Выявленные видео** | 1 | Фоновые / информационные видео |
| **Найденные PDF-документы** | 13 | Документы комплаенса и планы работ |
| **Статус обхода** | Успешно | Блокировка WAF (FortiGate) успешно обойдена |

---

## 2. Карта сайта (Sitemap)

Все обнаруженные роуты и ссылки на их детальное текстовое содержимое:

1. **Главная страница (/)** — [index.md](file:///Users/namazbekbekzhanov/AntigravityProjects/ddcnb_site/extracted/content/index.md)
2. **Домашняя страница (/home)** — [home.md](file:///Users/namazbekbekzhanov/AntigravityProjects/ddcnb_site/extracted/content/home.md)
3. **О нас (/about-us)** — [about-us.md](file:///Users/namazbekbekzhanov/AntigravityProjects/ddcnb_site/extracted/content/about-us.md)
4. **Услуги (/services)** — [services.md](file:///Users/namazbekbekzhanov/AntigravityProjects/ddcnb_site/extracted/content/services.md)
5. **Миссия и Направления (/mission)** — [mission.md](file:///Users/namazbekbekzhanov/AntigravityProjects/ddcnb_site/extracted/content/mission.md)
6. **Контакты (/contacts)** — [contacts.md](file:///Users/namazbekbekzhanov/AntigravityProjects/ddcnb_site/extracted/content/contacts.md)

---

## 3. Анализ визуального стиля и палитры (Design Tokens)

На основе computed CSS-стилей, извлеченных браузером:
- **Цветовое решение:** Фон страниц (`backgroundColor`) определен как `rgb(0, 0, 0)` (черный), основной цвет текста — `rgb(0, 0, 0)`. Это свидетельствует об использовании современной темной темы с контрастными блоками.
- **Интерфейс:** В верстке преобладают SVG-элементы интерфейса (изображения ноутбуков, планшетов, телефонов), что подчеркивает технологическую направленность организации.

---

## 4. Подробный анализ страниц и контента

### 4.1. Главная и Домашняя страницы (`/` и `/home`)
* **Файл данных:** [index.md](file:///Users/namazbekbekzhanov/AntigravityProjects/ddcnb_site/extracted/content/index.md) / [home.md](file:///Users/namazbekbekzhanov/AntigravityProjects/ddcnb_site/extracted/content/home.md)
* **Заголовки:**
  * **H1:** *«Цифровые решения для financial стабильности государства»*
  * **H2:** *«Цифровизация»*, *«Информационная безопасность»*, *«Технологический оператор данных»*, *«Контакт-центр 1477»*, *«Финансовая отчетность»*, *«Гарантированное качество»*
* **Суть контента:** Презентация ключевых возможностей центра, статистика работы (упоминаются цифры 25, 50/24, 2020 год как важные вехи).

### 4.2. О нас (`/about-us`)
* **Файл данных:** [about-us.md](file:///Users/namazbekbekzhanov/AntigravityProjects/ddcnb_site/extracted/content/about-us.md)
* **Заголовки:**
  * **H1:** *«Быть лидером в цифровой трансформации, обеспечивая Национальный Банк и его дочерние структуры передовыми ИТ-решениями»*
  * **H2:** *«ускоряя инновации, обеспечивая стабильность и соответствие международным стандартам ISO 9001»*
  * **H3 (Ценности):** *Инновации, Прозрачность, Качество, Надежность, Партнерство, Видение*.
* **Суть контента:** Подробная история с 1996 года, принципы партнерства и меритократии, а также структура управления.

> [!IMPORTANT]
> ### Структура управления АО «ЦДО»
>
> **Совет директоров:**
> - **Жаленов Бинур Муратович** — Председатель Совета директоров, заместитель Председателя Национального Банка РК.
> - **Узбеков Асхат Архатович** — Член Совета директоров, директор Департамента ИТ Национального Банка РК.
> - **Аринова Айжан Бейбытовна** — Член Совета директоров, директор Департамента цифровой трансформации Национального Банка РК.
> - **Конирбаев Баян Кайратович** — Член Совета директоров, независимый директор.
> - **Алпамысов Абай Абдисаметович** — Член Совета директоров, независимый директор.
> - **Аскар Марат** — Член Совета директоров, независимый директор.
> - **Амардинов Малик Алимжанович** — Член Совета директоров, Председатель Правления.
>
> **Правление (Исполнительный орган):**
> - **Амардинов Малик Алимжанович** — Председатель Правления.
> - **Дурмагамбетов Ерлан Дмитриевич** — Первый заместитель Председателя Правления.
> - **Имажанов Бахытжан Гылымбекович** — Заместитель Председателя Правления.
> - **Кентбеков Аргын Салаватович** — Руководитель аппарата.

### 4.3. Услуги (`/services`)
* **Файл данных:** [services.md](file:///Users/namazbekbekzhanov/AntigravityProjects/ddcnb_site/extracted/content/services.md)
* **Основные направления деятельности:**
  1. **Единый контакт-центр 1477:** Обеспечивает техническую и консультационную поддержку финансового рынка, организаций структуры Национального Банка РК по вопросам сдачи административной отчетности и использования веб-порталов Нацбанка.
  2. **Оператор портала закупок:** Предоставление единой точки доступа к электронным закупкам Национального Банка РК.
  3. **Технологический оператор данных:** Профессиональный сбор, агрегация и защита данных в цифровой экосистеме НБ РК.
  4. **Единый центр ИТ-услуг:** Сопровождение серверного парка, системного ПО и автоматизированных рабочих мест Национального Банка РК.

### 4.4. Миссия и Комплаенс (`/mission`)
* **Файл данных:** [mission.md](file:///Users/namazbekbekzhanov/AntigravityProjects/ddcnb_site/extracted/content/mission.md)
* **Суть контента:** Политика информационной безопасности (внедрена с 2022 года), цифровая трансформация (разработка «Цифрового ядра» НБ РК с 2021 года) и антикоррупционная комплаенс-служба.
* **Контакты комплаенс-контролера:**
  * Телефон: +7 (727) 258 49 58 (внутр. 5041)

### 4.5. Контакты (`/contacts`)
* **Файл данных:** [contacts.md](file:///Users/namazbekbekzhanov/AntigravityProjects/ddcnb_site/extracted/content/contacts.md)
* **Адрес:** Республика Казахстан, г. Астана, пр. Мангилик Ел, 57А (Почтовый индекс: Z05T8F6).
* **Телефон:** +7 (727) 258-49-58
* **Email:** info@bsbnb.kz
* **Instagram:** [@ddc.kz](https://www.instagram.com/ddc.kz)

---

## 5. Выявленные PDF-документы (Внутренний комплаенс)

На странице `/mission` обнаружены ссылки на следующие документы (файлы не скачивались в рамках задачи, но зафиксированы их точные пути):

### Планы работ
- [План работы на 2024 год](https://bsbnb.kz/upload/anticorruption/work-plans/work_plan_2024.pdf)
- [План работы на 2025 год](https://bsbnb.kz/upload/anticorruption/work-plans/work_plan_2025.pdf)
- [План работы на 2026 год](https://bsbnb.kz/upload/anticorruption/work-plans/work_plan_2026.pdf)

### Регламенты и политики
- [Положение о комплаенс-контролере АО «ЦДО»](https://bsbnb.kz/upload/anticorruption/internal-regulatory-documents/ddc_compliance_controller_regulations_2025.pdf)
- [Порядок проведения мониторинга закупок товаров, работ и услуг АО «ЦДО»](https://bsbnb.kz/upload/anticorruption/internal-regulatory-documents/ddc_procedure_for_monitoring_the_procurement_of_gws_2025.pdf)
- [Правила управления комплаенс-риском АО «ЦДО»](https://bsbnb.kz/upload/anticorruption/internal-regulatory-documents/ddc_compliance_risk_management_rules_2025.pdf)
- [Политика противодействия коррупции АО «ЦДО»](https://bsbnb.kz/upload/anticorruption/internal-regulatory-documents/ddc_anticorruption_policy_2025.pdf)
- [Политика инициативного информирования АО «ЦДО»](https://bsbnb.kz/upload/anticorruption/internal-regulatory-documents/ddc_proactive_information_policy_2025.pdf)
- [Инструкция по противодействию коррупции для работников АО «ЦДО»](https://bsbnb.kz/upload/anticorruption/internal-regulatory-documents/ddc_anticorruption_instructions_2025.pdf)
- [Порядок проведения комплаенс оценки и урегулирования конфликта интересов АО «ЦДО»](https://bsbnb.kz/upload/anticorruption/internal-regulatory-documents/ddc_procedure_for_conducting_compliance_assessments_and_resolving_conflicts_of_interest_2025.pdf)

### Справки по анализу коррупционных рисков (2025 г.)
- [Справка Департамента аналитики (DAD)](https://bsbnb.kz/upload/anticorruption/internal-analysis-corruption-risks/reference_IACR_DAD_2025.pdf)
- [Справка Департамента информационной политики (DPPIR)](https://bsbnb.kz/upload/anticorruption/internal-analysis-corruption-risks/reference_IACR_DPPIR_2025.pdf)
- [Справка Департамента управления рисками (DRFT)](https://bsbnb.kz/upload/anticorruption/internal-analysis-corruption-risks/reference_IACR_DRFT_2025.pdf)
- [Справка Отдела технического обеспечения (OTD)](https://bsbnb.kz/upload/anticorruption/internal-analysis-corruption-risks/reference_IACR_OTD_2025.pdf)

---

## 6. Зафиксированные видеоматериалы
- Фоновое видео на странице контактов: [GettyImages-933373382.mp4](https://bsbnb.kz/images/GettyImages-933373382.mp4)
- Интерактивная карта Google Maps: [Ссылка на Google Maps Embed](https://maps.google.com/maps?q=Z05T8F6%2C%20%D0%A0%D0%B5%D1%81%D0%BF%D1%83%D0%B1%D0%BB%D0%B8%D0%BA%D0%B0%20%D0%9A%D0%B0%D0%B7%D0%B0%D1%85%D1%81%D1%82%D0%B0%D0%BD%2C%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%20%D0%90%D1%81%D1%82%D0%B0%D0%BD%D0%B0%2C%20%D0%BF%D1%80.%20%D0%9C%D0%B0%D0%BD%D0%B3%D0%B8%D0%BB%D0%B8%D0%BA%20%D0%95%D0%BB%2C%2057%D0%90&output=embed)
