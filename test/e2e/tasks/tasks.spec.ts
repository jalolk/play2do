import { test, expect } from '../fixtures/test.fixtures';

const task = {
  title: 'Test Task',
  description: 'Test Description',
};

test.describe('Task Management', () => {
  test.beforeEach(async ({ apiMocker, loginPage, tasksPage }) => {
    await apiMocker.mockAuthEndpoints();
    await apiMocker.mockTaskEndpoints();

    await loginPage.goto();
    await loginPage.login();

    await tasksPage.createTask(task.title, task.description);
  });

  test('should create new task', async ({ tasksPage }) => {
    await expect(tasksPage.getTaskTitle(task.title)).toBeVisible();
  });

  test('should delete task', async ({ tasksPage }) => {
    await tasksPage.deleteTask();

    await expect(tasksPage.getTaskTitle(task.title)).not.toBeVisible();
  });

  test('should toggle task completion', async ({ tasksPage }) => {
    const checkboxes = tasksPage.getTaskCheckbox();
    await expect(checkboxes).not.toBeChecked();

    await tasksPage.toggleTaskComplete();
    await expect(checkboxes).toBeChecked();
  });
});
