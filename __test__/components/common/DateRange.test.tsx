import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateRange from '@/components/common/DateRange';
import { DateRangeProps } from '@/types/common';
import { FieldError } from 'react-hook-form';

// Mock the UI components
jest.mock('@/components/ui/input', () => ({
  Input: ({
    id,
    type,
    value,
    onChange,
    className,
  }: {
    id: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
  }) => {
    return (
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={className}
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
      <label
        htmlFor={htmlFor}
        className={className}
        data-testid={`date-label-${htmlFor}`}
      >
        {children}
      </label>
    );
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Calendar: ({ className }: { className?: string }) => (
    <span data-testid="calendar-icon" className={className}>
      📅
    </span>
  ),
}));

describe('DateRange', () => {
  const defaultProps: DateRangeProps = {
    startDate: {
      value: '',
      onChange: jest.fn(),
    },
    endDate: {
      value: '',
      onChange: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<DateRange {...defaultProps} />);
    expect(screen.getByTestId('date-label-startDate')).toBeInTheDocument();
    expect(screen.getByTestId('date-label-endDate')).toBeInTheDocument();
    expect(screen.getByTestId('date-input-startDate')).toBeInTheDocument();
    expect(screen.getByTestId('date-input-endDate')).toBeInTheDocument();
  });

  it('renders with default labels', () => {
    render(<DateRange {...defaultProps} />);
    expect(screen.getByText('Start Date')).toBeInTheDocument();
    expect(screen.getByText('End Date')).toBeInTheDocument();
  });

  it('renders with custom labels', () => {
    const customProps = {
      ...defaultProps,
      startLabel: 'Custom Start',
      endLabel: 'Custom End',
    };
    render(<DateRange {...customProps} />);
    expect(screen.getByText('Custom Start')).toBeInTheDocument();
    expect(screen.getByText('Custom End')).toBeInTheDocument();
  });

  it('renders calendar icon for start date label', () => {
    render(<DateRange {...defaultProps} />);
    const startLabel = screen.getByTestId('date-label-startDate');
    const calendarIcon = screen.getByTestId('calendar-icon');

    expect(startLabel).toContainElement(calendarIcon);
    expect(calendarIcon).toHaveClass('h-4', 'w-4', 'text-blue-500');
  });

  it('does not render calendar icon for end date label', () => {
    render(<DateRange {...defaultProps} />);
    const endLabel = screen.getByTestId('date-label-endDate');
    const calendarIcons = screen.getAllByTestId('calendar-icon');

    // Should only have one calendar icon (for start date)
    expect(calendarIcons).toHaveLength(1);
    expect(endLabel).not.toContainElement(calendarIcons[0]);
  });

  it('renders date inputs with correct types', () => {
    render(<DateRange {...defaultProps} />);
    const startInput = screen.getByTestId('date-input-startDate');
    const endInput = screen.getByTestId('date-input-endDate');

    expect(startInput).toHaveAttribute('type', 'date');
    expect(endInput).toHaveAttribute('type', 'date');
  });

  it('displays start date value correctly', () => {
    const propsWithStartValue = {
      ...defaultProps,
      startDate: {
        ...defaultProps.startDate,
        value: '2024-01-01',
      },
    };
    render(<DateRange {...propsWithStartValue} />);

    const startInput = screen.getByTestId('date-input-startDate');
    expect(startInput).toHaveValue('2024-01-01');
  });

  it('displays end date value correctly', () => {
    const propsWithEndValue = {
      ...defaultProps,
      endDate: {
        ...defaultProps.endDate,
        value: '2024-12-31',
      },
    };
    render(<DateRange {...propsWithEndValue} />);

    const endInput = screen.getByTestId('date-input-endDate');
    expect(endInput).toHaveValue('2024-12-31');
  });

  it('calls start date onChange when start date input changes', async () => {
    const mockStartDateOnChange = jest.fn();
    const propsWithMockStart = {
      ...defaultProps,
      startDate: {
        ...defaultProps.startDate,
        onChange: mockStartDateOnChange,
      },
    };

    const user = userEvent.setup();
    render(<DateRange {...propsWithMockStart} />);

    const startInput = screen.getByTestId('date-input-startDate');
    await user.type(startInput, '2024-06-15');

    expect(mockStartDateOnChange).toHaveBeenCalledWith('2024-06-15');
  });

  it('calls end date onChange when end date input changes', async () => {
    const mockEndDateOnChange = jest.fn();
    const propsWithMockEnd = {
      ...defaultProps,
      endDate: {
        ...defaultProps.endDate,
        onChange: mockEndDateOnChange,
      },
    };

    const user = userEvent.setup();
    render(<DateRange {...propsWithMockEnd} />);

    const endInput = screen.getByTestId('date-input-endDate');
    await user.type(endInput, '2024-12-25');

    expect(mockEndDateOnChange).toHaveBeenCalledWith('2024-12-25');
  });

  it('displays start date error message when provided', () => {
    const startDateError: FieldError = {
      type: 'required',
      message: 'Start date is required',
    };
    const propsWithStartError = {
      ...defaultProps,
      startDate: {
        ...defaultProps.startDate,
        error: startDateError,
      },
    };

    render(<DateRange {...propsWithStartError} />);
    expect(screen.getByText('Start date is required')).toBeInTheDocument();
  });

  it('displays end date error message when provided', () => {
    const endDateError: FieldError = {
      type: 'validation',
      message: 'End date must be after start date',
    };
    const propsWithEndError = {
      ...defaultProps,
      endDate: {
        ...defaultProps.endDate,
        error: endDateError,
      },
    };

    render(<DateRange {...propsWithEndError} />);
    expect(
      screen.getByText('End date must be after start date')
    ).toBeInTheDocument();
  });

  it('does not display error messages when no errors are provided', () => {
    render(<DateRange {...defaultProps} />);
    expect(
      screen.queryByText('Start date is required')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('End date must be after start date')
    ).not.toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    render(<DateRange {...defaultProps} className="custom-date-range" />);
    const container = screen
      .getByTestId('date-label-startDate')
      .closest('div')?.parentElement;
    expect(container).toBeTruthy();
    expect(container).toHaveClass('custom-date-range');
  });

  it('applies default grid classes when no custom className is provided', () => {
    render(<DateRange {...defaultProps} />);
    const container = screen
      .getByTestId('date-label-startDate')
      .closest('div')?.parentElement;
    expect(container).toBeTruthy();
    expect(container).toHaveClass(
      'grid',
      'grid-cols-1',
      'sm:grid-cols-2',
      'gap-4'
    );
  });

  it('renders error messages with correct styling', () => {
    const startDateError: FieldError = {
      type: 'required',
      message: 'Start date is required',
    };
    const propsWithStartError = {
      ...defaultProps,
      startDate: {
        ...defaultProps.startDate,
        error: startDateError,
      },
    };

    render(<DateRange {...propsWithStartError} />);
    const errorMessage = screen.getByText('Start date is required');
    expect(errorMessage).toHaveClass('text-sm', 'text-red-500');
  });

  it('handles multiple error types correctly', () => {
    const startDateError: FieldError = {
      type: 'min',
      message: 'Date too early',
    };
    const endDateError: FieldError = {
      type: 'max',
      message: 'Date too late',
    };

    const propsWithErrors = {
      ...defaultProps,
      startDate: {
        ...defaultProps.startDate,
        error: startDateError,
      },
      endDate: {
        ...defaultProps.endDate,
        error: endDateError,
      },
    };

    render(<DateRange {...propsWithErrors} />);
    expect(screen.getByText('Date too early')).toBeInTheDocument();
    expect(screen.getByText('Date too late')).toBeInTheDocument();
  });

  it('maintains proper spacing between elements', () => {
    render(<DateRange {...defaultProps} />);
    const startDateContainer = screen
      .getByTestId('date-label-startDate')
      .closest('div');
    const endDateContainer = screen
      .getByTestId('date-label-endDate')
      .closest('div');

    expect(startDateContainer).toHaveClass('space-y-2');
    expect(endDateContainer).toHaveClass('space-y-2');
  });

  it('applies correct text size to date inputs', () => {
    render(<DateRange {...defaultProps} />);
    const startInput = screen.getByTestId('date-input-startDate');
    const endInput = screen.getByTestId('date-input-endDate');

    expect(startInput).toHaveClass('text-lg');
    expect(endInput).toHaveClass('text-lg');
  });

  it('applies correct font weight to labels', () => {
    render(<DateRange {...defaultProps} />);
    const startLabel = screen.getByTestId('date-label-startDate');
    const endLabel = screen.getByTestId('date-label-endDate');

    expect(startLabel).toHaveClass('text-sm', 'font-medium');
    expect(endLabel).toHaveClass('text-sm', 'font-medium');
  });

  describe('accessibility', () => {
    it('associates start date label with start date input', () => {
      render(<DateRange {...defaultProps} />);
      const startLabel = screen.getByTestId('date-label-startDate');
      const startInput = screen.getByTestId('date-input-startDate');

      expect(startLabel).toHaveAttribute('for', 'startDate');
      expect(startInput).toHaveAttribute('id', 'startDate');
    });

    it('associates end date label with end date input', () => {
      render(<DateRange {...defaultProps} />);
      const endLabel = screen.getByTestId('date-label-endDate');
      const endInput = screen.getByTestId('date-input-endDate');

      expect(endLabel).toHaveAttribute('for', 'endDate');
      expect(endInput).toHaveAttribute('id', 'endDate');
    });

    it('provides proper label text for screen readers', () => {
      render(<DateRange {...defaultProps} />);
      expect(screen.getByText('Start Date')).toBeInTheDocument();
      expect(screen.getByText('End Date')).toBeInTheDocument();
    });
  });

  describe('responsive behavior', () => {
    it('applies single column layout on small screens', () => {
      render(<DateRange {...defaultProps} />);
      const container = screen
        .getByTestId('date-label-startDate')
        .closest('div')?.parentElement;
      expect(container).toBeTruthy();
      expect(container).toHaveClass('grid-cols-1');
    });

    it('applies two column layout on larger screens', () => {
      render(<DateRange {...defaultProps} />);
      const container = screen
        .getByTestId('date-label-startDate')
        .closest('div')?.parentElement;
      expect(container).toBeTruthy();
      expect(container).toHaveClass('sm:grid-cols-2');
    });
  });
});
