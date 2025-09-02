import { useCallback, useState } from 'react';
import { DateRangeProps } from '@/types/common';
import {
  calculatePeriodBetween,
  addPeriodToDate,
  isEndDateAfterStartDate,
} from '@/lib/helper/dateCalculations';
import {
  validateDateRange,
  clearFieldError,
  clearAllErrors,
  DateValidationErrors,
} from '@/lib/helper/dateValidation';

/**
 * Custom hook for managing DateRange component logic
 */
export function useDateRange({
  startDate,
  endDate,
  period,
  periodType,
}: Pick<DateRangeProps, 'startDate' | 'endDate' | 'period' | 'periodType'>) {
  // Local error state for date validation
  const [dateErrors, setDateErrors] = useState<DateValidationErrors>({});

  // Handle start date change
  const handleStartDateChange = useCallback(
    (value: string) => {
      startDate.onChange(value);

      // If we have start date and period, always calculate end date
      if (value && period?.value && periodType?.value) {
        const amount = parseInt(period.value);
        if (!isNaN(amount) && amount > 0) {
          const calculatedEndDate = addPeriodToDate(
            value,
            amount,
            periodType.value
          );
          endDate.onChange(calculatedEndDate);
        }
      }

      // Validate that start date is not after end date
      if (value && endDate.value) {
        const validationErrors = validateDateRange(value, endDate.value);
        if (validationErrors.startDate || validationErrors.endDate) {
          setDateErrors(validationErrors);
          // Clear end date if it's invalid
          endDate.onChange('');
        } else {
          setDateErrors(clearAllErrors());
        }
      } else {
        setDateErrors(clearFieldError(dateErrors, 'startDate'));
      }
    },
    [startDate, endDate, period, periodType, dateErrors]
  );

  // Handle end date change
  const handleEndDateChange = useCallback(
    (value: string) => {
      endDate.onChange(value);

      // Validate that end date is after start date
      if (value && startDate.value) {
        const validationErrors = validateDateRange(startDate.value, value);
        if (validationErrors.startDate || validationErrors.endDate) {
          setDateErrors(validationErrors);
          // Don't proceed with period calculation if dates are invalid
          return;
        } else {
          setDateErrors(clearAllErrors());
        }
      } else {
        setDateErrors(clearFieldError(dateErrors, 'endDate'));
      }

      // If end date is manually changed, recalculate period
      if (startDate.value && value && period && periodType) {
        const calculatedPeriod = calculatePeriodBetween(
          startDate.value,
          value,
          periodType.value
        );

        // If period is 0 in current type, try calculating in days
        if (calculatedPeriod === 0 && periodType.value !== 'days') {
          const calculatedPeriodInDays = calculatePeriodBetween(
            startDate.value,
            value,
            'days'
          );
          if (calculatedPeriodInDays > 0) {
            // Switch to days and set the period
            periodType.onChange('days');
            period.onChange(calculatedPeriodInDays.toString());
          }
        } else if (calculatedPeriod > 0) {
          period.onChange(calculatedPeriod.toString());
        }
      }
    },
    [startDate, endDate, period, periodType, dateErrors]
  );

  // Handle period change
  const handlePeriodChange = useCallback(
    (value: string) => {
      if (!period) return;

      period.onChange(value);

      // If period is changed, always recalculate end date
      if (startDate.value && value && periodType?.value) {
        const amount = parseInt(value);
        if (!isNaN(amount) && amount > 0) {
          const calculatedEndDate = addPeriodToDate(
            startDate.value,
            amount,
            periodType.value
          );
          endDate.onChange(calculatedEndDate);
        }
      }
    },
    [startDate, endDate, period, periodType]
  );

  // Handle period type change
  const handlePeriodTypeChange = useCallback(
    (value: 'days' | 'months' | 'years') => {
      if (!periodType) return;

      periodType.onChange(value);

      // If we have start date and period, recalculate end date with new type
      if (startDate.value && period?.value) {
        const amount = parseInt(period.value);
        if (!isNaN(amount) && amount > 0) {
          const calculatedEndDate = addPeriodToDate(
            startDate.value,
            amount,
            value
          );
          endDate.onChange(calculatedEndDate);
        }
      }

      // If we have start date and end date, recalculate period with new type
      if (startDate.value && endDate.value && period) {
        const calculatedPeriod = calculatePeriodBetween(
          startDate.value,
          endDate.value,
          value
        );
        if (calculatedPeriod > 0) {
          period.onChange(calculatedPeriod.toString());
        }
      }
    },
    [startDate, endDate, period, periodType]
  );

  return {
    dateErrors,
    handleStartDateChange,
    handleEndDateChange,
    handlePeriodChange,
    handlePeriodTypeChange,
  };
}
