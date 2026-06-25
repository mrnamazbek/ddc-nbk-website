import { test, expect } from '@playwright/test';

// Путь к папке артефактов для сохранения скриншотов
const ARTIFACTS_DIR = '/Users/namazbekbekzhanov/.gemini/antigravity/brain/d4d0c84c-eed3-4011-b13f-d0000dd5fd01';

test.describe('Visual QA - Interactive Shader Background & UI Elements', () => {
  let consoleErrors: string[] = [];

  test.beforeEach(({ page }) => {
    consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes("Encountered a script tag while rendering React component")) {
          consoleErrors.push(text);
        }
      }
    });
  });

  test('Desktop Viewport - Shader background idle & mouse interaction, Navigation & Map', async ({ page }) => {
    // Устанавливаем десктопное разрешение
    await page.setViewportSize({ width: 1440, height: 900 });

    // Открываем главную страницу
    await page.goto('/ru');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Даем время для инициализации WebGL

    // 1. Проверяем наличие WebGL холста
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // Делаем первый скриншот (курсор в покое)
    await page.screenshot({ path: `${ARTIFACTS_DIR}/screenshot_desktop_idle.png` });

    // 2. Имитируем движение мыши (перемещение в центр экрана)
    const width = 1440;
    const height = 900;
    await page.mouse.move(width / 2, height / 2);
    
    // Даем время для пружинной анимации расталкивания
    await page.waitForTimeout(1000);
    
    // Делаем скриншот после перемещения мыши (точки должны разбежаться)
    await page.screenshot({ path: `${ARTIFACTS_DIR}/screenshot_desktop_hover.png` });

    // 3. Проверяем интерактивность навигации
    // Наводим курсор на ссылку "Услуги" в шапке
    const servicesLink = page.locator('a[href="/ru/services"]');
    if (await servicesLink.count() > 0) {
      await servicesLink.hover();
      await page.waitForTimeout(500); // Даем время для появления превью-карточки
      await page.screenshot({ path: `${ARTIFACTS_DIR}/screenshot_navbar_preview.png` });
    }

    // 4. Переходим на страницу контактов и проверяем интерактивную карту
    await page.goto('/ru/contact');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // Убеждаемся, что интерактивная карта отображается
    const mapContainer = page.locator('svg[viewBox="0 0 1000 600"]'); // контейнер карты Казахстана
    if (await mapContainer.count() > 0) {
      await expect(mapContainer).toBeVisible();
      
      // Наводим на пин Астаны или Алматы
      const pin = page.locator('circle').first();
      if (await pin.count() > 0) {
        await pin.hover();
        await page.waitForTimeout(500);
      }
      await page.screenshot({ path: `${ARTIFACTS_DIR}/screenshot_map.png` });
    }

    // Убеждаемся, что консольных ошибок при этих операциях не было
    const errors = consoleErrors.filter(err => !err.includes('favicon'));
    if (errors.length > 0) {
      console.error("CONSOLE ERRORS DETECTED:", errors);
    }
    expect(errors.length).toBe(0);
  });

  test('Tablet Viewport - Responsive check', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/ru');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    await page.screenshot({ path: `${ARTIFACTS_DIR}/screenshot_tablet.png` });
    const errors = consoleErrors.filter(err => !err.includes('favicon'));
    if (errors.length > 0) {
      console.error("CONSOLE ERRORS DETECTED:", errors);
    }
    expect(errors.length).toBe(0);
  });

  test('Mobile Viewport - Responsive check & mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/ru');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // Скриншот мобильной версии
    await page.screenshot({ path: `${ARTIFACTS_DIR}/screenshot_mobile.png` });

    // Проверяем, что мобильное меню открывается
    const menuButton = page.locator('button[aria-label="Toggle menu"], button[aria-label="Открыть меню"]');
    if (await menuButton.count() > 0) {
      await menuButton.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${ARTIFACTS_DIR}/screenshot_mobile_menu.png` });
    }
    const errors = consoleErrors.filter(err => !err.includes('favicon'));
    if (errors.length > 0) {
      console.error("CONSOLE ERRORS DETECTED:", errors);
    }
    expect(errors.length).toBe(0);
  });

  test('Reduced Motion Check - Canvas should not mount', async ({ page }) => {
    // Включаем эмуляцию reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await page.goto('/ru');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Убеждаемся, что canvas не смонтирован
    const canvas = page.locator('canvas');
    await expect(canvas).not.toBeVisible();
  });

  test('MCP Playground Page - Bento Grid & Background Beams (RU & EN)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    for (const locale of ['ru', 'en']) {
      await page.goto(`/${locale}/test-mcp`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Убеждаемся, что элементы Bento Grid и фоновые лучи видны
      const bentoItems = page.locator('.group\\/bento');
      await expect(bentoItems.first()).toBeVisible();

      // Убеждаемся, что блок тарифов (Bento Pricing) отображается
      const pricingCards = page.locator('.group\\/pricing');
      await expect(pricingCards).toHaveCount(3);

      await page.screenshot({ path: `${ARTIFACTS_DIR}/screenshot_test_mcp_${locale}.png` });
    }

    const errors = consoleErrors.filter(err => !err.includes('favicon'));
    if (errors.length > 0) {
      console.error("CONSOLE ERRORS DETECTED:", errors);
    }
    expect(errors.length).toBe(0);
  });
});
