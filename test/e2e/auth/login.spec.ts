import { test, expect } from '../fixtures/test.fixtures';
import { validUser } from '../mock/data';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ apiMocker, loginPage }) => {
    await apiMocker.mockAuthEndpoints();
    await loginPage.goto();
  });

  test('should successfully login with valid credentials', async ({
    loginPage,
  }) => {
    await loginPage.login(validUser.email, validUser.password);

    await expect(loginPage.getDashboardHeading()).toBeVisible();
  });

  test('should fail login with invalid credentials', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('invalid@example.com', 'wrongpassword');

    await expect(loginPage.getErrorMessage()).toBeVisible();
    await expect(loginPage.getDashboardHeading()).not.toBeVisible();
  });
});
