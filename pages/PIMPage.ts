import { expect, Locator, Page } from '@playwright/test';

export class PIMPage {
  
  readonly page: Page;
  readonly addEmployeeMenu: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly profilePictureInput: Locator;
  readonly saveButton: Locator;
  readonly employeeListMenu: Locator;
  readonly employeeIdSearchInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addEmployeeMenu = page.getByText('Add Employee', {exact: true}).first();
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.employeeIdInput = page.locator('.oxd-input-group:has(label:has-text("Employee Id")) input.oxd-input');
    this.profilePictureInput = page.locator('input[type="file"]');
    this.saveButton = page.getByRole('button', {name: 'Save'});
    this.employeeListMenu = page.getByText('Employee List', {exact: true});
    this.employeeIdSearchInput = page.locator('.oxd-input-group:has(label:has-text("Employee Id")) input.oxd-input');    
    this.searchButton = page.getByRole('button', {name: 'Search'});
    this.resetButton = page.getByRole('button', {name: 'Reset'});
  }

  async navigateToAddEmployee(): Promise<void> {
    await this.addEmployeeMenu.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async enterEmployeeDetails(
    firstName: string,
    lastName: string,
    employeeId: string
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.employeeIdInput.fill('');
    await this.employeeIdInput.fill(employeeId);
  }

  async uploadProfilePicture(
    filePath: string
  ): Promise<void> {
    await this.profilePictureInput.setInputFiles(filePath);
  }

  async saveEmployee(): Promise<void> {
    await this.saveButton.click();
  }

  async verifyEmployeeCreated(): Promise<void> {
    await expect(
      this.page.getByText('Successfully Saved', {
        exact: false
      })
    ).toBeVisible();
  }

  async navigateToEmployeeList(): Promise<void> {
    await this.employeeListMenu.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async searchEmployeeById(employeeId: string): Promise<void> {
    await this.employeeIdSearchInput.fill(employeeId);
    await this.searchButton.click();
  }

  async openEmployee(employeeId: string): Promise<void> {
   await this.page.getByText(employeeId, { exact: true }).click();
  }

}

