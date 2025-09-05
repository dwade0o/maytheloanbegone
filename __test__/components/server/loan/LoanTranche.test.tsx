import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoanTrancheComponent from '@/components/server/loan/LoanTranche';

// Mock the DateRange component
jest.mock('@/components/server/common/DateRange', () => ({
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

describe('LoanTrancheComponent', () => {
  const defaultProps = {
    tranche: {
      id: '1',
      amount: '50000',
      interestRate: '5.5',
      startDate: '2024-01-01',
      endDate: '2029-01-01',
      label: 'Home Loan',
    },
    index: 0,
    onUpdate: jest.fn(),
    onRemove: jest.fn(),
    canRemove: true,
    errors: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<LoanTrancheComponent {...defaultProps} />);
    expect(screen.getByText('Loan Tranche 1')).toBeInTheDocument();
  });

  it('renders tranche number correctly', () => {
    render(<LoanTrancheComponent {...defaultProps} index={2} />);
    expect(screen.getByText('Loan Tranche 3')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // Circle number
  });

  it('renders tranche label field', () => {
    render(<LoanTrancheComponent {...defaultProps} />);
    expect(screen.getByLabelText('Label (Optional)')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Home Loan')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('e.g., Home Loan, Car Loan')
    ).toBeInTheDocument();
  });

  it('renders amount field', () => {
    render(<LoanTrancheComponent {...defaultProps} />);
    expect(screen.getByLabelText(/Amount \(\$\)/)).toBeInTheDocument();
    expect(screen.getByDisplayValue('50000')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., 40000')).toBeInTheDocument();
  });

  it('renders interest rate field', () => {
    render(<LoanTrancheComponent {...defaultProps} />);
    expect(screen.getByLabelText(/Interest Rate \(\%\)/)).toBeInTheDocument();
    expect(screen.getByDisplayValue('5.5')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., 5.5')).toBeInTheDocument();
  });

  it('renders date range component', () => {
    render(<LoanTrancheComponent {...defaultProps} />);
    expect(screen.getByTestId('date-range')).toBeInTheDocument();
  });

  it('shows remove button when canRemove is true', () => {
    render(<LoanTrancheComponent {...defaultProps} canRemove={true} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('hides remove button when canRemove is false', () => {
    render(<LoanTrancheComponent {...defaultProps} canRemove={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', async () => {
    const user = userEvent.setup();
    render(<LoanTrancheComponent {...defaultProps} />);

    const removeButton = screen.getByRole('button');
    await user.click(removeButton);

    expect(defaultProps.onRemove).toHaveBeenCalled();
  });

  it('calls onUpdate when label is changed', async () => {
    const user = userEvent.setup();
    render(<LoanTrancheComponent {...defaultProps} />);

    const labelInput = screen.getByLabelText('Label (Optional)');
    await user.clear(labelInput);
    await user.type(labelInput, 'New');

    // Check that onUpdate was called multiple times during typing
    expect(defaultProps.onUpdate).toHaveBeenCalled();
  });

  it('calls onUpdate when amount is changed', async () => {
    const user = userEvent.setup();
    render(<LoanTrancheComponent {...defaultProps} />);

    const amountInput = screen.getByLabelText(/Amount \(\$\)/);
    await user.clear(amountInput);
    await user.type(amountInput, '75');

    // Check that onUpdate was called multiple times during typing
    expect(defaultProps.onUpdate).toHaveBeenCalled();
  });

  it('calls onUpdate when interest rate is changed', async () => {
    const user = userEvent.setup();
    render(<LoanTrancheComponent {...defaultProps} />);

    const rateInput = screen.getByLabelText(/Interest Rate \(\%\)/);
    await user.clear(rateInput);
    await user.type(rateInput, '6');

    // Check that onUpdate was called (the exact final value may vary due to typing)
    expect(defaultProps.onUpdate).toHaveBeenCalledWith(
      'interestRate',
      expect.stringContaining('6')
    );
  });

  it('displays error messages when errors are provided', () => {
    const propsWithErrors = {
      ...defaultProps,
      errors: {
        amount: { message: 'Amount is required', type: 'required' },
        interestRate: {
          message: 'Interest rate is required',
          type: 'required',
        },
      },
    };

    render(<LoanTrancheComponent {...propsWithErrors} />);
    expect(screen.getByText('Amount is required')).toBeInTheDocument();
    expect(screen.getByText('Interest rate is required')).toBeInTheDocument();
  });

  it('handles empty label gracefully', () => {
    const propsWithEmptyLabel = {
      ...defaultProps,
      tranche: { ...defaultProps.tranche, label: '' },
    };

    render(<LoanTrancheComponent {...propsWithEmptyLabel} />);
    const labelInput = screen.getByLabelText('Label (Optional)');
    expect(labelInput).toHaveValue('');
  });
});
