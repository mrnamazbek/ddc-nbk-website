# Инвентаризация визуальных и медиа-активов

В данном документе приведено описание всех графических и видеофайлов, доступных в проекте, а также спецификации для фронтенд-компонентов.

## 1. Спецификация посадочной страницы (Landing Page Spec)
- **Технологический стек**: Next.js 16 (App Router), React 19, Framer Motion 12, GSAP 3, TailwindCSS 4, Three.js 0.184 (с `@react-three/fiber` и `@react-three/drei`).
- **Система жидкого стекла (Liquid Glass)**:
  - `.liquid-glass`: Небольшое размытие (`backdrop-filter: blur(4px)`), используется для навигации, чипсов и простых карточек.
  - `.liquid-glass-strong`: Сильное размытие (`backdrop-filter: blur(50px)`), используется для основных CTA-блоков и фокусов.
  - Окантовка (`::before` градиентная рамка) с золотым отливом `rgba(201, 168, 76, 0.15)` для имитации преломления света.
- **Компонент FadingVideo**: Плавный кроссфейд на основе `requestAnimationFrame` с временем перехода `FADE_MS = 500` и упреждением (lead) в `0.55s`.
- **Компонент BlurText**: Пословесная анимация появления текста с размытием (stagger blur-in).
- **Структура секций**:
  1. **Hero** (Акт 1: Становление шанырака)
  2. **Stats** (Акт 2: Расширение сети частиц)
  3. **Services** (Акт 3: Золотая монета тенге)
  4. **Security** (Акт 4: Хранилище комплаенса)
  5. **DigitalShowcase** (Акт 5: Потоки цифрового тенге)
  6. **About** (Акт 6: Беркут над степью)
  7. **News** (Акт 7: Возврат к шаныраку / финал)
  8. **CTA** (Финал с призывом к действию)

---

## 2. 3D PNG изображения
Все файлы находятся в директории `public/images/3d/` и имеют прозрачный фон (для аддитивного смешивания):
- **`shanyrak-gold.png`**: (1024x1024) Золотой шанырак (корона юрты) в ракурсе 3/4. Используется в качестве главного визуального якоря (Hero visual anchor).
- **`tenge-coin-gold.png`**: (1024x1024) Золотая монета с символом тенге (₸). Предназначена для секции услуг (Services / Act 3).
- **`burkit-eagle-gold.png`**: (1024x1024) Парящий беркут с распростертыми крыльями. Предназначен для секции о нас (About / Act 6).
- **`ddc-logo.svg`** (`public/images/logo/`): Логотип DDC для шапки и подвала.

---

## 3. Декоративные текстуры и фоны
- **`public/images/textures/bg-texture-noise.png`**: Тонкий зернистый оверлей для придания тактильности (grain overlay, opacity: 0.03).
- **`public/images/textures/ornament-divider-gold.png`**: Казахский национальный орнамент-разделитель в золотом исполнении.
- **`public/images/backgrounds/steppe-horizon-abstract.png`**: Абстрактный степной горизонт для секции About.
- **`public/images/backgrounds/glass-card-bg.png`**: Фоновое изображение для стеклянных карточек.

---

## 4. Видеофайлы
Все видео сжаты и оптимизированы для веба:
- **`public/video/The_golden_shanyrak_gently_rot.mp4`**: (1280x720, 24fps, 10s) Медленное вращение шанырака. **Используется для нарезки на кадры (Scroll Sequence)**.
- **`public/video/The_golden_tenge_coin_slowly_t.mp4`**: (1280x720, 24fps, 10s) Крутящаяся монета тенге.
- **`public/video/The_golden_eagle_flaps_its_win.mp4`**: (1280x720, 24fps, 10s) Медленные взмахи крыльев беркута.
- **`public/video/The_forest_green_and_gold_meda.mp4`**: (1280x720, 24fps, 10s) Вращение золотого медальона DDC на темно-зеленом фоне.
- **`public/video/3d/`**: Семейство видеоассетов 1024x1024 30fps для интеграции в Three.js Canvas в качестве `THREE.VideoTexture` (`shanyrak-gold.mp4`, `tenge-coin-gold.mp4`, `burkit-eagle-gold.mp4`, `logo-ddc-3d.mp4`).
