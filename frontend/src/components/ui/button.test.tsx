import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

type Variant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';
type Size = 'default' | 'sm' | 'lg' | 'icon';

const variants: Variant[] = [
  'default',
  'destructive',
  'outline',
  'secondary',
  'ghost',
  'link',
];
const sizes: Size[] = ['default', 'sm', 'lg', 'icon'];

describe('Button', () => {
  const renderButton = (props = {}, children = 'Click me') => {
    render(<Button {...props}>{children}</Button>);
    return screen.getByRole('button');
  };

  test('renders button with default props', () => {
    const button = renderButton();
    expect(button).toBeInTheDocument();
  });

  test('renders button with custom className', () => {
    const button = renderButton({ className: 'custom-class' }, 'Custom Button');
    expect(button).toHaveClass('custom-class');
  });

  test.each(variants)('renders button with the %s variant', (variant) => {
    const button = renderButton({ variant });
    expect(button).toBeInTheDocument();
  });

  test.each(sizes)('renders button with the %s size', (size) => {
    const button = renderButton({ size });
    expect(button).toBeInTheDocument();
  });

  test('renders as child when asChild prop is true', () => {
    render(
      <Button asChild>
        <a href="/">Link Button</a>
      </Button>,
    );
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
  });

  test('applies event handlers', async () => {
    const handleClick = jest.fn();
    const button = renderButton({ onClick: handleClick });
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('disables button when disabled prop is true', () => {
    const button = renderButton({ disabled: true }, 'Disabled Button');
    expect(button).toBeDisabled();
  });

  test('button is not disabled by default', () => {
    const button = renderButton({}, 'Enabled Button');
    expect(button).not.toBeDisabled();
  });
});
