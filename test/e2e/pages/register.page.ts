import { Page, Locator } from '@playwright/test';

export class RegisterPage {
  constructor(private page: Page) {}

  // Locators
  private getNameInput = () => this.page.getByPlaceholder('Enter your name');
  private getEmailInput = () => this.page.getByPlaceholder('Enter your email');
  private getPasswordInput = () =>
    this.page.getByPlaceholder('Enter your password');
  private getConfirmPasswordInput = () =>
    this.page.getByPlaceholder('Confirm your password');
  private getRegisterButton = () =>
    this.page.getByRole('button', { name: 'Register' });
  private getError = () => this.page.getByRole('alert');

  // Actions
  async goto() {
    await this.page.goto('/register');
  }

  async register(name: string, email: string, password: string) {
    await this.getNameInput().fill(name);
    await this.getEmailInput().fill(email);
    await this.getPasswordInput().fill(password);
    await this.getConfirmPasswordInput().fill(password);
    await this.getRegisterButton().click();
  }

  // Assertions helpers
  getErrorMessage(): Locator {
    return this.getError();
  }
}
