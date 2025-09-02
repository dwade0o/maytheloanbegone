/**
 * Date validation utilities for DateRange component
 */

export interface DateValidationErrors {
  startDate?: string;
  endDate?: string;
}

/**
 * Validate date range and return error messages
 */
export function validateDateRange(
  startDate: string,
  endDate: string
): DateValidationErrors {
  const errors: DateValidationErrors = {};

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      errors.startDate = 'Start date must be before end date';
      errors.endDate = 'End date must be after start date';
    }
  }

  return errors;
}

/**
 * Clear validation errors for a specific field
 */
export function clearFieldError(
  errors: DateValidationErrors,
  field: keyof DateValidationErrors
): DateValidationErrors {
  return {
    ...errors,
    [field]: undefined,
  };
}

/**
 * Clear all validation errors
 */
export function clearAllErrors(): DateValidationErrors {
  return {};
}
