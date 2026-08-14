import { Locator, Page } from '@playwright/test';

export class EmployeePage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly saveButton: Locator;
  readonly searchNameInput: Locator;
  readonly searchButton: Locator;
  readonly jobTitleDropdown: Locator;
  readonly employmentStatusDropdown: Locator;
  readonly jobMenu: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator(
      'input[name="firstName"], input#first_name',
    );
    this.lastNameInput = page.locator(
      'input[name="lastName"], input#last_name',
    );
    this.employeeIdInput = page.locator(
      'input[name="employeeId"], input#employee_id',
    );
    this.saveButton = page.locator('button:has-text("Save"), input#btnSave');
    this.searchNameInput = page.locator(
      'input[placeholder*="Employee Name"], input#empsearch_employee_name_empName',
    );
    this.searchButton = page.locator(
      'button:has-text("Search"), input#searchBtn',
    );
    this.jobTitleDropdown = page.locator(
      '.oxd-input-group:has(label:has-text("Job Title")) .oxd-select-text',
    );
    this.employmentStatusDropdown = page.locator(
      '.oxd-input-group:has(label:has-text("Employment Status")) .oxd-select-text',
    );
    this.jobMenu = page.locator('.orangehrm-tabs a:has-text("Job")');
    this.deleteButton = page.locator('button:has-text("Delete")');
  }

  async addEmployee(firstName: string, lastName: string, employeeId?: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    if (employeeId) {
      await this.employeeIdInput.fill(employeeId);
    }
    await this.saveButton.click();
  }

  async searchEmployee(name: string) {
    await this.searchNameInput.fill(name);
    await this.searchButton.click();
  }

  async updateJobTitle(jobTitle: string): Promise<void> {
    await this.jobMenu.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.jobTitleDropdown.click();
    await this.page.getByText(jobTitle, { exact: true }).click();
  }

  async updateEmploymentStatus(status: string): Promise<void> {
    await this.employmentStatusDropdown.click();
    await this.page.getByText(status, { exact: true }).click();
  }

  async saveChanges(): Promise<void> {
    await this.saveButton.click();
  }

  async getSelectedJobTitle(): Promise<string> {
    return await this.jobTitleDropdown.innerText();
  }

  async getSelectedEmploymentStatus(): Promise<string> {
    return await this.employmentStatusDropdown.innerText();
  }

  async deleteEmployee(employeeId: string): Promise<void> {
    const employeeRow = this.page.locator(".oxd-table-row").filter({
      hasText: employeeId,
    });
    await employeeRow.scrollIntoViewIfNeeded();

    await employeeRow
      .getByRole("button")
      .filter({
        has: this.page.locator("i.bi-trash"),
      })
      .last()
      .click();

    await this.page.getByRole("button", { name: /Yes, Delete/i }).click();
  }

  async getEmployeeRow(employeeId: string): Promise<Locator> {
    return this.page.locator(".oxd-table-row").filter({ hasText: employeeId });
  }

  async isEmployeeDisplayed(employeeId: string): Promise<boolean> {
    const employeeRow = this.page
      .locator(".oxd-table-row")
      .filter({ hasText: employeeId });

    return (await employeeRow.count()) > 0;
  }
}
