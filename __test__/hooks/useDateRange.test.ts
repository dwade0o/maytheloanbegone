import { renderHook, act } from '@testing-library/react';
import { useDateRange } from '@/hooks/useDateRange';
import { DateRangeProps } from '@/types/common';

// Mock the utility functions
jest.mock('@/lib/helper/dateCalculations', () => ({
  calculatePeriodBetween: jest.fn(),
  addPeriodToDate: jest.fn(),
  isEndDateAfterStartDate: jest.fn(),
}));

jest.mock('@/lib/helper/dateValidation', () => ({
  validateDateRange: jest.fn(),
  clearFieldError: jest.fn(),
  clearAllErrors: jest.fn(),
}));

import {
  calculatePeriodBetween,
  addPeriodToDate,
} from '@/lib/helper/dateCalculations';
import {
  validateDateRange,
  clearFieldError,
  clearAllErrors,
} from '@/lib/helper/dateValidation';

const mockCalculatePeriodBetween = calculatePeriodBetween as jest.MockedFunction<typeof calculatePeriodBetween>;
const mockAddPeriodToDate = addPeriodToDate as jest.MockedFunction<typeof addPeriodToDate>;
const mockValidateDateRange = validateDateRange as jest.MockedFunction<typeof validateDateRange>;
const mockClearFieldError = clearFieldError as jest.MockedFunction<typeof clearFieldError>;
const mockClearAllErrors = clearAllErrors as jest.MockedFunction<typeof clearAllErrors>;

describe('useDateRange', () => {
  const mockStartDateOnChange = jest.fn();
  const mockEndDateOnChange = jest.fn();
  const mockPeriodOnChange = jest.fn();
  const mockPeriodTypeOnChange = jest.fn();

  const defaultProps = {
    startDate: {
      value: '',
      onChange: mockStartDateOnChange,
    },
    endDate: {
      value: '',
      onChange: mockEndDateOnChange,
    },
    period: {
      value: '',
      onChange: mockPeriodOnChange,
    },
    periodType: {
      value: 'days' as const,
      onChange: mockPeriodTypeOnChange,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockClearAllErrors.mockReturnValue({});
    mockClearFieldError.mockImplementation((errors, field) => ({
      ...errors,
      [field]: undefined,
    }));
  });

  it('should initialize with empty date errors', () => {
    const { result } = renderHook(() => useDateRange(defaultProps));
    expect(result.current.dateErrors).toEqual({});
  });

  it('should handle start date change with period calculation', () => {
    mockAddPeriodToDate.mockReturnValue('2024-01-31');
    
    const { result } = renderHook(() => useDateRange({
      ...defaultProps,
      period: { value: '30', onChange: mockPeriodOnChange },
      periodType: { value: 'days', onChange: mockPeriodTypeOnChange },
    }));

    act(() => {
      result.current.handleStartDateChange('2024-01-01');
    });

    expect(mockStartDateOnChange).toHaveBeenCalledWith('2024-01-01');
    expect(mockAddPeriodToDate).toHaveBeenCalledWith('2024-01-01', 30, 'days');
    expect(mockEndDateOnChange).toHaveBeenCalledWith('2024-01-31');
  });

  it('should handle end date change with period calculation', () => {
    mockCalculatePeriodBetween.mockReturnValue(30);
    mockValidateDateRange.mockReturnValue({}); // No validation errors
    
    const { result } = renderHook(() => useDateRange({
      ...defaultProps,
      startDate: { value: '2024-01-01', onChange: mockStartDateOnChange },
    }));

    act(() => {
      result.current.handleEndDateChange('2024-01-31');
    });

    expect(mockEndDateOnChange).toHaveBeenCalledWith('2024-01-31');
    expect(mockCalculatePeriodBetween).toHaveBeenCalledWith('2024-01-01', '2024-01-31', 'days');
    expect(mockPeriodOnChange).toHaveBeenCalledWith('30');
  });

  it('should handle period change with end date calculation', () => {
    mockAddPeriodToDate.mockReturnValue('2024-01-31');
    
    const { result } = renderHook(() => useDateRange({
      ...defaultProps,
      startDate: { value: '2024-01-01', onChange: mockStartDateOnChange },
      periodType: { value: 'days', onChange: mockPeriodTypeOnChange },
    }));

    act(() => {
      result.current.handlePeriodChange('30');
    });

    expect(mockPeriodOnChange).toHaveBeenCalledWith('30');
    expect(mockAddPeriodToDate).toHaveBeenCalledWith('2024-01-01', 30, 'days');
    expect(mockEndDateOnChange).toHaveBeenCalledWith('2024-01-31');
  });

  it('should handle period type change with recalculation', () => {
    mockAddPeriodToDate.mockReturnValue('2024-02-01');
    mockCalculatePeriodBetween.mockReturnValue(1);
    
    const { result } = renderHook(() => useDateRange({
      ...defaultProps,
      startDate: { value: '2024-01-01', onChange: mockStartDateOnChange },
      endDate: { value: '2024-01-31', onChange: mockEndDateOnChange },
      period: { value: '30', onChange: mockPeriodOnChange },
    }));

    act(() => {
      result.current.handlePeriodTypeChange('months');
    });

    expect(mockPeriodTypeOnChange).toHaveBeenCalledWith('months');
    expect(mockAddPeriodToDate).toHaveBeenCalledWith('2024-01-01', 30, 'months');
    expect(mockEndDateOnChange).toHaveBeenCalledWith('2024-02-01');
    expect(mockCalculatePeriodBetween).toHaveBeenCalledWith('2024-01-01', '2024-01-31', 'months');
    expect(mockPeriodOnChange).toHaveBeenCalledWith('1');
  });

  it('should handle validation errors on start date change', () => {
    mockValidateDateRange.mockReturnValue({
      startDate: 'Start date must be before end date',
      endDate: 'End date must be after start date',
    });
    
    const { result } = renderHook(() => useDateRange({
      ...defaultProps,
      endDate: { value: '2024-01-01', onChange: mockEndDateOnChange },
    }));

    act(() => {
      result.current.handleStartDateChange('2024-01-02');
    });

    expect(mockStartDateOnChange).toHaveBeenCalledWith('2024-01-02');
    expect(mockValidateDateRange).toHaveBeenCalledWith('2024-01-02', '2024-01-01');
    expect(mockEndDateOnChange).toHaveBeenCalledWith(''); // Clear invalid end date
    expect(result.current.dateErrors).toEqual({
      startDate: 'Start date must be before end date',
      endDate: 'End date must be after start date',
    });
  });

  it('should handle validation errors on end date change', () => {
    mockValidateDateRange.mockReturnValue({
      startDate: 'Start date must be before end date',
      endDate: 'End date must be after start date',
    });
    
    const { result } = renderHook(() => useDateRange({
      ...defaultProps,
      startDate: { value: '2024-01-02', onChange: mockStartDateOnChange },
    }));

    act(() => {
      result.current.handleEndDateChange('2024-01-01');
    });

    expect(mockEndDateOnChange).toHaveBeenCalledWith('2024-01-01');
    expect(mockValidateDateRange).toHaveBeenCalledWith('2024-01-02', '2024-01-01');
    expect(result.current.dateErrors).toEqual({
      startDate: 'Start date must be before end date',
      endDate: 'End date must be after start date',
    });
  });
});
