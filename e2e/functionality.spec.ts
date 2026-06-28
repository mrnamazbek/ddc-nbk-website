import { expect, test } from "@playwright/test";

const locales = ["ru", "kz", "en"] as const;
const coreRoutes = ["", "/about", "/services", "/mission", "/news", "/careers", "/contact", "/security"] as const;

test.describe("Functionality smoke coverage", () => {
  test("core public routes are reachable in every locale", async ({ page }) => {
    for (const locale of locales) {
      for (const route of coreRoutes) {
        const response = await page.goto(`/${locale}${route}`, { waitUntil: "domcontentloaded" });
        expect(response?.status(), `/${locale}${route} should return 200`).toBe(200);
        await expect(page.locator("body")).not.toContainText("404");
      }
    }
  });

  test("home page exposes verifiable functionality journeys", async ({ page }) => {
    await page.goto("/ru", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Работоспособность и функционал")).toBeVisible();
    await expect(page.getByText("Маршруты и языки")).toBeVisible();
    await expect(page.getByText("Контактные сценарии")).toBeVisible();
    await expect(page.getByText("Доступность и стабильность")).toBeVisible();
    await expect(page.getByText("Доказательный контент")).toBeVisible();

    await page.getByRole("link", { name: /Контактные сценарии/i }).click();
    await expect(page).toHaveURL(/\/ru\/contact$/);
    await expect(page.getByText("1477").first()).toBeVisible();
  });
});
