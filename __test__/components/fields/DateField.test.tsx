import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DateField from '@/components/fields/DateField';

// Mock the Calendar icon
jest.mock('lucide-react', () => ({
  Calendar: ({ className }: { className?: string }) => (
    <span className={className} data-testid="calendar-icon">📅</span>
  ),
}));

// Mock the UI components
jest.mock('@/components/ui/input', () => ({
  Input: ({
    id,
    type,
    value,
    onChange,
    className,
    min,
    max,
    ...props
  }: {
    id: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    min?: string;
    max?: string;
    [key: string]: any;
  }) => {
    return (
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={className}
        min={min}
        max={max}
        {...props}
        data-testid={`date-input-${id}`}
      />
    );
  },
}));

jest.mock('@/components/ui/label', () => ({
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
      <label htmlFor={htmlFor} className={className} data-testid={`date-label-${htmlFor}`}>
        {children}
      </label>
    );
  },
}));

describe('DateField', () => {
  const defaultProps = {
    id: 'testDate',
    label: 'Test Date',
    value: '2024-01-01',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<DateField {...defaultProps} />);
    expect(screen.getByTestId('date-input-testDate')).toBeInTheDocument();
  });

  it('renders with correct label', () => {
    render(<DateField {...defaultProps} />);
    expect(screen.getByTestId('date-label-testDate')).toHaveTextContent('Test Date');
  });

  it('displays the correct value', () => {
    render(<DateField {...defaultProps} />);
    expect(screen.getByTestId('date-input-testDate')).toHaveValue('2024-01-01');
  });

  it('calls onChange when input changes', () => {
    const mockOnChange = jest.fn();
    render(<DateField {...defaultProps} onChange={mockOnChange} />);
    
    const input = screen.getByTestId('date-input-testDate');
    fireEvent.change(input, { target: { value: '2024-01-02' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('2024-01-02');
  });

  it('shows calendar icon when showIcon is true', () => {
    render(<DateField {...defaultProps} showIcon={true} />);
    // The Calendar icon is rendered as a span with the calendar emoji
    expect(screen.getByTestId('date-label-testDate')).toHaveTextContent('📅');
  });

  it('does not show calendar icon when showIcon is false', () => {
    render(<DateField {...defaultProps} showIcon={false} />);
    expect(screen.getByTestId('date-label-testDate')).not.toHaveTextContent('📅');
  });

  it('does not show calendar icon by default', () => {
    render(<DateField {...defaultProps} />);
    expect(screen.getByTestId('date-label-testDate')).not.toHaveTextContent('📅');
  });

  it('displays error message when error is provided', () => {
    render(<DateField {...defaultProps} error="Test error message" />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('applies error styling when error is provided', () => {
    render(<DateField {...defaultProps} error="Test error message" />);
    const input = screen.getByTestId('date-input-testDate');
    expect(input).toHaveClass('border-red-500');
  });

  it('does not display error message when no error is provided', () => {
    render(<DateField {...defaultProps} />);
    expect(screen.queryByText('Test error message')).not.toBeInTheDocument();
  });

  it('applies min attribute when provided', () => {
    render(<DateField {...defaultProps} min="2024-01-01" />);
    const input = screen.getByTestId('date-input-testDate');
    expect(input).toHaveAttribute('min', '2024-01-01');
  });

  it('applies max attribute when provided', () => {
    render(<DateField {...defaultProps} max="2024-12-31" />);
    const input = screen.getByTestId('date-input-testDate');
    expect(input).toHaveAttribute('max', '2024-12-31');
  });

  it('does not apply min/max attributes when not provided', () => {
    render(<DateField {...defaultProps} />);
    const input = screen.getByTestId('date-input-testDate');
    expect(input).not.toHaveAttribute('min');
    expect(input).not.toHaveAttribute('max');
  });

  it('applies custom className', () => {
    render(<DateField {...defaultProps} className="custom-class" />);
    const container = screen.getByTestId('date-input-testDate').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('applies default flex styling', () => {
    render(<DateField {...defaultProps} />);
    const container = screen.getByTestId('date-input-testDate').closest('div');
    expect(container).toHaveClass('flex-[0.8]');
  });
});
