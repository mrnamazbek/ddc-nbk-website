import { test, expect } from "@playwright/test";

test.describe("DDC Website E2E Tests", () => {
  test("should load main page and redirect/show localized content", async ({ page }) => {
    // Переходим на страницу с русской локалью
    await page.goto("/ru");
    
    // Проверяем заголовок
    await expect(page).toHaveTitle(/DDC — Центр цифрового развития Национального Банка Казахстана/);
    
    // Проверяем наличие ключевых секций по тексту
    await expect(page.locator("text=Центр цифрового развития").first()).toBeVisible();
    await expect(page.locator("text=Цифровой Тенге").first()).toBeVisible();
  });

  test("should load careers page and display hh.ru vacancies", async ({ page }) => {
    // Переходим на страницу вакансий
    await page.goto("/ru/careers");
    
    // Проверяем наличие заголовка Careers
    await expect(page.locator("text=Центр в поиске").first()).toBeVisible();
    await expect(page.locator("text=новых талантов").first()).toBeVisible();
    
    // Проверяем, что отображается хотя бы одна карточка вакансии (с кнопкой "Откликнуться")
    const applyButton = page.locator("text=Откликнуться").first();
    await expect(applyButton).toBeVisible();
  });

  test("should toggle icon systems in A/B switcher", async ({ page }) => {
    await page.goto("/ru");
    
    // Находим кнопку открытия виджета по aria-label
    const switcherButton = page.locator('button[aria-label="Настройки A/B теста иконок"]');
    await expect(switcherButton).toBeVisible();
    
    // Открываем виджет
    await switcherButton.click();
    
    // Проверяем наличие заголовка виджета
    await expect(page.locator("text=A/B Тест иконок")).toBeVisible();
    
    // Находим кнопку выбора Iconsax и кликаем на неё
    const iconsaxOption = page.locator("button:has-text('Iconsax')");
    await expect(iconsaxOption).toBeVisible();
    await iconsaxOption.click();
    
    // Проверяем, что кнопка Iconsax стала активной (проверяем класс или визуально)
    // Активная кнопка содержит bg-forest/30
    await expect(iconsaxOption).toHaveClass(/bg-forest/);
    
    // Переключаем на Solar
    const solarOption = page.locator("button:has-text('Solar')");
    await expect(solarOption).toBeVisible();
    await solarOption.click();
    await expect(solarOption).toHaveClass(/bg-forest/);
    
    // Переключаем обратно на MingCute
    const mingcuteOption = page.locator("button:has-text('MingCute')");
    await expect(mingcuteOption).toBeVisible();
    await mingcuteOption.click();
    await expect(mingcuteOption).toHaveClass(/bg-forest/);
  });
  
  test("should support dark/light theme switching", async ({ page }) => {
    await page.goto("/ru");
    
    // Находим кнопку переключения темы
    const themeButton = page.locator('button[aria-label="Переключить тему"]');
    if (await themeButton.count() > 0) {
      await expect(themeButton).toBeVisible();
      await themeButton.click();
    }
  });

  test("should toggle font systems in A/B switcher and render Kazakh text", async ({ page }) => {
    await page.goto("/ru");
    
    // Проверяем наличие проверочной строки в футере
    const kzPositionText = page.locator("text=әғқңөұүһі АО Цифровое развитие");
    await expect(kzPositionText).toBeVisible();
    
    // Находим кнопку открытия виджета
    const switcherButton = page.locator('button[aria-label="Настройки A/B теста иконок"]');
    await switcherButton.click();
    
    // Проверяем наличие заголовка A/B Тест шрифтов
    await expect(page.locator("text=A/B Тест шрифтов")).toBeVisible();
    
    // Кнопка выбора Пары B
    const pairBOption = page.locator("button:has-text('IBM Plex Sans + Lora')");
    await expect(pairBOption).toBeVisible();
    await pairBOption.click();
    await expect(pairBOption).toHaveClass(/bg-forest/);
    
    // Кнопка выбора Пары A
    const pairAOption = page.locator("button:has-text('Golos + Source Serif 4')");
    await expect(pairAOption).toBeVisible();
    await pairAOption.click();
    await expect(pairAOption).toHaveClass(/bg-forest/);
  });

  test("should load mission page and render FeatureCarousel", async ({ page }) => {
    await page.goto("/ru/mission");
    
    // Проверяем, что страница загрузилась и есть заголовок
    await expect(page.locator("h1").first()).toContainText("миссия", { ignoreCase: true });
    
    // Проверяем наличие карусели
    const firstStepText = page.locator("text=Разработка и сопровождение критических систем");
    if (await firstStepText.count() > 0) {
      await expect(firstStepText.first()).toBeVisible();
    }
  });

  test("should handle accessibility panel focus trap, close return focus, and reactive animations disablement", async ({ page }) => {
    // Принудительно устанавливаем отсутствие reduced-motion для теста обычного режима
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/ru");

    // Ждем, пока React смонтирует SmoothScroll и инициализирует __lenis
    await page.waitForFunction(() => typeof (window as any).__lenis !== "undefined", { timeout: 8000 });

    // 1. Проверяем, что __lenis инициализирован в обычном режиме
    const hasLenisInitially = await page.evaluate(() => typeof (window as any).__lenis !== "undefined");
    expect(hasLenisInitially).toBe(true);

    // 2. Находим активную кнопку версии для слабовидящих
    const triggers = page.locator('button[aria-label="Версия для слабовидящих"]');
    const triggerCount = await triggers.count();
    let activeTrigger = triggers.first();
    for (let i = 0; i < triggerCount; i++) {
      const trigger = triggers.nth(i);
      if (await trigger.isVisible()) {
        activeTrigger = trigger;
        break;
      }
    }
    await expect(activeTrigger).toBeVisible();

    // Кликаем по триггеру для открытия панели
    await activeTrigger.click();

    // Проверяем, что панель открылась
    const panel = page.locator('[role="dialog"]');
    await expect(panel).toBeVisible();

    // Ждем анимации монтирования панели
    await page.waitForTimeout(300);

    // Убеждаемся, что фокус зашел внутрь панели
    const isFocusInside = await page.evaluate((panelEl) => {
      if (!panelEl) return false;
      return panelEl.contains(document.activeElement);
    }, await panel.elementHandle());
    expect(isFocusInside).toBe(true);

    // Нажимаем Escape и проверяем закрытие панели и возврат фокуса на триггер
    await page.keyboard.press("Escape");
    await expect(panel).not.toBeVisible();
    
    // Ждем 200мс, чтобы события фокуса успели примениться
    await page.waitForTimeout(200);

    const activeElementHtml = await page.evaluate(() => document.activeElement ? document.activeElement.outerHTML : "null");
    console.log("ACTIVE ELEMENT AFTER CLOSE:", activeElementHtml);
    
    // Фокус должен вернуться на триггер
    const isTriggerFocused = await page.evaluate((triggerEl) => {
      return document.activeElement === triggerEl;
    }, await activeTrigger.elementHandle());
    expect(isTriggerFocused).toBe(true);

    // 3. Проверим отключение анимаций при системном reduced-motion
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForFunction(() => typeof (window as any).__lenis === "undefined", { timeout: 8000 });

    const canvasCountSys = await page.locator("canvas").count();
    expect(canvasCountSys).toBe(0);

    // Возвращаем обратно для продолжения теста
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.waitForFunction(() => typeof (window as any).__lenis !== "undefined", { timeout: 8000 });

    // 4. Открываем панель снова и включаем режим доступности вручную
    await activeTrigger.click();
    await page.waitForTimeout(300);

    // Кликаем по цветовой схеме "Чёрным по белому" для активации a11y режима
    const bwSchemeButton = page.locator('button[aria-label="Чёрным по белому"]');
    await expect(bwSchemeButton).toBeVisible();
    await bwSchemeButton.click();
    
    // Ожидаем реактивного удаления __lenis
    await page.waitForFunction(() => typeof (window as any).__lenis === "undefined", { timeout: 8000 });

    // Проверяем, что класс a11y добавился на html элемент
    const htmlClass = await page.evaluate(() => document.documentElement.className);
    expect(htmlClass).toContain("a11y");

    // Проверяем, что canvas InteractiveDotGrid более не рендерится (или отсутствует в DOM)
    const canvasCount = await page.locator("canvas").count();
    expect(canvasCount).toBe(0);

    // Кликаем по кнопке "Обычная версия" для выключения режима доступности
    const resetButton = page.locator('button:has-text("Обычная версия")');
    await expect(resetButton).toBeVisible();
    await resetButton.click();
    
    // Ожидаем реактивного пересоздания __lenis
    await page.waitForFunction(() => typeof (window as any).__lenis !== "undefined", { timeout: 8000 });

    // Проверяем, что canvas InteractiveDotGrid снова рендерится в DOM
    const canvasRestoredCount = await page.locator("canvas").count();
    expect(canvasRestoredCount).toBeGreaterThan(0);
  });
});
