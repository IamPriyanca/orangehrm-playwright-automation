import { Given, When, Then } from "@cucumber/cucumber";
import { CustomWorld } from "../hooks/CustomWorld";
import employeeData from "../test-data/employee.json";
import { generateEmployeeId } from "../utils/testData";
import { env } from "../utils/env";
import { expect } from '@playwright/test';

Given("I am on the OrangeHRM login page", async function (this: CustomWorld) {
  await this.loginPage.goto();
});

When("I login with valid OrangeHRM credentials", async function (this: CustomWorld) {
  await this.loginPage.login(env.username, env.password);
  await this.dashboardPage.verifyDashboard();
  await this.apiHelper.initialize(this.context);
});

When("I navigate to the PIM module", async function (this: CustomWorld) {
  await this.dashboardPage.navigateToPIM();
});

When("I navigate to the Add Employee page", async function (this: CustomWorld) {
  await this.pimPage.navigateToAddEmployee();
});

When("I add a new employee with valid details", async function (this: CustomWorld) {
  this.employeeId = generateEmployeeId();
  await this.pimPage.enterEmployeeDetails(
    employeeData.firstName,
    employeeData.lastName,
    this.employeeId,
  );
});

When("I upload the employee profile picture", async function (this: CustomWorld) {
  await this.pimPage.uploadProfilePicture("test-assets/profile.png");
});

When("I save the employee", async function (this: CustomWorld) {
  await this.pimPage.saveEmployee();
});

Then("the employee should be created successfully", async function (this: CustomWorld) {
  await this.pimPage.verifyEmployeeCreated();
});

When("I search for the newly created employee", async function (this: CustomWorld) {
  await this.pimPage.navigateToEmployeeList();
  await this.pimPage.searchEmployeeById(this.employeeId);
  await this.pimPage.openEmployee(this.employeeId);
});

When("I update the employee Job Title", async function (this: CustomWorld) {
  await this.employeePage.updateJobTitle(employeeData.jobTitle);
});

When("I update the employee Employment Status", async function (this: CustomWorld) {
  await this.employeePage.updateEmploymentStatus(
    employeeData.employmentStatus,
  );
});

When("I save the employee changes", async function (this: CustomWorld) {
  await this.employeePage.saveChanges();
});

Then('the employee information should be updated successfully', async function (this: CustomWorld) {
  const actualJobTitle = await this.employeePage.getSelectedJobTitle();
  const actualEmploymentStatus = await this.employeePage.getSelectedEmploymentStatus();

  expect(
    actualJobTitle,
    'Job Title should match the updated value'
  ).toContain(employeeData.jobTitle);

  expect(
    actualEmploymentStatus,
    'Employment Status should match the updated value'
  ).toContain(employeeData.employmentStatus);
});

When("I validate the employee through the API", async function (this: CustomWorld) {
    this.apiEmployee = await this.apiHelper.findEmployeeById(this.employeeId);
    console.log("API Employee:", this.apiEmployee);
  },
);

Then("the API employee information should match the UI information", async function (this: CustomWorld) {
    expect(this.apiEmployee,"Employee should exist in the API response",).toBeDefined();
    expect(this.apiEmployee.employeeId,"API Employee ID should match UI Employee ID",).toBe(this.employeeId);
    expect(this.apiEmployee.firstName,"API first name should match UI data",).toBe(employeeData.firstName);
    expect(this.apiEmployee.lastName,"API last name should match UI data",).toBe(employeeData.lastName);
  },
);

When("I delete the employee", async function (this: CustomWorld) {
  await this.pimPage.navigateToEmployeeList();
  await this.pimPage.searchEmployeeById(this.employeeId);
  await this.employeePage.deleteEmployee(this.employeeId);
});

Then("the employee should no longer exist in the UI", async function (this: CustomWorld) {
    const employeeExists = await this.employeePage.isEmployeeDisplayed(
      this.employeeId,
    );

    expect(
      employeeExists,
      `Employee ${this.employeeId} should not exist after deletion`,
    ).toBe(false);
  },
);

Then("the employee should no longer exist through the API", async function (this: CustomWorld) {
    const employeeDeleted = await this.apiHelper.waitForEmployeeDeletion(this.employeeId,10000,1000,);
    expect(employeeDeleted,`Employee ${this.employeeId} should not exist in the API after deletion`,).toBe(true);
  },
);

When("I logout", async function (this: CustomWorld) {
  await this.dashboardPage.logout();
});

Then("I should be redirected to the login page", async function (this: CustomWorld) {
    await expect(this.page).toHaveURL(/auth\/login/);
  },
);

Then("I should not be able to access the PIM page without logging in", async function (this: CustomWorld) {
    await this.page.goto(
      `${process.env.BASE_URL}/web/index.php/pim/viewEmployeeList`,
    );
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.page).toHaveURL(/auth\/login/);
  },
);