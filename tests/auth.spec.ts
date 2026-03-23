import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {

  test('should render the login page correctly', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('/login');

    // 2. Verify URL and page heading (brand title after UI refactor)
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.getByRole('heading', { name: 'FitMetrik' })).toBeVisible();

    // 3. Verify the subtitle
    await expect(page.getByText('Sign in to your account')).toBeVisible();

    // 4. Verify password tab form fields (default tab)
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('should show both login tabs', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('button', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Magic Link' })).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/login');

    // Attempt login with fake credentials (password tab is the default)
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('wrongpassword123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // The action redirects to /login?error=... which shows a styled Alert
    await expect(page.getByText('Invalid email or password')).toBeVisible({ timeout: 10000 });
  });

});
