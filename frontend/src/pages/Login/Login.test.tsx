import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '.';
import * as authStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

jest.mock('../../store/authStore', () => ({
  useAuthStore: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('LoginPage Unit Tests', () => {
  beforeEach(() => {
    jest.spyOn(authStore, 'useAuthStore').mockImplementation(() => ({
      user: null,
      login: jest.fn(),
    }));
    (useNavigate as jest.Mock).mockReturnValue(jest.fn());
  });

  it('renders the login form', () => {
    render(<LoginPage />);
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('validates form inputs', async () => {
    render(<LoginPage />);
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      expect(
        screen.getByText('Password must be at least 6 characters'),
      ).toBeInTheDocument();
    });
  });

  it('allows input in email and password fields', () => {
    render(<LoginPage />);
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });
});
