import { render, screen } from '@testing-library/react';
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

describe('DashboardPage Unit Tests', () => {
  beforeEach(() => {
    jest.spyOn(authStore, 'useAuthStore').mockImplementation(() => ({
      user: { id: 1 },
      logout: jest.fn(),
    }));
    jest.spyOn(taskStore, 'useTaskStore').mockImplementation(() => ({
      tasks: [],
      fetchTasks: jest.fn(),
      addTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
    }));
    (useNavigate as jest.Mock).mockReturnValue(jest.fn());
  });

  it('renders the dashboard page', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add New Task' }),
    ).toBeInTheDocument();
  });

  it('renders the task table headers', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
});
