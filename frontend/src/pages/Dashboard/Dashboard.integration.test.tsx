import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DashboardPage from '.';
import * as authStore from '../../store/authStore';
import * as taskStore from '../../store/taskStore';
import { useNavigate } from 'react-router-dom';

jest.mock('../../store/authStore', () => ({
  useAuthStore: jest.fn(),
}));
jest.mock('../../store/taskStore', () => ({
  useTaskStore: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('DashboardPage Integration Tests', () => {
  const mockLogout = jest.fn();
  const mockNavigate = jest.fn();
  const mockFetchTasks = jest.fn();
  const mockAddTask = jest.fn();
  const mockUpdateTask = jest.fn();
  const mockDeleteTask = jest.fn();

  beforeEach(() => {
    jest.spyOn(authStore, 'useAuthStore').mockImplementation(() => ({
      user: { id: 1 },
      logout: mockLogout,
    }));
    jest.spyOn(taskStore, 'useTaskStore').mockImplementation(() => ({
      tasks: [
        {
          id: 1,
          title: 'Test Task',
          description: 'Test Description',
          completed: false,
        },
      ],
      fetchTasks: mockFetchTasks,
      addTask: mockAddTask,
      updateTask: mockUpdateTask,
      deleteTask: mockDeleteTask,
    }));
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('fetches tasks on mount', async () => {
    render(<DashboardPage />);
    await waitFor(() => expect(mockFetchTasks).toHaveBeenCalled());
  });

  it('handles logout', async () => {
    render(<DashboardPage />);
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('renders tasks and allows toggling completion', async () => {
    render(<DashboardPage />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalledWith(1, { completed: true });
    });
  });

  it('allows deleting a task', async () => {
    render(<DashboardPage />);
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    await waitFor(() => {
      expect(mockDeleteTask).toHaveBeenCalledWith(1);
    });
  });
});
