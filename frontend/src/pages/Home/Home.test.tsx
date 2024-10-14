import { render, screen } from '@testing-library/react';

import { HOME_CONSTANTS } from '../lib/constants';
import Home from '.';

const { TITLE, DESCRIPTION, BUTTONS, BUILT_AND_TESTED_WITH, TECH_STACK } =
  HOME_CONSTANTS;

describe('Home Component', () => {
  beforeEach(() => {
    render(<Home />);
  });

  test('renders the title', () => {
    const titleElement = screen.getByText(TITLE);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders the description', () => {
    const descriptionElement = screen.getByText(DESCRIPTION);
    expect(descriptionElement).toBeInTheDocument();
  });

  test('renders the primary button with correct href', () => {
    const primaryButton = screen.getByText(BUTTONS.PRIMARY.title);
    expect(primaryButton).toBeInTheDocument();
    expect(primaryButton.closest('a')).toHaveAttribute(
      'href',
      BUTTONS.PRIMARY.href,
    );
  });

  test('renders the secondary button with correct href', () => {
    const secondaryButton = screen.getByText(BUTTONS.SECONDARY.title);
    expect(secondaryButton).toBeInTheDocument();
    expect(secondaryButton.closest('a')).toHaveAttribute(
      'href',
      BUTTONS.SECONDARY.href,
    );
  });

  test('renders the "BUILT AND TESTED WITH" text', () => {
    const builtWithText = screen.getByText(BUILT_AND_TESTED_WITH);
    expect(builtWithText).toBeInTheDocument();
  });

  test('renders all tech stack icons', () => {
    const iconElement = screen.getAllByRole('img');
    expect(iconElement).toHaveLength(TECH_STACK.length);
  });
});
