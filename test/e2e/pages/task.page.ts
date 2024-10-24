import { Page, Locator } from '@playwright/test';

export class TasksPage {
  constructor(private page: Page) {}

  // Locators
  private getAddTaskButton = () =>
    this.page.getByRole('button', { name: 'Add New Task' });
  private getTitleInput = () => this.page.getByPlaceholder('Enter task title');
  private getDescriptionInput = () =>
    this.page.getByPlaceholder('Enter task description');
  private getSubmitButton = () =>
    this.page.getByRole('button', { name: 'Add Task' });
  private getTaskByTitle = (title: string) => this.page.getByText(title);
  private getDeleteButton = () =>
    this.page.getByRole('button', { name: 'Delete' });
  private getCheckbox = () => this.page.getByRole('checkbox');

  // Actions
  async goto() {
    await this.page.goto('/dashboard');
  }

  async createTask(title: string, description: string) {
    await this.getAddTaskButton().click();
    await this.getTitleInput().fill(title);
    await this.getDescriptionInput().fill(description);
    await this.getSubmitButton().click();
  }

  async deleteTask(index?: number) {
    index
      ? await await this.getDeleteButton().all()[index].click()
      : await this.getDeleteButton().click();
  }

  async toggleTaskComplete(index?: number) {
    index
      ? this.page.getByRole('checkbox').all()[index].click()
      : this.page.getByRole('checkbox').click();
  }

  // Assertions helpers
  getTaskTitle(title: string): Locator {
    return this.getTaskByTitle(title);
  }

  getTaskCheckbox(index?: number): Locator {
    return index ? this.getCheckbox().all()[index] : this.getCheckbox();
  }
}
