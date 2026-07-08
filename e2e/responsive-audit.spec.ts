import { test } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const PAGES = [
  "/en",
  "/en/about",
  "/en/services",
  "/en/mission",
  "/en/careers",
  "/en/contact",
  "/en/news"
];

const VIEWPORTS = [
  { width: 320, height: 568, name: "320x568" },
  { width: 375, height: 812, name: "375x812" },
  { width: 390, height: 844, name: "390x844" },
  { width: 430, height: 932, name: "430x932" },
  { width: 768, height: 1024, name: "768x1024" },
  { width: 1024, height: 768, name: "1024x768" }
];

const BASE_URL = "https://ddcnbsite.vercel.app";
const OUTPUT_DIR =
  process.env.RESPONSIVE_AUDIT_DIR ??
  path.join(process.cwd(), "test-results", "responsive-audit");

test.describe("Mobile Responsiveness Audit", () => {
  test.beforeAll(() => {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
  });

  for (const vp of VIEWPORTS) {
    for (const pagePath of PAGES) {
      test(`Audit ${pagePath} on ${vp.name}`, async ({ page }) => {
        // Set viewport size
        await page.setViewportSize({ width: vp.width, height: vp.height });

        // Navigate
        const url = `${BASE_URL}${pagePath}`;
        
        // Listen to console errors
        const consoleErrors: string[] = [];
        page.on("pageerror", (err) => {
          consoleErrors.push(err.message);
        });

        await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
        
        // Wait 3 seconds for animations and hydration
        await page.waitForTimeout(3000);

        // Check horizontal scroll
        const hasHScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });

        // Log results
        console.log(`[AUDIT] VP: ${vp.name} | Page: ${pagePath} | Has H-Scroll: ${hasHScroll} | Console Errors: ${consoleErrors.length}`);
        if (consoleErrors.length > 0) {
          console.log(`  -> Errors: ${consoleErrors.join("; ")}`);
        }

        // Take a screenshot
        const safePathName = pagePath.replace(/\//g, "_");
        const screenshotName = `${vp.name}${safePathName}.png`;
        const screenshotPath = path.join(OUTPUT_DIR, screenshotName);

        await page.screenshot({ path: screenshotPath, fullPage: true });
      });
    }
  }
});
