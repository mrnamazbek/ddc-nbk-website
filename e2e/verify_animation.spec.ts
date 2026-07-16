import { test } from '@playwright/test';

test('Verify Variant B scroll milestones', async ({ page }) => {
  await page.goto('/en?variant=B');
  await page.waitForLoadState("domcontentloaded");
  
  // We need to wait for the WebGL canvas to render
  await page.waitForTimeout(2000); // Give Three.js some time to init

  const milestones = [0, 0.25, 0.50, 0.75, 1.0];
  
  for (const s of milestones) {
    // Scroll to the exact progress
    await page.evaluate((progress) => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, docHeight * progress);
    }, s);
    
    // Give time for scroll damping/springs to settle
    await page.waitForTimeout(1000);
    
    await page.screenshot({ path: `variant_b_${Math.round(s * 100)}.png` });
  }
});
