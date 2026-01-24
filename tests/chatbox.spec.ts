import { test, expect } from '@playwright/test';

test('test name', async ({ page }) => {
  await page.goto('/');

  await page.fill('#chatbox-message-field', 'Hello World');
  await page.click('#send');

  await expect(page.locator('.message').last()).toContainText('Hello World');
});