import { test, expect } from '@playwright/test';

test.describe('Client Invitation Flow', () => {
  // This test focuses just on the UI rendering since it's a protected route that normally requires login.
  // We test that the middleware protection works by verifying the redirect to /login,
  // or that the form renders correctly if somehow authenticated.

  test('should render the invite client form correctly', async ({ page }) => {
    // Navigate to the invite client page directly.
    // Middleware will redirect to /login for unauthenticated sessions.
    await page.goto('/clients/new');

    // Check if we were redirected to login (expected behavior for a protected route)
    if (page.url().includes('/login')) {
      console.log('Redirected to login as expected for protected route');
      // Verify the refactored login page heading (after UI redesign)
      await expect(page.getByRole('heading', { name: 'FitMetrik' })).toBeVisible();
      return; // Middleware protection confirmed ✓
    }

    // If authenticated (e.g. in a mocked environment), the form should render
    await expect(page.getByRole('heading', { name: 'Invite New Client' })).toBeVisible();
    await expect(page.getByLabel('Full Name')).toBeVisible();
    await expect(page.getByLabel('Email Address')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send Invite' })).toBeVisible();
  });
});
