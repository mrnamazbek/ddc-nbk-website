import { test, expect } from "@playwright/test";

test("Language dropdown switcher works correctly", async ({ page }) => {
  // Navigate to the home page (which redirects to localized /ru or /en depending on default)
  await page.goto("http://localhost:3000/");

  // Verify the header is visible
  const header = page.locator("header");
  await expect(header).toBeVisible();

  // Locate the language selector button (trigger)
  const langTrigger = page.locator('button[aria-label="Select Language"]').first();
  await expect(langTrigger).toBeVisible();

  // Click the trigger to open the dropdown
  await langTrigger.click();

  // Verify the dropdown menu containing English option is visible
  const englishOption = page.locator('button:has-text("English")');
  await expect(englishOption).toBeVisible();

  // Click English to switch locale
  await englishOption.click();

  // Verify the URL changed to include /en
  await expect(page).toHaveURL(/\/en/);

  // Trigger again to verify it works in localized view
  await langTrigger.click();

  const russianOption = page.locator('button:has-text("Русский")');
  await expect(russianOption).toBeVisible();
});
