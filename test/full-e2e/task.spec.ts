import { test, expect } from '@playwright/test';
import { setupLoginPage } from './helpers';

const Task = {
  title: 'Task 1',
  description: 'Description 1',
};

test.describe.serial('Task', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = await setupLoginPage(page);
    await loginPage.login();

    await page.waitForLoadState('networkidle');
  });

  test('should allow me to create a task', async ({ page }) => {
    await page.getByRole('button', { name: 'Add New Task' }).click();

    await page.getByPlaceholder('Enter task title').fill(Task.title);
    await page
      .getByPlaceholder('Enter task description')
      .fill(Task.description);

    await page.getByRole('button', { name: 'Add Task' }).click();

    await expect(page.getByText(Task.title)).toBeVisible();
    await expect(page.getByText(Task.description)).toBeVisible();
  });

  test('should allow me to toggle a task as complete', async ({ page }) => {
    const checkBox = page.getByRole('checkbox').first();

    await expect(checkBox).not.toBeChecked();

    await checkBox.click();

    await expect(checkBox).toBeChecked();
  });

  test('should allow me to delete a task', async ({ page }) => {
    const deleteBtns = await page.getByRole('button', { name: 'Delete' }).all();

    console.log(deleteBtns);

    for (let deleteBtn of deleteBtns) {
      await deleteBtn.click();
    }

    await expect(page.getByText(Task.title)).not.toBeVisible();
    await expect(page.getByText(Task.description)).not.toBeVisible();
  });
});
