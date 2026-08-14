import { Locator, Page } from '@playwright/test';
import { env } from '../utils/env';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"], input#txtUsername');
    this.passwordInput = page.locator('input[name="password"], input#txtPassword');
    this.loginButton = page.locator('button[type="submit"], input#btnLogin, button#btnLogin');
  }

  async goto() {
    await this.page.goto(env.baseUrl);
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}