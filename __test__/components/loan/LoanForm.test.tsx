import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoanForm from '@/components/loan/LoanForm';

// Mock the FormField component
jest.mock('@/components/fields/FormField', () => ({
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
        data-testid={`input-${id}`}
      />
      {icon && <span data-testid={`icon-${id}`}>{icon}</span>}
      {error && <span data-testid={`error-${id}`}>{error.message}</span>}
    </div>
  ),
}));

// Mock the DateRange component
jest.mock('@/components/common/DateRange', () => ({
  __esModule: true,
  default: ({ startDate, endDate, startLabel, endLabel }: any) => (
    <div data-testid="date-range">
      <div data-testid="start-date-section">
        <label data-testid="start-date-label">
          {startLabel || 'Start Date'}
        </label>
        <input
          data-testid="start-date-input"
          value={startDate?.value || ''}
          onChange={() => {}}
        />
      </div>
      <div data-testid="end-date-section">
        <label data-testid="end-date-label">{endLabel || 'End Date'}</label>
        <input
          data-testid="end-date-input"
          value={endDate?.value || ''}
          onChange={() => {}}
        />
      </div>
    </div>
  ),
}));

describe('LoanForm', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    onReset: jest.fn(),
    isCalculating: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<LoanForm {...defaultProps} />);
    expect(screen.getByTestId('form-field-loanAmount')).toBeInTheDocument();
    expect(screen.getByTestId('form-field-interestRate')).toBeInTheDocument();
  });

  it('renders title and description', () => {
    render(<LoanForm {...defaultProps} />);
    expect(screen.getByText('Loan Details')).toBeInTheDocument();
    expect(
      screen.getByText('Enter your loan information to calculate payments')
    ).toBeInTheDocument();
  });

  it('renders loan amount field', () => {
    render(<LoanForm {...defaultProps} />);
    expect(screen.getByTestId('label-loanAmount')).toHaveTextContent(
      'Loan Amount ($)'
    );
    expect(screen.getByTestId('input-loanAmount')).toHaveAttribute(
      'type',
      'number'
    );
    expect(screen.getByTestId('input-loanAmount')).toHaveAttribute(
      'step',
      '0.01'
    );
    expect(screen.getByTestId('input-loanAmount')).toHaveAttribute(
      'placeholder',
      'e.g., 250000'
    );
  });

  it('renders interest rate field', () => {
    render(<LoanForm {...defaultProps} />);
    expect(screen.getByTestId('label-interestRate')).toHaveTextContent(
      'Annual Interest Rate (%)'
    );
    expect(screen.getByTestId('input-interestRate')).toHaveAttribute(
      'type',
      'number'
    );
    expect(screen.getByTestId('input-interestRate')).toHaveAttribute(
      'step',
      '0.01'
    );
    expect(screen.getByTestId('input-interestRate')).toHaveAttribute(
      'placeholder',
      'e.g., 5.5'
    );
  });

  it('renders interest rate field with icon', () => {
    render(<LoanForm {...defaultProps} />);
    expect(screen.getByTestId('icon-interestRate')).toBeInTheDocument();
  });

  it('renders date range component', () => {
    render(<LoanForm {...defaultProps} />);
    expect(screen.getByTestId('date-range')).toBeInTheDocument();
    expect(screen.getByTestId('start-date-section')).toBeInTheDocument();
    expect(screen.getByTestId('end-date-section')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<LoanForm {...defaultProps} />);
    expect(
      screen.getByRole('button', { name: /calculate/i })
    ).toBeInTheDocument();
  });

  it('shows loading state when isCalculating is true', () => {
    render(<LoanForm {...defaultProps} isCalculating={true} />);
    expect(
      screen.getByRole('button', { name: /calculating/i })
    ).toBeInTheDocument();
  });

  it('disables submit button when loading', () => {
    render(<LoanForm {...defaultProps} isCalculating={true} />);
    const button = screen.getByRole('button', { name: /calculating/i });
    expect(button).toBeDisabled();
  });

  it('renders submit button that can be clicked', async () => {
    const user = userEvent.setup();
    render(<LoanForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /calculate/i });
    expect(submitButton).toBeInTheDocument();

    // Just verify the button is clickable (form validation will prevent actual submission)
    await user.click(submitButton);
    // Note: Form submission test is complex due to validation requirements
    // This test just verifies the button exists and is clickable
  });
});
