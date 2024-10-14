import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from './form';
import userEvent from '@testing-library/user-event';

// Mock component to test FormControl
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => <input ref={ref} {...props} />);

interface FormValues {
  test: string;
}

describe('FormComponent', () => {
  const TestForm: React.FC<{ onSubmit: SubmitHandler<FormValues> }> = ({
    onSubmit,
  }) => {
    const form = useForm<FormValues>();
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="test"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Input</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>This is a test input</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  };

  test('renders form components correctly', () => {
    render(<TestForm onSubmit={() => {}} />);

    expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('This is a test input')).toBeInTheDocument();
  });

  test('FormControl provides correct aria attributes', () => {
    render(<TestForm onSubmit={() => {}} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby');
    expect(input).toHaveAttribute('id');
  });

  test('FormMessage displays error message when form is invalid', async () => {
    const TestFormWithError = () => {
      const form = useForm<FormValues>({
        defaultValues: { test: '' },
      });
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})}>
            <FormField
              control={form.control}
              name="test"
              rules={{ required: 'This field is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button type="submit">Submit</button>
          </form>
        </Form>
      );
    };

    render(<TestFormWithError />);

    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Submit the form without entering any value
    await userEvent.click(submitButton);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
  });
});
