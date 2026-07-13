import { expect, test } from "@playwright/test";

const locales = ["ru", "kz", "en"] as const;
const publicRoutes = ["", "/about", "/services", "/mission", "/news", "/careers", "/contact", "/faq", "/security", "/digital", "/analytics", "/ecommerce"] as const;

test.describe("public route smoke checks", () => {
  test("core localized pages render without page errors", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(`${page.url()}: ${error.message}`));

    await page.emulateMedia({ reducedMotion: "reduce" });

    for (const locale of locales) {
      for (const route of publicRoutes) {
        const response = await page.goto(`/${locale}${route}`, { waitUntil: "domcontentloaded" });
        expect(response?.status(), `/${locale}${route} should return 200`).toBe(200);
        await expect(page.locator("#main")).toBeVisible();
        await expect(page.locator("footer")).toBeVisible();
      }
    }

    expect(pageErrors).toEqual([]);
  });
});
