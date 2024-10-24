import { test, expect } from '../fixtures/test.fixtures';
import { generateTestUser } from '../utils/test.utils';
import { validUser } from '../mock/data';

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ apiMocker, registerPage }) => {
    await apiMocker.mockAuthEndpoints();
    await registerPage.goto();
  });

  test('should successfully registration with new user', async ({
    registerPage,
    page,
  }) => {
    const newUser = generateTestUser();
    await registerPage.register(newUser.name, newUser.email, newUser.password);

    await expect(page.getByText('Dashboard')).toBeVisible();
  });

  test('should fail registration with existing user', async ({
    registerPage,
  }) => {
    const existingUser = {
      name: validUser.name,
      email: validUser.email,
      password: validUser.password,
    };

    await registerPage.register(
      existingUser.name,
      existingUser.email,
      existingUser.password,
    );

    await expect(registerPage.getErrorMessage()).toBeVisible();
  });
});
