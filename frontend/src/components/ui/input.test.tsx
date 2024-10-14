import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './input';

describe('Input', () => {
  const renderInput = (props = {}) => {
    render(<Input {...props} />);
    return screen.getByRole('textbox');
  };

  test('renders input', () => {
    const input = renderInput();
    expect(input).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const input = renderInput({ className: 'custom-class' });
    expect(input).toHaveClass('custom-class');
  });

  test('handles user input correctly', async () => {
    const input = renderInput();
    await userEvent.type(input, 'Hello, World!');
    expect(input).toHaveValue('Hello, World!');
  });

  test('calls onChange handler', async () => {
    const handleChange = jest.fn();
    const input = renderInput({ onChange: handleChange });
    await userEvent.type(input, 'a');
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('respects disabled attribute', () => {
    const input = renderInput({ disabled: true });
    expect(input).toBeDisabled();
  });

  test('applies placeholder text', () => {
    const placeholder = 'Enter your name';
    const input = renderInput({ placeholder });
    expect(input).toHaveAttribute('placeholder', placeholder);
  });

  test('handles maxLength attribute', async () => {
    const input = renderInput({ maxLength: 5 });
    await userEvent.type(input, 'Too long input');
    expect(input).toHaveValue('Too l');
  });

  test('handles required attribute', () => {
    const input = renderInput({ required: true });
    expect(input).toBeRequired();
  });

  test('handles readOnly attribute', async () => {
    const input = renderInput({ readOnly: true, defaultValue: 'Read only' });
    await userEvent.type(input, 'Try to type');
    expect(input).toHaveValue('Read only');
  });

  test('applies custom data attributes', () => {
    const input = renderInput({ 'data-testid': 'custom-input' });
    expect(input).toHaveAttribute('data-testid', 'custom-input');
  });
});
