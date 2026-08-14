import { setWorldConstructor, World } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { PIMPage } from '../pages/PIMPage';
import { EmployeePage } from '../pages/EmployeePage';
import { ApiHelper } from "../utils/apiHelper";

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  loginPage!: LoginPage;
  dashboardPage!: DashboardPage;
  pimPage!: PIMPage;
  employeeId!: string;
  employeePage!: EmployeePage;
  apiHelper!: ApiHelper;
  apiEmployee!: any;
}

setWorldConstructor(CustomWorld);