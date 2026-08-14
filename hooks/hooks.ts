import { Before, After } from "@cucumber/cucumber";
import { chromium } from "@playwright/test";
import { CustomWorld } from "./CustomWorld";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { PIMPage } from "../pages/PIMPage";
import { EmployeePage } from "../pages/EmployeePage";
import { ApiHelper } from "../utils/apiHelper";
import fs from "fs";
import path from "path";

Before(async function (this: CustomWorld) {
  this.browser = await chromium.launch({
    headless: process.env.CI === "true",
  });

  const videosDir = path.join(process.cwd(), "videos");

  fs.mkdirSync(videosDir, { recursive: true });

  this.context = await this.browser.newContext({
    recordVideo: {
      dir: videosDir,
      size: {
        width: 1280,
        height: 720,
      },
    },
  });

  this.page = await this.context.newPage();

  this.loginPage = new LoginPage(this.page);
  this.dashboardPage = new DashboardPage(this.page);
  this.pimPage = new PIMPage(this.page);
  this.employeePage = new EmployeePage(this.page);

  this.apiHelper = new ApiHelper();
});

After(async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === "FAILED" && this.page) {
    const screenshotsDir = path.join(process.cwd(), "screenshots");

    fs.mkdirSync(screenshotsDir, { recursive: true });

    const safeName = scenario.pickle.name
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();

    const screenshotPath = path.join(screenshotsDir, `${safeName}.png`);

    await this.page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });

    console.log(`Failure screenshot saved: ${screenshotPath}`);
  }

  if (this.apiHelper) {
    await this.apiHelper.dispose();
  }

  if (this.context) {
    await this.context.close();
  }

  if (this.browser) {
    await this.browser.close();
  }
});