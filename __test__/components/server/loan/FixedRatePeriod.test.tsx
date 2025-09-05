import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FixedRatePeriodComponent from '@/components/server/loan/FixedRatePeriod';
import { FixedRatePeriod } from '@/constants/loanSchema';

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

describe('FixedRatePeriodComponent', () => {
  const mockPeriod: FixedRatePeriod = {
    id: '1',
    interestRate: '5.5',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    label: 'Introductory Rate',
  };

  const mockProps = {
    period: mockPeriod,
    index: 0,
    onUpdate: jest.fn(),
    onRemove: jest.fn(),
    canRemove: true,
    errors: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with correct title and number', () => {
    render(<FixedRatePeriodComponent {...mockProps} />);
    
    expect(screen.getByText('Fixed Rate Period 1')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('displays the period number in the circle', () => {
    render(<FixedRatePeriodComponent {...mockProps} />);
    
    const circleElement = screen.getByText('1');
    expect(circleElement).toBeInTheDocument();
  });

  it('renders all form fields with correct values', () => {
    render(<FixedRatePeriodComponent {...mockProps} />);
    
    expect(screen.getByDisplayValue('Introductory Rate')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5.5')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-01-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-12-31')).toBeInTheDocument();
  });

  it('calls onUpdate when label is changed', () => {
    render(<FixedRatePeriodComponent {...mockProps} />);
    
    const labelInput = screen.getByDisplayValue('Introductory Rate');
    fireEvent.change(labelInput, { target: { value: 'New Label' } });
    
    expect(mockProps.onUpdate).toHaveBeenCalledWith('label', 'New Label');
  });

  it('calls onUpdate when interest rate is changed', () => {
    render(<FixedRatePeriodComponent {...mockProps} />);
    
    const rateInput = screen.getByDisplayValue('5.5');
    fireEvent.change(rateInput, { target: { value: '6.0' } });
    
    expect(mockProps.onUpdate).toHaveBeenCalledWith('interestRate', '6.0');
  });

  it('calls onUpdate when start date is changed', () => {
    render(<FixedRatePeriodComponent {...mockProps} />);
    
    const startDateInput = screen.getByDisplayValue('2024-01-01');
    fireEvent.change(startDateInput, { target: { value: '2024-02-01' } });
    
    expect(mockProps.onUpdate).toHaveBeenCalledWith('startDate', '2024-02-01');
  });

  it('calls onUpdate when end date is changed', () => {
    render(<FixedRatePeriodComponent {...mockProps} />);
    
    const endDateInput = screen.getByDisplayValue('2024-12-31');
    fireEvent.change(endDateInput, { target: { value: '2024-11-30' } });
    
    expect(mockProps.onUpdate).toHaveBeenCalledWith('endDate', '2024-11-30');
  });

  it('shows remove button when canRemove is true', () => {
    render(<FixedRatePeriodComponent {...mockProps} />);
    
    const removeButton = screen.getByRole('button');
    expect(removeButton).toBeInTheDocument();
  });

  it('hides remove button when canRemove is false', () => {
    render(<FixedRatePeriodComponent {...mockProps} canRemove={false} />);
    
    const removeButton = screen.queryByRole('button');
    expect(removeButton).not.toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    render(<FixedRatePeriodComponent {...mockProps} />);
    
    const removeButton = screen.getByRole('button');
    fireEvent.click(removeButton);
    
    expect(mockProps.onRemove).toHaveBeenCalled();
  });

  it('displays error messages when provided', () => {
    const propsWithErrors = {
      ...mockProps,
      errors: {
        interestRate: { message: 'Interest rate is required', type: 'required' },
      },
    };

    render(<FixedRatePeriodComponent {...propsWithErrors} />);
    
    expect(screen.getByText('Interest rate is required')).toBeInTheDocument();
  });

  it('renders with empty values when period has no data', () => {
    const emptyPeriod: FixedRatePeriod = {
      id: '1',
      interestRate: '',
      startDate: '',
      endDate: '',
      label: '',
    };

    const propsWithEmptyPeriod = {
      ...mockProps,
      period: emptyPeriod,
    };

    render(<FixedRatePeriodComponent {...propsWithEmptyPeriod} />);
    
    expect(screen.getAllByDisplayValue('')).toHaveLength(4); // label, rate, start, end
  });

  it('has correct input types and placeholders', () => {
    render(<FixedRatePeriodComponent {...mockProps} />);
    
    const labelInput = screen.getByPlaceholderText('e.g., Introductory Rate, Standard Rate');
    const rateInput = screen.getByPlaceholderText('e.g., 5.5');
    
    expect(labelInput).toHaveAttribute('type', 'text');
    expect(rateInput).toHaveAttribute('type', 'number');
    expect(rateInput).toHaveAttribute('step', '0.01');
  });

  it('renders with correct styling classes', () => {
    render(<FixedRatePeriodComponent {...mockProps} />);
    
    const card = screen.getByText('Fixed Rate Period 1').closest('.border-2');
    expect(card).toHaveClass('border-slate-200', 'hover:border-green-300');
  });

  it('displays correct labels for form fields', () => {
    render(<FixedRatePeriodComponent {...mockProps} />);
    
    expect(screen.getByText('Label (Optional)')).toBeInTheDocument();
    expect(screen.getByText('Interest Rate (%)')).toBeInTheDocument();
  });
});
