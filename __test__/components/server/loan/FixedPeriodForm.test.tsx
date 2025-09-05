import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FixedPeriodForm from '@/components/server/loan/FixedPeriodForm';

// Mock the FormField component
jest.mock('@/components/server/fields/FormField', () => ({
  __esModule: true,
  default: ({
    id,
    label,
    type,
    step,
    placeholder,
    icon,
    error,
    register,
    className,
    value,
    onChange,
  }: any) => (
    <div className={className} data-testid={`form-field-${id}`}>
      <label htmlFor={id} data-testid={`label-${id}`}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        step={step}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        data-testid={`input-${id}`}
      />
      {icon && <span data-testid={`icon-${id}`}>{icon}</span>}
      {error && <span data-testid={`error-${id}`}>{error.message}</span>}
    </div>
  ),
}));

// Mock the DateRange component
jest.mock('@/components/server/common/DateRange', () => ({
  __esModule: true,
  default: ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
  }: any) => (
    <div data-testid="date-range">
      <input
        data-testid="start-date"
        value={startDate}
        onChange={e => onStartDateChange(e.target.value)}
      />
      <input
        data-testid="end-date"
        value={endDate}
        onChange={e => onEndDateChange(e.target.value)}
      />
    </div>
  ),
}));

describe('FixedPeriodForm', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    onReset: jest.fn(),
    isCalculating: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<FixedPeriodForm {...defaultProps} />);
    expect(screen.getByTestId('form-field-loanAmount')).toBeInTheDocument();
    expect(screen.getByTestId('form-field-interestRate')).toBeInTheDocument();
    expect(
      screen.getByTestId('form-field-totalLoanTermYears')
    ).toBeInTheDocument();
  });

  it('renders all required form fields', () => {
    render(<FixedPeriodForm {...defaultProps} />);

    expect(screen.getByTestId('label-loanAmount')).toHaveTextContent(
      'Loan Amount ($)'
    );
    expect(screen.getByTestId('label-interestRate')).toHaveTextContent(
      'Fixed Interest Rate (%)'
    );
    expect(screen.getByTestId('label-totalLoanTermYears')).toHaveTextContent(
      'Total Loan Term (Years)'
    );
  });

  it('renders date range components', () => {
    render(<FixedPeriodForm {...defaultProps} />);
    const dateRanges = screen.getAllByTestId('date-range');
    expect(dateRanges).toHaveLength(2); // Fixed rate period and analysis period
  });

  it('renders submit button', () => {
    render(<FixedPeriodForm {...defaultProps} />);
    expect(
      screen.getByRole('button', { name: /calculate/i })
    ).toBeInTheDocument();
  });

  it('shows loading state when isCalculating is true', () => {
    render(<FixedPeriodForm {...defaultProps} isCalculating={true} />);
    expect(
      screen.getByRole('button', { name: /calculating/i })
    ).toBeInTheDocument();
  });

  it('disables submit button when loading', () => {
    render(<FixedPeriodForm {...defaultProps} isCalculating={true} />);
    const button = screen.getByRole('button', { name: /calculating/i });
    expect(button).toBeDisabled();
  });

  it('renders submit button that can be clicked', async () => {
    const user = userEvent.setup();
    render(<FixedPeriodForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /calculate/i });
    expect(submitButton).toBeInTheDocument();

    // Just verify the button is clickable (form validation will prevent actual submission)
    await user.click(submitButton);
    // Note: Form submission test is complex due to validation requirements
    // This test just verifies the button exists and is clickable
  });

  it('renders form fields with correct types', () => {
    render(<FixedPeriodForm {...defaultProps} />);

    const loanAmountInput = screen.getByTestId('input-loanAmount');
    const interestInput = screen.getByTestId('input-interestRate');
    const termInput = screen.getByTestId('input-totalLoanTermYears');

    expect(loanAmountInput).toHaveAttribute('type', 'number');
    expect(interestInput).toHaveAttribute('type', 'number');
    expect(termInput).toHaveAttribute('type', 'number');
  });

  it('renders step attributes for decimal inputs', () => {
    render(<FixedPeriodForm {...defaultProps} />);

    const loanAmountInput = screen.getByTestId('input-loanAmount');
    const interestInput = screen.getByTestId('input-interestRate');

    expect(loanAmountInput).toHaveAttribute('step', '0.01');
    expect(interestInput).toHaveAttribute('step', '0.01');
  });

  it('renders appropriate placeholders', () => {
    render(<FixedPeriodForm {...defaultProps} />);

    const loanAmountInput = screen.getByTestId('input-loanAmount');
    const interestInput = screen.getByTestId('input-interestRate');
    const termInput = screen.getByTestId('input-totalLoanTermYears');

    expect(loanAmountInput).toHaveAttribute('placeholder', 'e.g., 250000');
    expect(interestInput).toHaveAttribute('placeholder', 'e.g., 6.0');
    expect(termInput).toHaveAttribute('placeholder', 'e.g., 30');
  });
});
