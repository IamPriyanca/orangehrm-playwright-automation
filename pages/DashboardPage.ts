import { Locator, Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly dashboardHeader: Locator;
  readonly pimMenu: Locator;
  readonly logoutMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardHeader = page.locator('h6.oxd-topbar-header-breadcrumb-module');
    this.pimMenu = page.getByText('PIM', { exact: true });
    this.logoutMenu = page.getByText('Logout', { exact: true });
  }

  async verifyDashboard(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.dashboardHeader.waitFor({ state: 'visible' });
  }

  async navigateToPIM(): Promise<void> {
    await this.pimMenu.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async logout(): Promise<void> {
    await this.page
      .locator('.oxd-userdropdown-tab')
      .click();

    await this.logoutMenu.click();
  }
}