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

    // Nonce-based script-src: у каждого ответа свой nonce, и в script-src не
    // должно быть 'unsafe-inline' — иначе CSP не защищает от XSS.
    const scriptSrc = headers["content-security-policy"]
      .split(";")
      .find((d) => d.trim().startsWith("script-src"))!;
    expect(scriptSrc).toMatch(/'nonce-[A-Za-z0-9+/=]+'/);
    expect(scriptSrc).toContain("'strict-dynamic'");
    expect(scriptSrc).not.toContain("'unsafe-inline'");

    const second = await request.get("/ru");
    const secondNonce = second.headers()["content-security-policy"].match(/'nonce-([^']+)'/)?.[1];
    const firstNonce = scriptSrc.match(/'nonce-([^']+)'/)?.[1];
    expect(firstNonce).toBeTruthy();
    expect(secondNonce).toBeTruthy();
    expect(secondNonce).not.toBe(firstNonce);
  });

  test("contact form does not pre-claim successful delivery", async ({ page }) => {
    await page.goto("/en/contact", { waitUntil: "domcontentloaded" });

    await expect(page.locator("form")).toBeVisible();
    await expect(page.locator("input#name")).toBeVisible();
    await expect(page.locator("input#email")).toBeVisible();
    await expect(page.locator("button[type=submit]")).toBeVisible();
    await expect(page.getByText("Your request has been successfully registered.")).toHaveCount(0);
  });

  test("contact intake accepts only same-origin JSON requests", async ({ request, baseURL }) => {
    const submission = {
      name: "Release QA",
      email: "qa@example.test",
      organization: "DDC QA",
      message: "This is a valid contact endpoint security test.",
    };

    const crossOrigin = await request.post("/api/contact", {
      headers: { "Content-Type": "application/json", Origin: "https://attacker.example" },
      data: submission,
    });
    expect(crossOrigin.status()).toBe(403);

    const nonJson = await request.post("/api/contact", {
      headers: { "Content-Type": "text/plain", Origin: new URL(baseURL!).origin },
      data: JSON.stringify(submission),
    });
    expect(nonJson.status()).toBe(415);
  });
});
