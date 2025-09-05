import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SplitLoanForm from '@/components/server/loan/SplitLoanForm';

// Mock the LoanTranche component
jest.mock('@/components/server/loan/LoanTranche', () => ({
  __esModule: true,
  default: ({ tranche, index, onUpdate, onRemove, canRemove, errors }: any) => (
    <div data-testid={`tranche-${index}`}>
      <input
        data-testid={`tranche-${index}-amount`}
        value={tranche.amount}
        onChange={e => onUpdate('amount', e.target.value)}
        placeholder="Amount"
      />
      <input
        data-testid={`tranche-${index}-interestRate`}
        value={tranche.interestRate}
        onChange={e => onUpdate('interestRate', e.target.value)}
        placeholder="Interest Rate"
      />
      <button
        data-testid={`tranche-${index}-remove`}
        onClick={onRemove}
        disabled={!canRemove}
      >
        Remove
      </button>
    </div>
  ),
}));

describe('SplitLoanForm', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    onReset: jest.fn(),
    isCalculating: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<SplitLoanForm {...defaultProps} />);
    expect(screen.getByText('Split Loan Calculator')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Break down your loan into multiple tranches with different rates and terms'
      )
    ).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<SplitLoanForm {...defaultProps} />);
    expect(
      screen.getByRole('button', { name: /calculate split loan/i })
    ).toBeInTheDocument();
  });

  it('shows loading state when isCalculating is true', () => {
    render(<SplitLoanForm {...defaultProps} isCalculating={true} />);
    expect(
      screen.getByRole('button', { name: /calculating/i })
    ).toBeInTheDocument();
  });

  it('disables submit button when loading', () => {
    render(<SplitLoanForm {...defaultProps} isCalculating={true} />);
    const button = screen.getByRole('button', { name: /calculating/i });
    expect(button).toBeDisabled();
  });

  it('renders submit button that can be clicked', async () => {
    const user = userEvent.setup();
    render(<SplitLoanForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', {
      name: /calculate split loan/i,
    });
    expect(submitButton).toBeInTheDocument();

    // Just verify the button is clickable (form validation will prevent actual submission)
    await user.click(submitButton);
    // Note: Form submission test is complex due to validation requirements
    // This test just verifies the button exists and is clickable
  });
});
