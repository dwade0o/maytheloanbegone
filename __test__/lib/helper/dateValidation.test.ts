import {
  validateDateRange,
  clearFieldError,
  clearAllErrors,
  DateValidationErrors,
} from '@/lib/helper/dateValidation';

describe('dateValidation', () => {
  describe('validateDateRange', () => {
    it('should return no errors for valid date range', () => {
      const result = validateDateRange('2024-01-01', '2024-01-02');
      expect(result).toEqual({});
    });

    it('should return errors when start date is after end date', () => {
      const result = validateDateRange('2024-01-02', '2024-01-01');
      expect(result).toEqual({
        startDate: 'Start date must be before end date',
        endDate: 'End date must be after start date',
      });
    });

    it('should return errors when start date equals end date', () => {
      const result = validateDateRange('2024-01-01', '2024-01-01');
      expect(result).toEqual({
        startDate: 'Start date must be before end date',
        endDate: 'End date must be after start date',
      });
    });

    it('should return no errors when either date is empty', () => {
      expect(validateDateRange('', '2024-01-01')).toEqual({});
      expect(validateDateRange('2024-01-01', '')).toEqual({});
      expect(validateDateRange('', '')).toEqual({});
    });
  });

  describe('clearFieldError', () => {
    it('should clear specific field error', () => {
      const errors: DateValidationErrors = {
        startDate: 'Start date error',
        endDate: 'End date error',
      };

      const result = clearFieldError(errors, 'startDate');
      expect(result).toEqual({
        startDate: undefined,
        endDate: 'End date error',
      });
    });

    it('should handle clearing non-existent field', () => {
      const errors: DateValidationErrors = {
        startDate: 'Start date error',
      };

      const result = clearFieldError(errors, 'endDate');
      expect(result).toEqual({
        startDate: 'Start date error',
        endDate: undefined,
      });
    });
  });

  describe('clearAllErrors', () => {
    it('should return empty errors object', () => {
      const result = clearAllErrors();
      expect(result).toEqual({});
    });
  });
});
