import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FixedRateLoanForm from '@/components/server/loan/FixedRateLoanForm';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
      <div {...props}>{children}</div>
    ),
  },
}));

// Mock the DateRange component
jest.mock('@/components/server/common/DateRange', () => ({
  __esModule: true,
  default: ({ 
    startDate, 
    endDate, 
    startLabel, 
    endLabel 
  }: { 
    startDate?: { value: string; onChange: (value: string) => void }; 
    endDate?: { value: string; onChange: (value: string) => void };
    startLabel?: string;
    endLabel?: string;
  }) => (
    <div data-testid="date-range">
      <div data-testid="start-date-section">
        <label data-testid="start-date-label">
          {startLabel || 'Start Date'}
        </label>
        <input
          data-testid="start-date-input"
          value={startDate?.value || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => startDate?.onChange?.(e.target.value)}
        />
      </div>
      <div data-testid="end-date-section">
        <label data-testid="end-date-label">{endLabel || 'End Date'}</label>
        <input
          data-testid="end-date-input"
          value={endDate?.value || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => endDate?.onChange?.(e.target.value)}
        />
      </div>
    </div>
  ),
}));

// Mock the FixedRatePeriod component
jest.mock('@/components/server/loan/FixedRatePeriod', () => ({
  __esModule: true,
  default: ({ 
    period, 
    index, 
    onUpdate, 
    onRemove, 
    canRemove 
  }: { 
    period: { label?: string; interestRate?: string; startDate?: string; endDate?: string };
    index: number;
    onUpdate: (field: string, value: string) => void;
    onRemove: () => void;
    canRemove: boolean;
  }) => (
    <div data-testid={`fixed-rate-period-${index}`}>
      <h3>Fixed Rate Period {index + 1}</h3>
      <input
        data-testid={`period-label-${index}`}
        value={period.label || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate('label', e.target.value)}
      />
      <input
        data-testid={`period-rate-${index}`}
        value={period.interestRate || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate('interestRate', e.target.value)}
      />
      <input
        data-testid={`period-start-${index}`}
        value={period.startDate || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate('startDate', e.target.value)}
      />
      <input
        data-testid={`period-end-${index}`}
        value={period.endDate || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate('endDate', e.target.value)}
      />
      {canRemove && (
        <button data-testid={`remove-period-${index}`} onClick={onRemove}>
          Remove
        </button>
      )}
    </div>
  ),
}));

describe('FixedRateLoanForm', () => {
  const mockProps = {
    onSubmit: jest.fn(),
    onReset: jest.fn(),
    isCalculating: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with correct title and description', () => {
    render(<FixedRateLoanForm {...mockProps} />);
    
    expect(screen.getByText('Fixed Rate Loan Calculator')).toBeInTheDocument();
    expect(screen.getByText('Calculate loan payments with different interest rates for different time periods')).toBeInTheDocument();
  });

  it('renders loan amount field', () => {
    render(<FixedRateLoanForm {...mockProps} />);
    
    expect(screen.getByLabelText('Loan Amount ($)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., 250000')).toBeInTheDocument();
  });

  it('renders date range fields', () => {
    render(<FixedRateLoanForm {...mockProps} />);
    
    expect(screen.getByTestId('start-date-input')).toBeInTheDocument();
    expect(screen.getByTestId('end-date-input')).toBeInTheDocument();
  });

  it('renders fixed rate periods section', () => {
    render(<FixedRateLoanForm {...mockProps} />);
    
    expect(screen.getByText('Fixed Rate Periods')).toBeInTheDocument();
    expect(screen.getByText('Add Period')).toBeInTheDocument();
  });

  it('renders initial fixed rate period', () => {
    render(<FixedRateLoanForm {...mockProps} />);
    
    expect(screen.getByText('Fixed Rate Period 1')).toBeInTheDocument();
  });

  it('adds a new period when Add Period button is clicked', async () => {
    render(<FixedRateLoanForm {...mockProps} />);
    
    const addButton = screen.getByText('Add Period');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Fixed Rate Period 2')).toBeInTheDocument();
    });
  });

  it('removes a period when remove button is clicked', async () => {
    render(<FixedRateLoanForm {...mockProps} />);
    
    // Add a second period
    const addButton = screen.getByText('Add Period');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Fixed Rate Period 2')).toBeInTheDocument();
    });
    
    // Remove the second period
    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    fireEvent.click(removeButtons[1]); // Click remove on second period
    
    await waitFor(() => {
      expect(screen.queryByText('Fixed Rate Period 2')).not.toBeInTheDocument();
    });
  });

  it('shows coverage summary when periods are filled', async () => {
    render(<FixedRateLoanForm {...mockProps} />);
    
    // Fill in loan dates
    const startDateInput = screen.getByTestId('start-date-input');
    const endDateInput = screen.getByTestId('end-date-input');
    
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-12-31' } });
    
    // Fill in period dates
    const periodStartInput = screen.getByTestId('period-start-0');
    const periodEndInput = screen.getByTestId('period-end-0');
    
    fireEvent.change(periodStartInput, { target: { value: '2024-01-01' } });
    fireEvent.change(periodEndInput, { target: { value: '2024-06-30' } });
    
    await waitFor(() => {
      expect(screen.getByText('Period Coverage')).toBeInTheDocument();
    });
  });

  it('calculates coverage percentage correctly', async () => {
    render(<FixedRateLoanForm {...mockProps} />);
    
    // Fill in loan dates (12 months)
    const startDateInput = screen.getByTestId('start-date-input');
    const endDateInput = screen.getByTestId('end-date-input');
    
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-12-31' } });
    
    // Fill in period dates (6 months)
    const periodStartInput = screen.getByTestId('period-start-0');
    const periodEndInput = screen.getByTestId('period-end-0');
    
    fireEvent.change(periodStartInput, { target: { value: '2024-01-01' } });
    fireEvent.change(periodEndInput, { target: { value: '2024-06-30' } });
    
    await waitFor(() => {
      expect(screen.getByText(/49\.\d+% of loan term/)).toBeInTheDocument();
      expect(screen.getByText(/5\.\d+ months covered/)).toBeInTheDocument();
    });
  });

  it('shows complete coverage badge when coverage is 100%', async () => {
    render(<FixedRateLoanForm {...mockProps} />);
    
    // Fill in loan dates
    const startDateInput = screen.getByTestId('start-date-input');
    const endDateInput = screen.getByTestId('end-date-input');
    
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-12-31' } });
    
    // Fill in period dates to cover entire loan
    const periodStartInput = screen.getByTestId('period-start-0');
    const periodEndInput = screen.getByTestId('period-end-0');
    
    fireEvent.change(periodStartInput, { target: { value: '2024-01-01' } });
    fireEvent.change(periodEndInput, { target: { value: '2024-12-31' } });
    
    await waitFor(() => {
      expect(screen.getByText('Complete')).toBeInTheDocument();
    });
  });

  it('shows partial coverage badge when coverage is less than 100%', async () => {
    render(<FixedRateLoanForm {...mockProps} />);
    
    // Fill in loan dates
    const startDateInput = screen.getByTestId('start-date-input');
    const endDateInput = screen.getByTestId('end-date-input');
    
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-12-31' } });
    
    // Fill in period dates for partial coverage
    const periodStartInput = screen.getByTestId('period-start-0');
    const periodEndInput = screen.getByTestId('period-end-0');
    
    fireEvent.change(periodStartInput, { target: { value: '2024-01-01' } });
    fireEvent.change(periodEndInput, { target: { value: '2024-06-30' } });
    
    await waitFor(() => {
      expect(screen.getByText('Partial')).toBeInTheDocument();
    });
  });

  it('calls onSubmit with correct data when form is submitted', async () => {
    render(<FixedRateLoanForm {...mockProps} />);
    
    // Fill in form data
    const loanAmountInput = screen.getByLabelText('Loan Amount ($)');
    const startDateInput = screen.getByTestId('start-date-input');
    const endDateInput = screen.getByTestId('end-date-input');
    
    fireEvent.change(loanAmountInput, { target: { value: '250000' } });
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-12-31' } });
    
    // Fill in period data
    const periodStartInput = screen.getByTestId('period-start-0');
    const periodEndInput = screen.getByTestId('period-end-0');
    const rateInput = screen.getByTestId('period-rate-0');
    
    fireEvent.change(periodStartInput, { target: { value: '2024-01-01' } });
    fireEvent.change(periodEndInput, { target: { value: '2024-06-30' } });
    fireEvent.change(rateInput, { target: { value: '5.5' } });
    
    // Submit form
    const submitButton = screen.getByText('Calculate Fixed Rate Loan');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          loanType: 'fixed-rate',
          loanAmount: '250000',
          loanStartDate: '2024-01-01',
          loanEndDate: '2024-12-31',
          fixedRatePeriods: expect.arrayContaining([
            expect.objectContaining({
              interestRate: '5.5',
              startDate: '2024-01-01',
              endDate: '2024-06-30',
            }),
          ]),
        }),
        expect.any(Object) // Event object
      );
    });
  });

  it('calls onReset when reset button is clicked', () => {
    render(<FixedRateLoanForm {...mockProps} />);
    
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    
    expect(mockProps.onReset).toHaveBeenCalled();
  });

  it('disables submit button when no periods are filled', () => {
    render(<FixedRateLoanForm {...mockProps} />);
    
    const submitButton = screen.getByText('Calculate Fixed Rate Loan');
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when periods are filled', async () => {
    render(<FixedRateLoanForm {...mockProps} />);
    
    // Fill in period dates
    const periodStartInput = screen.getByTestId('period-start-0');
    const periodEndInput = screen.getByTestId('period-end-0');
    
    fireEvent.change(periodStartInput, { target: { value: '2024-01-01' } });
    fireEvent.change(periodEndInput, { target: { value: '2024-06-30' } });
    
    await waitFor(() => {
      const submitButton = screen.getByText('Calculate Fixed Rate Loan');
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('shows loading state when isCalculating is true', () => {
    render(<FixedRateLoanForm {...mockProps} isCalculating={true} />);
    
    const submitButton = screen.getByText('Calculating...');
    expect(submitButton).toBeDisabled();
  });
});
