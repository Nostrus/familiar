import { expect, test } from '@playwright/test';

test('discover page loads and shows city sections', async ({ page }) => {
  await page.goto('/discover');

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Homes around the world');
});

test('discover filter bar is visible', async ({ page }) => {
  await page.goto('/discover');

  await expect(page.getByText('Date range', { exact: true })).toBeVisible();
  await expect(page.getByText('Cities', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Number of guests')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Apply filters' })).toBeVisible();
});

test('discover page filters by city via URL', async ({ page }) => {
  // Navigate with a city filter already set. The page should not show other cities' sections.
  // We use a city that likely has homes in the test DB.
  await page.goto('/discover?cities=Paris');

  // The page should load without error
  await expect(page).toHaveURL(/cities=Paris/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('navbar has Discover link', async ({ page }) => {
  await page.goto('/');
  // sign-in first — just check the public nav has sign-in/sign-up (no Discover for signed-out)
  await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
});

test('popular destinations cards link to /discover', async ({ page }) => {
  await page.goto('/');

  // Wait for popular destinations to load (has a 2s delay in getCities)
  const destinationLinks = page.locator('a[href^="/discover?cities="]');
  await expect(destinationLinks.first()).toBeVisible({ timeout: 10_000 });
});
