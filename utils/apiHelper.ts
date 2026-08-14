import { APIRequestContext, APIResponse, BrowserContext, request, } from "@playwright/test";

export class ApiHelper {
  private requestContext?: APIRequestContext;

  async initialize(context: BrowserContext): Promise<void> {
    const cookies = await context.cookies();

    this.requestContext = await request.newContext({
      baseURL: process.env.BASE_URL,
      extraHTTPHeaders: {
        Accept: "application/json",
      },
      storageState: {
        cookies,
        origins: [],
      },
    });
  }

  private getRequestContext(): APIRequestContext {
    if (!this.requestContext) {
      throw new Error(
        "API request context is not initialized. Call initialize() before making API requests.",
      );
    }

    return this.requestContext;
  }

  async getEmployees(): Promise<APIResponse> {
    const api = this.getRequestContext();

    return await api.get("/web/index.php/api/v2/pim/employees");
  }

  async findEmployeeById(employeeId: string): Promise<any> {
    const api = this.getRequestContext();

    const response = await api.get("/web/index.php/api/v2/pim/employees");

    if (!response.ok()) {
      throw new Error(
        `Failed to retrieve employees. Status: ${response.status()}`,
      );
    }

    const body = await response.json();

    const employee = body.data.find(
      (emp: any) => emp.employeeId === employeeId,
    );

    if (!employee) {
      throw new Error(
        `Employee with ID "${employeeId}" was not found through API`,
      );
    }

    return employee;
  }

  async getEmployeePersonalDetails(employeeId: string): Promise<APIResponse> {
    const api = this.getRequestContext();

    return await api.get(
      `/web/index.php/api/v2/pim/employees/${employeeId}/personal-details`,
    );
  }

  async employeeExists(employeeId: string): Promise<boolean> {
    const api = this.getRequestContext();

    const response = await api.get("/web/index.php/api/v2/pim/employees");

    if (!response.ok()) {
      throw new Error(
        `Failed to retrieve employees. Status: ${response.status()}`,
      );
    }

    const body = await response.json();

    return body.data.some(
      (employee: any) => employee.employeeId === employeeId,
    );
  }

  async dispose(): Promise<void> {
    if (this.requestContext) {
      await this.requestContext.dispose();
      this.requestContext = undefined;
    }
  }

  async waitForEmployeeDeletion(
    employeeId: string,
    timeout = 10000,
    interval = 1000,
  ): Promise<boolean> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const exists = await this.employeeExists(employeeId);

      if (!exists) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return false;
  }
}
