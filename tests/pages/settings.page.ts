import { Page, Locator } from '@playwright/test';

export class SettingsPage {
  readonly page: Page;
  readonly settingsHeading: Locator;
  readonly profileImageUrlInput: Locator;
  readonly usernameInput: Locator;
  readonly bioInput: Locator;
  readonly emailInput: Locator;
  readonly newPasswordInput: Locator;
  readonly updateSettingsButton: Locator;
  readonly logoutButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.settingsHeading = page.getByRole('heading', { name: 'Your Settings', level: 1 });
    this.profileImageUrlInput = page.getByPlaceholder('URL of profile picture');
    this.usernameInput = page.getByPlaceholder('Your Name');
    this.bioInput = page.getByPlaceholder('Short bio about you');
    this.emailInput = page.getByPlaceholder('Email');
    this.newPasswordInput = page.getByPlaceholder('New Password');
    this.updateSettingsButton = page.getByRole('button', { name: 'Update Settings' });
    this.logoutButton = page.getByRole('button', { name: 'Or click here to logout.' });
    this.successMessage = page.getByText('Updated successfully!');
  }

  async goto() {
    await this.page.goto(`${process.env.BASE_URL}/#/settings`);
  }

  async updateProfile(data: {
    image?: string;
    username?: string;
    bio?: string;
    email?: string;
    password?: string;
  }) {
    if (data.image !== undefined) {
      await this.profileImageUrlInput.fill(data.image);
    }

    if (data.username !== undefined) {
      await this.usernameInput.fill(data.username);
    }

    if (data.bio !== undefined) {
      await this.bioInput.fill(data.bio);
    }

    if (data.email !== undefined) {
      await this.emailInput.fill(data.email);
    }

    if (data.password !== undefined) {
      await this.newPasswordInput.fill(data.password);
    }

    await this.updateSettingsButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }
}
