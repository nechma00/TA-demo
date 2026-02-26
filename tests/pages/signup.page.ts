import { Page, Locator } from '@playwright/test';

export class SignupPage {
  readonly page: Page;
  readonly signUpHeading: Locator;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signUpButton: Locator;
  readonly haveAccountLink: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signUpHeading = page.getByRole('heading', { name: 'Sign up', level: 1 });
    this.usernameInput = page.getByPlaceholder('Username');
    this.emailInput = page.getByPlaceholder('Email');
    this.passwordInput = page.getByPlaceholder('Password');
    this.signUpButton = page.getByRole('button', { name: 'Sign up' });
    this.haveAccountLink = page.getByRole('link', { name: 'Have an account?' });
    this.successMessage = page.getByText('Registration successful. Redirecting to login page...');
  }

  async goto() {
    await this.page.goto(`${process.env.BASE_URL}/#/register`);
  }

  async register(username: string, email: string, password: string) {
    await this.usernameInput.fill(username);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signUpButton.click();
  }

  async openLogin() {
    await this.haveAccountLink.click();
  }
}
