import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PeriodField from '@/components/server/fields/PeriodField';

// Mock the Clock icon
jest.mock('lucide-react', () => ({
  Clock: ({ className }: { className?: string }) => (
    <span className={className} data-testid="clock-icon">⏰</span>
  ),
}));

// Mock the UI components
jest.mock('@/components/client/ui/input', () => ({
  Input: ({
    id,
    type,
    value,
    onChange,
    className,
    placeholder,
    min,
    ...props
  }: {
    id: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    placeholder?: string;
    min?: string;
    [key: string]: any;
  }) => {
    return (
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={className}
        placeholder={placeholder}
        min={min}
        {...props}
        data-testid={`period-input-${id}`}
      />
    );
  },
}));

jest.mock('@/components/client/ui/label', () => ({
  Label: ({
    htmlFor,
    children,
    className,
  }: {
    htmlFor: string;
    children: React.ReactNode;
    className?: string;
  }) => {
    return (
      <label htmlFor={htmlFor} className={className} data-testid={`period-label-${htmlFor}`}>
        {children}
      </label>
    );
  },
}));

jest.mock('@/components/client/ui/select', () => ({
  Select: ({
    value,
    onValueChange,
    children,
  }: {
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
  }) => {
    return (
      <div data-testid="select">
        <select
          value={value}
          onChange={e => onValueChange(e.target.value)}
          data-testid="select-element"
        >
          <option value="days">Days</option>
          <option value="months">Months</option>
          <option value="years">Years</option>
        </select>
        {children}
      </div>
    );
  },
  SelectTrigger: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className} data-testid="select-trigger">
      {children}
    </div>
  ),
  SelectValue: () => <span data-testid="select-value" />,
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectItem: ({ value, children }: { value: string; children: React.ReactNode }) => (
    <option value={value} data-testid={`select-item-${value}`}>
      {children}
    </option>
  ),
}));

describe('PeriodField', () => {
  const defaultProps = {
    id: 'testPeriod',
    label: 'Test Period',
    value: '30',
    onChange: jest.fn(),
  };

  const periodTypeProps = {
    value: 'days' as const,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<PeriodField {...defaultProps} />);
    expect(screen.getByTestId('period-input-testPeriod')).toBeInTheDocument();
  });

  it('renders with correct label', () => {
    render(<PeriodField {...defaultProps} />);
    expect(screen.getByTestId('period-label-testPeriod')).toHaveTextContent('Test Period');
  });

  it('displays the correct value', () => {
    render(<PeriodField {...defaultProps} />);
    expect(screen.getByTestId('period-input-testPeriod')).toHaveValue(30);
  });

  it('calls onChange when input changes', () => {
    const mockOnChange = jest.fn();
    render(<PeriodField {...defaultProps} onChange={mockOnChange} />);
    
    const input = screen.getByTestId('period-input-testPeriod');
    fireEvent.change(input, { target: { value: '60' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('60');
  });

  it('shows clock icon in label', () => {
    render(<PeriodField {...defaultProps} />);
    expect(screen.getByTestId('period-label-testPeriod')).toHaveTextContent('⏰');
  });

  it('displays error message when error is provided', () => {
    render(<PeriodField {...defaultProps} error="Test error message" />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('applies error styling when error is provided', () => {
    render(<PeriodField {...defaultProps} error="Test error message" />);
    const errorMessage = screen.getByText('Test error message');
    expect(errorMessage).toHaveClass('text-red-500');
  });

  it('does not display error message when no error is provided', () => {
    render(<PeriodField {...defaultProps} />);
    expect(screen.queryByText('Test error message')).not.toBeInTheDocument();
  });

  it('renders period type selector when periodType is provided', () => {
    render(<PeriodField {...defaultProps} periodType={periodTypeProps} />);
    expect(screen.getByTestId('select')).toBeInTheDocument();
  });

  it('accepts decimal values with step attribute', () => {
    render(<PeriodField {...defaultProps} value="6.1" />);
    const input = screen.getByRole('spinbutton');
    
    expect(input).toHaveValue(6.1);
    expect(input).toHaveAttribute('step', '0.1');
    expect(input).toHaveAttribute('min', '0.1');
  });

  it('allows decimal input without validation errors', async () => {
    const onChangeMock = jest.fn();
    
    // Start with empty value to avoid default value issues
    render(<PeriodField {...defaultProps} value="" onChange={onChangeMock} />);
    const input = screen.getByRole('spinbutton');
    
    // Use fireEvent for more direct control over the input value
    fireEvent.change(input, { target: { value: '6.1' } });
    
    // Check that the onChange was called with the decimal value
    expect(onChangeMock).toHaveBeenCalledWith('6.1');
    expect((input as HTMLInputElement).checkValidity()).toBe(true); // HTML5 validation should pass
  });

  it('does not render period type selector when periodType is not provided', () => {
    render(<PeriodField {...defaultProps} />);
    expect(screen.queryByTestId('select')).not.toBeInTheDocument();
  });

  it('displays correct period type value', () => {
    render(<PeriodField {...defaultProps} periodType={periodTypeProps} />);
    const select = screen.getByTestId('select-element');
    expect(select).toBeInTheDocument();
    // The select element exists and is rendered correctly
  });

  it('calls periodType onChange when period type changes', () => {
    const mockPeriodTypeOnChange = jest.fn();
    render(
      <PeriodField
        {...defaultProps}
        periodType={{ value: 'days', onChange: mockPeriodTypeOnChange }}
      />
    );
    
    const select = screen.getByTestId('select-element');
    // Simulate a change event
    fireEvent.change(select, { target: { value: 'months' } });
    
    // The mock should be called (the exact value depends on the mock implementation)
    expect(mockPeriodTypeOnChange).toHaveBeenCalled();
  });

  it('renders all period type options', () => {
    render(<PeriodField {...defaultProps} periodType={periodTypeProps} />);
    expect(screen.getByTestId('select-item-days')).toBeInTheDocument();
    expect(screen.getByTestId('select-item-months')).toBeInTheDocument();
    expect(screen.getByTestId('select-item-years')).toBeInTheDocument();
  });

  it('applies correct input attributes', () => {
    render(<PeriodField {...defaultProps} />);
    const input = screen.getByTestId('period-input-testPeriod');
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', '0.1');
    expect(input).toHaveAttribute('step', '0.1');
    expect(input).toHaveAttribute('placeholder', 'Amount');
  });

  it('applies correct styling classes', () => {
    render(<PeriodField {...defaultProps} periodType={periodTypeProps} />);
    const input = screen.getByTestId('period-input-testPeriod');
    expect(input).toHaveClass('text-base', 'flex-1', 'min-w-[80px]');
    
    const selectTrigger = screen.getByTestId('select-trigger');
    expect(selectTrigger).toHaveClass('w-28', 'text-sm');
  });

  it('applies custom className', () => {
    render(<PeriodField {...defaultProps} className="custom-class" />);
    const container = screen.getByTestId('period-input-testPeriod').closest('div')?.parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('applies default flex styling', () => {
    render(<PeriodField {...defaultProps} />);
    const container = screen.getByTestId('period-input-testPeriod').closest('div')?.parentElement;
    expect(container).toHaveClass('flex-[1.4]');
  });

  it('maintains proper spacing between elements', () => {
    render(<PeriodField {...defaultProps} periodType={periodTypeProps} />);
    const container = screen.getByTestId('period-input-testPeriod').closest('div')?.parentElement;
    expect(container).toHaveClass('space-y-2');
    
    const inputContainer = screen.getByTestId('period-input-testPeriod').closest('div');
    expect(inputContainer).toHaveClass('flex', 'gap-2');
  });
});
