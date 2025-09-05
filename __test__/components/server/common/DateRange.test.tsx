import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateRange from '@/components/server/common/DateRange';
import { DateRangeProps } from '@/types/common';
import { FieldError } from 'react-hook-form';

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
    max,
    ...props
  }: {
    id: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    placeholder?: string;
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
        placeholder={placeholder}
        min={min}
        max={max}
        {...props}
        data-testid={`date-input-${id}`}
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
          data-testid="select-trigger"
        >
          {children}
        </select>
      </div>
    );
  },
  SelectTrigger: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className} data-testid="select-trigger">
      {children}
    </div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectItem: ({ value, children }: { value: string; children: React.ReactNode }) => (
    <option value={value} data-testid={`select-item-${value}`}>
      {children}
    </option>
  ),
  SelectValue: () => <span data-testid="select-value" />,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Calendar: ({ className }: { className?: string }) => (
    <span data-testid="calendar-icon" className={className}>
      📅
    </span>
  ),
  Clock: ({ className }: { className?: string }) => (
    <span data-testid="clock-icon" className={className}>
      🕐
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

  it('applies default flex classes when no custom className is provided', () => {
    render(<DateRange {...defaultProps} />);
    const container = screen
      .getByTestId('date-label-startDate')
      .closest('div')?.parentElement;
    expect(container).toBeTruthy();
    expect(container).toHaveClass(
      'flex',
      'flex-col',
      'sm:flex-row',
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

    expect(startInput).toHaveClass('text-base');
    expect(endInput).toHaveClass('text-base');
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
    it('applies column layout on small screens', () => {
      render(<DateRange {...defaultProps} />);
      const container = screen
        .getByTestId('date-label-startDate')
        .closest('div')?.parentElement;
      expect(container).toBeTruthy();
      expect(container).toHaveClass('flex-col');
    });

    it('applies row layout on medium screens and up', () => {
      render(<DateRange {...defaultProps} />);
      const container = screen
        .getByTestId('date-label-startDate')
        .closest('div')?.parentElement;
      expect(container).toBeTruthy();
      expect(container).toHaveClass('sm:flex-row');
    });
  });

  describe('period functionality', () => {
    const propsWithPeriod: DateRangeProps = {
      ...defaultProps,
      period: {
        value: '',
        onChange: jest.fn(),
      },
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders period field when period prop is provided', () => {
      render(<DateRange {...propsWithPeriod} />);
      expect(screen.getByTestId('date-label-period')).toBeInTheDocument();
      expect(screen.getByTestId('date-input-period')).toBeInTheDocument();
    });

    it('does not render period field when period prop is not provided', () => {
      render(<DateRange {...defaultProps} />);
      expect(screen.queryByTestId('date-label-period')).not.toBeInTheDocument();
      expect(screen.queryByTestId('date-input-period')).not.toBeInTheDocument();
    });

    it('renders period field with default label', () => {
      render(<DateRange {...propsWithPeriod} />);
      expect(screen.getByText('Period')).toBeInTheDocument();
    });

    it('renders period field with custom label', () => {
      const customProps = {
        ...propsWithPeriod,
        periodLabel: 'Custom Period',
      };
      render(<DateRange {...customProps} />);
      expect(screen.getByText('Custom Period')).toBeInTheDocument();
    });

    it('renders clock icon for period label', () => {
      render(<DateRange {...propsWithPeriod} />);
      const periodLabel = screen.getByTestId('date-label-period');
      const clockIcon = screen.getByTestId('clock-icon');

      expect(periodLabel).toContainElement(clockIcon);
      expect(clockIcon).toHaveClass('h-4', 'w-4', 'text-green-500');
    });

    it('renders period input with correct type and attributes', () => {
      render(<DateRange {...propsWithPeriod} />);
      const periodInput = screen.getByTestId('date-input-period');

      expect(periodInput).toHaveAttribute('type', 'number');
      expect(periodInput).toHaveAttribute('min', '1');
      expect(periodInput).toHaveAttribute('placeholder', 'Amount');
    });

    it('displays period value correctly', () => {
      const propsWithPeriodValue = {
        ...propsWithPeriod,
        period: {
          ...propsWithPeriod.period!,
          value: '30',
        },
      };
      render(<DateRange {...propsWithPeriodValue} />);

      const periodInput = screen.getByTestId('date-input-period');
      expect(periodInput).toHaveValue(30);
    });

    it('calls period onChange when period input changes', async () => {
      const mockPeriodOnChange = jest.fn();
      const propsWithMockPeriod = {
        ...propsWithPeriod,
        period: {
          ...propsWithPeriod.period!,
          onChange: mockPeriodOnChange,
        },
      };

      render(<DateRange {...propsWithMockPeriod} />);

      const periodInput = screen.getByTestId('date-input-period');
      // Use fireEvent to simulate the change
      fireEvent.change(periodInput, { target: { value: '45' } });

      // Check that onChange was called with the final value
      expect(mockPeriodOnChange).toHaveBeenCalledWith('45');
    });

    it('displays period error message when provided', () => {
      const periodError: FieldError = {
        type: 'min',
        message: 'Period must be at least 1 day',
      };
      const propsWithPeriodError = {
        ...propsWithPeriod,
        period: {
          ...propsWithPeriod.period!,
          error: periodError,
        },
      };

      render(<DateRange {...propsWithPeriodError} />);
      expect(screen.getByText('Period must be at least 1 day')).toBeInTheDocument();
    });

    it('applies correct styling to period input', () => {
      render(<DateRange {...propsWithPeriod} />);
      const periodInput = screen.getByTestId('date-input-period');

      expect(periodInput).toHaveClass('text-base', 'flex-1', 'min-w-[80px]');
    });

    it('applies correct styling to period label', () => {
      render(<DateRange {...propsWithPeriod} />);
      const periodLabel = screen.getByTestId('date-label-period');

      expect(periodLabel).toHaveClass('text-sm', 'font-medium');
    });

    it('associates period label with period input', () => {
      render(<DateRange {...propsWithPeriod} />);
      const periodLabel = screen.getByTestId('date-label-period');
      const periodInput = screen.getByTestId('date-input-period');

      expect(periodLabel).toHaveAttribute('for', 'period');
      expect(periodInput).toHaveAttribute('id', 'period');
    });
  });

  describe('automatic calculations', () => {
    const propsWithPeriod: DateRangeProps = {
      startDate: {
        value: '',
        onChange: jest.fn(),
      },
      endDate: {
        value: '',
        onChange: jest.fn(),
      },
      period: {
        value: '',
        onChange: jest.fn(),
      },
      periodType: {
        value: 'days',
        onChange: jest.fn(),
      },
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('calculates end date when start date and period are provided', async () => {
      const mockEndDateOnChange = jest.fn();
      const propsWithMocks = {
        ...propsWithPeriod,
        endDate: {
          ...propsWithPeriod.endDate,
          onChange: mockEndDateOnChange,
        },
        period: {
          ...propsWithPeriod.period!,
          value: '30',
        },
      };

      const user = userEvent.setup();
      render(<DateRange {...propsWithMocks} />);

      const startInput = screen.getByTestId('date-input-startDate');
      await user.type(startInput, '2024-01-01');

      // Should calculate end date as 2024-01-31 (30 days later)
      expect(mockEndDateOnChange).toHaveBeenCalledWith('2024-01-31');
    });

    it('calculates period when end date is manually changed', async () => {
      const mockPeriodOnChange = jest.fn();
      const mockEndDateOnChange = jest.fn();
      const mockPeriodTypeOnChange = jest.fn();
      const mockStartDateOnChange = jest.fn();
      
      const propsWithMocks = {
        ...propsWithPeriod,
        startDate: {
          ...propsWithPeriod.startDate,
          value: '2024-01-01', // Pre-set start date
          onChange: mockStartDateOnChange,
        },
        period: {
          ...propsWithPeriod.period!,
          onChange: mockPeriodOnChange,
        },
        endDate: {
          ...propsWithPeriod.endDate,
          onChange: mockEndDateOnChange,
        },
        periodType: {
          value: 'days' as const,
          onChange: mockPeriodTypeOnChange,
        },
      };

      render(<DateRange {...propsWithMocks} />);

      const endInput = screen.getByTestId('date-input-endDate');
      
      // Manually change end date (start date is already set)
      fireEvent.change(endInput, { target: { value: '2024-01-31' } });

      // Should calculate period as 30 days when end date is manually changed
      expect(mockPeriodOnChange).toHaveBeenCalledWith('30');
    });

    it('calculates end date when period is changed with existing start date', async () => {
      const mockEndDateOnChange = jest.fn();
      const mockPeriodOnChange = jest.fn();
      const propsWithMocks = {
        ...propsWithPeriod,
        startDate: {
          ...propsWithPeriod.startDate,
          value: '2024-01-01',
        },
        endDate: {
          ...propsWithPeriod.endDate,
          onChange: mockEndDateOnChange,
        },
        period: {
          ...propsWithPeriod.period!,
          onChange: mockPeriodOnChange,
        },
      };

      render(<DateRange {...propsWithMocks} />);

      const periodInput = screen.getByTestId('date-input-period');
      // Use fireEvent to simulate the change
      fireEvent.change(periodInput, { target: { value: '30' } });

      // Should calculate end date as 2024-01-31 (30 days later)
      // Note: The calculation happens when the period value is set to '30'
      expect(mockEndDateOnChange).toHaveBeenCalledWith('2024-01-31');
    });

    it('calculates period when end date is changed with existing start date', async () => {
      const mockPeriodOnChange = jest.fn();
      const propsWithMocks = {
        ...propsWithPeriod,
        startDate: {
          ...propsWithPeriod.startDate,
          value: '2024-01-01',
        },
        period: {
          ...propsWithPeriod.period!,
          onChange: mockPeriodOnChange,
        },
      };

      const user = userEvent.setup();
      render(<DateRange {...propsWithMocks} />);

      const endInput = screen.getByTestId('date-input-endDate');
      await user.type(endInput, '2024-02-15');

      // Should calculate period as 45 days
      expect(mockPeriodOnChange).toHaveBeenCalledWith('45');
    });

    it('does not calculate when period is not provided', async () => {
      const mockEndDateOnChange = jest.fn();
      const propsWithoutPeriod = {
        startDate: {
          value: '',
          onChange: jest.fn(),
        },
        endDate: {
          value: '',
          onChange: mockEndDateOnChange,
        },
      };

      const user = userEvent.setup();
      render(<DateRange {...propsWithoutPeriod} />);

      const startInput = screen.getByTestId('date-input-startDate');
      await user.type(startInput, '2024-01-01');

      // Should not call endDate onChange for calculation
      expect(mockEndDateOnChange).not.toHaveBeenCalled();
    });

    it('handles invalid period values gracefully', async () => {
      const mockEndDateOnChange = jest.fn();
      const propsWithMocks = {
        ...propsWithPeriod,
        endDate: {
          ...propsWithPeriod.endDate,
          onChange: mockEndDateOnChange,
        },
        period: {
          ...propsWithPeriod.period!,
          value: 'invalid',
        },
      };

      const user = userEvent.setup();
      render(<DateRange {...propsWithMocks} />);

      const startInput = screen.getByTestId('date-input-startDate');
      await user.type(startInput, '2024-01-01');

      // Should not calculate end date with invalid period
      expect(mockEndDateOnChange).not.toHaveBeenCalled();
    });

    it('handles zero or negative period values gracefully', async () => {
      const mockEndDateOnChange = jest.fn();
      const mockPeriodOnChange = jest.fn();
      const propsWithMocks = {
        ...propsWithPeriod,
        endDate: {
          ...propsWithPeriod.endDate,
          onChange: mockEndDateOnChange,
        },
        period: {
          ...propsWithPeriod.period!,
          onChange: mockPeriodOnChange,
        },
        startDate: {
          ...propsWithPeriod.startDate,
          value: '2024-01-01',
        },
      };

      const user = userEvent.setup();
      render(<DateRange {...propsWithMocks} />);

      const periodInput = screen.getByTestId('date-input-period');
      // Use fireEvent to simulate the change
      fireEvent.change(periodInput, { target: { value: '0' } });

      // Should call period onChange but not calculate end date with zero period
      expect(mockPeriodOnChange).toHaveBeenCalledWith('0');
      expect(mockEndDateOnChange).not.toHaveBeenCalled();
    });

    it('calculates period correctly when period type is changed and then dates are updated', () => {
      const mockPeriodOnChange = jest.fn();
      const mockEndDateOnChange = jest.fn();
      const mockPeriodTypeOnChange = jest.fn();
      const mockStartDateOnChange = jest.fn();
      
      const propsWithMocks = {
        ...propsWithPeriod,
        startDate: {
          ...propsWithPeriod.startDate,
          value: '2024-01-01',
          onChange: mockStartDateOnChange,
        },
        period: {
          ...propsWithPeriod.period!,
          onChange: mockPeriodOnChange,
        },
        endDate: {
          ...propsWithPeriod.endDate,
          value: '2024-01-31', // 30 days later
          onChange: mockEndDateOnChange,
        },
        periodType: {
          value: 'years' as const, // Changed to years
          onChange: mockPeriodTypeOnChange,
        },
      };

      render(<DateRange {...propsWithMocks} />);

      const endInput = screen.getByTestId('date-input-endDate');
      
      // Change end date (should calculate period in years, not days)
      fireEvent.change(endInput, { target: { value: '2025-01-01' } }); // 1 year later

      // Should calculate period as 1 year (not 365 days)
      expect(mockPeriodOnChange).toHaveBeenCalledWith('1');
    });

    it('should calculate period in days when end date is very close to start date', () => {
      const mockPeriodOnChange = jest.fn();
      const mockEndDateOnChange = jest.fn();
      const mockPeriodTypeOnChange = jest.fn();
      const mockStartDateOnChange = jest.fn();
      
      const propsWithMocks = {
        ...propsWithPeriod,
        startDate: {
          ...propsWithPeriod.startDate,
          value: '2025-09-02',
          onChange: mockStartDateOnChange,
        },
        period: {
          ...propsWithPeriod.period!,
          value: '1', // Initially 1 month
          onChange: mockPeriodOnChange,
        },
        endDate: {
          ...propsWithPeriod.endDate,
          value: '2025-10-02', // 1 month later
          onChange: mockEndDateOnChange,
        },
        periodType: {
          value: 'months' as const, // Initially months
          onChange: mockPeriodTypeOnChange,
        },
      };

      render(<DateRange {...propsWithMocks} />);

      const endInput = screen.getByTestId('date-input-endDate');
      
      // Change end date to very close date (1 day later)
      fireEvent.change(endInput, { target: { value: '2025-09-03' } });

      // Should calculate period as 1 day
      expect(mockPeriodOnChange).toHaveBeenCalledWith('1');
      // Should also change period type to days
      expect(mockPeriodTypeOnChange).toHaveBeenCalledWith('days');
    });

    it('should show error when start date is after end date', () => {
      const mockStartDateOnChange = jest.fn();
      const mockEndDateOnChange = jest.fn();
      
      const propsWithMocks = {
        ...propsWithPeriod,
        startDate: {
          ...propsWithPeriod.startDate,
          value: '2025-09-02',
          onChange: mockStartDateOnChange,
        },
        endDate: {
          ...propsWithPeriod.endDate,
          value: '2025-09-01', // End date before start date
          onChange: mockEndDateOnChange,
        },
      };

      render(<DateRange {...propsWithMocks} />);

      const startInput = screen.getByTestId('date-input-startDate');
      
      // Change start date to be after the end date
      fireEvent.change(startInput, { target: { value: '2025-09-03' } });

      // Should show error message
      expect(screen.getByText('Start date must be before end date')).toBeInTheDocument();
      expect(screen.getByText('End date must be after start date')).toBeInTheDocument();
    });

    it('should show error when end date is before start date', () => {
      const mockStartDateOnChange = jest.fn();
      const mockEndDateOnChange = jest.fn();
      
      const propsWithMocks = {
        ...propsWithPeriod,
        startDate: {
          ...propsWithPeriod.startDate,
          value: '2025-09-02',
          onChange: mockStartDateOnChange,
        },
        endDate: {
          ...propsWithPeriod.endDate,
          value: '', // Start with empty end date
          onChange: mockEndDateOnChange,
        },
      };

      render(<DateRange {...propsWithMocks} />);

      const endInput = screen.getByTestId('date-input-endDate');
      
      // Change end date to be before the start date
      fireEvent.change(endInput, { target: { value: '2025-09-01' } });

      // Should show error message
      expect(screen.getByText('End date must be after start date')).toBeInTheDocument();
      expect(screen.getByText('Start date must be before end date')).toBeInTheDocument();
    });

    it('should clear errors when dates become valid', () => {
      const mockStartDateOnChange = jest.fn();
      const mockEndDateOnChange = jest.fn();
      
      const propsWithMocks = {
        ...propsWithPeriod,
        startDate: {
          ...propsWithPeriod.startDate,
          value: '2025-09-02',
          onChange: mockStartDateOnChange,
        },
        endDate: {
          ...propsWithPeriod.endDate,
          value: '', // Start with empty end date
          onChange: mockEndDateOnChange,
        },
      };

      render(<DateRange {...propsWithMocks} />);

      const endInput = screen.getByTestId('date-input-endDate');
      
      // First, set invalid date to trigger error
      fireEvent.change(endInput, { target: { value: '2025-09-01' } });
      expect(screen.getByText('End date must be after start date')).toBeInTheDocument();

      // Then, set valid date to clear error
      fireEvent.change(endInput, { target: { value: '2025-09-03' } });
      expect(screen.queryByText('End date must be after start date')).not.toBeInTheDocument();
    });

    it('should set max attribute on start date input when end date is present', () => {
      const propsWithMocks = {
        ...propsWithPeriod,
        startDate: {
          ...propsWithPeriod.startDate,
          value: '2025-09-01',
        },
        endDate: {
          ...propsWithPeriod.endDate,
          value: '2025-09-10',
        },
      };

      render(<DateRange {...propsWithMocks} />);

      const startInput = screen.getByTestId('date-input-startDate');
      expect(startInput).toHaveAttribute('max', '2025-09-10');
    });

    it('should set min attribute on end date input when start date is present', () => {
      const propsWithMocks = {
        ...propsWithPeriod,
        startDate: {
          ...propsWithPeriod.startDate,
          value: '2025-09-01',
        },
        endDate: {
          ...propsWithPeriod.endDate,
          value: '2025-09-10',
        },
      };

      render(<DateRange {...propsWithMocks} />);

      const endInput = screen.getByTestId('date-input-endDate');
      expect(endInput).toHaveAttribute('min', '2025-09-01');
    });

    it('should not set max attribute on start date when end date is empty', () => {
      const propsWithMocks = {
        ...propsWithPeriod,
        startDate: {
          ...propsWithPeriod.startDate,
          value: '2025-09-01',
        },
        endDate: {
          ...propsWithPeriod.endDate,
          value: '',
        },
      };

      render(<DateRange {...propsWithMocks} />);

      const startInput = screen.getByTestId('date-input-startDate');
      expect(startInput).not.toHaveAttribute('max');
    });

    it('should not set min attribute on end date when start date is empty', () => {
      const propsWithMocks = {
        ...propsWithPeriod,
        startDate: {
          ...propsWithPeriod.startDate,
          value: '',
        },
        endDate: {
          ...propsWithPeriod.endDate,
          value: '2025-09-10',
        },
      };

      render(<DateRange {...propsWithMocks} />);

      const endInput = screen.getByTestId('date-input-endDate');
      expect(endInput).not.toHaveAttribute('min');
    });

  });
});
