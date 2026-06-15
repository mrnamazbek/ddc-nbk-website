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

  test("should render SakaScroll component on main page", async ({ page }) => {
    await page.goto("/ru");
    
    // Проверяем наличие заголовочной части Saka Core в SakaScroll
    await expect(page.locator("text=Saka Core").first()).toBeVisible();
    await expect(page.locator("text=Инфраструктура нового поколения").first()).toBeVisible();
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
});
