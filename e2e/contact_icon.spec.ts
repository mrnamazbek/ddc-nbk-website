import { test, expect } from '@playwright/test';

const ARTIFACTS_DIR = '/Users/namazbekbekzhanov/.gemini/antigravity-ide/brain/1b45dc03-e7ec-4159-a306-8aad0e9fabc1';

test('Verify Send Request button icon is visible', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  // Navigate to contact page
  await page.goto('/ru/contact');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Locate the submit button
  const submitButton = page.locator('button[type="submit"]').first();
  await expect(submitButton).toBeVisible();

  // Scroll to the submit button
  await submitButton.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Capture screenshot of the form area
  await page.screenshot({ path: `${ARTIFACTS_DIR}/contact_form.png` });

  // Locate the SVG icon inside the button
  const svgIcon = submitButton.locator('svg').first();
  await expect(svgIcon).toBeVisible();

  // Capture focused screenshot of the button
  await submitButton.screenshot({ path: `${ARTIFACTS_DIR}/submit_button.png` });

  console.log("Send request icon is verified successfully and screenshots are captured.");
});
