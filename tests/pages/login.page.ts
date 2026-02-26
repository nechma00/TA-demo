import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly signInHeading: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly needAccountLink: Locator;
  readonly invalidCredentialsMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInHeading = page.getByRole('heading', { name: 'Sign in', level: 1 });
    this.emailInput = page.getByPlaceholder('Email');
    this.passwordInput = page.getByPlaceholder('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.needAccountLink = page.getByRole('link', { name: 'Need an account?' });
    this.invalidCredentialsMessage = page.getByText('Invalid email or password');
  }

  async goto() {
    await this.page.goto(`${process.env.BASE_URL}/#/login`);
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async openSignUp() {
    await this.needAccountLink.click();
  }
}
