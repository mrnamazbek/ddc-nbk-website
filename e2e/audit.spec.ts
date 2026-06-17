import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const LOCALES = ["ru", "kz", "en"];
const ROUTES = [
  "",
  "/about",
  "/services",
  "/mission",
  "/news",
  "/careers",
  "/contact",
  "/faq",
  "/security",
  "/digital",
  "/analytics",
  "/ecommerce"
];

test.describe("DDC Site Quality Audit", () => {
  for (const locale of LOCALES) {
    for (const route of ROUTES) {
      const path = `/${locale}${route}`;

      test(`Audit page: ${path}`, async ({ page }) => {
        const consoleErrors: string[] = [];
        page.on("console", (msg) => {
          if (msg.type() === "error") {
            const text = msg.text();
            if (!text.includes("Failed to fetch vacancies from HH API")) {
              consoleErrors.push(text);
            }
          }
        });

        const failedRequests: string[] = [];
        page.on("requestfailed", (request) => {
          failedRequests.push(`${request.url()}: ${request.failure()?.errorText}`);
        });

        // Emulate reduced motion to disable opacity animations during audit
        await page.emulateMedia({ reducedMotion: "reduce" });

        // Navigate to page
        await page.goto(path);
        await page.waitForLoadState("load");
        await page.waitForSelector("footer", { timeout: 15000 });
        await page.waitForTimeout(2000);

        // 1. Check Console Errors
        expect(consoleErrors).toEqual([]);

        // 2. Check Failed Network Requests
        expect(failedRequests).toEqual([]);

        // 3. Check Horizontal Scroll / Overflows
        const overflowResult = await page.evaluate(() => {
          const docEl = document.documentElement;
          const bodyEl = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, bodyEl.scrollWidth);
          const clientWidth = docEl.clientWidth;
          const hasOverflow = scrollWidth > clientWidth + 2;

          // Find overflow elements if any
          const overflowingElements: string[] = [];
          if (hasOverflow) {
            const allElements = document.querySelectorAll("*");
            allElements.forEach((el) => {
              const rect = el.getBoundingClientRect();
              if (rect.right > window.innerWidth + 2) {
                overflowingElements.push(`${el.tagName}.${el.className.split(" ").join(".")}`);
              }
            });
          }

          return {
            hasOverflow,
            scrollWidth,
            clientWidth,
            overflowingElements: overflowingElements.slice(0, 10),
          };
        });

        expect(overflowResult.hasOverflow, `Page has horizontal scroll! scrollWidth: ${overflowResult.scrollWidth}, clientWidth: ${overflowResult.clientWidth}. Overflowing elements: ${overflowResult.overflowingElements.join(", ")}`).toBe(false);

        // 4. Run Axe Accessibility Check
        const axeResults = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();

        const criticalViolations = axeResults.violations.filter(
          v => v.impact === "critical" || v.impact === "serious"
        );

        if (criticalViolations.length > 0) {
          console.log(`AXE VIOLATIONS on ${path}:`, JSON.stringify(criticalViolations, null, 2));
        }

        expect(criticalViolations.length).toBe(0);
      });
    }
  }
});
