import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {

  test('should render the login page correctly', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('/login');

    // 2. Verify URL and page title
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.getByRole('heading', { name: 'Nutritionist Login' })).toBeVisible();

    // 3. Verify form fields exist
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  // Example test for what happens on a failed login
  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Attempt login with fake credentials
    await page.getByLabel('Email address').fill('test@example.com');
    await page.getByLabel('Password').fill('wrongpassword123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // The Supabase Auth Provider is not configured in E2E environments,
    // so we just want to ensure it tries and shows an error message.
    await expect(page.getByText('Invalid login credentials')).toBeVisible({ timeout: 10000 });
  });

});
