/**
 * Date calculation utilities for DateRange component
 */

export type PeriodType = 'days' | 'months' | 'years';

/**
 * Calculate the period between two dates
 */
export function calculatePeriodBetween(
  start: string,
  end: string,
  type: PeriodType = 'days'
): number {
  if (!start || !end) return 0;

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (type === 'days') {
    const diffTime = endDate.getTime() - startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } else if (type === 'months') {
    const yearDiff = endDate.getFullYear() - startDate.getFullYear();
    const monthDiff = endDate.getMonth() - startDate.getMonth();
    return yearDiff * 12 + monthDiff;
  } else if (type === 'years') {
    const yearDiff = endDate.getFullYear() - startDate.getFullYear();
    const monthDiff = endDate.getMonth() - startDate.getMonth();
    return Math.floor((yearDiff * 12 + monthDiff) / 12);
  }

  return 0;
}

/**
 * Add a period to a date
 */
export function addPeriodToDate(
  startDate: string,
  amount: number,
  type: PeriodType
): string {
  if (!startDate || amount <= 0) return startDate;

  const date = new Date(startDate);

  if (type === 'days') {
    date.setDate(date.getDate() + amount);
  } else if (type === 'months') {
    date.setMonth(date.getMonth() + amount);
  } else if (type === 'years') {
    date.setFullYear(date.getFullYear() + amount);
  }

  return date.toISOString().split('T')[0];
}

/**
 * Check if a date is valid
 */
export function isValidDate(dateString: string): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Check if end date is after start date
 */
export function isEndDateAfterStartDate(
  startDate: string,
  endDate: string
): boolean {
  if (!startDate || !endDate) return true;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return end > start;
}
