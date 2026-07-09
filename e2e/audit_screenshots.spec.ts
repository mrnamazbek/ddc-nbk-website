import { test, expect } from "@playwright/test";
import * as path from "path";

const ART_DIR = "/Users/namazbekbekzhanov/.gemini/antigravity-ide/brain/1b45dc03-e7ec-4159-a306-8aad0e9fabc1";

test.describe("Screenshot Audit", () => {
  test("audit pages and states", async ({ page }) => {
    test.setTimeout(120000);

    // 1. Desktop - Normal Mode - Services Page Scroll
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/ru/services");
    await page.waitForTimeout(3000);

    // Capture starting state (Slide 1 / CBDC)
    await page.screenshot({ path: path.join(ART_DIR, "audit_services_0.png") });

    // Scroll down to middle (Slide 2 / IPS)
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(ART_DIR, "audit_services_50.png") });

    // Scroll down further
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 3));
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(ART_DIR, "audit_services_100.png") });

    // 2. Mobile - Services Page Scroll
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/ru/services");
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(ART_DIR, "audit_services_mobile_0.png") });

    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(ART_DIR, "audit_services_mobile_50.png") });

    // 3. Accessibility mode on home, services, mission
    await page.goto("/ru");
    await page.waitForTimeout(2000);
    
    // Toggle accessibility
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
    await activeTrigger.click();
    await page.waitForTimeout(500);

    const bwSchemeButtons = page.locator('button[aria-label="Чёрным по белому"]');
    const bwCount = await bwSchemeButtons.count();
    let bwSchemeButton = bwSchemeButtons.first();
    for (let i = 0; i < bwCount; i++) {
      const btn = bwSchemeButtons.nth(i);
      if (await btn.isVisible()) {
        bwSchemeButton = btn;
        break;
      }
    }
    await expect(bwSchemeButton).toBeVisible();
    await bwSchemeButton.click();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);

    // Take screenshots in accessibility mode
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.screenshot({ path: path.join(ART_DIR, "audit_a11y_home_desktop.png") });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(ART_DIR, "audit_a11y_home_mobile.png") });

    // Go to services page in accessibility mode
    await page.goto("/ru/services");
    await page.waitForTimeout(2000);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.screenshot({ path: path.join(ART_DIR, "audit_a11y_services_desktop.png") });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(ART_DIR, "audit_a11y_services_mobile.png") });

    // Go to mission page in accessibility mode
    await page.goto("/ru/mission");
    await page.waitForTimeout(2000);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.screenshot({ path: path.join(ART_DIR, "audit_a11y_mission_desktop.png") });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(ART_DIR, "audit_a11y_mission_mobile.png") });
  });
});
