import { expect, test } from "@playwright/test";

test.describe("browser security contract", () => {
  test("serves a restrictive baseline header set", async ({ request }) => {
    const response = await request.get("/ru");
    const headers = response.headers();

    expect(response.status()).toBe(200);
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["x-powered-by"]).toBeUndefined();
    expect(headers["content-security-policy"]).toContain("default-src 'self'");
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["content-security-policy"]).toContain("object-src 'none'");
  });

  test("contact form does not pre-claim successful delivery", async ({ page }) => {
    await page.goto("/en/contact", { waitUntil: "domcontentloaded" });

    await expect(page.locator("form")).toBeVisible();
    await expect(page.locator("input#name")).toBeVisible();
    await expect(page.locator("input#email")).toBeVisible();
    await expect(page.locator("button[type=submit]")).toBeVisible();
    await expect(page.getByText("Your request has been successfully registered.")).toHaveCount(0);
  });
});
