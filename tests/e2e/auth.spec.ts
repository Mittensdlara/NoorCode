import { test, expect } from '@playwright/test';

test('landing page loads and has CTA', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: /get started/i })).toBeVisible();
});
