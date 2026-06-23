import { test, expect } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";

test.describe("Variant B Animation & Scroll Verification", () => {
  const artifactDir = "/Users/namazbekbekzhanov/.gemini/antigravity/brain/98940bcf-dbde-4c7d-af20-7ba0f58cde8f";

  test("should load Variant B, scroll to milestones, capture screenshots and assert correctness", async ({ page }) => {
    // 1. Monitor console errors
    const consoleErrors: string[] = [];
    page.on("pageerror", (error) => {
      consoleErrors.push(error.message);
    });

    // 2. Set desktop viewport size
    await page.setViewportSize({ width: 1280, height: 800 });

    // 3. Navigate to Russian homepage with variant B
    await page.goto("/ru?variant=B");

    // Wait for the page and components to be hydrated
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);

    // Milestones to scroll and verify
    const milestones = [
      { pct: 0, label: "0_top" },
      { pct: 25, label: "25_dome" },
      { pct: 50, label: "50_sphere" },
      { pct: 75, label: "75_diagonal_start" },
      { pct: 100, label: "100_yield_curve" },
    ];

    for (const milestone of milestones) {
      // Calculate scroll position
      const scrollPosition = await page.evaluate((fraction) => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const targetScroll = docHeight * fraction;
        window.scrollTo(0, targetScroll);
        return {
          scrollY: window.scrollY,
          docHeight,
          targetScroll
        };
      }, milestone.pct / 100);

      console.log(`Scrolled to ${milestone.pct}%: target=${scrollPosition.targetScroll}, actual=${scrollPosition.scrollY}`);
      
      // Wait for Three.js MathUtils.damp / Lenis scroll smoothing to fully ease in
      await page.waitForTimeout(800);

      // Verify that at least one canvas element exists in normal mode
      const canvasCount = await page.locator("canvas").count();
      expect(canvasCount).toBeGreaterThan(0);

      // Verify header/text content exists on screen
      if (milestone.pct === 0) {
        // Hero screen active
        const mainHeader = page.locator("h1");
        await expect(mainHeader).toBeVisible();
      } else if (milestone.pct === 50) {
        // Stats screen active
        const statsHeader = page.locator("text=Национального Банка");
        await expect(statsHeader.first()).toBeVisible();
      } else if (milestone.pct === 100) {
        // Services screen active
        const servicesHeader = page.locator("text=Наши услуги и направления");
        await expect(servicesHeader.first()).toBeVisible();
      }

      // Take screenshot and save to the artifacts folder
      const screenshotPath = path.join(artifactDir, `variant_b_${milestone.pct}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`Saved screenshot for ${milestone.pct}% to ${screenshotPath}`);

      // Verify screenshot file exists
      expect(fs.existsSync(screenshotPath)).toBe(true);
    }

    // Verify 0 console errors were thrown
    expect(consoleErrors).toEqual([]);
  });

  test("should support reduced-motion / a11y fallback without WebGL canvas", async ({ page }) => {
    // Emulate reduced motion
    await page.emulateMedia({ reducedMotion: "reduce" });

    // Navigate to Variant B
    await page.goto("/ru?variant=B");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);

    // Verify that NO canvas element is rendered in reduced motion mode
    const canvasCount = await page.locator("canvas").count();
    expect(canvasCount).toBe(0);

    // Verify that key text content is still present
    const mainHeader = page.locator("h1");
    await expect(mainHeader).toBeVisible();
  });
});
