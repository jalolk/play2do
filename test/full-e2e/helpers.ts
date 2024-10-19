import { type Page } from '@playwright/test';

const VALID_EMAIL = 'user@example.com';
const VALID_PASSWORD = 'yourpassword';

class LoginPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('http://localhost:5173');
    await this.page.getByRole('button', { name: 'Get Started' }).click();
  }

  async login(email: string = VALID_EMAIL, password: string = VALID_PASSWORD) {
    await this.page.getByPlaceholder('Enter your email').fill(email);
    await this.page.getByPlaceholder('Enter your password').fill(password);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
  }

  async logout() {
    await this.page.getByRole('button', { name: 'Logout' }).click();
  }
}

export async function setupLoginPage(page: Page): Promise<LoginPage> {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  return loginPage;
}
