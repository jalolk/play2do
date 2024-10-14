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

describe('RegisterPage Integration Tests', () => {
  const mockRegister = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.spyOn(authStore, 'useAuthStore').mockImplementation(() => ({
      user: null,
      register: mockRegister,
    }));
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('submits the form with valid inputs and navigates on success', async () => {
    render(<RegisterPage />);
    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Register' });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'password123' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        'john@example.com',
        'password123',
        'John Doe',
      );
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays error message on registration failure', async () => {
    mockRegister.mockRejectedValueOnce(new Error('Registration failed'));
    render(<RegisterPage />);
    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Register' });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'password123' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Failed to register. Please try again.'),
      ).toBeInTheDocument();
    });
  });

  it('redirects to dashboard if user is already logged in', async () => {
    jest.spyOn(authStore, 'useAuthStore').mockImplementation(() => ({
      user: { id: 1 },
      register: mockRegister,
    }));
    render(<RegisterPage />);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
