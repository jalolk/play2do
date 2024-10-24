import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';
import { TasksPage } from '../pages/task.page';
import { APIRequestMocker } from '../mock/handlers';

type Fixtures = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  tasksPage: TasksPage;
  apiMocker: APIRequestMocker;
};

export const test = base.extend<Fixtures>({
  apiMocker: async ({ page }, use) => {
    await use(new APIRequestMocker(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  tasksPage: async ({ page }, use) => {
    await use(new TasksPage(page));
  },
});

export { expect } from '@playwright/test';
