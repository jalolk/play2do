import { test, expect } from '@playwright/test';
import { setupLoginPage } from './helpers';

const VALID_EMAIL = 'user@example.com';
const VALID_PASSWORD = 'yourpassword';
const INVALID_EMAIL = 'wrongemail@example.com';
const INVALID_PASSWORD = 'wrongpassword';

test.describe('Login', () => {
  test('should allow me to login', async ({ page }) => {
    const loginPage = await setupLoginPage(page);
    await loginPage.login();

    await expect(
      page.getByRole('heading', { name: 'Dashboard' }),
    ).toBeVisible();
  });

  test('should allow me to log out and redirect to the login page', async ({
    page,
  }) => {
    const loginPage = await setupLoginPage(page);
    await loginPage.login();

    await expect(
      page.getByRole('heading', { name: 'Dashboard' }),
    ).toBeVisible();

    await loginPage.logout();
    await expect(page).toHaveURL(/login/);
  });

  test('should show an error message if the email is invalid', async ({
    page,
  }) => {
    const loginPage = await setupLoginPage(page);
    await loginPage.login(INVALID_EMAIL, VALID_PASSWORD);

    await expect(
      page.getByRole('heading', { name: 'Dashboard' }),
    ).not.toBeVisible();
    await expect(page.getByText('Failed to login. Please check')).toBeVisible();
  });

  test('should show an error message if the password is invalid', async ({
    page,
  }) => {
    const loginPage = await setupLoginPage(page);
    await loginPage.login(VALID_EMAIL, INVALID_PASSWORD);

    await expect(
      page.getByRole('heading', { name: 'Dashboard' }),
    ).not.toBeVisible();
    await expect(page.getByText('Failed to login. Please check')).toBeVisible();
  });
});
