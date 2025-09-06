import { PaymentFrequency } from '@/components/shared/PaymentFrequencySelector';

// Frequency conversion constants
const WEEKLY_CONVERSION = 52 / 12; // 4.33...
const FORTNIGHTLY_CONVERSION = 26 / 12; // 2.17...

/**
 * Converts a monthly value to the specified payment frequency
 */
export function convertMonthlyToFrequency(
  monthlyValue: number,
  frequency: PaymentFrequency
): number {
  switch (frequency) {
    case 'weekly':
      return monthlyValue / WEEKLY_CONVERSION;
    case 'fortnightly':
      return monthlyValue / FORTNIGHTLY_CONVERSION;
    default:
      return monthlyValue;
  }
}

/**
 * Gets the payment amount for the specified frequency
 */
export function getPaymentAmount(
  results: any,
  frequency: PaymentFrequency
): number {
  if (!results) return 0;
  switch (frequency) {
    case 'weekly':
      return results.totalPeriod.weeklyPayment;
    case 'fortnightly':
      return results.totalPeriod.fortnightlyPayment;
    default:
      return results.totalPeriod.monthlyPayment;
  }
}

/**
 * Gets the principal reduction amount for the specified frequency
 */
export function getPrincipalReduction(
  results: any,
  frequency: PaymentFrequency
): number {
  if (!results) return 0;
  return convertMonthlyToFrequency(
    results.totalPeriod.monthlyPrincipal,
    frequency
  );
}

/**
 * Gets the first payment interest amount for the specified frequency
 */
export function getFirstPaymentInterest(
  results: any,
  frequency: PaymentFrequency
): number {
  if (!results) return 0;
  const monthlyInterest =
    results.totalPeriod.paymentBreakdown[0]?.interest || 0;
  return convertMonthlyToFrequency(monthlyInterest, frequency);
}

/**
 * Gets the first payment total amount for the specified frequency
 */
export function getFirstPaymentTotal(
  results: any,
  frequency: PaymentFrequency
): number {
  if (!results) return 0;
  const monthlyTotal =
    results.totalPeriod.paymentBreakdown[0]?.totalPayment || 0;
  return convertMonthlyToFrequency(monthlyTotal, frequency);
}
