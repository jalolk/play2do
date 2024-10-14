import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '.';
import * as authStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

jest.mock('../../store/authStore', () => ({
  useAuthStore: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('RegisterPage Unit Tests', () => {
  beforeEach(() => {
    jest.spyOn(authStore, 'useAuthStore').mockImplementation(() => ({
      user: null,
      register: jest.fn(),
    }));
    (useNavigate as jest.Mock).mockReturnValue(jest.fn());
  });

  it('renders the registration form', () => {
    render(<RegisterPage />);
    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Register' }),
    ).toBeInTheDocument();
  });

  it('validates form inputs', async () => {
    render(<RegisterPage />);
    const submitButton = screen.getByRole('button', { name: 'Register' });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Name must be at least 2 characters'),
      ).toBeInTheDocument();
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      expect(
        screen.getByText('Password must be at least 6 characters'),
      ).toBeInTheDocument();
    });
  });

  it('validates password confirmation', async () => {
    render(<RegisterPage />);
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Register' });

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'password321' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    });
  });

  it('allows input in all fields', () => {
    render(<RegisterPage />);
    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'password123' },
    });

    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(confirmPasswordInput).toHaveValue('password123');
  });
});
