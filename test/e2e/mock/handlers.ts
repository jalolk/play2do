import { type Page } from '@playwright/test';
import { validUser } from './data';

export interface MockConfig {
  statusCode?: number;
  delay?: number;
}

export class APIRequestMocker {
  constructor(private page: Page) {}

  async mockAuthEndpoints() {
    await this.page.route('**/auth/login', async (route) => {
      const body = JSON.parse(route.request().postData() || '{}');

      if (
        body.email === validUser.email &&
        body.password === validUser.password
      ) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            access_token: 'mock-jwt-token',
          }),
        });
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Invalid credentials',
          }),
        });
      }
    });

    await this.page.route('**/auth/register', async (route) => {
      const body = JSON.parse(route.request().postData() || '{}');

      if (body.email === validUser.email) {
        await route.fulfill({
          status: 409,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'User already exists',
          }),
        });
      } else {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            access_token: 'mock-jwt-token',
          }),
        });
      }
    });
  }

  async mockTaskEndpoints() {
    const tasks = new Map();
    let taskIdCounter = 1;

    // GET and POST /tasks
    await this.page.route('**/tasks', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(Array.from(tasks.values())),
        });
      } else if (route.request().method() === 'POST') {
        const body = JSON.parse(route.request().postData() || '{}');
        const newTask = {
          id: taskIdCounter++,
          ...body,
          completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        tasks.set(newTask.id, newTask);

        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(newTask),
        });
      }
    });

    // PUT and DELETE /tasks/:id
    await this.page.route(/\/tasks\/\d+/, async (route) => {
      const method = route.request().method();
      const taskId = parseInt(route.request().url().split('/').pop() || '0');

      if (method === 'PUT') {
        const body = JSON.parse(route.request().postData() || '{}');

        if (tasks.has(taskId)) {
          const updatedTask = {
            ...tasks.get(taskId),
            ...body,
            updated_at: new Date().toISOString(),
          };
          tasks.set(taskId, updatedTask);

          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(updatedTask),
          });
        } else {
          await route.fulfill({
            status: 404,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Task not found' }),
          });
        }
      } else if (method === 'DELETE') {
        if (tasks.has(taskId)) {
          tasks.delete(taskId);
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Task deleted' }),
          });
        } else {
          await route.fulfill({
            status: 404,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Task not found' }),
          });
        }
      }
    });
  }
}
