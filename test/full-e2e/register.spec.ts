import { test, expect } from '@playwright/test';

const Name = 'User';
const Email = 'user@email.com';
const Password = 'password';

test.describe('Register', () => {
  test('should allow me to register', async ({ page }) => {
    await page.goto('http://localhost:5173/register');

    await page.route('**/auth/register', async (route) => {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'some_token',
        }),
      });
    });

    await page.getByPlaceholder('Enter your name').fill(Name);
    await page.getByPlaceholder('Enter your email').fill(Email);
    await page.getByPlaceholder('Enter your password').fill(Password);
    await page.getByPlaceholder('Confirm your password').fill(Password);

    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page.getByText('Dashboard')).toBeVisible();
  });

  test('should me not to register when user exists', async ({ page }) => {
    await page.goto('http://localhost:5173/register');

    await page.route('**/auth/register', async (route) => {
      route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'User already exists',
          error: 'Conflict',
          statusCode: 409,
        }),
      });
    });

    await page.getByPlaceholder('Enter your name').fill(Name);
    await page.getByPlaceholder('Enter your email').fill(Email);
    await page.getByPlaceholder('Enter your password').fill(Password);
    await page.getByPlaceholder('Confirm your password').fill(Password);

    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page.getByText('Failed to register. Please')).toBeVisible();
  });
});
