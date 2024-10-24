import { Page, Locator } from '@playwright/test';
import { validUser } from '../mock/data';

export class LoginPage {
  constructor(private page: Page) {}

  // Locators
  private getEmailInput = () => this.page.getByPlaceholder('Enter your email');
  private getPasswordInput = () =>
    this.page.getByPlaceholder('Enter your password');
  private getSignInButton = () =>
    this.page.getByRole('button', { name: 'Sign in' });
  private getDashboard = () => this.page.getByText('Dashboard');
  private getError = () => this.page.getByRole('alert');

  // Actions
  async goto() {
    await this.page.goto('/login');
  }

  async login(
    email: string = validUser.email,
    password: string = validUser.password,
  ) {
    await this.getEmailInput().fill(email);
    await this.getPasswordInput().fill(password);
    await this.getSignInButton().click();
  }

  // Assertions helpers
  getDashboardHeading(): Locator {
    return this.getDashboard();
  }

  getErrorMessage(): Locator {
    return this.getError();
  }
}
