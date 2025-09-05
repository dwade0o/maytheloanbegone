import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaymentFrequencySelector, { PaymentFrequency } from '@/components/shared/PaymentFrequencySelector';

describe('PaymentFrequencySelector', () => {
  const mockOnFrequencyChange = jest.fn();

  beforeEach(() => {
    mockOnFrequencyChange.mockClear();
  });

  it('renders all frequency options', () => {
    render(
      <PaymentFrequencySelector
        selectedFrequency="monthly"
        onFrequencyChange={mockOnFrequencyChange}
      />
    );

    expect(screen.getByText('Monthly')).toBeInTheDocument();
    expect(screen.getByText('Weekly')).toBeInTheDocument();
    expect(screen.getByText('Fortnightly')).toBeInTheDocument();
  });

  it('renders frequency descriptions', () => {
    render(
      <PaymentFrequencySelector
        selectedFrequency="monthly"
        onFrequencyChange={mockOnFrequencyChange}
      />
    );

    expect(screen.getByText('12 payments per year')).toBeInTheDocument();
    expect(screen.getByText('52 payments per year')).toBeInTheDocument();
    expect(screen.getByText('26 payments per year')).toBeInTheDocument();
  });

  it('shows monthly as selected by default', () => {
    render(
      <PaymentFrequencySelector
        selectedFrequency="monthly"
        onFrequencyChange={mockOnFrequencyChange}
      />
    );

    const monthlyButton = screen.getByText('Monthly').closest('button');
    expect(monthlyButton).toHaveClass('bg-primary'); // Default variant for selected
  });

  it('shows weekly as selected when selectedFrequency is weekly', () => {
    render(
      <PaymentFrequencySelector
        selectedFrequency="weekly"
        onFrequencyChange={mockOnFrequencyChange}
      />
    );

    const weeklyButton = screen.getByText('Weekly').closest('button');
    expect(weeklyButton).toHaveClass('bg-primary'); // Default variant for selected
  });

  it('shows fortnightly as selected when selectedFrequency is fortnightly', () => {
    render(
      <PaymentFrequencySelector
        selectedFrequency="fortnightly"
        onFrequencyChange={mockOnFrequencyChange}
      />
    );

    const fortnightlyButton = screen.getByText('Fortnightly').closest('button');
    expect(fortnightlyButton).toHaveClass('bg-primary'); // Default variant for selected
  });

  it('calls onFrequencyChange when weekly button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <PaymentFrequencySelector
        selectedFrequency="monthly"
        onFrequencyChange={mockOnFrequencyChange}
      />
    );

    const weeklyButton = screen.getByText('Weekly').closest('button');
    await user.click(weeklyButton!);

    expect(mockOnFrequencyChange).toHaveBeenCalledWith('weekly');
  });

  it('calls onFrequencyChange when fortnightly button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <PaymentFrequencySelector
        selectedFrequency="monthly"
        onFrequencyChange={mockOnFrequencyChange}
      />
    );

    const fortnightlyButton = screen.getByText('Fortnightly').closest('button');
    await user.click(fortnightlyButton!);

    expect(mockOnFrequencyChange).toHaveBeenCalledWith('fortnightly');
  });

  it('calls onFrequencyChange when monthly button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <PaymentFrequencySelector
        selectedFrequency="weekly"
        onFrequencyChange={mockOnFrequencyChange}
      />
    );

    const monthlyButton = screen.getByText('Monthly').closest('button');
    await user.click(monthlyButton!);

    expect(mockOnFrequencyChange).toHaveBeenCalledWith('monthly');
  });

  it('renders with proper accessibility attributes', () => {
    render(
      <PaymentFrequencySelector
        selectedFrequency="monthly"
        onFrequencyChange={mockOnFrequencyChange}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    
    buttons.forEach(button => {
      expect(button).toBeEnabled();
    });
  });

  it('has responsive grid layout', () => {
    render(
      <PaymentFrequencySelector
        selectedFrequency="monthly"
        onFrequencyChange={mockOnFrequencyChange}
      />
    );

    const container = screen.getByText('Payment Frequency').closest('div');
    expect(container).toHaveClass('space-y-3');
    
    const grid = container?.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'sm:grid-cols-3');
  });
});
